# Suggestions d'améliorations pour la gestion des queues (SpeakFlow)

Ce fichier regroupe des recommandations et des exemples concrets pour :
- encapsuler l'accès à `roomQueues` (préserver les invariants)
- éviter les interférences asynchrones lors des modifications (concurrence logique)
- préparer l'évolution vers une persistance (DB / Redis)

---

## 1) Encapsulation : pourquoi et comment

- Problème : si plusieurs fichiers mutent directement `roomQueues` (lecture puis modification séparées), on finit par devoir répéter la validation, la dé-duplication par `sid`, le nettoyage des rooms vides, etc. Cela augmente les bugs et rend l'évolution difficile.
- Solution : exposer une API claire (helpers) qui centralise toutes les opérations sur la queue.

Exemples de fonctions à exposer :
- `getQueue(room: string): QueueUser[]` — renvoie une copie ou une vue immuable de la queue
- `addToQueue(user: QueueUser): number` — ajoute un user (vérifie doublon par `sid`) et retourne la position
- `removeFromQueue(sid: string, room: string): QueueUser | undefined` — supprime et retourne l'utilisateur
- `getNextInQueue(room: string): QueueUser | undefined` — consulte sans modifier
- `popFromQueue(room: string): QueueUser | undefined` — retire et retourne le premier
- `cleanupEmptyRoom(room: string): void` — supprime la clé Map si la queue est vide

Ces helpers garantissent :
- invariants (pas de doublons)
- nettoyage mémoire (suppression de rooms vides)
- point unique pour ajouter logs / métriques / persistence

---

## 2) Concurrence logique en Node.js

- Rappel : Node.js est mono-thread, mais des callbacks asynchrones (handlers socket, timers, promesses) peuvent provoquer des interférences si tu fais des opérations read-modify-write en dehors d'une fonction atomique.
- Exemple de bug courant : deux sockets appellent `getOrCreateRoomQueue()` puis `push()` presque simultanément — si la logique de vérification et d'ajout n'est pas atomique, on peut obtenir des doublons ou un ordre indésirable.

Principes pour éviter ces problèmes :
1. Centraliser la logique critique dans des fonctions synchrones (lecture + validation + modification dans la même fonction). Par exemple, `addToQueue()` fait tout : vérifier doublon, push, écrire la Map.
2. Si la modification nécessite des appels asynchrones (ex. écriture en base), sérialiser ces opérations : soit via une file d'opérations, soit via un petit mutex asynchrone pour la section critique.

---

## 3) Exemple concret : helpers synchrones (implémentation recommandée)

Copier-coller ce pattern dans `backend/src/services/queueService.ts` :

```ts
export const roomQueues: Map<string, QueueUser[]> = new Map();

export function getQueue(room: string): QueueUser[] {
  const q = roomQueues.get(room);
  return q ? [...q] : [];
}

export function addToQueue(user: QueueUser): number {
  const room = user.room;
  const q = roomQueues.get(room) ?? [];
  const exists = q.find(u => u.sid === user.sid);
  if (exists) {
    return q.indexOf(exists) + 1;
  }
  q.push(user);
  roomQueues.set(room, q);
  return q.length;
}

export function removeFromQueue(sid: string, room: string): QueueUser | undefined {
  const q = roomQueues.get(room);
  if (!q) return undefined;
  const idx = q.findIndex(u => u.sid === sid);
  if (idx === -1) return undefined;
  const [removed] = q.splice(idx, 1);
  if (q.length === 0) roomQueues.delete(room);
  else roomQueues.set(room, q);
  return removed;
}

export function getNextInQueue(room: string): QueueUser | undefined {
  const q = roomQueues.get(room);
  return q && q.length ? q[0] : undefined;
}

export function popFromQueue(room: string): QueueUser | undefined {
  const q = roomQueues.get(room);
  if (!q || q.length === 0) return undefined;
  const first = q.shift();
  if (!q.length) roomQueues.delete(room);
  else roomQueues.set(room, q);
  return first;
}
```

Ces helpers réalisent la lecture et la modification dans la même fonction : cela évite la plupart des courses logiques.

---

## 4) Option : mutex asynchrone léger (pour opérations async)

Si tu dois effectuer des actions asynchrones dans la modification (ex. write DB avant de confirmer l'ajout), protège la section critique par un mutex asynchrone :

```ts
class SimpleMutex {
  private _locked = false;
  private _waiters: Array<() => void> = [];
  async lock() {
    if (this._locked) {
      await new Promise<void>(r => this._waiters.push(r));
    }
    this._locked = true;
  }
  unlock() {
    const next = this._waiters.shift();
    if (next) next();
    else this._locked = false;
  }
}

const queueMutex = new SimpleMutex();

export async function addToQueueAsync(user: QueueUser): Promise<number> {
  await queueMutex.lock();
  try {
    const pos = addToQueue(user); // réutilise la fonction synchrone
    // ici : opérations async (DB) si besoin
    return pos;
  } finally {
    queueMutex.unlock();
  }
}
```

Ce pattern garantit qu'une seule opération critique tourne à la fois.

---

## 5) Validation & ack Socket.IO

- Validation côté serveur : vérifier `typeof data.room === 'string'` et `data.identity` avant d'ajouter.
- Utiliser un ack (callback) côté client pour confirmer la réussite/erreur :

Client :
```ts
socket.emit('join_room', payload, (res) => {
  if (res.ok) onJoinSuccess(res.token, payload.room, res.livekitUrl);
  else /* afficher erreur */;
});
```

Serveur :
```ts
socket.on('join_room', async (data, ack) => {
  if (!isValid(data)) return ack({ ok: false, error: 'invalid' });
  const token = await createToken(...);
  // ajouter à la queue, etc.
  ack({ ok: true, token, livekitUrl: process.env.LIVEKIT_URL });
});
```

---

## 6) Tests recommandés

- Tests unitaires pour :
  - `addToQueue` (ajout normal, doublon)
  - `removeFromQueue` (suppression existante, non existante)
  - `popFromQueue` (vide, non vide)
  - nettoyage des rooms vides

- Tests d'intégration simple : simuler deux handlers sockets qui appellent `addToQueue` pour vérifier qu'il n'y a pas de doublons et que l'ordre est correct.

---

## 7) Migration vers persistance

- À moyen terme : remplacer la Map par une couche reposant sur Redis (listes ordonnées) ou PostgreSQL.
- Garde la même API helpers; change uniquement l'implémentation interne pour minimiser l'impact sur le reste du code.

---

Si tu veux, j'applique directement ces helpers dans `backend/src/services/queueService.ts` et j'ajoute un petit fichier de tests `backend/src/services/__tests__/queueService.test.ts`.

# 🎤 SpeakFlow

> **La parole qui circule harmonieusement**

Une application web de visioconférence audio qui révolutionne la prise de parole grâce à un système de file d'attente FIFO (First In, First Out). Fini les interruptions et les silences gênants - SpeakFlow organise automatiquement qui parle et quand.

## 🎯 Le Problème

Dans les visioconférences traditionnelles :
- ❌ **Interruptions constantes** - Tout le monde parle en même temps
- ❌ **Silences awkward** - Personne n'ose prendre la parole
- ❌ **Frustration** - Les participants timides n'arrivent pas à s'exprimer
- ❌ **Inefficacité** - Les réunions traînent en longueur

## ✨ La Solution SpeakFlow

SpeakFlow implémente un **système de file d'attente intelligente** :
- ✅ **File FIFO automatique** - Premier demandeur = premier à parler
- ✅ **Contrôle automatique des micros** - Seul l'orateur actuel peut parler
- ✅ **Interface claire** - Voir qui parle, qui attend, combien de temps reste
- ✅ **Gestion des déconnexions** - La file s'adapte automatiquement

## 🚀 Fonctionnalités

### MVP (Minimum Viable Product)
- 🏠 **Création/Jointure de salles** avec identifiants uniques
- 👥 **Gestion temps réel des participants** (connexion/déconnexion)
- 🎤 **File d'attente FIFO** pour les demandes de parole
- 🔇 **Contrôle automatique des micros** via WebRTC
- 📊 **Interface en temps réel** avec mise à jour instantanée

### Fonctionnalités Avancées (Futures versions)
- 👑 **Rôles modérateur** (override de la file, gestion du temps)
- 📈 **Statistiques de participation** (temps de parole par utilisateur)
- 🎨 **Thèmes personnalisables** et avatars
- 📱 **Support mobile** complet
- 🔐 **Salles privées** avec codes d'accès

## 🛠️ Stack Technique

### Frontend
- **React 18** + **TypeScript** - Interface utilisateur moderne et typée
- **Tailwind CSS** - Design system rapide et responsive
- **Vite** - Build tool ultra-rapide pour le développement
- **Socket.IO Client** - Communication temps réel avec le serveur
- **LiveKit SDK** - Gestion WebRTC et audio haute qualité

### Backend
- **Node.js** + **Express** - Serveur web robuste et performant
- **TypeScript** - Développement sécurisé avec typage statique
- **Socket.IO** - WebSockets pour la synchronisation temps réel
- **PostgreSQL** - Base de données relationnelle via **Supabase**
- **LiveKit Cloud** - Infrastructure WebRTC managée (STUN/TURN)

### DevOps & Outils
- **Railway** - Déploiement cloud avec support WebSocket
- **ESLint** + **Prettier** - Qualité et formatage du code
- **Jest** - Tests unitaires et d'intégration
- **GitHub** - Versioning et collaboration

## 🏗️ Architecture

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│                 │ ◄──────────────► │                 │
│   React Client  │                  │   Node.js API   │
│   (Frontend)    │                  │   (Backend)     │
│                 │    REST API      │                 │
└─────────────────┘ ◄──────────────► └─────────────────┘
         │                                     │
         │ LiveKit SDK                        │
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   LiveKit       │                  │   PostgreSQL    │
│   (WebRTC)      │                  │   (Database)    │
└─────────────────┘                  └─────────────────┘
```

### Flux de Données
1. **Connexion** : L'utilisateur rejoint une salle via l'API REST
2. **WebSocket** : Connexion temps réel pour les événements de file
3. **WebRTC** : Connexion audio peer-to-peer via LiveKit
4. **File FIFO** : Algorithme serveur qui gère l'ordre de parole
5. **Synchronisation** : Tous les clients reçoivent les mises à jour instantanément

## 🎮 Comment ça marche

### Pour les Utilisateurs
1. **Rejoindre une salle** - Entrer l'ID de salle et son nom
2. **Demander la parole** - Cliquer sur le bouton 🎤 "Je veux parler"
3. **Attendre son tour** - Voir sa position dans la file d'attente
4. **Parler** - Son micro s'active automatiquement quand c'est son tour
5. **Terminer** - Cliquer "J'ai fini" pour passer au suivant


```

## 📋 Utilisation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte LiveKit Cloud
- Base de données PostgreSQL (Supabase)

```


### Tests
```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🎯 Cas d'Usage

### 🎓 Éducation
- **Cours en ligne** - Les étudiants lèvent la main virtuellement
- **Séminaires** - Participation ordonnée et équitable
- **Soutenances** - Gestion des questions du jury

### 💼 Entreprise
- **Daily standups** - Chacun parle à son tour sans interruption
- **Réunions d'équipe** - Participation équilibrée de tous
- **Formations** - Gestion des questions/réponses

### 🤝 Associatif
- **Assemblées générales** - Respect de l'ordre de passage
- **Cercles de parole** - Environnement bienveillant et structuré
- **Groupes de soutien** - Chacun peut s'exprimer en sécurité

### ♿ Accessibilité
- **Personnes timides** - Encouragement à la participation
- **Troubles de communication** - Temps garanti pour s'exprimer
- **Environnements bruyants** - Contrôle strict des micros

## 🚧 Roadmap

### Version 1.0 (MVP) - ✅ Terminé
- [x] Création/jointure de salles
- [x] File d'attente FIFO
- [x] Audio WebRTC avec LiveKit
- [x] Interface temps réel
- [x] Gestion des déconnexions

### Version 1.1 - 🔄 En cours
- [ ] Rôles modérateur/participant
- [ ] Paramètres de salle (durée max par tour)
- [ ] Statistiques de participation
- [ ] Tests automatisés complets

### Version 2.0 - 📋 Planifié
- [ ] Application mobile (React Native)
- [ ] Intégration calendrier (Google/Outlook)
- [ ] Enregistrement des sessions
- [ ] API publique pour intégrations




### Guidelines
- Suivre les conventions TypeScript/ESLint
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les API dans le code
- Garder les commits atomiques et descriptifs

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Beydi** - Étudiant Holberton School Bordeaux  
---

## 🔗 Liens Utiles

- [Documentation LiveKit](https://docs.livekit.io/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React TypeScript Guide](https://react-typescript-cheatsheet.netlify.app/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

*Dernière mise à jour: Novembre 2024*
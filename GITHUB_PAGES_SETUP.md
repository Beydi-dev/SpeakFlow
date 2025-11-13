# Configuration GitHub Pages pour SpeakFlow

## 🎯 Vue d'ensemble

Ce guide vous explique comment activer GitHub Pages pour afficher la landing page de SpeakFlow.

## 📋 Prérequis

- Le workflow GitHub Actions est déjà configuré dans `.github/workflows/deploy.yml`
- La landing page React est créée dans `frontend/src/components/Landing.tsx`
- Vite est configuré pour GitHub Pages dans `frontend/vite.config.ts`

## 🚀 Activation de GitHub Pages

### Étape 1 : Activer GitHub Pages dans les paramètres du repository

1. Allez sur votre repository GitHub : `https://github.com/Beydi-dev/SpeakFlow`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Dans la section **Build and deployment** :
   - **Source** : Sélectionnez `GitHub Actions`
5. Enregistrez les modifications

### Étape 2 : Pusher les modifications

Une fois que vous avez pushé les modifications sur la branche `main` ou `master`, GitHub Actions va automatiquement :

1. Installer les dépendances
2. Builder le projet React
3. Déployer sur GitHub Pages

### Étape 3 : Vérifier le déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vous devriez voir le workflow "Deploy to GitHub Pages" en cours d'exécution
3. Une fois terminé (avec un ✓ vert), votre site sera disponible à :
   ```
   https://beydi-dev.github.io/SpeakFlow/
   ```

## 🎨 Structure de la Landing Page

La landing page comprend :

- **Section Hero** : Titre principal et appels à l'action
- **Section Features** : 3 fonctionnalités principales
  - Gestion de file d'attente
  - Audio/Vidéo en temps réel
  - Sécurité et confidentialité
- **Section Comment ça marche** : 3 étapes simples
- **Section CTA** : Appel à l'action final
- **Footer** : Liens et informations

## 🔧 Maintenance

### Modifier la landing page

Le fichier à modifier est : `frontend/src/components/Landing.tsx`

### Rebuilder localement

```bash
cd frontend
npm install
npm run build
```

### Tester localement

```bash
cd frontend
npm run dev
```

Puis ouvrez `http://localhost:5173` dans votre navigateur.

## 🌐 Routes disponibles

- `/` : Landing page publique
- `/connexion` : Page de connexion
- `/inscription` : Page d'inscription
- `/accueil` : Application principale (authentification requise)

## 📝 Notes importantes

- Le workflow GitHub Actions se déclenche automatiquement à chaque push sur `main` ou `master`
- Vous pouvez également déclencher manuellement le workflow depuis l'onglet Actions
- Le temps de déploiement est généralement de 2-3 minutes

## ❓ Problèmes courants

### Le site n'apparaît pas après le déploiement

1. Vérifiez que le workflow GitHub Actions s'est exécuté sans erreur
2. Attendez quelques minutes (le DNS peut prendre du temps à se propager)
3. Videz le cache de votre navigateur

### Erreurs 404 sur les routes

- C'est normal pour une SPA (Single Page Application)
- Les routes React fonctionnent correctement, mais le rechargement direct d'une route peut nécessiter une configuration supplémentaire

## 🎉 C'est tout !

Votre landing page SpeakFlow est maintenant prête à être déployée sur GitHub Pages !

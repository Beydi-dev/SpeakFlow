Architecture du projet:


backend/
├── src/
│   ├── services/
│   │   ├── queueService.ts         ← TON ALGO (inchangé)
│   │   └── databaseService.ts      ← Connexion PostgreSQL
│   ├── routes/                     ← API REST
│   ├── controllers/               
│   ├── socket/                     ← Socket.IO handlers
│   ├── middleware/                
│   ├── models/                     ← Classes UTILISATEUR, SALLE, STATISTIQUES
│   └── server.ts                   
├── database/
│   ├── schema.sql                  ← Création des tables
│   ├── migrations/                 ← Évolutions de schéma
│   └── seeds.sql                   ← Données de test
├── package.json
└── tsconfig.json
# Exercice
Programmer une horloge avec gestion d'alarme.

**Contraintes :**
- Utilisez Electron pour créer l'application.
- Le "frontend" (renderer) de l'application doit être développé en TypeScript avec React, en utilisant les dernières versions avec les hooks.
- Côté "main" (la partie backend-like d'Electron), assurez la persistance des alarmes (par exemple, en utilisant SQLite).
- Mettez en place la mécanique de communication d'Electron pour permettre la communication entre les processus.

# GETTING STARTED 

### yarn est obligatoire 
```bash
$ npm -g install yarn
$ yarn install
$ yarn build
$ yarn dev 
```

# Environment de developpment:

  ## ceci est un exemple je ne realise pas toutes ces parties
  Pour le travail en equipe et la vie du projet  il est important de definir un infrastructure durable et maintenable
  J'ai décidé de mettre en place un répertoire en amont dans l'environnement avec des outils de développement et de devops.

  ## Voici les étapes  :

- Mise en place de la virtualisation (Docker, Virtualbox, etc.) pour gérer les dépendances du projet et assurer l'autonomie sur les postes de développement.
- Mise en place d'une CI/CD (Continuous Integration/Continuous Deployment) ; par exemple, l'utilisation de GitLab, de webhooks, etc.
- Intégration d'une interface en ligne de commande (CLI) DevOps (un exécutable Volta pour une installation rapide sur le poste de développement avec par exemple  `$ npx volta build`).
- Mise en place par exemple d'Ansible pour prévoir des déploiements de tests et de production sur la machine finale.
- Intégration d'une bibliothèque Volta indépendante pour la séparation des préoccupations métier. Le choix d'Electron n'est pas figé, donc il est intéressant de créer une bibliothèque qui ne dépend pas d'Electron et de son 'IPC' pour réaliser des tâches métier, comme par exemple la gestion de la base de données dans le cas de l'exercice.
- Mise en place d'un environnement de tests unitaires, de documentation et de formatage de code versionné (norme ISO).
- Utilisation de sous-modules Git pour les dépendances de travail inter-équipes.
- Mise en place d'un systeme de log

## REPOSITORY (/)
```
volta
├── CHANGELOG.md
├── README.md
├── Vagrantfile
├── ansible
├── bin
├── docker
├── electron
├── lib
├── logs
├── node_modules
├── package.json
├── shared
├── src
├── tmp
├── tools
└── yarn.lock
```

## CLI (/bin/volta) npx volta ou yarn start 
``` bash
 #    #   ####   #       #####    ##   
 #    #  #    #  #         #     #  #  
 #    #  #    #  #         #    #    # 
 #    #  #    #  #         #    ###### 
  #  #   #    #  #         #    #    # 
   ##     ####   ######    #    #    # 
                                       
  version 1.0.0
  
? Volta infra (Use arrow keys)
❯ build 
  dev 
  prod 
  docker 
  vagrant 
  deploy 
  quit 
```

## Choix du Bac à Sable Electron (/electron)
2 choix se presentent :
- [Electron Vite](https://electron-vite.org/) (basé sur Rollup)
- [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) (basé sur webpack)

Après avoir installé les deux, je décide d'utiliser Electron Vite, mais mon choix n'est pas motivé en raison d'un manque d'expérience.
Je pourrais en dire plus après avoir eu davantage d'expérience dans le développement,
notamment en ce qui concerne les fonctionnalités telles que le Hot Module Replacement (HMR) et autres.

### ELECTRON (/electron)
```
├── README.md
├── build
├── dev-app-update.yml
├── electron-builder.yml
├── electron.vite.config.ts
├── node_modules
├── out
├── package.json
├── resources
├── src
|   ├── main
│   └── index.ts
├── preload
│   ├── index.d.ts
│   └── index.ts
├── renderer
│   ├── index.html
│   └── src
│       ├── App.tsx
│       ├── assets
│       │   ├── icons.svg
│       │   └── index.css
│       ├── components
│       │   └── Versions.tsx
│       ├── env.d.ts
│       └── main.tsx
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.web.json
└── yarn.lock
```

### Installation de l'environement initial 
``` bash
  $ yarn create @quick-start/electron volta -- --template react-ts
  $ yarn install
  $ git init
  $ git add .
  $ git commit -m "initial commit"
```

# Architecture du projet Horloge  braimstorming

Dans cet exercice, la première question qui se pose est de savoir où réaliser l'alarme (backend, frontend). Pour garantir la flexibilité du projet, l'alarme doit être implémentée côté backend.

Dans le cadre de l'exercice, je décide de mettre en œuvre l'alarme côté frontend en utilisant l'heure uniquement. Cependant, j'utiliserai une Date complète 

Pour intégrer la partie de la librairie volta dans la partie Electron, 
Il faudra trouver une solution avec mécanisme IPC (Inter-Process Communication) 
 -  Ne pas influer sur la lib (isolation) avec IPC et electron 
 -  Trouver Protocole de communication entre le main et renderer 

## Librairies Utilisées

###  BACKEND 
  - La database sera gerée avec un ORM [Sequelize](https://sequelize.org/) (avec sqlite3) (multibases)
  - [JSON RPC](https://www.jsonrpc.org/specification) pour le protocole entre le process main et renderer 
    pour l'exercice je decrirais un protole maison  exemple : 
``` typescript
interface msgTemplate {
  channel: string
  id?: string | null
  date: Date
  data?: string | JSON[]
  error?: unknown
  action?: string | null
}
```

### DATABASE sqlite (/tmp/volta.db) 
``` bash
$ sqlite3 tmp/volta.db .dump
```
``` sql
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `alarms` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `date` DATETIME NOT NULL, `active` TINYINT(1) NOT NULL DEFAULT 1, `message` VARCHAR(1024), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
DELETE FROM sqlite_sequence;
COMMIT;
```

### FRONTEND
  - Pour les Notifications d'alarme j'utilise  [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API) (attention de pas les bloquer sur os !)
  - Pour les dates [Moment.js](https://momentjs.com/)
  - Pour découvrir les hooks react j'utiliserais [usehooks-ts](https://usehooks-ts.com/)
  - Pour l'UI intégration de [MUI](https://mui.com/)

# Améliorations possibles 
  - Revue de code pour proteger tous les champs et securiser l'application 
  - Utilser un protocle serieux pour la communication interprocess (le typage seras plus facile)
  - Revoir les types de ORM sequelize et autres  (manque d'experience)
  - Refactoriser un hook react pour un retour async des messages IPC (avec un id)
  - Revoir le cycle de vie react pour un bon montage des composants , bonnes pratiques etc ...  ( manque d'experience )
  - Refactorise l'alarme sur le backend  et utilser une crontab ou un logiciel de workflow de taches
  - Faire sonner l'alarme avec la webaudio api (voir la compatibilé electron ?)
  - Gestion des locales et des timezones
  - mettre en place de la documentation pour la lib et du jsdoc 
  - Mettre un Place un systeme de log puissant qui peux s'interfacer avec les outils actuel

# Production Electron Packager

``` bash
cd electron 

# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```







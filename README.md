# Exercice
Programmer une horloge avec gestion d'alarme.

**Contraintes :**
- Utilisez Electron pour créer l'application.
- Le "frontend" (renderer) de l'application doit être développé en TypeScript avec React, en utilisant les dernières versions avec les hooks.
- Côté "main" (la partie backend-like d'Electron), assurez la persistance des alarmes (par exemple, en utilisant SQLite).
- Mettez en place la mécanique de communication d'Electron pour permettre la communication entre les processus.


# GET STARTED

```bash
$ yarn install
$ yarn build
$ yarn dev
```
!! si on utilse npm il faudra corriger le package.json
``` json
 "scripts": {
    "build": "yarn --cwd ./electron install",
    "start": "node bin/index.js",
    "dev": "yarn --cwd ./electron dev"
  },
```
``` json
 "scripts": {
    "build": "npm install --prefix ./electron",
    "start": "node bin/index.js",
    "dev": "npm run dev --prefix ./electron"
  },
```

# Environment de developpment: (/) (ceci est un exemple je ne realise pas toutes ces parties)

  Pour le travail en equipe et la vie du projet  il est important de definir un infrastructure durable et maintenable
  J'ai décidé de mettre en place un répertoire en amont dans l'environnement avec des outils de développement et de devops.

  Voici les étapes  :

-  Mise en place de la virtualisation (Docker, Virtualbox, etc.) pour gérer les dépendances du projet et assurer l'autonomie sur les postes de développement.
- Mise en place d'une CI/CD (Continuous Integration/Continuous Deployment) ; par exemple, l'utilisation de GitLab, de webhooks, etc.
- Intégration d'une interface en ligne de commande (CLI) DevOps (un exécutable Volta pour une installation rapide sur le poste de développement avec par exemple  `$ volta build`).
- Mise en place par exemple d'Ansible pour prévoir des déploiements de tests et de production sur la machine finale.
- Intégration d'une bibliothèque Volta indépendante pour la séparation des préoccupations métier. Le choix d'Electron n'est pas figé, donc il est intéressant de créer une bibliothèque qui ne dépend pas d'Electron et de son 'IPC' pour réaliser des tâches métier, comme par exemple la gestion de la base de données dans le cas de l'exercice.
- Mise en place d'un environnement de tests unitaires, de documentation et de formatage de code versionné (norme ISO).
- Utilisation de sous-modules Git pour les dépendances de travail inter-équipes.

TRUNK (/)
```
volta
├── Vagrantfile
├── ansible
├── bin
├── docker
├── electron
├── lib
├── package.json
├── shared
├── tmp
└── tools
```

## Choix du Bac à Sable Electron (/electron)
2 choix se presentent :
- [Electron Vite](https://electron-vite.org/) (basé sur Rollup)
- [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) (basé sur webpack)

Après avoir installé les deux, je décide d'utiliser Electron Vite, mais mon choix n'est pas motivé en raison d'un manque d'expérience.
Je pourrais en dire plus après avoir eu davantage d'expérience dans le développement,
notamment en ce qui concerne les fonctionnalités telles que le Hot Module Replacement (HMR) et autres.

ELECTRON (/electron)
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
  - la database sera gerée avec un ORM Sequelize (sqlite3) (multibases)
  - [JSON RPC](https://www.jsonrpc.org/specification) pour le protocole entre le process main (node) et renderer 
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

### FRONTEND
   - Pour les dates [Moment.js](https://momentjs.com/)
   - Pour découvrir les hooks react j'utiliserais [usehooks-ts](https://usehooks-ts.com/)
   - Pour UI intégration de [MUI](https://mui.com/)

# Améliorations possibles 
  - Faire sonner l'alarme avec la webaudio api (voir la compatibilé electron ?)
  - Refactorise l'alarme sur le backend  et utilser une crontab pour realiser un workflow de taches
  - Gestion des locales et des timezones

# Production Electron (je ne realise pas cette partie)

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```







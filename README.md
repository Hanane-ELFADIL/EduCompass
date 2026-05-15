# EduCompass - Student AI — Assistant Pédagogique Intelligent

> Une application web full-stack qui aide les étudiants marocains (lycée & université) grâce à l'intelligence artificielle — en **français**, **arabe** ou **darija**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-FF6B35)
![License](https://img.shields.io/badge/license-MIT-blue)

---

##  Fonctionnalités

| # | Outil | Description |
|---|-------|-------------|
|  | **Chat IA** | Assistant pédagogique qui répond en français, arabe ou darija |
|  | **Résumé de cours** | Génère un résumé structuré (idées principales, concepts clés) |
|  | **Quiz QCM** | Génère des questions à choix multiples à partir d'un cours |
|  | **Flashcards** | Crée des cartes question/réponse pour mémoriser facilement |
|  | **Examen simulé** | Simule une session d'examen avec timer |
|  | **Orientation** | Conseils personnalisés sur les filières et établissements marocains |
|  | **Authentification** | Inscription / Connexion sécurisée avec JWT |
|  | **Tableau de bord** | Statistiques d'utilisation et historique des activités |
|  | **Thème sombre/clair** | Interface adaptable selon les préférences |

---

##  Stack Technique

### Frontend
- **React 18** + **Vite**
- **React Router DOM** v6
- **Axios** pour les appels API
- Contexts : `AuthContext`, `LangContext`, `ThemeContext`, `HistoryContext`

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** + **bcryptjs** pour l'authentification
- **Multer** pour l'upload de fichiers

### Intelligence Artificielle
- **[Groq API](https://console.groq.com)** — modèle `llama-3.3-70b-versatile`
- **Vision IA** — modèle `llama-3.2-11b-vision-preview` pour extraction de texte depuis images

---

##  Structure du projet

```
educompass/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Summary.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── Exam.jsx
│   │   │   ├── Orientation.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LangContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── HistoryContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── app.css
│   ├── index.html
│   └── package.json
│
├── server/                          # Backend Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── aiRoutes.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── package.json                     # Scripts root (concurrently)
```

---

##  Installation & Lancement

### Prérequis
- **Node.js** v18+
- Un compte **[MongoDB Atlas](https://cloud.mongodb.com)** (gratuit)
- Une clé **[Groq API](https://console.groq.com)** (gratuit)

### 1. Cloner le projet
```bash
git clone https://github.com/Hanane-ELFADIL/educompass.git
cd educompass
```

### 2. Installer toutes les dépendances
```bash
npm run install:all
```

### 3. Configurer les variables d'environnement

Crée le fichier `server/.env` :
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_ai
PORT=5000
NODE_ENV=development
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
JWT_SECRET=student_ai_secret_2026
```

>  Remplace les valeurs par tes vraies clés.

### 4. Lancer en développement
```bash
npm run dev
```

Le frontend sera disponible sur → **http://localhost:5173**  
Le backend tournera sur → **http://localhost:5000**

---

##  Obtenir les clés API

### Groq API (gratuit)
1. Va sur [console.groq.com](https://console.groq.com)
2. Crée un compte → **API Keys** → **Create API Key**
3. Copie la clé et colle-la dans `server/.env`

### MongoDB Atlas (gratuit)
1. Va sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crée un cluster gratuit (M0)
3. **Database Access** → Ajoute un utilisateur avec mot de passe
4. **Network Access** → Autorise `0.0.0.0/0`
5. Copie l'URI de connexion dans `server/.env`

---

##  Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance frontend + backend en parallèle |
| `npm run client` | Lance uniquement le frontend |
| `npm run server` | Lance uniquement le backend |
| `npm run install:all` | Installe toutes les dépendances |

---

##  Routes API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/ai/chat` | Chat avec l'IA |
| POST | `/api/ai/summary` | Générer un résumé |
| POST | `/api/ai/quiz` | Générer un quiz QCM |
| POST | `/api/ai/flashcards` | Générer des flashcards |
| POST | `/api/ai/orientation` | Conseils d'orientation |
| POST | `/api/ai/extract` | Extraire texte d'une image |
| GET  | `/api/health` | Vérifier l'état du serveur |

---

##  Développé par

**Hanane ELFADIL**  
Projet : Assistant IA pour étudiants marocains 🇲🇦

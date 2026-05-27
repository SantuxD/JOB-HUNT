# 🧭 JOB-HUNT — Full Stack Job Portal

A full-stack job portal web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It provides a seamless platform for job seekers to discover opportunities and for recruiters to post and manage job listings.

---

## 📁 Project Structure

```
JOB-HUNT/
├── backend/          # Node.js + Express REST API
└── frontend/
    └── job-portal/   # React.js client application
```

---

## ✨ Features

- 🔐 User authentication & authorization (JWT)
- 👤 Role-based access — Job Seeker & Recruiter
- 📋 Job posting, editing, and deletion (Recruiter)
- 🔍 Job search and filtering (Job Seeker)
- 📄 Apply to jobs and track applications
- 🗂️ Profile management for users
- 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI library |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS / CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Bcrypt | Password hashing |
| dotenv | Environment config |
| CORS | Cross-origin requests |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

---

### 🔧 Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
# Fill in your environment variables (see below)

# Start the development server
npm run dev
```

**Backend `.env` variables:**

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 💻 Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend/job-portal

# Install dependencies
npm install

# Start the React development server
npm start
```

The app will run at `http://localhost:3000` by default.

---

## 🚀 Running the Full App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend/job-portal
npm start
```

---

## 📡 API Endpoints (Overview)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/jobs` | Get all job listings |
| POST | `/api/jobs` | Post a new job (Recruiter) |
| PUT | `/api/jobs/:id` | Update a job (Recruiter) |
| DELETE | `/api/jobs/:id` | Delete a job (Recruiter) |
| POST | `/api/jobs/:id/apply` | Apply to a job (Seeker) |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**SantuxD**
- GitHub: [@SantuxD](https://github.com/SantuxD)

# TalentMatch AI – Full Stack Job Portal

A full-stack job portal application built with React, Node.js, Express, Prisma, PostgreSQL, and Redis, featuring authentication, role-based access control, job management and performance optimization.

---

## Live Links 🌐

Frontend: https://talentmatch-ai-theta.vercel.app

Backend: https://talentmatch-ai-z4qa.onrender.com

---

## Features ✨ 

### 🔐 Authentication & Security
- JWT-based authentication system  
- Secure login and registration  
- Role-based access control (ADMIN / RECRUITER / USER)  
- Protected routes using middleware  

### Job Management System 💼 
- Create jobs  
- Update jobs  
- Delete jobs  
- View all jobs  
- View single job details  

### Advanced Features 🔎 
- Search jobs by keyword  
- Filter by location and company  
- Pagination support  

### Performance Optimization⚡ 
- Redis caching (Upstash)  
- Reduced database load  
- Faster API responses for job listings  

### Application System 📊 
- Apply to jobs  
- Track application status  
- Recruiter dashboard to manage applications  

### Deployment ☁️
- Backend deployed on Render  
- Frontend deployed on Vercel  
- Environment-based configuration setup  

---

## Tech Stack 🛠️

Frontend:
- React.js  
- Tailwind CSS  
- Axios  

Backend:
- Node.js  
- Express.js  
- Prisma ORM  
- JWT Authentication  

Database:
- PostgreSQL  

Cache:
- Redis (Upstash)  

Deployment:
- Render (Backend)  
- Vercel (Frontend)  

---

## Project Structure 📁

backend/
- src/
  - config/
  - controllers/
  - middleware/
  - routes/
  - utils/
  - server.js

frontend/
- src/
  - components/
  - pages/
  - api/
  - App.jsx

---

## Environment Variables ⚙️

Backend (.env):

DATABASE_URL=your_postgres_database_url

JWT_SECRET=your_jwt_secret_key

REDIS_URL=your_upstash_redis_url

PORT=5000

---

## Installation & Setup 🚀 

### 1. Clone repository

git clone https://github.com/your-username/talentmatch-ai.git

cd talentmatch-ai

---

### 2. Backend setup

cd backend

npm install

npx prisma generate

npm run dev

---

### 3. Frontend setup

cd frontend

npm install

npm run dev

---

##  API Endpoints 🔗

### Authentication

POST /api/auth/register

POST /api/auth/login

---

### Jobs

GET /api/jobs

POST /api/jobs

PUT /api/jobs/:id

DELETE /api/jobs/:id

---

### Applications

POST /api/applications

GET /api/applications/:jobId

---

## Performance Highlights⚡

- Redis caching reduces database load significantly  
- Optimized pagination queries  
- Secure and scalable REST API design  
- Modular backend architecture  
- Production-ready deployment setup  

---

## What I Learned 💡

- Full-stack system design and architecture  
- JWT authentication and role-based authorization  
- Redis caching strategies for performance optimization  
- Prisma ORM with PostgreSQL integration  
- Cloud deployment using Render and Vercel  
- Real-world debugging and production fixes  

---

## Project Status 🏁

Backend Completed  
Frontend Completed  
Deployment Done  
Production Ready  

---

## Author 👨‍💻 

Vighnesh  

---

## Support ⭐

If you like this project, please give it a ⭐ on GitHub

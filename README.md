# Smart Learning Tutor Platform

## 🚀 Overview
The **Smart Learning Tutor Platform** is a cutting-edge web application designed to connect students with tutors in a seamless and interactive manner. The platform provides role-based dashboards for students, tutors, and administrators, facilitating real-time communication, scheduling, and learning.

## 🔥 Features
- 📚 **Role-Based Access Control (RBAC)** – Separate dashboards for students, tutors, and admins.
- 💬 **Chat & Messaging** – Real-time messaging between students and tutors.
- 🎥 **Video Conferencing** – Seamless online tutoring sessions.
- 📆 **Scheduling System** – Booking and managing tutoring sessions.
- 📊 **Progress Tracking** – Monitor student progress and tutor performance.
- 🔒 **Secure Authentication** – User authentication via JWT.
- 🎨 **Modern UI/UX** – Styled with Tailwind CSS.
- ⚡ **Scalable Architecture** – Built using Next.js for full-stack capabilities.

## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| **Next.js** | Full-stack frontend & backend |
| **TypeScript** | Strongly-typed development |
| **PostgreSQL** | Database management |
| **Prisma ORM** | Database interaction |
| **Tailwind CSS** | UI styling |
| **WebRTC** | Video conferencing |
| **Socket.io** | Real-time chat |
| **JWT Authentication** | Secure authentication |

## 📂 Folder Structure
```
smart-learning-tutor/
│── public/             # Static assets
│── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Next.js pages
│   ├── api/            # API routes (Next.js backend)
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom hooks
│── prisma/             # Database schema
│── .env                # Environment variables
│── next.config.js      # Next.js configuration
│── tailwind.config.js  # Tailwind CSS configuration
│── package.json        # Dependencies & scripts
```

## 🚀 Getting Started
### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Yarn](https://yarnpkg.com/) (or npm)

### 2️⃣ Installation
```sh
git clone https://github.com/your-username/smart-learning-tutor.git
cd smart-learning-tutor
yarn install  # or npm install
```

### 3️⃣ Environment Setup
Create a `.env` file in the root directory and configure the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4️⃣ Database Setup
```sh
yarn prisma migrate dev --name init
yarn prisma generate
```

### 5️⃣ Run the Development Server
```sh
yarn dev  # or npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ Security & Best Practices
- Use **HTTPS** in production.
- Store environment variables securely.
- Use **rate-limiting** and **input validation**.
- Implement **role-based access control** properly.

## 🤝 Contributing
We welcome contributions! Please fork the repo and submit a PR with improvements.

## 📜 License
This project is licensed under the **MIT License**.

---

🚀 **Let's revolutionize online tutoring!**

---

## Migration to Next.js + Supabase

This project is being migrated from Vite + React Router to **Next.js (App Router)** with **Supabase** as the database and auth provider.

### Env vars
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Run (Next.js)
```sh
npm install
npm run dev
```

- Next entrypoint: `app/page.tsx`
- Global styles: `app/globals.css` (imports existing `src/index.css`)
- Supabase client: `src/lib/supabase.ts` (supports Next env vars)

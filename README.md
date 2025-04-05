# 📚 Course Platform

A full-stack web app where **Admins** can create and manage courses, and **Users** can browse and access them.

---

## 🚀 Features

### 👨‍🏫 Admin
- 🔐 Secure admin login with session-based auth
- 📦 Create, view, and manage your own courses
- 📄 Fetch all or specific courses (`/course/bulk`, `/course/:id`)
- 🛡️ Protected routes via `adminMiddleware`

### 👨‍🎓 User
- 📝 User registration & login (coming soon)
- 👀 View all published courses
- 📘 View course details (`/courses`, `/courses/:id`)
- 🔒 Only see public/published courses

---

## 🧰 Tech Stack

- 🖥️ **Frontend**:  React.js
- 🌐 **Backend**: Express.js
- 🗃️ **Database**: MongoDB
- 🍪 **Auth**: express-session (admin & user sessions)
- 🔐 **Validation**: zod
- 🔑 **Password Security**: bcrypt

---


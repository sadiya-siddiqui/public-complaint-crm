# 🚀 Public Complaint CRM System

## 📌 Project Overview
Public Complaint CRM System is a full-stack web application developed to help citizens register and track public complaints digitally.  
The system allows administrators to manage complaints efficiently and update their status in real time.

This project aims to improve transparency, reduce manual complaint handling, and create a smart digital grievance management system.

---

# 🎯 Project Goal

The main goal of this project is to:

- Digitize complaint management
- Improve transparency between citizens and administration
- Reduce paperwork and manual processes
- Provide fast complaint tracking
- Build a smart governance support platform

---

# ✨ Features

## 👤 User Features
- Submit complaints online
- Generate unique Tracking ID
- Track complaint status
- Responsive user interface

## 🛠 Admin Features
- View all complaints
- Update complaint status
- Complaint analytics dashboard
- Manage complaints efficiently

---

# 🏗 Project Architecture Diagram

```text
              ┌────────────────────┐
              │       USER         │
              │ Submit Complaint   │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │   Frontend UI      │
              │ HTML • CSS • JS    │
              └─────────┬──────────┘
                        │ Fetch API
                        ▼
              ┌────────────────────┐
              │  Node.js Backend   │
              │   Express Server   │
              └─────────┬──────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
┌──────────────────┐      ┌──────────────────┐
│ Complaint Routes │      │   Admin Panel    │
│ POST / GET / PUT │      │ Manage Complaints│
└─────────┬────────┘      └─────────┬────────┘
          │                         │
          └──────────┬──────────────┘
                     ▼
          ┌────────────────────┐
          │     MongoDB        │
          │ Complaint Database │
          └────────────────────┘
```

---

# ⚙️ Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Tools
- Git & GitHub
- Postman
- Netlify

---

# 🔥 Workflow

1. User submits complaint
2. Backend API receives request
3. Complaint stored in MongoDB
4. Unique Tracking ID generated
5. Admin views complaints
6. Admin updates complaint status
7. User tracks complaint status

---

# 📊 APIs Used

## POST
`/api/complaints`
- Create complaint

## GET
`/api/complaints`
- Fetch all complaints

## PUT
`/api/complaints/:id`
- Update complaint status

---

# ✅ Completed Modules

- Complaint Submission System
- Tracking ID Generation
- MongoDB Integration
- REST APIs
- Admin Dashboard
- Complaint Status Update
- Frontend & Backend Integration
- GitHub Upload
- API Testing using Postman

---

# 🌟 Future Improvements

- JWT Authentication
- Email Notifications
- Live Analytics Dashboard
- Complaint Category Filter
- Image Upload Support
- Cloud Deployment

---

# 👩‍💻 Developed By

Sadiya Siddiqui

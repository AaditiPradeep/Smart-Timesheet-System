# Smart Timesheet Validation and Approval System
🚀 Quick Start – Local Development (Docker)

This project uses Docker and Docker Compose to run the frontend, backend, and database in isolated containers for consistent local development.

🔧 Prerequisites

Ensure the following tools are installed on your system:

Git

Docker Desktop (AMD64 / x86_64)

Node.js (only required if running without Docker)

Web browser (Chrome/Firefox)

📂 Project Structure
smart-timesheet-system/
│
├── frontend/            # React frontend
│   ├── Dockerfile
│   └── package.json
│
├── backend/             # Node.js + Express backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml   # Docker Compose configuration
├── .gitignore
└── README.md

▶️ Running the Application Using Docker Compose

1️⃣ Clone the repository

git clone <your-github-repo-url>
cd smart-timesheet-system


2️⃣ Build and start all services

docker-compose up --build


This command will:

Build the frontend and backend Docker images

Start the React frontend

Start the Node.js backend

Start MongoDB as a database container

🌐 Access the Application

Frontend (React UI):
👉 http://localhost:3000

Backend (API test):
👉 http://localhost:5000

🛑 Stopping the Application

To stop all running containers:

docker-compose down

🧰 Local Development Tools Used

VS Code – Code editor

Docker Desktop – Containerization

Docker Compose – Multi-container orchestration

Git & GitHub – Version control

Draw.io – Architecture diagram

Figma – UI wireframes
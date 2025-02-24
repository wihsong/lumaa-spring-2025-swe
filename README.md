# Full-Stack Coding Challenge

**Deadline**: Sunday, Feb 23th 11:59 pm PST

---

# Task Manager

A minimal full-stack application for managing tasks with user authentication.

## 1. Database Setup

### Create a PostgreSQL Database
Create a database named `taskmanager`.

### Set Environment Variables
Create a `.env` file in the `backend/` directory with the following content:

```bash
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/taskmanager
JWT_SECRET=supersecretkey
PORT=4000
```

Replace `USERNAME`, `PASSWORD`, and other values as needed.

### Run Migrations
In the `backend/` folder, run:

```bash
psql -d taskmanager -f ./src/migrations/001_init.sql
```

This script should create the necessary tables (e.g., users, tasks).

## 2. Running the Backend

### Install Dependencies
Navigate to the `backend/` folder and run:

```bash
npm install
```

### Start the Backend Server
For development, run:

```bash
npm run dev
```

Alternatively, to build and run:

```bash
npm run build
npm run start
```

The server will run on [http://localhost:4000](http://localhost:4000).

## 3. Running the Frontend

### Install Dependencies
Navigate to the `frontend/` folder and run:

```bash
npm install
```

### Start the Frontend Server
Run:

```bash
npm start
```

The React app will run on [http://localhost:3000](http://localhost:3000).

## 4. Testing Notes

### API Testing
Use **Postman** or `curl` to test endpoints such as:
- `POST /auth/register`
- `POST /auth/login`
- `GET/POST/PUT/DELETE /tasks`

### UI Testing
In the browser:
1. Register a new user.
2. Log in.
3. Create, update, and delete tasks.
4. Ensure that tasks are correctly associated with each user.

## 5. Salary Expectations

My expected monthly salary is **$1,600-$2,000 per month**.  

## 6. Short Video Demo

[Watch the Demo Video](https://drive.google.com/file/d/1TkXxpJdUtrrhDLodm2nIPKrAKO7afde-/view?usp=sharing)
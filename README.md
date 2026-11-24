# College Bus and Transport Management System

Web-based transport management system for college buses, drivers, routes, schedules, students, and allocations.

## Technology

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt

## Project structure

```text
client/   React frontend
server/   Express backend
```

## Getting started

```bash
npm run install:all
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend runs on the Vite development port.

Copy `server/.env.example` to `server/.env` before starting the backend.

For the local MongoDB installation, make sure the MongoDB service is running and use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/college_transport
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@college.local
ADMIN_PASSWORD=change-this-development-password
```

To create or update the first Admin account after adding these values to `server/.env`, run:

```bash
npm run seed:admin --prefix server
```


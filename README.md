# ProjectMate — MERN starter

A working full-stack project collaboration platform with a glassmorphism dashboard inspired by the supplied reference.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Protected routes, validation, centralized error middleware

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Set `MONGO_URI` and a long random `JWT_SECRET` in `server/.env`.

### 2. Install and run the backend
```bash
npm install
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Install and run the frontend
Open a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

### 4. Create your account
Register through the UI. The first registered account is a normal user; there is no hard-coded demo password.

## Deploy publicly

This project is prepared for separate deployment:
- **MongoDB:** create a MongoDB Atlas cluster and allow your hosting provider's network access.
- **Backend:** deploy `server/` to Render. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`.
- **Frontend:** deploy `client/` to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend URL plus `/api`.
- Set the frontend domain in the backend `CLIENT_URL` environment variable.

Do not commit `.env` files or expose `JWT_SECRET` / MongoDB credentials.

## Included functionality
- Registration and login with hashed passwords and JWT
- Authentication middleware and protected API routes
- Create, list, view, update, and delete projects (owner-only edits/deletes)
- Search and category filtering
- Join requests and owner accept/reject workflow
- Student profile and skill editing
- Dashboard counts and recent projects
- Centralized 404 and error handling

## Notes
- The UI uses sample project records only when the database has no projects, to make the dashboard visually useful on first launch. Those sample records are client-side presentation data and are not persisted.
- Real public hosting is not completed from this generated source package. You must connect your own MongoDB and deploy the two services using the instructions above.

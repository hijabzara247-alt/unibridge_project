# UniBridge

**Your university, Your seniors, Your guide.**

A full-stack platform that connects newly admitted students (Juniors) with
existing students (Seniors) of the **same university only**. Every list,
feed, and search result is scoped to the logged-in user's university —
students from one college never see or interact with students from another.

## How university isolation works

On registration, the university/college name a user types or picks is
normalized (trimmed, collapsed whitespace, lowercased) into a
`universityKey`. Every query in the app — the Q&A feed, "Find Seniors",
"Find Juniors" — filters by `req.user.universityKey`, so "Govt Post
Graduate College Mansehra" and "govt post graduate college mansehra " both
resolve to the same isolated group, while a different college resolves to
a completely separate one. See `backend/models/User.js` and
`backend/controllers/userController.js` / `questionController.js` for the
enforcement points.

## Tech stack

- **Frontend:** React (Create React App) + Tailwind CSS, React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (bcrypt-hashed passwords)

## Project structure

```
unibridge/
├── backend/
│   ├── config/          # DB connection, university dropdown list
│   ├── controllers/     # auth, users (find people), questions (Q&A)
│   ├── middleware/       # JWT "protect" middleware
│   ├── models/           # User, Question (with embedded Answer subdoc)
│   ├── routes/           # /api/auth, /api/users, /api/questions, /api/meta
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios instance with JWT interceptor
        ├── context/       # AuthContext (login state, token storage)
        ├── components/    # Navbar, PrivateRoute, QuestionCard, UserCard, RoleBadge
        └── pages/         # Landing, Login, Register, Dashboard, QA feed,
                            # AskQuestion, QuestionDetail, FindPeople
```

## Deploying the backend on Vercel

The `backend/` folder now works two ways:
- **Normal hosting** (your own computer, Railway, Render): `server.js` is the
  entry point — it calls `app.listen()` and stays running.
- **Vercel (serverless)**: `api/index.js` is the entry point Vercel uses
  automatically, together with `vercel.json`. No `app.listen()` is needed;
  Vercel calls the exported function per request. When creating the Vercel
  project, set **Root Directory** to `backend` and add the `MONGO_URI` and
  `JWT_SECRET` environment variables — same values as any other host.

Both entry points share the same Express app defined in `app.js`, so routes
and middleware only need to be written once.

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm install
npm run dev                # nodemon, or `npm start` for plain node
```

Requires a running MongoDB instance (local `mongod` or a MongoDB Atlas
connection string in `MONGO_URI`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # only needed if backend isn't on localhost:5000
npm install
npm start
```

Open http://localhost:3000. The React dev server proxies API calls to
whatever `REACT_APP_API_URL` points to (defaults to
`http://localhost:5000/api`).

## API overview

| Method | Route                     | Auth | Description                              |
|--------|---------------------------|------|-------------------------------------------|
| POST   | /api/auth/register        | No   | Create account (name, email, password, university, department, role, year) |
| POST   | /api/auth/login           | No   | Log in, returns JWT + user                |
| GET    | /api/auth/me              | Yes  | Current logged-in user                    |
| GET    | /api/meta/universities    | No   | Standardized university dropdown list     |
| GET    | /api/users/seniors        | Yes  | Seniors at your university                |
| GET    | /api/users/juniors        | Yes  | Juniors at your university                |
| GET    | /api/questions            | Yes  | Q&A feed for your university              |
| POST   | /api/questions            | Yes  | Ask a question                            |
| GET    | /api/questions/:id        | Yes  | One question + its answers                |
| POST   | /api/questions/:id/answers        | Yes | Post an answer                    |
| POST   | /api/questions/:id/answers/:aid/upvote | Yes | Toggle upvote on an answer |

Every one of the `Yes`-auth routes above filters by the requester's
`universityKey` — there is no endpoint that returns cross-university data.

## Notes for production

- Set a long, random `JWT_SECRET` and a real `MONGO_URI` (e.g. MongoDB Atlas).
- Run `npm run build` in `frontend/` and serve the static build behind a
  CDN or the Express app; update `CLIENT_ORIGIN` in the backend `.env`
  accordingly.
- Add rate limiting (e.g. `express-rate-limit`) on `/api/auth/*` before
  going live.

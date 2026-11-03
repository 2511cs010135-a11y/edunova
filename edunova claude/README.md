# EduNova - Smart Education Platform

A comprehensive smart education ecosystem combining hackathon & tech-event listings with registration, a live coding-contest feed, milestone-based study roadmaps, interactive quizzes & self-assessment, team & peer study finder, 3D active recall flashcards, and a productivity focus studio with synthesized ambient soundscapes.

## Smart Education Modules

1. **Hackathons & Tech Events (`/events`)**: Browse events, single-click registration, participant list tracking.
2. **Live Coding Contests (`/contests`)**: Real-time contest feeds from Codeforces, CodeChef, LeetCode, AtCoder, etc.
3. **Study Roadmaps (`/roadmaps`)**: Milestone checklist roadmaps for WebDev, AI/ML, DSA, and Mobile Apps.
4. **Smart Quizzes & Self-Assessment (`/quizzes`)**: Interactive timed quizzes, instant grading, answer explanations, and scorecard tracking.
5. **Team & Peer Finder (`/teams`)**: Post and join team recruitments for hackathons, study groups, and open-source projects.
6. **Smart Revision & Flashcards (`/resources`)**: 3D active-recall flip cards with self-grading and 1-click code cheat sheets.
7. **Productivity Focus Studio (`/focus`)**: Pomodoro timer, Web Audio synthesizers (Rain, Binaural Focus Tones, White Noise), and daily study logging.

## Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Web Audio API
- **Backend:** Node.js, Express, JWT auth (bcrypt password hashing), lowdb (file-based JSON database)
- **External API:** [kontests.net](https://kontests.net) public API proxied through backend

## Quick Start

### Install dependencies (first run only)

```bash
npm run install:all
```

### Run the app

```bash
npm run dev
```

This starts both servers together. Open `http://localhost:5173`; the frontend proxies API requests to the backend at `http://localhost:5000`. The backend health check is `http://localhost:5000/api/health`.

For production, `npm start` builds the frontend and serves it from the backend.

## API Overview

| Method | Route                              | Auth | Description                              |
|--------|-------------------------------------|------|--------------------------------------------|
| POST   | /api/auth/signup                    | –    | Create an account                          |
| POST   | /api/auth/login                     | –    | Log in, returns JWT                        |
| GET    | /api/auth/me                        | ✔    | Current user                               |
| GET    | /api/events                         | –    | List events (`?type=hackathon`)            |
| GET    | /api/events/:id                     | –    | Event detail                               |
| POST   | /api/events/:id/register            | ✔    | Register for an event                      |
| DELETE | /api/events/:id/register            | ✔    | Cancel a registration                      |
| GET    | /api/events/mine/registrations      | ✔    | Your registrations                         |
| GET    | /api/roadmaps                       | –    | List roadmaps                              |
| GET    | /api/roadmaps/:id                   | –    | Roadmap detail                             |
| GET    | /api/roadmaps/:id/progress          | ✔    | Your checklist progress                    |
| PUT    | /api/roadmaps/:id/progress          | ✔    | Save checklist progress                    |
| GET    | /api/contests                       | –    | Live upcoming contests                     |
| GET    | /api/quizzes                        | –    | List quizzes (`?category=`, `?difficulty=`) |
| GET    | /api/quizzes/:id                    | –    | Get quiz details                           |
| POST   | /api/quizzes/:id/submit             | –    | Submit quiz answers and calculate score    |
| GET    | /api/quizzes/mine/results           | ✔    | Get user quiz attempt history              |
| GET    | /api/teams                          | –    | List open team recruitment posts           |
| POST   | /api/teams                          | ✔    | Create a team recruitment post             |
| POST   | /api/teams/:id/apply                | ✔    | Apply/connect to a team post               |
| DELETE | /api/teams/:id                      | ✔    | Delete own team post                       |
| GET    | /api/resources/flashcards           | –    | List 3D flashcard decks                    |
| GET    | /api/resources/cheatsheets          | –    | List code cheat sheets                     |
| GET    | /api/focus/logs                     | ✔    | Get user focus study logs & analytics      |
| POST   | /api/focus/logs                     | ✔    | Log a completed focus study session        |

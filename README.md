# TaskFlow — Full-Stack Task Management Application

A production-ready full-stack application with **JWT authentication**, **role-based access control**, and **CRUD operations** built with Node.js/Express and React.

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB (Mongoose ODM)                       |
| Auth       | JWT (jsonwebtoken), bcryptjs                 |
| Validation | express-validator                            |
| API Docs   | Swagger (swagger-jsdoc + swagger-ui-express) |
| Frontend   | React 19 (Vite), React Router, Axios         |
| Security   | Helmet, CORS, input sanitization             |

## Project Structure

```
intern/
├── server/                  # Backend API
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── swagger.js       # Swagger/OpenAPI config
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT protect + role authorize
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validate.js      # express-validator middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js            # Entry point
│   ├── .env.example
│   └── package.json
├── client/                  # React Frontend
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend Setup

```bash
cd server
cp .env.example .env        # Edit .env with your MongoDB URI & JWT secret
npm install
npm run dev                  # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev                  # Starts on http://localhost:5173
```

### 3. Open in Browser

- **Frontend**: http://localhost:5173
- **API Docs (Swagger)**: http://localhost:5000/api-docs

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint    | Access  | Description         |
| ------ | ----------- | ------- | ------------------- |
| POST   | `/register` | Public  | Register new user   |
| POST   | `/login`    | Public  | Login & receive JWT |
| GET    | `/me`       | Private | Get current user    |
| GET    | `/users`    | Admin   | List all users      |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Access  | Description                      |
| ------ | -------- | ------- | -------------------------------- |
| GET    | `/`      | Private | List tasks (own / all for admin) |
| POST   | `/`      | Private | Create a task                    |
| GET    | `/:id`   | Private | Get single task                  |
| PUT    | `/:id`   | Private | Update task (owner or admin)     |
| DELETE | `/:id`   | Private | Delete task (owner or admin)     |

**Query filters**: `?status=pending&priority=high`

## Database Schema

### User

| Field    | Type   | Details                     |
| -------- | ------ | --------------------------- |
| name     | String | Required, max 50 chars      |
| email    | String | Required, unique, validated |
| password | String | Hashed (bcrypt, 12 rounds)  |
| role     | Enum   | `user` (default) \| `admin` |

### Task

| Field       | Type     | Details                                   |
| ----------- | -------- | ----------------------------------------- |
| title       | String   | Required, max 100 chars                   |
| description | String   | Optional, max 500 chars                   |
| status      | Enum     | `pending` \| `in-progress` \| `completed` |
| priority    | Enum     | `low` \| `medium` \| `high`               |
| user        | ObjectId | Reference to User (owner)                 |

## Security Practices

- **Password hashing**: bcrypt with 12 salt rounds
- **JWT tokens**: Signed with secret, configurable expiry (default 7 days)
- **Input validation**: express-validator on all endpoints
- **Security headers**: Helmet middleware
- **CORS**: Configurable cross-origin policy
- **Body size limit**: 10KB JSON payload limit
- **Ownership checks**: Users can only modify their own tasks
- **Role-based access**: Admin-only endpoints guarded by `authorize()` middleware
- **Global error handler**: Sanitized error responses (no stack traces in production)

## Scalability Notes

### Horizontal Scaling

- **Stateless JWT**: No server-side session storage — any instance can handle any request

### Performance

- **Database Indexing**: Compound index on `(user, createdAt)` for fast task queries

# AY Digital Institute Backend API

Backend API server for AY Digital Institute website with authentication system.

## Features

- User Registration & Login
- JWT Authentication
- Protected Routes
- User Profile Management
- PostgreSQL Database
- Express.js REST API

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - `DATABASE_URL`
   - `JWT_SECRET` and `REFRESH_TOKEN_SECRET`
   - `FRONTEND_URL` (CORS)

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)

## Environment Variables

- `PORT` - Server port (default: 5001)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Access token signing secret
- `REFRESH_TOKEN_SECRET` - Refresh token signing secret
- `FRONTEND_URL` - Allowed origin for CORS
- `API_BASE_URL` - Public base URL (used for OAuth callback URLs)
- `NODE_ENV` - Environment (development/production)

## Database Setup

1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE aydigital;
```

3. Update `.env` with your PostgreSQL credentials
4. Apply schema changes using Prisma (`prisma db push` or migrations if introduced)

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
   - MongoDB connection string
   - JWT secret key
   - Port number

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

- `PORT` - Server port (default: 5000)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: aydigital)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Database Setup

1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE aydigital;
```

3. Update `.env` with your PostgreSQL credentials
4. The application will automatically create tables on first run

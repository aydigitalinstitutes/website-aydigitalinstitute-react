# AY Digital Institute - Full Stack Application

A complete full-stack application for AY Digital Institute with React frontend and Node.js/Express backend.

## Project Structure

```
aydigital/
├── frontend/          # React frontend application
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── context/      # React context (Auth)
│   ├── data/        # Static data
│   └── utils/        # Utility functions
├── backend/          # Node.js/Express backend
│   ├── config/      # Configuration files
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middleware/  # Express middleware
│   └── utils/        # Utility functions
└── package.json      # Frontend dependencies
```

## Features

### Frontend
- ✅ Responsive React website
- ✅ User Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Dashboard for logged-in users
- ✅ 22 Courses with NIELIT certifications
- ✅ Contact form
- ✅ WhatsApp floating button
- ✅ Smooth animations

### Backend
- ✅ RESTful API with Express.js
- ✅ JWT Authentication
- ✅ User Registration & Login
- ✅ Protected API routes
- ✅ PostgreSQL database
- ✅ User profile management

## Setup Instructions

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aydigital
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

5. Create PostgreSQL database:
```sql
CREATE DATABASE aydigital;
```

5. Start backend server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (Protected)

## Technologies

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Vite
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL (Sequelize ORM)
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## Development

Run both frontend and backend simultaneously:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

## GitHub Actions CI/CD

This project includes GitHub Actions workflows for automated CI/CD:

> 📖 **Quick Setup:** See [SETUP_SECRETS.md](./SETUP_SECRETS.md) for detailed instructions on setting up GitHub secrets.

### Available Workflows
- **CI/CD Pipeline**: Automated testing, building, and frontend deployment
- **Database Migration**: Run database schema updates
- **Backend Deployment**: Deploy backend to staging/production
- **Database Backup**: Automated daily backups (runs at 2 AM UTC)

### Setup GitHub Actions Secrets

Go to your repository → Settings → Secrets and variables → Actions, and add:

**Frontend:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VITE_API_URL` - Production API URL

**Backend/Database:**
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (usually 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key

See `.github/README.md` for detailed workflow documentation.

## Production Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel/Netlify
- GitHub Actions will auto-deploy on push to main branch

### Backend
- Deploy to Heroku/Railway/Render
- Set environment variables
- Connect PostgreSQL database (local or cloud like Supabase, Neon, etc.)
- Use GitHub Actions workflow for automated deployment

## License

This project is created for AY Digital Institute.

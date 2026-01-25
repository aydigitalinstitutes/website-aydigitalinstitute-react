# 🚀 Quick Start Guide - Production Stack

## ✅ What's Ready

- ✅ TypeScript (Frontend & Backend)
- ✅ Prisma ORM (Schema ready)
- ✅ JWT + Refresh Tokens (Http-only cookies)
- ✅ React Hook Form + Zod (Form validation)
- ✅ Security Middleware (Helmet, CORS, Rate Limiting)
- ✅ Auth System (Complete)

---

## 🏃 Get Started in 5 Minutes

### 1. **Backend Setup**

```bash
cd backend

# Install dependencies (if not done)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# Start development server
npm run dev
```

### 2. **Frontend Setup**

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

### 3. **Test Authentication**

1. Open http://localhost:5173
2. Go to `/register`
3. Create an account
4. Login at `/login`
5. Access `/dashboard`

---

## 🔧 Environment Variables

### Backend `.env`

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/aydigital"
JWT_SECRET="your-secret-key-here"
REFRESH_TOKEN_SECRET="your-refresh-secret-here"
FRONTEND_URL="http://localhost:5173"

# Optional
PORT=5000
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Database Migration

### First Time Setup

```bash
cd backend
npx prisma migrate dev --name init
```

### After Schema Changes

```bash
npx prisma migrate dev --name your_change_description
```

### View Database

```bash
npx prisma studio
```

---

## 🧪 Testing Endpoints

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123"
}
```

### Get Current User
```bash
GET http://localhost:5000/api/auth/me
# Cookies are sent automatically
```

---

## 🎯 Key Features

### Security
- ✅ Http-only cookies (XSS protection)
- ✅ Token rotation
- ✅ Rate limiting
- ✅ Security headers
- ✅ CORS protection

### Forms
- ✅ Real-time validation
- ✅ Type-safe
- ✅ Error messages
- ✅ Loading states

### Auth Flow
- ✅ Register → Login → Dashboard
- ✅ Auto token refresh
- ✅ Secure logout
- ✅ Protected routes

---

## 📝 Next Steps

1. **Run Prisma Migration** (if not done)
2. **Test Authentication** (register/login)
3. **Add OAuth** (optional - Google/GitHub)
4. **Add Email Verification** (optional)
5. **Deploy** (when ready)

---

## 🆘 Troubleshooting

### Backend won't start
- Check `DATABASE_URL` in `.env`
- Run `npx prisma generate`
- Check database connection

### Frontend can't connect
- Verify `VITE_API_URL` in `.env`
- Check backend is running
- Check CORS settings

### Migration fails
- Verify database exists
- Check connection string
- Ensure database user has permissions

---

**Status: ✅ Ready to Run - Just Add Database URL!**

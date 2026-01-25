# Deployment Guide

## 🚀 Quick Deployment Options

### Frontend Deployment (Vercel) - Recommended

**Prerequisites:**
- Vercel account
- Vercel project created

**Steps:**

1. **Get Vercel Credentials:**
   ```bash
   # 1. Get Vercel Token
   # Go to: https://vercel.com/account/tokens
   # Create token → Copy it
   
   # 2. Get Organization ID
   # Go to: https://vercel.com/account
   # Settings → General → Copy Team ID
   
   # 3. Get Project ID
   # Go to your Vercel project
   # Settings → General → Copy Project ID
   ```

2. **Set GitHub Secrets:**
   ```powershell
   gh secret set VERCEL_TOKEN --body "your-vercel-token"
   gh secret set VERCEL_ORG_ID --body "your-org-id"
   gh secret set VERCEL_PROJECT_ID --body "your-project-id"
   gh secret set VITE_API_URL --body "https://your-backend-api.com/api"
   ```

3. **Deploy:**
   - Push to `master` branch (auto-deploys)
   - Or manually trigger: `gh workflow run "CI/CD Pipeline"`

**Manual Vercel Deployment (Alternative):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### Backend Deployment

#### Option 1: Railway

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up/login

2. **Deploy:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd backend
   railway init
   
   # Deploy
   railway up
   ```

3. **Set Environment Variables in Railway:**
   - `PORT=5000`
   - `DB_HOST=your-db-host`
   - `DB_PORT=5432`
   - `DB_NAME=aydigital`
   - `DB_USER=your-db-user`
   - `DB_PASSWORD=your-db-password`
   - `JWT_SECRET=your-jwt-secret`
   - `NODE_ENV=production`

#### Option 2: Render

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up/login

2. **Create Web Service:**
   - New → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Set Environment Variables:**
   - Same as Railway above

#### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Windows
   winget install Heroku.HerokuCLI
   ```

2. **Deploy:**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   git push heroku master
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set DB_HOST=your-host
   heroku config:set DB_PORT=5432
   heroku config:set DB_NAME=aydigital
   heroku config:set DB_USER=your-user
   heroku config:set DB_PASSWORD=your-password
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   ```

---

## 📦 Build Artifacts

### Frontend Build
```bash
npm run build
# Output: dist/ directory
```

### Backend Package
The GitHub Actions workflow automatically creates:
- `backend-deploy.tar.gz` (deployment package)
- Available as workflow artifact

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-api.com/api
```

### Backend (.env)
```env
PORT=5000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=aydigital
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

---

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Get connection details from Settings → Database
4. Update backend environment variables

### Option 2: Neon
1. Go to https://neon.tech
2. Create new project
3. Get connection string
4. Update backend environment variables

### Option 3: Railway Database
1. Create PostgreSQL service in Railway
2. Get connection details
3. Update backend environment variables

---

## ✅ Deployment Checklist

### Frontend
- [ ] Vercel account created
- [ ] Vercel project created
- [ ] GitHub secrets configured (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] VITE_API_URL set to production backend URL
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Deployed and accessible

### Backend
- [ ] Backend hosting platform chosen (Railway/Render/Heroku)
- [ ] Database provider set up (Supabase/Neon/Railway)
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backend accessible and healthy
- [ ] CORS configured for frontend domain

### Database
- [ ] Database created
- [ ] Connection tested
- [ ] Migrations applied
- [ ] Backup strategy configured

### GitHub Actions
- [ ] All secrets configured
- [ ] Workflows running successfully
- [ ] CI/CD pipeline passing
- [ ] Automatic deployments working

---

## 🧪 Testing Deployment

### Test Frontend
```bash
# Build locally
npm run build

# Preview build
npm run preview

# Check build output
ls dist/
```

### Test Backend
```bash
cd backend
npm start

# Test health endpoint
curl http://localhost:5000/api/health
```

---

## 🔗 Useful Links

- **Repository**: https://github.com/aydigitalinstitutes/website-aydigitalinstitute-react
- **Actions**: https://github.com/aydigitalinstitutes/website-aydigitalinstitute-react/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Render Dashboard**: https://dashboard.render.com

---

## 🆘 Troubleshooting

### Frontend Build Fails
- Check `npm run build` locally
- Verify all dependencies installed
- Check for TypeScript/ESLint errors

### Backend Deployment Fails
- Verify environment variables set correctly
- Check database connection
- Review deployment logs
- Test locally first: `cd backend && npm start`

### Database Connection Issues
- Verify database credentials
- Check firewall/network settings
- Test connection string
- Ensure database is accessible from deployment platform

---

## 📝 Notes

- Frontend builds are automatically created in GitHub Actions
- Backend deployment packages are available as workflow artifacts
- All deployments should use production environment variables
- Keep secrets secure and never commit them to repository

# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD, database management, and deployment.

## Available Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push/PR to main/master/develop branches
- **Jobs**:
  - **Frontend Build**: Builds the React frontend and uploads artifacts
  - **Backend Test**: Tests backend with PostgreSQL service
  - **Deploy Frontend**: Auto-deploys to Vercel on main branch

### 2. Database Migration (`.github/workflows/database-migrate.yml`)
- **Triggers**: Manual dispatch or when model files change
- **Purpose**: Runs database migrations and schema updates
- **Usage**: Can be triggered manually with environment selection

### 3. Deploy Backend (`.github/workflows/deploy-backend.yml`)
- **Triggers**: Manual dispatch or when backend files change
- **Purpose**: Builds and packages backend for deployment
- **Usage**: Manual trigger with environment selection (staging/production)

### 4. Database Backup (`.github/workflows/backup-database.yml`)
- **Triggers**: Daily at 2 AM UTC or manual dispatch
- **Purpose**: Creates PostgreSQL database backups
- **Storage**: Uploads to GitHub Actions artifacts (30 days retention)

## Required Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Frontend Deployment
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VITE_API_URL` - Frontend API URL

### Backend/Database
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key

## Usage

### Running Workflows Manually

1. Go to **Actions** tab in your GitHub repository
2. Select the workflow you want to run
3. Click **Run workflow**
4. Select branch and options
5. Click **Run workflow**

### Viewing Workflow Results

- Check the **Actions** tab for workflow runs
- View logs for each step
- Download artifacts (builds, backups) from completed runs

## Customization

### Adding Tests

Update the backend workflow to include your test command:
```yaml
- name: Run tests
  run: npm test
```

### Changing Deployment Platform

Modify the deploy workflows to use your preferred platform:
- Railway
- Render
- Heroku
- AWS
- DigitalOcean

### Backup Storage

To store backups in cloud storage (S3, Google Cloud, etc.), add steps to upload after backup creation.

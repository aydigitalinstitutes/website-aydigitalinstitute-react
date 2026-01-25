# GitHub Actions Secrets Setup Guide

This guide will help you set up all required secrets for GitHub Actions workflows.

## Quick Setup Steps

1. Go to your repository: https://github.com/aydigitalinstitutes/website-aydigitalinstitute-react
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each secret below

---

## Required Secrets

### Frontend Deployment (Vercel)

#### 1. VERCEL_TOKEN
- **How to get it:**
  1. Go to https://vercel.com/account/tokens
  2. Click **"Create Token"**
  3. Name it: `github-actions`
  4. Copy the token
  5. Add as secret: `VERCEL_TOKEN`

#### 2. VERCEL_ORG_ID
- **How to get it:**
  1. Go to https://vercel.com/account
  2. Click on your organization/team
  3. Go to **Settings** → **General**
  4. Copy the **Team ID** (this is your ORG_ID)
  5. Add as secret: `VERCEL_ORG_ID`

#### 3. VERCEL_PROJECT_ID
- **How to get it:**
  1. Go to your Vercel project dashboard
  2. Go to **Settings** → **General**
  3. Copy the **Project ID**
  4. Add as secret: `VERCEL_PROJECT_ID`

#### 4. VITE_API_URL
- **Value:** Your production backend API URL
- **Example:** `https://your-backend.railway.app/api` or `https://api.yourdomain.com/api`
- **Add as secret:** `VITE_API_URL`

---

### Backend/Database (PostgreSQL)

#### 5. DB_HOST
- **Value:** Your PostgreSQL database host
- **Examples:**
  - Local: `localhost`
  - Supabase: `db.xxxxx.supabase.co`
  - Railway: `containers-us-west-xxx.railway.app`
  - Neon: `ep-xxxxx.us-east-2.aws.neon.tech`
- **Add as secret:** `DB_HOST`

#### 6. DB_PORT
- **Value:** PostgreSQL port (usually `5432`)
- **Add as secret:** `DB_PORT`

#### 7. DB_NAME
- **Value:** Your database name (e.g., `aydigital`)
- **Add as secret:** `DB_NAME`

#### 8. DB_USER
- **Value:** Your PostgreSQL username
- **Add as secret:** `DB_USER`

#### 9. DB_PASSWORD
- **Value:** Your PostgreSQL password
- **⚠️ Important:** Keep this secure!
- **Add as secret:** `DB_PASSWORD`

#### 10. JWT_SECRET
- **Value:** A strong random string for JWT token signing
- **Generate one:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Or use:** Any long random string (at least 32 characters)
- **Add as secret:** `JWT_SECRET`

#### 11. GH_PAT (Optional - GitHub Personal Access Token)
- **Purpose:** Custom GitHub token for workflows (optional, defaults to GITHUB_TOKEN)
- **When to use:** If you need extended permissions beyond the default GitHub Actions token
- **How to get it:**
  1. Go to https://github.com/settings/tokens
  2. Click **"Generate new token"** → **"Generate new token (classic)"**
  3. Name it: `github-actions-pat`
  4. Select scopes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
  5. Click **"Generate token"**
  6. Copy the token immediately (you won't see it again)
  7. Add as secret: `GH_PAT`
- **Note:** If not set, workflows will use the default `GITHUB_TOKEN` automatically

---

## Setting Up Secrets via GitHub CLI (Alternative)

If you have GitHub CLI installed, you can set secrets via command line:

```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: See https://cli.github.com/

# Login to GitHub
gh auth login

# Set secrets (replace values with your actual values)
gh secret set VERCEL_TOKEN --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
gh secret set VITE_API_URL --body "https://your-api-url.com/api"
gh secret set DB_HOST --body "your-db-host"
gh secret set DB_PORT --body "5432"
gh secret set DB_NAME --body "aydigital"
gh secret set DB_USER --body "your-db-user"
gh secret set DB_PASSWORD --body "your-db-password"
gh secret set JWT_SECRET --body "your-jwt-secret"
gh secret set GH_PAT --body "your-github-pat"  # Optional
```

---

## Verify Secrets Are Set

1. Go to: https://github.com/aydigitalinstitutes/website-aydigitalinstitute-react/settings/secrets/actions
2. You should see all required secrets listed (10 required + 1 optional)
3. Secrets are hidden (showing only `••••••••`)

---

## Test Workflows

After setting up secrets:

1. Go to **Actions** tab in your repository
2. You should see workflows available
3. Try running **"Database Backup"** workflow manually to test
4. Push a commit to trigger CI/CD pipeline

---

## Troubleshooting

### Workflow fails with "Secret not found"
- Make sure you added the secret with the exact name (case-sensitive)
- Check that you're in the correct repository

### Vercel deployment fails
- Verify `VERCEL_TOKEN` is valid and not expired
- Check that `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
- Ensure your Vercel project exists

### Database connection fails
- Verify all database secrets are correct
- Check that your database allows connections from GitHub Actions IPs
- For cloud databases, ensure firewall rules allow external connections

---

## Security Notes

- ⚠️ **Never commit secrets to your repository**
- ✅ Secrets are encrypted and only accessible to workflows
- ✅ Secrets are hidden in logs (automatically masked)
- ✅ Use different secrets for development/staging/production

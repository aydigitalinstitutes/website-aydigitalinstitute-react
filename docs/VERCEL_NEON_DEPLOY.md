# Deploying to Vercel + Neon

This project is configured as a monorepo with 3 distinct services. To deploy using Vercel (for Apps & API) and Neon (for Database), follow these steps.

## Prerequisites
- A [Vercel](https://vercel.com/) account
- A [Neon](https://neon.tech/) account
- GitHub repository connected to both

## Step 1: Database (Neon)
1. Log in to Neon Console and create a new project.
2. Note down the **Connection String** (Postgres URL). It should look like:
   `postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`

## Step 2: Backend API (Vercel)
We will deploy the NestJS API as a Serverless Function.

1. Go to Vercel Dashboard > **Add New...** > **Project**.
2. Import your GitHub repository.
3. **Configure Project**:
   - **Project Name**: `aydigital-api` (example)
   - **Framework Preset**: `Other`
   - **Root Directory**: `api` (Click Edit next to Root Directory)
   - **Build Command**: `npm run build` (or leave default if configured)
   - **Environment Variables**:
     - `DATABASE_URL`: (Paste your Neon Connection String)
     - `JWT_ACCESS_SECRET`: (Generate secure string)
     - `JWT_REFRESH_SECRET`: (Generate secure string)
     - `CORS_ORIGINS`: `https://your-frontend.vercel.app,https://your-admin.vercel.app` (Update this later once you have frontend URLs)
4. Click **Deploy**.
5. Once deployed, note the domain (e.g., `https://aydigital-api.vercel.app`).

**Important**: The API endpoints will be available at `https://aydigital-api.vercel.app/api/v1/...`.

## Step 3: Frontend (Vercel)
Deploy the public-facing React website.

1. Go to Vercel Dashboard > **Add New...** > **Project**.
2. Import the SAME GitHub repository.
3. **Configure Project**:
   - **Project Name**: `aydigital-web`
   - **Framework Preset**: `Vite` (Vercel should auto-detect)
   - **Root Directory**: `.` (Root)
   - **Environment Variables**:
     - `VITE_API_URL`: `https://aydigital-api.vercel.app/api/v1` (Use the API URL from Step 2)
4. Click **Deploy**.

## Step 4: Admin Portal (Vercel)
Deploy the admin dashboard.

1. Go to Vercel Dashboard > **Add New...** > **Project**.
2. Import the SAME GitHub repository.
3. **Configure Project**:
   - **Project Name**: `aydigital-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `admin`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://aydigital-api.vercel.app/api/v1`
4. Click **Deploy**.

## Step 5: Final Configuration
1. Go back to your **API Project** in Vercel.
2. Update the `CORS_ORIGINS` environment variable to include the actual domains of your deployed Web and Admin projects.
   Example: `https://aydigital-web.vercel.app,https://aydigital-admin.vercel.app`
3. Redeploy the API project for changes to take effect.

## Troubleshooting
- **Database Connection**: Ensure Neon allows connections from anywhere (0.0.0.0/0) or Vercel's IP ranges. Neon is serverless-friendly by default.
- **Cold Starts**: Serverless functions may have a slight delay on first request. This is normal.
- **Prisma in Serverless**: The project uses standard Prisma. If you encounter timeout issues, consider using the Neon Serverless Driver for Prisma, but the standard driver usually works fine for low-to-medium traffic.

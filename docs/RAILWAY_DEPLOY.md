# Deploying to Railway

This project is configured as a monorepo with 3 distinct services that can be deployed individually on Railway.

## Prerequisites
- A [Railway](https://railway.app/) account
- GitHub repository connected to Railway

## Service 1: Database (PostgreSQL)
1. In Railway, click **New Project** > **Database** > **Add PostgreSQL**.
2. Once created, go to the **Variables** tab to view connection details.

## Service 2: Redis
1. Click **New** > **Database** > **Add Redis**.

## Service 3: Backend API (NestJS)
1. Click **New** > **GitHub Repo** > Select this repository.
2. Click on the new service to configure it.
3. **Settings** > **Root Directory**: Set to `/api`
4. **Settings** > **Build Command**: Leave empty (uses Dockerfile).
5. **Variables**: Add the following:
   - `DATABASE_URL`: (Reference your Postgres service)
   - `REDIS_URL`: (Reference your Redis service)
   - `JWT_ACCESS_SECRET`: (Generate a secure string)
   - `JWT_REFRESH_SECRET`: (Generate a secure string)
   - `PORT`: `5001` (Railway automatically sets `PORT`, but your app defaults to 5001. Best to use `PORT` env var in code).
   - `CORS_ORIGINS`: `https://your-frontend.up.railway.app,https://your-admin.up.railway.app`
6. Railway will automatically detect `api/Dockerfile` and build it.

## Service 4: Frontend (React)
1. Click **New** > **GitHub Repo** > Select this repository (again).
2. **Settings** > **Root Directory**: Set to `/` (Root)
3. **Settings** > **Dockerpath**: `Dockerfile` (Default)
4. **Variables**:
   - `VITE_API_URL`: `https://your-api-service.up.railway.app/api/v1` (Use the actual URL of your API service)
   - `PORT`: `80` (Optional, Nginx listens on 80)
5. This uses the root `Dockerfile` which builds the React app and serves it with Nginx.

## Service 5: Admin Portal (React)
1. Click **New** > **GitHub Repo** > Select this repository (again).
2. **Settings** > **Root Directory**: Set to `/` (Root)
3. **Settings** > **Dockerpath**: `admin/Dockerfile`
4. **Variables**:
   - `VITE_API_URL`: `https://your-api-service.up.railway.app/api/v1`
   - `PORT`: `80`
5. This uses `admin/Dockerfile` which builds the Admin app and serves it with Nginx.

## Troubleshooting
- **CORS Errors**: Ensure `CORS_ORIGINS` in the API service exactly matches the URLs of your Frontend and Admin services (no trailing slashes usually).
- **Database Connection**: Ensure `DATABASE_URL` is correct. In Railway, you can type `${{PostgreSQL.DATABASE_URL}}` to reference it dynamically.

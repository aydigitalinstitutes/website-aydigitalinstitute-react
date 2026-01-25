# Quick Secret Setup Script
# Run individual commands to set secrets

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Actions Secrets Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Use the following commands to set secrets:" -ForegroundColor Yellow
Write-Host ""

# Frontend Secrets (Vercel)
Write-Host "Frontend Secrets (Vercel):" -ForegroundColor Cyan
Write-Host '  gh secret set VERCEL_TOKEN --body "your-vercel-token"' -ForegroundColor Gray
Write-Host '  gh secret set VERCEL_ORG_ID --body "your-org-id"' -ForegroundColor Gray
Write-Host '  gh secret set VERCEL_PROJECT_ID --body "your-project-id"' -ForegroundColor Gray
Write-Host '  gh secret set VITE_API_URL --body "https://your-api-url.com/api"' -ForegroundColor Gray
Write-Host ""

# Database Secrets
Write-Host "Database Secrets (PostgreSQL):" -ForegroundColor Cyan
Write-Host '  gh secret set DB_HOST --body "your-db-host"' -ForegroundColor Gray
Write-Host '  gh secret set DB_PORT --body "5432"' -ForegroundColor Gray
Write-Host '  gh secret set DB_NAME --body "aydigital"' -ForegroundColor Gray
Write-Host '  gh secret set DB_USER --body "your-db-user"' -ForegroundColor Gray
Write-Host '  gh secret set DB_PASSWORD --body "your-db-password"' -ForegroundColor Gray
Write-Host ""

# Security Secrets
Write-Host "Security Secrets:" -ForegroundColor Cyan
Write-Host '  ✓ JWT_SECRET (already set)' -ForegroundColor Green
Write-Host '  gh secret set GH_PAT --body "your-github-pat"  # Optional' -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Current Secrets:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
gh secret list
Write-Host ""

Write-Host "Repository:" -ForegroundColor Cyan
Write-Host "https://github.com/aydigitalinstitutes/website-aydigitalinstitute-react" -ForegroundColor Yellow
Write-Host ""

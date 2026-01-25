# GitHub Actions Secrets Setup Script
# This script helps you set up secrets via GitHub CLI

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Actions Secrets Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghInstalled) {
    Write-Host "GitHub CLI (gh) is not installed." -ForegroundColor Yellow
    Write-Host "Please install it first:" -ForegroundColor Yellow
    Write-Host "  Windows: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "  Or download from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, set secrets manually at:" -ForegroundColor Yellow
    Write-Host "https://github.com/anshulyadav32/website-aydigitalinstitute-react/settings/secrets/actions" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to GitHub CLI." -ForegroundColor Yellow
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ GitHub CLI is ready" -ForegroundColor Green
Write-Host ""

# Function to set secret
function Set-Secret {
    param(
        [string]$Name,
        [string]$Description,
        [string]$Example = ""
    )
    
    Write-Host "Setting: $Name" -ForegroundColor Cyan
    Write-Host "  $Description" -ForegroundColor Gray
    if ($Example) {
        Write-Host "  Example: $Example" -ForegroundColor Gray
    }
    
    $value = Read-Host "  Enter value for $Name"
    
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "  ⚠ Skipped (empty value)" -ForegroundColor Yellow
        return
    }
    
    gh secret set $Name --body $value
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Secret '$Name' set successfully" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to set secret '$Name'" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend Secrets (Vercel)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Secret -Name "VERCEL_TOKEN" -Description "Vercel API token" -Example "Get from: https://vercel.com/account/tokens"
Set-Secret -Name "VERCEL_ORG_ID" -Description "Vercel Organization/Team ID" -Example "Get from Vercel Settings → General"
Set-Secret -Name "VERCEL_PROJECT_ID" -Description "Vercel Project ID" -Example "Get from Vercel Project Settings → General"
Set-Secret -Name "VITE_API_URL" -Description "Production API URL" -Example "https://your-backend.railway.app/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Secrets (PostgreSQL)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Secret -Name "DB_HOST" -Description "PostgreSQL host" -Example "localhost or db.xxxxx.supabase.co"
Set-Secret -Name "DB_PORT" -Description "PostgreSQL port" -Example "5432"
Set-Secret -Name "DB_NAME" -Description "Database name" -Example "aydigital"
Set-Secret -Name "DB_USER" -Description "Database username" -Example "postgres"
Set-Secret -Name "DB_PASSWORD" -Description "Database password" -Example "your-secure-password"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Secrets" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate JWT secret if user wants
Write-Host "JWT_SECRET" -ForegroundColor Cyan
Write-Host "  Generate a random JWT secret? (Y/n)" -ForegroundColor Gray
$generate = Read-Host "  "
if ($generate -eq "" -or $generate -eq "Y" -or $generate -eq "y") {
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "  Generated JWT Secret: $jwtSecret" -ForegroundColor Green
    gh secret set JWT_SECRET --body $jwtSecret
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ JWT_SECRET set successfully" -ForegroundColor Green
    }
} else {
    Set-Secret -Name "JWT_SECRET" -Description "JWT secret key (at least 32 characters)" -Example "Use a long random string"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Authentication (Optional)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "GH_PAT (GitHub Personal Access Token)" -ForegroundColor Cyan
Write-Host "  Optional: Custom GitHub token for workflows" -ForegroundColor Gray
Write-Host "  If not set, workflows will use default GITHUB_TOKEN" -ForegroundColor Gray
Write-Host "  Set this if you need extended permissions" -ForegroundColor Gray
Write-Host "  Get from: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host ""
$setPat = Read-Host "  Set GH_PAT? (y/N)"
if ($setPat -eq "y" -or $setPat -eq "Y") {
    Set-Secret -Name "GH_PAT" -Description "GitHub Personal Access Token" -Example "Get from: https://github.com/settings/tokens"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verify secrets at:" -ForegroundColor Cyan
Write-Host "https://github.com/anshulyadav32/website-aydigitalinstitute-react/settings/secrets/actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Test workflows at:" -ForegroundColor Cyan
Write-Host "https://github.com/anshulyadav32/website-aydigitalinstitute-react/actions" -ForegroundColor Yellow
Write-Host ""

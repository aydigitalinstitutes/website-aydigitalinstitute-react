param(
    [string]$Service = "all"
)

Write-Host "AY Digital - Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check Vercel CLI
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: 'vercel' CLI not found." -ForegroundColor Red
    Write-Host "Please run: npm install -g vercel"
    exit 1
}

function Deploy-Project {
    param(
        [string]$Path,
        [string]$Name
    )
    
    Write-Host "`n[Deploying $Name]" -ForegroundColor Yellow
    Push-Location $Path
    
    try {
        # Run interactive deploy if not linked, or just deploy
        vercel deploy --prod
    }
    catch {
        Write-Host "Deployment failed for $Name" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# 1. API Deployment
if ($Service -eq "all" -or $Service -eq "api") {
    Deploy-Project -Path "./apps/api" -Name "Backend API"
}

# 2. Web Deployment
if ($Service -eq "all" -or $Service -eq "web") {
    Deploy-Project -Path "./apps/website" -Name "Frontend Web"
}

# 3. Admin Deployment
if ($Service -eq "all" -or $Service -eq "admin") {
    Deploy-Project -Path "./apps/portal" -Name "Admin Portal"
}

Write-Host "`nDeployment process completed." -ForegroundColor Green
Write-Host "Note: Ensure environment variables are set in Vercel Dashboard for each project." -ForegroundColor Gray

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "       Starting LoanSphere Microservices" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# [1/3] Database Prerequisite Check
Write-Host "[1/3] Database Prerequisite Check" -ForegroundColor Yellow
Write-Host "---------------------------------" -ForegroundColor Yellow
$mysqlPort = 3306
$connection = Test-NetConnection -Port $mysqlPort -ComputerName localhost -WarningAction SilentlyContinue
if ($connection.TcpTestSucceeded) {
    Write-Host "MySQL is running on localhost:$mysqlPort" -ForegroundColor Green
} else {
    Write-Host "Warning: MySQL does not appear to be running on localhost:$mysqlPort." -ForegroundColor Red
    Write-Host "Please ensure MySQL is running, the database 'loansphere_db' exists," -ForegroundColor Red
    Write-Host "and MySQL user is 'root' with password 'Pratham@098'." -ForegroundColor Red
}
Write-Host ""

# [2/3] Checking Frontend Dependencies
Write-Host "[2/3] Checking Frontend Dependencies" -ForegroundColor Yellow
Write-Host "---------------------------------" -ForegroundColor Yellow
$frontendDir = Join-Path $PSScriptRoot "frontend/LoanSphere-frontend"
if (Test-Path (Join-Path $frontendDir "node_modules")) {
    Write-Host "Frontend dependencies are already installed." -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Green
    Start-Process cmd.exe -ArgumentList "/c", "cd `"$frontendDir`" && npm install" -Wait
}
Write-Host ""

# [3/3] Launching Microservices in New Terminals
Write-Host "[3/3] Launching Microservices in New Terminals" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Yellow

$services = @(
    @{ Name = "Service Registry"; Path = "service-registry"; Cmd = ".\mvnw.cmd spring-boot:run" },
    @{ Name = "Auth Service"; Path = "auth-service"; Cmd = ".\mvnw.cmd spring-boot:run" },
    @{ Name = "User Service"; Path = "user-service"; Cmd = ".\mvnw.cmd spring-boot:run" },
    @{ Name = "Loan Service"; Path = "loan-service"; Cmd = ".\mvnw.cmd spring-boot:run" },
    @{ Name = "API Gateway"; Path = "api-gateway"; Cmd = ".\mvnw.cmd spring-boot:run" },
    @{ Name = "React Frontend"; Path = "frontend/LoanSphere-frontend"; Cmd = "npm run dev" }
)

foreach ($service in $services) {
    $fullPath = Join-Path $PSScriptRoot $service.Path
    Write-Host "-> Launching $($service.Name) ($($service.Path))...." -ForegroundColor Cyan
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd `"$fullPath`"; $($service.Cmd)"
    
    if ($service.Path -eq "service-registry") {
        Write-Host "Waiting 12 seconds for Eureka Service Registry to initialize..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 12
    } else {
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " All startup tasks launched successfully!" -ForegroundColor Cyan
Write-Host " Eureka Server: http://localhost:8761" -ForegroundColor Cyan
Write-Host " API Gateway:   http://localhost:8090" -ForegroundColor Cyan
Write-Host " Frontend:      http://localhost:5173" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Press any key to close this launcher..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

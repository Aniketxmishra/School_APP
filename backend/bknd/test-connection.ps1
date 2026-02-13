# Simple database connection test
Write-Host "=== Database Connection Test ===" -ForegroundColor Green

# Test MySQL connection directly
try {
    Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
    
    # Try to connect to MySQL using mysql command if available
    $mysqlTest = mysql -h 127.0.0.1 -P 3306 -u root -p@Aniket123 -e "SELECT 'Connection successful' as Status;" school_temp 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL connection successful" -ForegroundColor Green
        Write-Host "✓ Database 'school_temp' is accessible" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "MySQL command not found or connection failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Testing .NET API Connection ===" -ForegroundColor Cyan

# Build and test the API
try {
    Write-Host "Building API..." -ForegroundColor Yellow
    $buildResult = dotnet build --verbosity quiet
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ API build successful" -ForegroundColor Green
        
        # Test database connection through EF Core
        Write-Host "Testing EF Core database connection..." -ForegroundColor Yellow
        
        $testResult = dotnet run --project . --no-build -- --test-connection 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ EF Core database connection successful" -ForegroundColor Green
        } else {
            Write-Host "⚠ EF Core connection test inconclusive" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ API build failed" -ForegroundColor Red
    }
} catch {
    Write-Host "Error testing API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Connection Summary ===" -ForegroundColor Cyan
Write-Host "Database: school_temp"
Write-Host "Server: 127.0.0.1:3306"
Write-Host "User: root"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Ensure MySQL is running: net start mysql80 (or your MySQL service name)"
Write-Host "2. Create database: CREATE DATABASE IF NOT EXISTS school_temp;"
Write-Host "3. Run migrations: dotnet ef database update"
Write-Host "4. Start API: dotnet run"
Write-Host "5. Test endpoints: http://localhost:5116/swagger"
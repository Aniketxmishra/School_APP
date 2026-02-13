# PowerShell script to test database connection and setup
# Run this script to verify database connectivity and structure

Write-Host "=== School Management System - Database Connection Test ===" -ForegroundColor Green
Write-Host ""

# Configuration
$apiUrl = "http://localhost:5116/api"
$dbTestUrl = "$apiUrl/test/connection"
$dbTablesUrl = "$apiUrl/database/tables"

# Function to test API endpoint
function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url"
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -ErrorAction Stop
        Write-Host "✓ SUCCESS: $Description" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "✗ FAILED: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
    Write-Host ""
}

# Function to test database connection
function Test-DatabaseConnection {
    Write-Host "=== Testing Database Connection ===" -ForegroundColor Cyan
    
    $result = Test-ApiEndpoint -Url $dbTestUrl -Description "Database Connection"
    
    if ($result) {
        Write-Host "Database: $($result.database)" -ForegroundColor Green
        Write-Host "Server: $($result.server)" -ForegroundColor Green
        Write-Host "Message: $($result.message)" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Function to check database tables
function Test-DatabaseTables {
    Write-Host "=== Checking Database Tables ===" -ForegroundColor Cyan
    
    # Note: This endpoint requires admin authentication
    # For now, we'll just check if the API is running
    
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/test/students" -Method GET -ErrorAction Stop
        Write-Host "✓ API is accessible" -ForegroundColor Green
        
        if ($response.StatusCode -eq 200) {
            $students = $response.Content | ConvertFrom-Json
            Write-Host "✓ Students table accessible - Found $($students.Count) students" -ForegroundColor Green
        }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "⚠ API requires authentication (this is expected)" -ForegroundColor Yellow
        }
        else {
            Write-Host "✗ Error accessing students endpoint: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Function to check if API is running
function Test-ApiStatus {
    Write-Host "=== Checking API Status ===" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/test/connection" -Method GET -ErrorAction Stop
        Write-Host "✓ API is running and accessible" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ API is not accessible" -ForegroundColor Red
        Write-Host "Make sure the API is running with: dotnet run" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host ""
}

# Function to display connection string info
function Show-ConnectionInfo {
    Write-Host "=== Connection Information ===" -ForegroundColor Cyan
    Write-Host "Expected Database: school_temp"
    Write-Host "Expected Server: 127.0.0.1:3306"
    Write-Host "Expected User: root"
    Write-Host ""
    Write-Host "If connection fails, check:"
    Write-Host "1. MySQL server is running"
    Write-Host "2. Database 'school_temp' exists"
    Write-Host "3. Connection string in appsettings.json is correct"
    Write-Host "4. Password matches your MySQL root password"
    Write-Host ""
}

# Function to show next steps
function Show-NextSteps {
    Write-Host "=== Next Steps ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "If database connection is successful:"
    Write-Host "1. Run migrations: dotnet ef database update"
    Write-Host "2. Seed test data via API: POST /api/database/seed-data"
    Write-Host "3. Test authentication: POST /api/auth/login"
    Write-Host ""
    Write-Host "If database connection fails:"
    Write-Host "1. Check MySQL service is running"
    Write-Host "2. Verify database exists: CREATE DATABASE school_temp;"
    Write-Host "3. Update password in appsettings.json"
    Write-Host "4. Run setup-database.sql script"
    Write-Host ""
}

# Main execution
Write-Host "Starting database connection tests..." -ForegroundColor White
Write-Host ""

Show-ConnectionInfo

$apiRunning = Test-ApiStatus

if ($apiRunning) {
    Test-DatabaseConnection
    Test-DatabaseTables
}

Show-NextSteps

Write-Host "=== Test Complete ===" -ForegroundColor Green
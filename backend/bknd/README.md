# School Management System - Database Connection Setup

## Overview
This project is set up to connect to a MySQL database named `school_temp` using Entity Framework Core.

## Database Configuration

### Connection String
The application is configured to connect to:
- **Server**: 127.0.0.1
- **Database**: school_temp
- **User**: root
- **Password**: your_password (update this in appsettings.json)
- **Port**: 3306
- **SSL Mode**: None
- **Allow Public Key Retrieval**: true

**Important**: You must replace `your_password` with your actual MySQL root password in both `appsettings.json` and `appsettings.Development.json` files before running the application.

### Update Connection String
If you need to modify the connection string, update the following files:
- `SchoolApp.API/appsettings.json`
- `SchoolApp.API/appsettings.Development.json`

## Prerequisites
1. MySQL Server installed and running
2. Database `school_temp` created
3. .NET 8.0 SDK installed

## Setup Steps

### 1. Update Connection String
**IMPORTANT**: Before proceeding, you must update the connection string in both configuration files:
- `SchoolApp.API/appsettings.json`
- `SchoolApp.API/appsettings.Development.json`

Replace `your_password` with your actual MySQL root password.

### 2. Create MySQL Database
```sql
CREATE DATABASE school_temp;
USE school_temp;
```

### 3. Test Database Connection
```bash
cd SchoolApp.API
dotnet run --project . --configuration Debug -- TestConnection
```

This will test if your connection string is correct and if you can connect to the database.

### 4. Install Dependencies
```bash
dotnet restore
```

### 5. Create Database Migration
```bash
dotnet ef migrations add InitialCreate --project ../SchoolApp.Infrastructure
```

### 6. Update Database
```bash
dotnet ef database update --project ../SchoolApp.Infrastructure
```

### 7. Run the Application
```bash
dotnet run
```

## Testing Database Connection

### Test Endpoints
Once the application is running, you can test the database connection:

1. **Test Connection**: `GET /api/test/connection`
   - Verifies if the application can connect to the database
   - Returns connection status and database information

2. **Get Students**: `GET /api/test/students`
   - Retrieves all students from the database
   - Tests if the database schema is working correctly

### Swagger UI
Access the Swagger documentation at: `https://localhost:7000/swagger` (or the port shown in your console)

## Project Structure
- **SchoolApp.API**: Main API project with controllers and configuration
- **SchoolApp.Infrastructure**: Data access layer with Entity Framework context and models
- **Models**: Entity classes (Student, etc.)

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check if MySQL is running and accessible
2. **Authentication Error**: Verify username/password in connection string
3. **Database Not Found**: Ensure `school_temp` database exists
4. **Port Issues**: Verify MySQL is running on port 3306

### Connection String Examples
```json
// Local MySQL with password
"Default": "Server=127.0.0.1;Port=3306;Database=school_temp;User Id=root;Password=@Aniket123;SslMode=None;AllowPublicKeyRetrieval=true;"

// Remote MySQL
"Default": "Server=your-server-ip;Database=school_temp;User=youruser;Password=yourpassword;Port=3306;"

// MySQL with SSL
"Default": "Server=localhost;Database=school_temp;User=root;Password=yourpassword;Port=3306;SslMode=Required;"
```

## Next Steps
1. Add more entity models (Teachers, Classes, etc.)
2. Implement CRUD operations
3. Add authentication and authorization
4. Create data seeding scripts

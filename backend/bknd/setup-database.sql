-- School Management System Database Setup
-- Run this script to create the database and initial structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_temp;
USE school_temp;

-- Students table
CREATE TABLE IF NOT EXISTS Students (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (Email),
    INDEX idx_name (FirstName, LastName)
);

-- Teachers table
CREATE TABLE IF NOT EXISTS Teachers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeId VARCHAR(20) NOT NULL UNIQUE,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Subject VARCHAR(100) NOT NULL,
    Department VARCHAR(100) NOT NULL,
    HireDate DATE NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_id (EmployeeId),
    INDEX idx_email (Email),
    INDEX idx_subject (Subject),
    INDEX idx_department (Department)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS Attendances (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    StudentId INT NOT NULL,
    Date DATE NOT NULL,
    Status INT NOT NULL COMMENT '1=Present, 2=Absent, 3=Late',
    Remarks TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100) NOT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100) NOT NULL,
    FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (StudentId, Date),
    INDEX idx_date (Date),
    INDEX idx_student_date (StudentId, Date)
);

-- Login users table
CREATE TABLE IF NOT EXISTS TbmasLogins (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Fdusername VARCHAR(100) NOT NULL UNIQUE,
    Fdpassword TEXT NOT NULL,
    Fdusertype VARCHAR(50) NOT NULL DEFAULT 'student',
    Fdgroupid INT,
    Fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    Fdfailedcount INT NOT NULL DEFAULT 0,
    Fdlockeduntil DATETIME NULL,
    Fdlastlogindate DATETIME NULL,
    Fdaudituser VARCHAR(100) NOT NULL,
    Fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (Fdusername),
    INDEX idx_usertype (Fdusertype),
    INDEX idx_status (Fdstatus)
);

-- Login audit table
CREATE TABLE IF NOT EXISTS Tbloginaudit (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Fdusername VARCHAR(100) NOT NULL,
    Fdstatus VARCHAR(20) NOT NULL,
    Fdlogindatetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fdmodulename VARCHAR(50),
    Fdsubmodulename VARCHAR(50),
    INDEX idx_username (Fdusername),
    INDEX idx_datetime (Fdlogindatetime),
    INDEX idx_status (Fdstatus)
);

-- Fee Structure table (for future use)
CREATE TABLE IF NOT EXISTS FeeStructures (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FeeName VARCHAR(100) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    FeeType VARCHAR(50) NOT NULL,
    DueDate DATE,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fee Payments table (for future use)
CREATE TABLE IF NOT EXISTS FeePayments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    StudentId INT NOT NULL,
    FeeStructureId INT NOT NULL,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    TransactionId VARCHAR(100),
    PaymentStatus VARCHAR(20) NOT NULL,
    Remarks TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100) NOT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100) NOT NULL,
    FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
    FOREIGN KEY (FeeStructureId) REFERENCES FeeStructures(Id) ON DELETE CASCADE,
    INDEX idx_student (StudentId),
    INDEX idx_payment_date (PaymentDate)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO TbmasLogins (Fdusername, Fdpassword, Fdusertype, Fdstatus, Fdaudituser, Fdauditdate) 
VALUES ('admin', '$2a$11$rQZJKjQXjGF.8WqOKbKxUeYvF8anUFNNlzKJbKjQXjGF8WqOKbKxUe', 'admin', 'active', 'system', NOW());

-- Insert sample fee structures
INSERT IGNORE INTO FeeStructures (FeeName, Amount, FeeType, DueDate, IsActive) VALUES
('Tuition Fee', 30000.00, 'Academic', '2024-04-15', TRUE),
('Library Fee', 5000.00, 'Facility', '2024-04-15', TRUE),
('Lab Fee', 15000.00, 'Facility', '2024-04-15', TRUE),
('Sports Fee', 3000.00, 'Activity', '2024-04-15', TRUE),
('Transport Fee', 12000.00, 'Transport', '2024-04-15', TRUE);

-- Create views for reporting
CREATE OR REPLACE VIEW StudentAttendanceStats AS
SELECT 
    s.Id as StudentId,
    CONCAT(s.FirstName, ' ', s.LastName) as StudentName,
    COUNT(a.Id) as TotalDays,
    SUM(CASE WHEN a.Status = 1 THEN 1 ELSE 0 END) as PresentDays,
    SUM(CASE WHEN a.Status = 2 THEN 1 ELSE 0 END) as AbsentDays,
    SUM(CASE WHEN a.Status = 3 THEN 1 ELSE 0 END) as LateDays,
    ROUND((SUM(CASE WHEN a.Status = 1 THEN 1 ELSE 0 END) / COUNT(a.Id)) * 100, 2) as AttendancePercentage
FROM Students s
LEFT JOIN Attendances a ON s.Id = a.StudentId
GROUP BY s.Id, s.FirstName, s.LastName;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_status ON Attendances(Status);
CREATE INDEX IF NOT EXISTS idx_fee_payment_status ON FeePayments(PaymentStatus);
CREATE INDEX IF NOT EXISTS idx_teachers_active ON Teachers(IsActive);

COMMIT;
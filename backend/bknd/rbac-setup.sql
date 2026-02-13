-- RBAC (Role-Based Access Control) System Setup
-- Add these tables to implement comprehensive permission system

USE school_temp;

-- Staff Groups (Roles) table
CREATE TABLE IF NOT EXISTS tbstaffgroup (
    fdgroupid INT AUTO_INCREMENT PRIMARY KEY,
    fdgroupname VARCHAR(100) NOT NULL UNIQUE,
    fdgroupdesc TEXT,
    fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    fdaudituser VARCHAR(100) NOT NULL,
    fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_groupname (fdgroupname),
    INDEX idx_status (fdstatus)
);

-- System Modules table
CREATE TABLE IF NOT EXISTS tbmasmodule (
    fdmoduleid INT AUTO_INCREMENT PRIMARY KEY,
    fdmodulename VARCHAR(100) NOT NULL UNIQUE,
    fdmoduledesc TEXT,
    fdmoduleicon VARCHAR(50),
    fdmoduleorder INT DEFAULT 0,
    fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    fdaudituser VARCHAR(100) NOT NULL,
    fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_modulename (fdmodulename),
    INDEX idx_status (fdstatus),
    INDEX idx_order (fdmoduleorder)
);

-- System Submodules table
CREATE TABLE IF NOT EXISTS tbmassubmodule (
    fdsubmoduleid INT AUTO_INCREMENT PRIMARY KEY,
    fdmoduleid INT NOT NULL,
    fdsubmodulename VARCHAR(100) NOT NULL,
    fdsubmoduledesc TEXT,
    fdsubmoduleicon VARCHAR(50),
    fdsubmoduleorder INT DEFAULT 0,
    fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    fdaudituser VARCHAR(100) NOT NULL,
    fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_submodulename (fdsubmodulename),
    INDEX idx_module (fdmoduleid),
    INDEX idx_status (fdstatus),
    INDEX idx_order (fdsubmoduleorder)
);

-- Add foreign key constraint after both tables are created
ALTER TABLE tbmassubmodule 
ADD CONSTRAINT fk_submodule_module 
FOREIGN KEY (fdmoduleid) REFERENCES tbmasmodule(fdmoduleid) ON DELETE CASCADE;

-- Access Rights table (Group-level permissions)
CREATE TABLE IF NOT EXISTS tbaccessright (
    fdaccessid INT AUTO_INCREMENT PRIMARY KEY,
    fdgroupid INT NOT NULL,
    fdmodulename VARCHAR(100) NOT NULL,
    fdsubmodulename VARCHAR(100),
    fdcanread BOOLEAN NOT NULL DEFAULT FALSE,
    fdcanwrite BOOLEAN NOT NULL DEFAULT FALSE,
    fdcandelete BOOLEAN NOT NULL DEFAULT FALSE,
    fdcanupdate BOOLEAN NOT NULL DEFAULT FALSE,
    fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    fdaudituser VARCHAR(100) NOT NULL,
    fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fdgroupid) REFERENCES tbstaffgroup(fdgroupid) ON DELETE CASCADE,
    INDEX idx_group_module (fdgroupid, fdmodulename),
    INDEX idx_status (fdstatus),
    UNIQUE KEY unique_group_module_submodule (fdgroupid, fdmodulename, fdsubmodulename)
);

-- User-level permission overrides
CREATE TABLE IF NOT EXISTS tbgroupdml (
    fdoverrideid INT AUTO_INCREMENT PRIMARY KEY,
    fdusername VARCHAR(100) NOT NULL,
    fdmodulename VARCHAR(100) NOT NULL,
    fdsubmodulename VARCHAR(100),
    fdcanread BOOLEAN NOT NULL DEFAULT FALSE,
    fdcanwrite BOOLEAN NOT NULL DEFAULT FALSE,
    fdcandelete BOOLEAN NOT NULL DEFAULT FALSE,
    fdcanupdate BOOLEAN NOT NULL DEFAULT FALSE,
    fdstatus VARCHAR(20) NOT NULL DEFAULT 'active',
    fdaudituser VARCHAR(100) NOT NULL,
    fdauditdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fdusername) REFERENCES TbmasLogins(Fdusername) ON DELETE CASCADE,
    INDEX idx_username_module (fdusername, fdmodulename),
    INDEX idx_status (fdstatus),
    UNIQUE KEY unique_user_module_submodule (fdusername, fdmodulename, fdsubmodulename)
);

-- Update TbmasLogins to include group reference
ALTER TABLE TbmasLogins 
ADD CONSTRAINT fk_login_group 
FOREIGN KEY (Fdgroupid) REFERENCES tbstaffgroup(fdgroupid) ON DELETE SET NULL;

-- Insert default staff groups
INSERT IGNORE INTO tbstaffgroup (fdgroupname, fdgroupdesc, fdstatus, fdaudituser) VALUES
('Super Admin', 'Full system access with all permissions', 'active', 'system'),
('Principal', 'School principal with administrative access', 'active', 'system'),
('Teacher', 'Teaching staff with student management access', 'active', 'system'),
('Student', 'Student users with limited read-only access', 'active', 'system'),
('Parent', 'Parent users with child-specific access', 'active', 'system'),
('Accountant', 'Financial management and fee collection', 'active', 'system'),
('Librarian', 'Library management access', 'active', 'system');

-- Insert system modules
INSERT IGNORE INTO tbmasmodule (fdmodulename, fdmoduledesc, fdmoduleicon, fdmoduleorder, fdstatus, fdaudituser) VALUES
('Student Management', 'Student registration, profiles, and academic records', 'account-group', 1, 'active', 'system'),
('Teacher Management', 'Teacher profiles, assignments, and performance', 'account-tie', 2, 'active', 'system'),
('Attendance', 'Daily attendance tracking and reporting', 'calendar-check', 3, 'active', 'system'),
('Academic', 'Marks, grades, exams, and academic performance', 'school', 4, 'active', 'system'),
('Fee Management', 'Fee structure, payments, and financial tracking', 'currency-usd', 5, 'active', 'system'),
('Library', 'Book management, issue/return tracking', 'library', 6, 'active', 'system'),
('Communication', 'Notifications, circulars, and announcements', 'message-text', 7, 'active', 'system'),
('Reports', 'Various system reports and analytics', 'chart-line', 8, 'active', 'system'),
('System Settings', 'User management, system configuration', 'cog', 9, 'active', 'system');

-- Insert submodules for Student Management
INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Student List', 'View and manage student list', 'format-list-bulleted', 1, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Student Management';

INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Student Profile', 'Individual student profile management', 'account-circle', 2, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Student Management';

-- Insert submodules for Teacher Management
INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Teacher List', 'View and manage teacher list', 'format-list-bulleted', 1, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Teacher Management';

INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Teacher Profile', 'Individual teacher profile management', 'account-tie', 2, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Teacher Management';

-- Insert submodules for Attendance
INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Mark Attendance', 'Daily attendance marking', 'calendar-plus', 1, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Attendance';

INSERT IGNORE INTO tbmassubmodule (fdmoduleid, fdsubmodulename, fdsubmoduledesc, fdsubmoduleicon, fdsubmoduleorder, fdstatus, fdaudituser) 
SELECT fdmoduleid, 'Attendance Reports', 'Attendance analytics and reports', 'chart-bar', 2, 'active', 'system' FROM tbmasmodule WHERE fdmodulename = 'Attendance';

-- Set up default permissions for Super Admin (full access)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdcanupdate, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulename, NULL, TRUE, TRUE, TRUE, TRUE, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Super Admin' AND m.fdstatus = 'active';

-- Set up permissions for Principal (almost full access, no system settings)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdcanupdate, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulename, NULL, TRUE, TRUE, 
       CASE WHEN m.fdmodulename = 'System Settings' THEN FALSE ELSE TRUE END,
       CASE WHEN m.fdmodulename = 'System Settings' THEN FALSE ELSE TRUE END,
       'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Principal' AND m.fdstatus = 'active';

-- Set up permissions for Teacher (limited access)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdcanupdate, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulename, NULL, 
       CASE WHEN m.fdmodulename IN ('Student Management', 'Attendance', 'Academic', 'Communication', 'Library') THEN TRUE ELSE FALSE END,
       CASE WHEN m.fdmodulename IN ('Attendance', 'Academic') THEN TRUE ELSE FALSE END,
       FALSE, -- No delete permissions
       CASE WHEN m.fdmodulename IN ('Attendance', 'Academic') THEN TRUE ELSE FALSE END,
       'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Teacher' AND m.fdstatus = 'active';

-- Set up permissions for Student (read-only access to limited modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdcanupdate, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulename, NULL, 
       CASE WHEN m.fdmodulename IN ('Academic', 'Library', 'Communication') THEN TRUE ELSE FALSE END,
       FALSE, FALSE, FALSE, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Student' AND m.fdstatus = 'active';

-- Set up permissions for Parent (read-only access to child-related modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdcanupdate, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulename, NULL, 
       CASE WHEN m.fdmodulename IN ('Student Management', 'Academic', 'Fee Management', 'Communication') THEN TRUE ELSE FALSE END,
       FALSE, FALSE, FALSE, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Parent' AND m.fdstatus = 'active';

-- Update existing users with group assignments
UPDATE TbmasLogins SET Fdgroupid = (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Super Admin') WHERE Fdusername = 'admin';

-- Insert demo users for testing
INSERT IGNORE INTO TbmasLogins (Fdusername, Fdpassword, Fdusertype, Fdgroupid, Fdstatus, Fdaudituser) VALUES
('teacher1', '$2a$11$rQZJKjQXjGF.8WqOKbKxUeYvF8anUFNNlzKJbKjQXjGF8WqOKbKxUe', 'teacher', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Teacher'), 'active', 'system'),
('student1', '$2a$11$rQZJKjQXjGF.8WqOKbKxUeYvF8anUFNNlzKJbKjQXjGF8WqOKbKxUe', 'student', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Student'), 'active', 'system'),
('parent1', '$2a$11$rQZJKjQXjGF.8WqOKbKxUeYvF8anUFNNlzKJbKjQXjGF8WqOKbKxUe', 'parent', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Parent'), 'active', 'system');

-- Create view for user permissions
CREATE OR REPLACE VIEW vw_user_permissions AS
SELECT 
    l.Fdusername,
    l.Fdusertype,
    sg.fdgroupname,
    ar.fdmodulename,
    ar.fdsubmodulename,
    COALESCE(gdml.fdcanread, ar.fdcanread) as fdcanread,
    COALESCE(gdml.fdcanwrite, ar.fdcanwrite) as fdcanwrite,
    COALESCE(gdml.fdcandelete, ar.fdcandelete) as fdcandelete,
    COALESCE(gdml.fdcanupdate, ar.fdcanupdate) as fdcanupdate
FROM TbmasLogins l
JOIN tbstaffgroup sg ON l.Fdgroupid = sg.fdgroupid
JOIN tbaccessright ar ON sg.fdgroupid = ar.fdgroupid
LEFT JOIN tbgroupdml gdml ON l.Fdusername = gdml.fdusername 
    AND ar.fdmodulename = gdml.fdmodulename 
    AND COALESCE(ar.fdsubmodulename, '') = COALESCE(gdml.fdsubmodulename, '')
    AND gdml.fdstatus = 'active'
WHERE l.Fdstatus = 'active' 
    AND sg.fdstatus = 'active' 
    AND ar.fdstatus = 'active';

COMMIT;
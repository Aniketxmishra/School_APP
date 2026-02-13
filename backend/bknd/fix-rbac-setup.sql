-- Fix RBAC Setup Script
-- This script ensures all users have proper module access

-- 1. First, let's check and create modules if they don't exist
INSERT IGNORE INTO tbmasmodule (fdid, fdmodulerefcode, fddisplayname, fdstatus, fdicon, fdroute, fdcreatedby, fdcreatedon)
VALUES 
(1, 'DASHBOARD', 'Dashboard', 'active', 'dashboard', '/dashboard', 'system', NOW()),
(2, 'STUDENTS', 'Student Management', 'active', 'people', '/students', 'system', NOW()),
(3, 'TEACHERS', 'Teacher Management', 'active', 'person', '/teachers', 'system', NOW()),
(4, 'CLASSES', 'Class Management', 'active', 'school', '/classes', 'system', NOW()),
(5, 'ATTENDANCE', 'Attendance', 'active', 'check-circle', '/attendance', 'system', NOW()),
(6, 'FEES', 'Fee Management', 'active', 'payment', '/fees', 'system', NOW()),
(7, 'EXAMS', 'Exam Management', 'active', 'assignment', '/exams', 'system', NOW()),
(8, 'LIBRARY', 'Library Management', 'active', 'library-books', '/library', 'system', NOW()),
(9, 'REPORTS', 'Reports', 'active', 'assessment', '/reports', 'system', NOW()),
(10, 'SETTINGS', 'System Settings', 'active', 'settings', '/settings', 'system', NOW());

-- 2. Create staff groups if they don't exist
INSERT IGNORE INTO tbstaffgroup (fdgroupid, fdgroupname, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(1, 'Super Admin', 'active', 'system', NOW()),
(2, 'Teacher', 'active', 'system', NOW()),
(3, 'Student', 'active', 'system', NOW()),
(4, 'Parent', 'active', 'system', NOW());

-- 3. Update users to have proper group assignments
UPDATE tbmaslogin SET fdgroupid = 1 WHERE fdusertype = 'admin';
UPDATE tbmaslogin SET fdgroupid = 2 WHERE fdusertype = 'teacher';
UPDATE tbmaslogin SET fdgroupid = 3 WHERE fdusertype = 'student';
UPDATE tbmaslogin SET fdgroupid = 4 WHERE fdusertype = 'parent';

-- 4. Create access rights for Super Admin (full access to all modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
SELECT 1, fdid, 'Y', 'Y', 'Y', 'active', 'system', NOW()
FROM tbmasmodule 
WHERE fdstatus = 'active';

-- 5. Create access rights for Teachers (read/write access to most modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(2, 1, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Dashboard - read only
(2, 2, 'Y', 'Y', 'N', 'active', 'system', NOW()), -- Students - read/write
(2, 4, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Classes - read only
(2, 5, 'Y', 'Y', 'N', 'active', 'system', NOW()), -- Attendance - read/write
(2, 7, 'Y', 'Y', 'N', 'active', 'system', NOW()), -- Exams - read/write
(2, 8, 'Y', 'Y', 'N', 'active', 'system', NOW()), -- Library - read/write
(2, 9, 'Y', 'N', 'N', 'active', 'system', NOW()); -- Reports - read only

-- 6. Create access rights for Students (limited read access)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(3, 1, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Dashboard - read only
(3, 5, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Attendance - read only
(3, 7, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Exams - read only
(3, 8, 'Y', 'N', 'N', 'active', 'system', NOW()); -- Library - read only

-- 7. Create access rights for Parents (read-only access to student-related modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(4, 1, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Dashboard - read only
(4, 2, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Students - read only (their children)
(4, 5, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Attendance - read only
(4, 6, 'Y', 'N', 'N', 'active', 'system', NOW()), -- Fees - read only
(4, 7, 'Y', 'N', 'N', 'active', 'system', NOW()); -- Exams - read only

-- 8. Verify the setup
SELECT 'Users with Groups' as Info;
SELECT l.fdusername, l.fdusertype, l.fdgroupid, sg.fdgroupname 
FROM tbmaslogin l 
LEFT JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid 
WHERE l.fdstatus = 'active';

SELECT 'Modules Available' as Info;
SELECT fdid, fdmodulerefcode, fddisplayname, fdstatus FROM tbmasmodule WHERE fdstatus = 'active';

SELECT 'Access Rights Summary' as Info;
SELECT sg.fdgroupname, COUNT(ar.fdmoduleid) as ModuleCount
FROM tbstaffgroup sg
LEFT JOIN tbaccessright ar ON sg.fdgroupid = ar.fdgroupid AND ar.fdstatus = 'active'
WHERE sg.fdstatus = 'active'
GROUP BY sg.fdgroupid, sg.fdgroupname;
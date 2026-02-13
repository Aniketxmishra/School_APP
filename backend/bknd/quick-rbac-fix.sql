-- Quick RBAC Fix for user 'rahul'

-- 1. Ensure rahul has a group (assuming he's a student)
UPDATE tbmaslogin SET fdgroupid = 3 WHERE fdusername = 'rahul';

-- 2. Create basic modules if they don't exist
INSERT IGNORE INTO tbmasmodule (fdid, fdmodulerefcode, fddisplayname, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(1, 'DASHBOARD', 'Dashboard', 'active', 'system', NOW()),
(2, 'STUDENTS', 'Student Management', 'active', 'system', NOW()),
(3, 'ATTENDANCE', 'Attendance', 'active', 'system', NOW());

-- 3. Create student group if it doesn't exist
INSERT IGNORE INTO tbstaffgroup (fdgroupid, fdgroupname, fdstatus, fdcreatedby, fdcreatedon)
VALUES (3, 'Student', 'active', 'system', NOW());

-- 4. Give student group access to basic modules
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
VALUES 
(3, 1, 'Y', 'N', 'N', 'active', 'system', NOW()),
(3, 2, 'Y', 'N', 'N', 'active', 'system', NOW()),
(3, 3, 'Y', 'N', 'N', 'active', 'system', NOW());

-- 5. Check the result
SELECT 'Rahul User Info' as Info;
SELECT l.fdusername, l.fdusertype, l.fdgroupid, sg.fdgroupname 
FROM tbmaslogin l 
LEFT JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid 
WHERE l.fdusername = 'rahul';

SELECT 'Available Modules' as Info;
SELECT * FROM tbmasmodule WHERE fdstatus = 'active';

SELECT 'Rahul Access Rights' as Info;
SELECT ar.*, m.fddisplayname 
FROM tbaccessright ar 
JOIN tbmasmodule m ON ar.fdmoduleid = m.fdid 
WHERE ar.fdgroupid = 3 AND ar.fdstatus = 'active';
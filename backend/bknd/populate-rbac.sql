-- Populate RBAC data for existing tables
USE school_temp;

-- Insert staff groups (roles)
INSERT IGNORE INTO tbstaffgroup (fdgroupname, fddescription, fdstatus, fdaudituser) VALUES
('Super Admin', 'Full system access with all permissions', 'active', 'system'),
('Principal', 'School principal with administrative access', 'active', 'system'),
('Teacher', 'Teaching staff with student management access', 'active', 'system'),
('Student', 'Student users with limited read-only access', 'active', 'system'),
('Parent', 'Parent users with child-specific access', 'active', 'system'),
('Accountant', 'Financial management and fee collection', 'active', 'system'),
('Librarian', 'Library management access', 'active', 'system');

-- Insert system modules
INSERT IGNORE INTO tbmasmodule (fdmodulerefcode, fddisplayname, fdicon, fdroute, fdstatus, fdcreatedby, fdaudituser) VALUES
('STUDENT_MGMT', 'Student Management', 'account-group', '/student_details', 'active', 'system', 'system'),
('TEACHER_MGMT', 'Teacher Management', 'account-tie', '/teacher_details', 'active', 'system', 'system'),
('ATTENDANCE', 'Attendance', 'calendar-check', '/attendance', 'active', 'system', 'system'),
('ACADEMIC', 'Academic', 'school', '/marks_details', 'active', 'system', 'system'),
('FEE_MGMT', 'Fee Management', 'currency-usd', '/payment', 'active', 'system', 'system'),
('LIBRARY', 'Library', 'library', '/lib_books', 'active', 'system', 'system'),
('COMMUNICATION', 'Communication', 'message-text', '/notification', 'active', 'system', 'system'),
('REPORTS', 'Reports', 'chart-line', '/report', 'active', 'system', 'system'),
('SYSTEM_SETTINGS', 'System Settings', 'cog', '/school_details', 'active', 'system', 'system'),
('GALLERY', 'Gallery', 'image', '/Gallery', 'active', 'system', 'system'),
('LIVE_CLASS', 'Live Classes', 'video', '/live_class', 'active', 'system', 'system'),
('BUS_TRACKING', 'Bus Tracking', 'bus', '/bus_track', 'active', 'system', 'system'),
('LEAVE_MGMT', 'Leave Management', 'account-cancel', '/leave_app', 'active', 'system', 'system'),
('ASSIGNMENTS', 'Assignments', 'notebook', '/school_work', 'active', 'system', 'system'),
('EXAM_MGMT', 'Exam Management', 'file-document', '/Exam_table', 'active', 'system', 'system'),
('TIMETABLE', 'Timetable', 'clock-outline', '/table_way', 'active', 'system', 'system'),
('CALENDAR', 'Calendar/Holidays', 'calendar', '/calendar', 'active', 'system', 'system'),
('NEWS', 'News & Stories', 'newspaper', '/positive_news', 'active', 'system', 'system');

-- Set up default permissions for Super Admin (full access)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulerefcode, NULL, 1, 1, 1, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Super Admin' AND m.fdstatus = 'active';

-- Set up permissions for Principal (almost full access, no system settings delete)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulerefcode, NULL, 1, 1, 
       CASE WHEN m.fdmodulerefcode = 'SYSTEM_SETTINGS' THEN 0 ELSE 1 END,
       'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Principal' AND m.fdstatus = 'active';

-- Set up permissions for Teacher (limited access)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulerefcode, NULL, 
       CASE WHEN m.fdmodulerefcode IN ('STUDENT_MGMT', 'ATTENDANCE', 'ACADEMIC', 'COMMUNICATION', 'LIBRARY', 'GALLERY', 'LIVE_CLASS', 'ASSIGNMENTS', 'EXAM_MGMT', 'TIMETABLE', 'CALENDAR', 'NEWS') THEN 1 ELSE 0 END,
       CASE WHEN m.fdmodulerefcode IN ('ATTENDANCE', 'ACADEMIC', 'ASSIGNMENTS', 'LIVE_CLASS') THEN 1 ELSE 0 END,
       0, -- No delete permissions for teachers
       'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Teacher' AND m.fdstatus = 'active';

-- Set up permissions for Student (read-only access to limited modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulerefcode, NULL, 
       CASE WHEN m.fdmodulerefcode IN ('ACADEMIC', 'LIBRARY', 'COMMUNICATION', 'GALLERY', 'LIVE_CLASS', 'ASSIGNMENTS', 'EXAM_MGMT', 'TIMETABLE', 'CALENDAR', 'NEWS', 'BUS_TRACKING', 'FEE_MGMT') THEN 1 ELSE 0 END,
       0, 0, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Student' AND m.fdstatus = 'active';

-- Set up permissions for Parent (read-only access to child-related modules)
INSERT IGNORE INTO tbaccessright (fdgroupid, fdmodulename, fdsubmodulename, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdaudituser)
SELECT sg.fdgroupid, m.fdmodulerefcode, NULL, 
       CASE WHEN m.fdmodulerefcode IN ('STUDENT_MGMT', 'ACADEMIC', 'FEE_MGMT', 'COMMUNICATION', 'GALLERY', 'BUS_TRACKING', 'TIMETABLE', 'CALENDAR', 'NEWS') THEN 1 ELSE 0 END,
       0, 0, 'active', 'system'
FROM tbstaffgroup sg, tbmasmodule m 
WHERE sg.fdgroupname = 'Parent' AND m.fdstatus = 'active';

-- Update existing admin user with group assignment
UPDATE tbmaslogin SET fdgroupid = (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Super Admin') WHERE fdusername = 'admin';

-- Insert demo users for testing
INSERT IGNORE INTO tbmaslogin (fdusername, fdpassword, fdusertype, fdgroupid, fdstatus, fdaudituser) VALUES
('teacher1', 'teacher123', 'teacher', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Teacher'), 'active', 'system'),
('student1', 'student123', 'student', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Student'), 'active', 'system'),
('parent1', 'parent123', 'parent', 
 (SELECT fdgroupid FROM tbstaffgroup WHERE fdgroupname = 'Parent'), 'active', 'system');

-- Create simplified view for user permissions
CREATE OR REPLACE VIEW vw_user_permissions AS
SELECT 
    l.fdusername as username,
    l.fdusertype as usertype,
    sg.fdgroupname as groupname,
    ar.fdmodulename as modulename,
    ar.fdsubmodulename as submodulename,
    ar.fdcanread as canread,
    ar.fdcanwrite as canwrite,
    ar.fdcandelete as candelete,
    m.fddisplayname as displayname,
    m.fdicon as icon,
    m.fdroute as route
FROM tbmaslogin l
JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid
JOIN tbaccessright ar ON sg.fdgroupid = ar.fdgroupid
JOIN tbmasmodule m ON ar.fdmodulename = m.fdmodulerefcode
WHERE l.fdstatus = 'active' 
    AND sg.fdstatus = 'active' 
    AND ar.fdstatus = 'active'
    AND m.fdstatus = 'active';

COMMIT;
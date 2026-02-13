namespace SchoolApp.API.Utilities
{
    /// <summary>
    /// Utility class for generating consistent cache keys
    /// </summary>
    public static class CacheKeyGenerator
    {
        // User permissions cache keys
        public static string UserPermissions(string username) => $"permissions:user:{username.ToLowerInvariant()}";
        
        // Student cache keys (real entities)
        public static string AllStudents() => "real_students:list:all";
        public static string StudentById(long studentId) => $"real_student:detail:{studentId}";
        public static string ActiveStudents() => "real_students:list:active";
        
        // Teacher cache keys (real entities)
        public static string AllTeachers() => "real_teachers:list:all";
        public static string TeacherById(long teacherId) => $"real_teacher:detail:{teacherId}";
        public static string ActiveTeachers() => "real_teachers:list:active";
        public static string TeacherHierarchy() => "real_teachers:hierarchy";
        
        // Attendance cache keys
        public static string DailyAttendance(DateTime date) => $"attendance:daily:{date:yyyy-MM-dd}";
        public static string StudentAttendance(long studentId, DateTime date) => $"attendance:student:{studentId}:{date:yyyy-MM-dd}";
        public static string ClassAttendance(string className, DateTime date) => $"attendance:class:{className.ToLowerInvariant()}:{date:yyyy-MM-dd}";
        
        // Module and menu cache keys
        public static string UserModules(string username) => $"modules:user:{username.ToLowerInvariant()}";
        public static string MenuItems() => "menu:items:all";
        
        // Pattern keys for bulk operations
        public static string UserPattern(string username) => $"*:user:{username.ToLowerInvariant()}*";
        public static string StudentPattern(long? studentId = null) => studentId.HasValue ? $"*student*:{studentId}*" : "*student*";
        public static string TeacherPattern(long? teacherId = null) => teacherId.HasValue ? $"*teacher*:{teacherId}*" : "*teacher*";
        public static string AttendancePattern(DateTime? date = null) => date.HasValue ? $"*attendance*:{date:yyyy-MM-dd}*" : "*attendance*";
    }
}
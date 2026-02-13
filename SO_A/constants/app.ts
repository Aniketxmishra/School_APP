export const APP_CONFIG = {
  NAME: 'School Management System',
  VERSION: '1.0.0',
  AUTHOR: 'Aniket',
  DESCRIPTION: 'Complete school management system for students, teachers, and administrators',
};

export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.yourschool.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_ROLE: 'userRole',
  USER_DATA: 'userData',
  THEME_PREFERENCE: 'themePreference',
  LANGUAGE: 'language',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export const SCREEN_NAMES = {
  SPLASH: 'index',
  AUTH: 'auth',
  HOME: 'home',
  ATTENDANCE: 'attendance',
  CALENDAR: 'calendar',
  GALLERY: 'Gallery',
  NOTIFICATIONS: 'notification',
  STUDENT_DETAILS: 'student_details',
  TEACHER_DETAILS: 'teacher_details',
  MARKS: 'marks_details',
  EXAM_TABLE: 'Exam_table',
  LIBRARY: 'lib_books',
  PAYMENT: 'payment',
  LIVE_CLASS: 'live_class',
  BUS_TRACK: 'bus_track',
  LEAVE_APP: 'leave_app',
  SCHOOL_WORK: 'school_work',
  REPORT: 'report',
  CIRCULAR: 'circular',
  POSITIVE_NEWS: 'positive_news',
  SHORT_STORY: 'short_story',
  THOUGHT_OF_DAY: 'thought_of_day',
  BIRTHDAYS: 'birthdays',
  SCHOOL_DETAILS: 'school_details',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  USER_ID_MIN_LENGTH: 3,
  USER_ID_MAX_LENGTH: 20,
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 300000, // 5 minutes
};

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
import Constants from 'expo-constants';

/**
 * Centralized API Configuration
 * 
 * This file serves as the single source of truth for API URLs and configuration.
 * It automatically switches between development (local IP) and production URLs.
 */

// Default development IP - CHANGE THIS if your computer's IP changes
const DEV_IP = '192.168.0.107';
const DEV_PORT = '5116';

// Production API URL
const PROD_URL = 'https://api.yourschool.com/api';

const getApiBaseUrl = (): string => {
    if (__DEV__) {
        return `http://${DEV_IP}:${DEV_PORT}`;
    }
    return PROD_URL;
};

// Base URL (e.g., http://192.168.0.101:5116) - used for constructing full URLs manually
export const SITE_URL = getApiBaseUrl();

// API Base URL (e.g., http://192.168.0.101:5116/api) - used for API calls
// Note: Some legacy services append /api manually, so we export both
export const API_BASE_URL = `${SITE_URL}/api`;

export const API_CONFIG = {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
};

export default {
    SITE_URL,
    API_BASE_URL,
    API_CONFIG
};

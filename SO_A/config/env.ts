import { API_BASE_URL, API_CONFIG } from './api';

interface EnvConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  DEBUG_MODE: boolean;
  API_TIMEOUT: number;
}

const getEnvConfig = (): EnvConfig => {
  const isDev = __DEV__;

  return {
    API_BASE_URL: API_BASE_URL,
    APP_ENV: isDev ? 'development' : 'production',
    DEBUG_MODE: isDev,
    API_TIMEOUT: API_CONFIG.TIMEOUT,
  };
};

export const ENV = getEnvConfig();

export const isProduction = () => ENV.APP_ENV === 'production';
export const isDevelopment = () => ENV.APP_ENV === 'development';

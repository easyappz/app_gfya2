import { instance } from './axios';

/**
 * Register a new user
 * @param {Object} data - User registration data
 * @param {string} data.username - Username
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Server response
 */
export const register = async (data) => {
  try {
    const response = await instance.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка регистрации' };
  }
};

/**
 * Login user
 * @param {Object} data - User login data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Server response with token and user data
 */
export const login = async (data) => {
  try {
    const response = await instance.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка входа' };
  }
};

/**
 * Reset user password
 * @param {Object} data - Password reset data
 * @param {string} data.email - User email
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} Server response
 */
export const resetPassword = async (data) => {
  try {
    const response = await instance.post('/api/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка сброса пароля' };
  }
};

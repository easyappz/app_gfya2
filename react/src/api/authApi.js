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
    const response = await instance.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
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
    const response = await instance.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
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
    const response = await instance.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

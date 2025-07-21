import { instance } from './axios';

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await instance.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics data
 */
export const getUserStatistics = async () => {
  try {
    const response = await instance.get('/user/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch statistics' };
  }
};

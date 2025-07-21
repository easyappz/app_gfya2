import { instance } from './axios';

/**
 * Upload a photo
 * @param {FormData} formData - FormData containing the photo file
 * @returns {Promise<Object>} Server response with uploaded photo data
 */
export const uploadPhoto = async (formData) => {
  try {
    const response = await instance.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Photo upload failed' };
  }
};

/**
 * Get all photos
 * @returns {Promise<Object[]>} Array of photo objects
 */
export const getAllPhotos = async () => {
  try {
    const response = await instance.get('/photos');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch photos' };
  }
};

/**
 * Get user photos
 * @returns {Promise<Object[]>} Array of user photo objects
 */
export const getUserPhotos = async () => {
  try {
    const response = await instance.get('/photos/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user photos' };
  }
};

/**
 * Rate a photo
 * @param {string} photoId - ID of the photo to rate
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise<Object>} Server response with updated photo data
 */
export const ratePhoto = async (photoId, rating) => {
  try {
    const response = await instance.post(`/photos/${photoId}/rate`, { rating });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to rate photo' };
  }
};

/**
 * Filter photos by minimum rating
 * @param {number} minRating - Minimum rating to filter by
 * @returns {Promise<Object[]>} Array of filtered photo objects
 */
export const filterPhotosByRating = async (minRating) => {
  try {
    const response = await instance.get(`/photos/filter?minRating=${minRating}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to filter photos' };
  }
};

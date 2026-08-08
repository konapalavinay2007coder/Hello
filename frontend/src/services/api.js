import axios from 'axios';

const isProductionDomain = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const defaultFallback = isProductionDomain 
  ? 'https://hello-production-918b.up.railway.app/api' 
  : 'http://localhost:5000/api';

const rawUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || defaultFallback;
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 1. Multilingual Advisory Query Endpoint (Text or Audio FormData)
 */
export const postQuery = async (payload) => {
  // Check if payload is FormData (contains audio file)
  if (payload instanceof FormData) {
    const res = await apiClient.post('/query', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
  const res = await apiClient.post('/query', payload);
  return res.data;
};

/**
 * 2. Multimodal Crop Photo Vision Endpoint
 */
export const postQueryImage = async (formData) => {
  const res = await apiClient.post('/query/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

/**
 * 3. Government Schemes Endpoint
 */
export const getSchemes = async (params = {}) => {
  const res = await apiClient.get('/schemes', { params });
  return res.data;
};

/**
 * 4. Directory Infrastructure Contacts Endpoint
 */
export const getDirectory = async (params = {}) => {
  const res = await apiClient.get('/directory', { params });
  return res.data;
};

/**
 * 5. Weather Forecast Endpoint
 */
export const getWeather = async (params = {}) => {
  const res = await apiClient.get('/weather', { params });
  return res.data;
};

/**
 * 6. Mandi Market Prices Endpoint
 */
export const getMandiPrices = async (params = {}) => {
  const res = await apiClient.get('/mandi-prices', { params });
  return res.data;
};

/**
 * 7. Community Board Endpoints
 */
export const getCommunityPosts = async (params = {}) => {
  const res = await apiClient.get('/community', { params });
  return res.data;
};

export const createCommunityPost = async (payload) => {
  const res = await apiClient.post('/community', payload);
  return res.data;
};

export const addCommunityAnswer = async (postId, payload) => {
  const res = await apiClient.post(`/community/${postId}/answer`, payload);
  return res.data;
};

export const upvoteCommunityAnswer = async (postId, answerId) => {
  const res = await apiClient.post(`/community/${postId}/answer/${answerId}/upvote`);
  return res.data;
};

/**
 * 8. Voice Slot-Filling Form Endpoint
 */
export const postFormFill = async (payload) => {
  const res = await apiClient.post('/form-fill', payload);
  return res.data;
};

export default apiClient;

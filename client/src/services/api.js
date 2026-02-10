import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
};

export const categoryService = {
  getAll: () => API.get('/categories'),
  getSubcategories: (id) => API.get(`/categories/${id}/subcategories`),
  getBySlug: (slug) => API.get(`/categories/slug/${slug}`),
};

export const subCategoryService = {
  getByCategory: (categoryId) => API.get(`/subcategories/${categoryId}`),
};

export const businessService = {
  getAll: (params) => API.get('/businesses', { params }),
  getById: (id) => API.get(`/businesses/${id}`),
  create: (businessData) => API.post('/businesses', businessData),
  getFeatured: () => API.get('/businesses/featured'),
  getLatest: () => API.get('/businesses/latest'),
  getModerationList: () => API.get('/businesses/moderation'),
  updateStatus: (id, statusData) => API.put(`/businesses/${id}/status`, statusData),
};

export default API;

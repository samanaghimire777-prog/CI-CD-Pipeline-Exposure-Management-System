import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanImage = async (imageName) => {
  const response = await api.post('/scan', { image_name: imageName });
  return response.data;
};

export const fetchVulnerabilities = async (severity = null, limit = 100) => {
  const params = { limit };
  if (severity) {
    params.severity = severity;
  }
  const response = await api.get('/results', { params });
  return response.data;
};

export const fetchScans = async (limit = 20) => {
  const response = await api.get('/scans', { params: { limit } });
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export default api;

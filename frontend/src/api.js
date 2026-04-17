import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanImage = async (imageName, alertEmail = null) => {
  const payload = { image_name: imageName };
  if (alertEmail) {
    payload.alert_email = alertEmail;
  }
  const response = await api.post('/scan', payload);
  return response.data;
};

export const scanLocalImage = async (imageName, alertEmail = null) => {
  const payload = { image_name: imageName };
  if (alertEmail) {
    payload.alert_email = alertEmail;
  }
  const response = await api.post('/scan/local', payload);
  return response.data;
};

export const fetchLocalDockerImages = async () => {
  const response = await api.get('/docker/images');
  return response.data;
};

export const createDockerEventsStream = () => {
  const base = API_BASE_URL.replace(/\/$/, '');
  return new EventSource(`${base}/docker/events`);
};

export const fetchVulnerabilities = async (severity = null, limit = 100) => {
  const params = { limit };
  if (severity) {
    params.severity = severity;
  }
  const response = await api.get('/results', { params });
  return response.data;
};

export const fetchScans = async (limit = 20, scanId = null) => {
  const params = { limit };
  if (scanId !== null && scanId !== '') {
    params.scan_id = Number(scanId);
  }
  const response = await api.get('/scans', { params });
  return response.data;
};

export const fetchScanById = async (scanId) => {
  const response = await api.get(`/scans/${scanId}`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const downloadScanReport = async (scanId, format) => {
  const response = await api.get(`/reports/scan/${scanId}`, {
    params: { format },
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] || '';
  const match = disposition.match(/filename=([^;]+)/i);
  const filename = match ? match[1].replace(/"/g, '').trim() : `scan-report-${scanId}.${format === 'excel' ? 'xlsx' : 'pdf'}`;

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export default api;

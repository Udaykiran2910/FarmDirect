import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  login: (email, password, role) => 
    axios.post(`${API_URL}/auth/login`, { email, password, role }),
  
  register: (data) => 
    axios.post(`${API_URL}/auth/register`, data),
  
  getProfile: () => 
    axios.get(`${API_URL}/auth/profile`),
  
  updateProfile: (data) => 
    axios.put(`${API_URL}/auth/profile`, data),
  
  switchRole: (newRole) => 
    axios.post(`${API_URL}/auth/switch-role`, { newRole })
};

export const productService = {
  addProduct: (data) => 
    axios.post(`${API_URL}/products`, data),
  
  getProduct: (productId) => 
    axios.get(`${API_URL}/products/${productId}`),
  
  getFarmerProducts: () => 
    axios.get(`${API_URL}/products/farmer`),
  
  getAllProducts: (filters = {}) => 
    axios.get(`${API_URL}/products/all`, { params: filters }),
  
  updateProduct: (productId, data) => 
    axios.put(`${API_URL}/products/${productId}`, data),
  
  deleteProduct: (productId) => 
    axios.delete(`${API_URL}/products/${productId}`)
};

export const orderService = {
  createOrder: (data) => 
    axios.post(`${API_URL}/orders`, data),
  
  getOrder: (orderId) => 
    axios.get(`${API_URL}/orders/${orderId}`),
  
  getConsumerOrders: () => 
    axios.get(`${API_URL}/orders/consumer/all`),
  
  getFarmerOrders: () => 
    axios.get(`${API_URL}/orders/farmer/all`),
  
  trackOrder: (orderId) => 
    axios.get(`${API_URL}/orders/track/${orderId}`),
  
  getQRCode: (orderId) => 
    axios.get(`${API_URL}/orders/qr/${orderId}`),
  
  assignTransporter: (orderId, transporterId) => 
    axios.post(`${API_URL}/orders/assign-transporter`, { orderId, transporterId })
};

export const transportService = {
  getDeliveries: () => 
    axios.get(`${API_URL}/transport/deliveries`),
  
  getDeliveryDetails: (transportId) => 
    axios.get(`${API_URL}/transport/${transportId}`),
  
  updateStatus: (transportId, data) => 
    axios.put(`${API_URL}/transport/${transportId}/status`, data),
  
  updateLocation: (transportId, data) => 
    axios.put(`${API_URL}/transport/${transportId}/location`, data)
};

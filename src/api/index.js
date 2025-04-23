import axios from 'axios';

// Базовый URL для API запросов
const API_URL = 'https://telegram-server-dqpj.onrender.com/api';

// Настройка axios для отправки Telegram инициализационных данных
const api = axios.create({
  baseURL: API_URL
});

// Добавляем перехватчик запросов для добавления Telegram данных
api.interceptors.request.use(config => {
  // Получаем данные инициализации из Telegram WebApp если они доступны
  if (window.Telegram && window.Telegram.WebApp) {
    config.headers['telegram-init-data'] = window.Telegram.WebApp.initData;
  }
  return config;
});

// API методы
export const API = {
  // Категории
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  // Продукты
  getProducts: async (categoryId = null) => {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    const response = await api.get(url);
    return response.data.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  searchProducts: async (query) => {
    const response = await api.get(`/products/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  // Заказы
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Клиенты
  saveCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Сообщения
  sendMessageToAdmin: async (messageData) => {
    const response = await api.post('/messages/admin', messageData);
    return response.data;
  },

  broadcastMessage: async (messageData) => {
    const response = await api.post('/messages/broadcast', messageData);
    return response.data;
  }
};

export default API;
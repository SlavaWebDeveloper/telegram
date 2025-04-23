import React, { createContext, useState, useEffect, useContext } from 'react';

// Создаем контекст
const AppContext = createContext();

// Хук для использования контекста
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  // Данные пользователя из Telegram
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Состояние загрузки
  const [loading, setLoading] = useState(true);

  // Данные каталога
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Поиск
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Корзина/заказ
  const [orderData, setOrderData] = useState({
    product: null,
    deliveryDate: '',
    packaging: '',
    deliveryMethod: '',
    customerName: '',
    customerContact: '',
    additionalComment: ''
  });

  // Состояние для возможных ошибок
  const [error, setError] = useState(null);

  // Инициализация Telegram WebApp
  useEffect(() => {
    // Проверяем, доступен ли Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Активируем приложение
      tg.ready();

      // Получаем данные пользователя
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser({
          id: userData.id.toString(),
          firstName: userData.first_name,
          lastName: userData.last_name || '',
          username: userData.username || '',
          // Полное имя (имя + фамилия если есть)
          fullName: userData.first_name + (userData.last_name ? ` ${userData.last_name}` : '')
        });

        // Проверяем, является ли пользователь администратором
        // В реальном приложении здесь будет проверка ID с сервера
        // Для демо используем захардкоженное значение из .env
        const adminId = import.meta.env.VITE_ADMIN_TELEGRAM_ID || '123456789';
        setIsAdmin(userData.id.toString() === adminId);
      }

      // Устанавливаем основной цвет кнопки в соответствии с темой Telegram
      if (tg.themeParams) {
        document.documentElement.style.setProperty(
          '--tg-theme-button-color',
          tg.themeParams.button_color || '#2678b6'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-button-text-color',
          tg.themeParams.button_text_color || '#ffffff'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          tg.themeParams.bg_color || '#ffffff'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          tg.themeParams.text_color || '#000000'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-hint-color',
          tg.themeParams.hint_color || '#999999'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-link-color',
          tg.themeParams.link_color || '#2678b6'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-secondary-bg-color',
          tg.themeParams.secondary_bg_color || '#f1f1f1'
        );
      }
    }

    // Завершаем начальную загрузку
    setLoading(false);
  }, []);

  // Функция для обновления данных заказа
  const updateOrderData = (newData) => {
    setOrderData(prev => ({ ...prev, ...newData }));
  };

  // Функция для очистки данных заказа
  const clearOrderData = () => {
    setOrderData({
      product: null,
      deliveryDate: '',
      packaging: '',
      deliveryMethod: '',
      customerName: user ? user.fullName : '',
      customerContact: user ? user.username : '',
      additionalComment: ''
    });
  };

  // Предоставляем данные всему приложению через контекст
  const contextValue = {
    user,
    isAdmin,
    loading,
    setLoading,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    orderData,
    updateOrderData,
    clearOrderData,
    error,
    setError
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
// Проверка, доступен ли Telegram WebApp API
export const isTelegramWebAppAvailable = () => {
  return Boolean(window.Telegram && window.Telegram.WebApp);
};

// Получить экземпляр Telegram WebApp
export const getTelegramWebApp = () => {
  if (isTelegramWebAppAvailable()) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Получить данные пользователя из Telegram
export const getUserData = () => {
  const tg = getTelegramWebApp();
  
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const userData = tg.initDataUnsafe.user;
    
    return {
      id: userData.id.toString(),
      firstName: userData.first_name,
      lastName: userData.last_name || '',
      username: userData.username || '',
      languageCode: userData.language_code || 'ru',
      fullName: userData.first_name + (userData.last_name ? ` ${userData.last_name}` : '')
    };
  }
  
  return null;
};

// Показать основную кнопку
export const showMainButton = (text, callback) => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    tg.MainButton.text = text;
    
    if (callback) {
      tg.MainButton.onClick(callback);
    }
    
    tg.MainButton.show();
  }
};

// Скрыть основную кнопку
export const hideMainButton = () => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    tg.MainButton.hide();
  }
};

// Показать кнопку назад
export const showBackButton = (callback) => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    if (callback) {
      tg.BackButton.onClick(callback);
    }
    
    tg.BackButton.show();
  }
};

// Скрыть кнопку назад
export const hideBackButton = () => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    tg.BackButton.hide();
  }
};

// Закрыть мини-приложение
export const closeWebApp = () => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    tg.close();
  }
};

// Проверить, является ли пользователь администратором (по ID из env)
export const isUserAdmin = (userId) => {
  // В реальном приложении лучше проверять через API
  const adminId = import.meta.env.VITE_ADMIN_TELEGRAM_ID || '123456789';
  return userId && userId.toString() === adminId;
};

// Получить цвета темы Telegram
export const getThemeParams = () => {
  const tg = getTelegramWebApp();
  
  if (tg && tg.themeParams) {
    return tg.themeParams;
  }
  
  // Возвращаем дефолтные цвета, если не удалось получить из Telegram
  return {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#2678b6',
    button_color: '#2678b6',
    button_text_color: '#ffffff',
    secondary_bg_color: '#f1f1f1'
  };
};

// Применить цвета темы Telegram к CSS переменным
export const applyThemeColors = () => {
  const colors = getThemeParams();
  
  document.documentElement.style.setProperty('--tg-theme-bg-color', colors.bg_color);
  document.documentElement.style.setProperty('--tg-theme-text-color', colors.text_color);
  document.documentElement.style.setProperty('--tg-theme-hint-color', colors.hint_color);
  document.documentElement.style.setProperty('--tg-theme-link-color', colors.link_color);
  document.documentElement.style.setProperty('--tg-theme-button-color', colors.button_color);
  document.documentElement.style.setProperty('--tg-theme-button-text-color', colors.button_text_color);
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', colors.secondary_bg_color);
};

// Инициализация Telegram WebApp
export const initializeTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  
  if (tg) {
    // Запускаем приложение
    tg.ready();
    
    // Расширяем приложение на весь экран
    tg.expand();
    
    // Применяем цвета темы
    applyThemeColors();
    
    return true;
  }
  
  return false;
};

// Форматирование даты для отображения
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Проверка, запущено ли приложение в Telegram
export const isRunningInTelegram = () => {
  return isTelegramWebAppAvailable();
};

export default {
  isTelegramWebAppAvailable,
  getTelegramWebApp,
  getUserData,
  showMainButton,
  hideMainButton,
  showBackButton,
  hideBackButton,
  closeWebApp,
  isUserAdmin,
  getThemeParams,
  applyThemeColors,
  initializeTelegramWebApp,
  formatDate,
  isRunningInTelegram
};
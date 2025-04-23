import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import API from '../../api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const OrderForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, products } = useAppContext();
  
  // Варианты упаковки и способа получения
  const packagingOptions = [
    'Стандартная',
    'Подарочная',
    'Эко-упаковка',
    'Без упаковки'
  ];
  
  const deliveryOptions = [
    'Самовывоз',
    'Доставка'
  ];
  
  // Состояние формы заказа
  const [formData, setFormData] = useState({
    customerName: user ? user.fullName : '',
    customerContact: user ? (user.username || '') : '',
    deliveryDate: '',
    packaging: 'Стандартная',
    deliveryMethod: 'Самовывоз',
    additionalComment: ''
  });
  
  // Состояние загрузки и ошибок
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Загрузка информации о продукте
  useEffect(() => {
    const loadProductData = async () => {
      // Проверяем, есть ли продукт в уже загруженных данных
      const existingProduct = products.find(p => p.id === productId);
      
      if (existingProduct) {
        setProduct(existingProduct);
        setLoading(false);
        return;
      }
      
      // Иначе загружаем с сервера
      try {
        setLoading(true);
        const data = await API.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Ошибка при загрузке информации о продукте:', error);
        setError('Не удалось загрузить информацию о продукте. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProductData();
    
    // Настройка кнопки "Назад" в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => navigate(`/product/${productId}`));
      
      return () => {
        tg.BackButton.hide();
      };
    }
  }, [productId, products, navigate]);
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка заполнения обязательных полей
    if (!formData.customerName || !formData.customerContact || !formData.deliveryDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Подготовка данных заказа
      const orderData = {
        customerId: user ? user.id : null,
        customerName: formData.customerName,
        customerContact: formData.customerContact,
        productId: product.id,
        productName: product.name,
        deliveryDate: formData.deliveryDate,
        packaging: formData.packaging,
        deliveryMethod: formData.deliveryMethod,
        additionalComment: formData.additionalComment
      };
      
      // Отправка заказа
      const response = await API.createOrder(orderData);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError('Ошибка при создании заказа. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      setError('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error && !product) {
    return <ErrorMessage message={error} />;
  }
  
  if (!product) {
    return <ErrorMessage message="Продукт не найден" />;
  }
  
  if (!product.isAvailable) {
    return (
      <div className="order-form">
        <h2>Оформление заказа</h2>
        <ErrorMessage message="Этот товар временно недоступен для заказа" />
        <button onClick={() => navigate(`/product/${productId}`)}>
          Вернуться к товару
        </button>
      </div>
    );
  }

  return (
    <div className="order-form">
      <h2>Оформление заказа</h2>
      
      {success ? (
        <div className="success-message">
          <h3>Заказ успешно оформлен!</h3>
          <p>Мы свяжемся с вами для подтверждения заказа.</p>
          
          <div className="success-actions">
            <button onClick={() => navigate('/')}>
              На главную
            </button>
            <button onClick={() => navigate('/catalog')}>
              Продолжить покупки
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="product-info">
            <h3>Информация о товаре</h3>
            <p><strong>Товар:</strong> {product.name}</p>
            {product.price && (
              <p><strong>Цена:</strong> {product.price} ₽</p>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div className="form-section">
            <h3>Информация о заказе</h3>
            
            <div className="form-group">
              <label htmlFor="deliveryDate">
                Дата, к которой нужен продукт *
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="packaging">Упаковка</label>
              <select
                id="packaging"
                name="packaging"
                value={formData.packaging}
                onChange={handleChange}
                disabled={submitting}
              >
                {packagingOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="deliveryMethod">Способ получения</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                disabled={submitting}
              >
                {deliveryOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Контактная информация</h3>
            
            <div className="form-group">
              <label htmlFor="customerName">Ваше имя *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Введите ваше имя"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerContact">
                Телефон или контакт Telegram *
              </label>
              <input
                type="text"
                id="customerContact"
                name="customerContact"
                value={formData.customerContact}
                onChange={handleChange}
                placeholder="Телефон или @username"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalComment">Дополнительный комментарий</label>
              <textarea
                id="additionalComment"
                name="additionalComment"
                value={formData.additionalComment}
                onChange={handleChange}
                placeholder="Дополнительная информация по заказу"
                rows="3"
                disabled={submitting}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Отправка...' : 'Оформить заказ'}
            </button>
            
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(`/product/${productId}`)}
              disabled={submitting}
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderForm;
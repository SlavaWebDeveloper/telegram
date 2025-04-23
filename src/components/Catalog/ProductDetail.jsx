import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import API from '../../api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const {
    products,
    setSelectedProduct,
    selectedCategory
  } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Загрузка данных продукта
  useEffect(() => {
    const loadProduct = async () => {
      // Если продукт уже загружен в state, используем его
      const existingProduct = products.find(p => p.id === productId);

      if (existingProduct) {
        setProduct(existingProduct);
        setSelectedProduct(existingProduct);
        setLoading(false);
        return;
      }

      // Иначе загружаем с сервера
      try {
        setLoading(true);
        const data = await API.getProductById(productId);
        setProduct(data);
        setSelectedProduct(data);
      } catch (error) {
        console.error('Ошибка при загрузке продукта:', error);
        setError('Не удалось загрузить информацию о продукте. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }

    // Настройка кнопки "Назад" в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();

      tg.BackButton.onClick(() => {
        if (selectedCategory) {
          navigate(`/catalog/${selectedCategory.id}`);
        } else {
          navigate('/catalog');
        }
      });

      return () => {
        tg.BackButton.hide();
      };
    }
  }, [productId, products, setSelectedProduct, navigate, selectedCategory]);

  // Обработчик для переключения изображений
  const handleImageChange = (direction) => {
    if (!product || !product.images || product.images.length <= 1) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Переход к оформлению заказа
  const handleOrderClick = () => {
    navigate(`/order/${productId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!product) {
    return <ErrorMessage message="Продукт не найден" />;
  }

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>

      {/* Слайдер изображений */}
      <div className="product-images">
        {product.images && product.images.length > 0 ? (
          <>
            <div className="main-image">
              <img src={product.images[currentImageIndex]} alt={product.name} />
            </div>

            {product.images.length > 1 && (
              <div className="image-navigation">
                <button onClick={() => handleImageChange('prev')}>←</button>
                <span>{currentImageIndex + 1} / {product.images.length}</span>
                <button onClick={() => handleImageChange('next')}>→</button>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder-image">Изображение отсутствует</div>
        )}
      </div>

      {/* Информация о продукте */}
      <div className="product-information">
        <div className="product-description">
          <h3>Описание</h3>
          <p>{product.description || 'Описание отсутствует'}</p>
        </div>

        <div className="product-ingredients">
          <h3>Состав</h3>
          <p>{product.ingredients || 'Состав не указан'}</p>
        </div>

        {product.price && (
          <div className="product-price">
            <h3>Цена</h3>
            <p>{product.price} ₽</p>
          </div>
        )}

        {product.additionalInfo && (
          <div className="additional-info">
            <h3>Дополнительная информация</h3>
            <p>{product.additionalInfo}</p>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="product-actions">
        {product.isAvailable ? (
          <button className="order-button" onClick={handleOrderClick}>
            Оформить заказ
          </button>
        ) : (
          <p className="unavailable-notice">
            Этот товар временно недоступен для заказа
          </p>
        )}

        <button
          className="back-button"
          onClick={() => {
            if (selectedCategory) {
              navigate(`/catalog/${selectedCategory.id}`);
            } else {
              navigate('/catalog');
            }
          }}
        >
          Назад к списку
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import API from '../../api';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const Catalog = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const {
    categories,
    setCategories,
    products,
    setProducts,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    setLoading,
    setError
  } = useAppContext();

  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLocalLoading(true);
        const data = await API.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        setLocalError('Не удалось загрузить категории. Пожалуйста, попробуйте позже.');
      } finally {
        setLocalLoading(false);
      }
    };

    loadCategories();

    // Настройка кнопки "Назад" в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => navigate('/'));

      return () => {
        tg.BackButton.hide();
      };
    }
  }, [navigate, setCategories]);

  // Загрузка продуктов при изменении категории
  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;

      try {
        setLocalLoading(true);
        const data = await API.getProducts(categoryId);
        setProducts(data);

        // Установка текущей категории
        const currentCategory = categories.find(cat => cat.id === categoryId);
        setSelectedCategory(currentCategory || null);
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        setLocalError('Не удалось загрузить продукты. Пожалуйста, попробуйте позже.');
      } finally {
        setLocalLoading(false);
      }
    };

    if (categories.length > 0) {
      if (categoryId) {
        loadProducts();
      } else {
        setProducts([]);
        setSelectedCategory(null);
      }
    }
  }, [categoryId, categories, setProducts, setSelectedCategory]);

  // Обработчик поиска
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLocalLoading(true);
      const data = await API.searchProducts(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('Ошибка при поиске продуктов:', error);
      setLocalError('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };

  if (localLoading && categories.length === 0) {
    return <Loading />;
  }

  if (localError) {
    return <ErrorMessage message={localError} />;
  }

  return (
    <div className="catalog">
      <h2>Каталог продукции</h2>

      {/* Поиск */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск по названию или ингредиентам"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Поиск</button>
        </form>
      </div>

      {/* Если есть результаты поиска, показываем их */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Результаты поиска</h3>
          <ProductList products={searchResults} />
          <button onClick={() => {
            setSearchQuery('');
            setSearchResults([]);
          }}>
            Очистить поиск
          </button>
        </div>
      )}

      {/* Если поиск пустой, показываем каталог */}
      {searchResults.length === 0 && (
        <>
          {/* Если категория не выбрана, показываем список категорий */}
          {!categoryId && (
            <CategoryList categories={categories} />
          )}

          {/* Если категория выбрана, показываем список продуктов */}
          {categoryId && (
            <>
              <h3>
                {categories.find(cat => cat.id === categoryId)?.name || 'Продукты категории'}
              </h3>

              {localLoading ? (
                <Loading />
              ) : (
                <>
                  {products.length === 0 ? (
                    <p>В этой категории нет товаров</p>
                  ) : (
                    <ProductList products={products} />
                  )}
                </>
              )}

              <button onClick={() => navigate('/catalog')}>
                Назад к категориям
              </button>
            </>
          )}
        </>
      )}

      <button onClick={() => navigate('/')}>
        На главную
      </button>
    </div>
  );
};

export default Catalog;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>Товары не найдены</p>
      ) : (
        <div className="products">
          {products.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="placeholder-image">Изображение</div>
                )}
              </div>

              <div className="product-info">
                <h4>{product.name}</h4>

                {product.ingredients && (
                  <p><strong>Ингредиенты:</strong> {product.ingredients}</p>
                )}

                {product.price && (
                  <p><strong>Цена:</strong> {product.price} ₽</p>
                )}

                {!product.isAvailable && (
                  <p className="unavailable">Нет в наличии</p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryList = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <div className="category-list">
      <h3>Категории</h3>

      {categories.length === 0 ? (
        <p>Категории не найдены</p>
      ) : (
        <div className="categories">
          {categories.map(category => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => navigate(`/catalog/${category.id}`)}
            >
              <div className="category-image">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} />
                ) : (
                  <div className="placeholder-image">Изображение</div>
                )}
              </div>

              <div className="category-info">
                <h4>{category.name}</h4>
                {category.description && (
                  <p>{category.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
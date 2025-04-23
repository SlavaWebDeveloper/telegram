import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAppContext();

  return (
    <div className="home">
      <div className="welcome-section">
        <h2>Добро пожаловать в нашу кондитерскую!</h2>
        <p>Выберите действие ниже:</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/catalog')}>
          Ассортимент
        </button>

        <button onClick={() => navigate('/about')}>
          О кондитере
        </button>

        <button onClick={() => navigate('/message-admin')}>
          Написать администратору
        </button>

        {isAdmin && (
          <button onClick={() => navigate('/admin/broadcast')}>
            Рассылка клиентам
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
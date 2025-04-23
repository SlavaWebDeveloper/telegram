import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  return (
    <header>
      <div className="header-content">
        <h1 onClick={() => navigate('/')}>Кондитерская</h1>
        {user && (
          <div className="user-info">
            Привет, {user.firstName}!
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
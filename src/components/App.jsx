import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Home from './Home/Home';
import About from './About/About';
import Catalog from './Catalog/Catalog';
import ProductDetail from './Catalog/ProductDetail';
import MessageAdmin from './MessageAdmin/MessageAdmin';
import OrderForm from './Order/OrderForm';
import Broadcast from './Admin/Broadcast';
import Header from './common/Header';
import Footer from './common/Footer';
import Loading from './common/Loading';
import ErrorMessage from './common/ErrorMessage';

const App = () => {
  const {
    user,
    isAdmin,
    loading,
    error
  } = useAppContext();

  const navigate = useNavigate();

  // При монтировании компонента настраиваем основную кнопку Telegram
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Отображаем кнопку "Закрыть"
      tg.BackButton.hide();
      tg.MainButton.hide();

      // При закрытии приложения
      tg.onEvent('viewportChanged', () => {
        if (!tg.isExpanded) {
          tg.close();
        }
      });
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categoryId" element={<Catalog />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/message-admin" element={<MessageAdmin />} />
          <Route path="/order/:productId" element={<OrderForm />} />

          {/* Административные маршруты */}
          {isAdmin && (
            <Route path="/admin/broadcast" element={<Broadcast />} />
          )}

          {/* Маршрут для несуществующих страниц */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
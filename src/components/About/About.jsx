import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Настройка кнопки "Назад" в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => navigate('/'));

      return () => {
        tg.BackButton.hide();
      };
    }
  }, [navigate]);

  return (
    <div className="about">
      <h2>О кондитере</h2>

      <div className="about-content">
        <div className="about-image">
          {/* Здесь будет изображение кондитера */}
          <div className="placeholder-image">Фото кондитера</div>
        </div>

        <div className="about-text">
          <p>
            Меня зовут [Имя Фамилия], и я профессиональный кондитер с более чем
            10-летним опытом работы в создании вкусных и красивых десертов.
          </p>

          <p>
            Моя страсть к кондитерскому искусству началась еще в детстве,
            когда я помогал(а) своей бабушке печь домашние пироги и торты. Сегодня
            эта страсть переросла в дело всей моей жизни.
          </p>

          <p>
            Я специализируюсь на изготовлении тортов на заказ, пирожных и других
            десертов для всех видов праздников и мероприятий. В своей работе
            я использую только натуральные ингредиенты высочайшего качества.
          </p>

          <p>
            Буду рада помочь вам сделать ваш праздник незабываемым с помощью
            вкусных и красивых десертов!
          </p>
        </div>
      </div>

      <button onClick={() => navigate('/')}>Вернуться на главную</button>
    </div>
  );
};

export default About;
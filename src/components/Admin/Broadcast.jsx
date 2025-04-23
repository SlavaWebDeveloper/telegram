import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import API from '../../api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const Broadcast = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAppContext();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Проверяем, является ли пользователь администратором
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }

    // Настройка кнопки "Назад" в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => navigate('/'));

      return () => {
        tg.BackButton.hide();
      };
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Пожалуйста, введите текст сообщения');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const messageData = {
        message: message.trim(),
        senderTelegramId: user?.id
      };

      const response = await API.broadcastMessage(messageData);

      if (response.success) {
        setResult(response.data);
        setMessage('');
      } else {
        setError('Ошибка при отправке рассылки: ' + (response.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка при отправке рассылки:', error);
      setError('Произошла ошибка при отправке рассылки. Пожалуйста, попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  if (!isAdmin) {
    return <ErrorMessage message="У вас нет доступа к этой странице" />;
  }

  return (
    <div className="broadcast">
      <h2>Рассылка сообщений клиентам</h2>

      {result ? (
        <div className="broadcast-result">
          <h3>Результаты рассылки</h3>

          <div className="result-summary">
            <p>Всего клиентов: {result.totalCustomers}</p>
            <p>Успешно доставлено: {result.successfulDeliveries}</p>
            <p>Не доставлено: {result.failedDeliveries}</p>
          </div>

          <div className="result-actions">
            <button onClick={() => setResult(null)}>
              Отправить еще сообщение
            </button>
            <button onClick={() => navigate('/')}>
              Вернуться на главную
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="message">Текст сообщения:</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите текст сообщения для всех клиентов..."
              disabled={sending}
            />
          </div>

          <div className="broadcast-notice">
            <p>
              <strong>Важно:</strong> Сообщение будет отправлено всем клиентам,
              у которых установлено это мини-приложение. Используйте эту функцию
              только для важных объявлений.
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={sending}>
              {sending ? 'Отправка...' : 'Отправить рассылку'}
            </button>

            <button type="button" onClick={() => navigate('/')} disabled={sending}>
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Broadcast;
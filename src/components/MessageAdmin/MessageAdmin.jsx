import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import API from '../../api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const MessageAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Пожалуйста, введите сообщение');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const messageData = {
        customerName: user ? user.fullName : 'Пользователь',
        telegramUsername: user ? user.username : '',
        message: message.trim()
      };

      const response = await API.sendMessageToAdmin(messageData);

      if (response.success) {
        setSuccess(true);
        setMessage('');
      } else {
        setError('Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setError('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="message-admin">
      <h2>Написать администратору</h2>

      {success ? (
        <div className="success-message">
          <p>Ваше сообщение успешно отправлено!</p>
          <button onClick={() => {
            setSuccess(false);
          }}>
            Отправить еще сообщение
          </button>
          <button onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="message">Ваше сообщение:</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите ваше сообщение..."
              disabled={sending}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={sending}>
              {sending ? 'Отправка...' : 'Отправить сообщение'}
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

export default MessageAdmin;
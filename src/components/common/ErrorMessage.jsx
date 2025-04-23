import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <h3>Произошла ошибка</h3>
      <p>{message || 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.'}</p>
    </div>
  );
};

export default ErrorMessage;
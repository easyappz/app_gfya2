import React, { useState } from 'react';
import { resetPassword } from '../api/authApi';
import '../App.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await resetPassword({ email, newPassword });
      setMessage(data.message || 'Пароль успешно сброшен');
    } catch (err) {
      setError(err.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Сброс пароля</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Введите email"
          />
        </div>
        <div className="form-group">
          <label>Новый пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Введите новый пароль"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Сброс...' : 'Сбросить пароль'}
        </button>
      </form>
      <div className="auth-links">
        <a href="/login">Вернуться ко входу</a>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

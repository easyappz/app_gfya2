import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const UploadPhotoPage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return setError('Пожалуйста, выберите файл');
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const data = await uploadPhoto(formData);
      setMessage(data.message || 'Фотография успешно загружена');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки фотографии');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="upload-container">
      <header>
        <h2>Загрузить фотографию</h2>
        <div className="nav-links">
          <a href="/gallery">Галерея</a>
          <a href="/profile">Профиль</a>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Выберите фотографию</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </form>
    </div>
  );
};

export default UploadPhotoPage;

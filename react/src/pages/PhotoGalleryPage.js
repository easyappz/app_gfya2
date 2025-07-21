import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPhotos, ratePhoto, filterPhotosByRating } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const PhotoGalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        if (minRating > 0) {
          data = await filterPhotosByRating(minRating);
        } else {
          data = await getAllPhotos();
        }
        setPhotos(data);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки фотографий');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [minRating]);

  const handleRate = async (photoId, rating) => {
    try {
      await ratePhoto(photoId, rating);
      // Refresh photos after rating
      const data = minRating > 0 ? await filterPhotosByRating(minRating) : await getAllPhotos();
      setPhotos(data);
    } catch (err) {
      setError(err.message || 'Ошибка оценки фотографии');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="gallery-container">
      <header>
        <h2>Галерея фотографий</h2>
        <div className="nav-links">
          <a href="/upload">Загрузить фото</a>
          <a href="/profile">Профиль</a>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      {error && <div className="error-message">{error}</div>}
      <div className="filter-section">
        <label>Минимальная оценка:</label>
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>Все</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5</option>
        </select>
      </div>
      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="photo-grid">
          {photos.length === 0 ? (
            <p>Фотографии не найдены.</p>
          ) : (
            photos.map((photo) => (
              <div key={photo._id} className="photo-card">
                <img src={`/uploads/${photo.filename}`} alt={photo.originalName} />
                <div className="photo-info">
                  <p>Загрузил: {photo.userId?.username || 'Неизвестно'}</p>
                  <div className="rating">
                    <span>Оценить:</span>
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleRate(photo._id, rate)}
                        className="rate-button"
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryPage;

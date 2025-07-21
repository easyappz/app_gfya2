import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getUserStatistics } from '../api/userApi';
import { getUserPhotos } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [photos, setPhotos] = useState([]);
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
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const profileData = await getUserProfile();
        const statsData = await getUserStatistics();
        const photosData = await getUserPhotos();
        setProfile(profileData);
        setStatistics(statsData);
        setPhotos(photosData);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <header>
        <h2>Профиль пользователя</h2>
        <div className="nav-links">
          <a href="/gallery">Галерея</a>
          <a href="/upload">Загрузить фото</a>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="profile-content">
          {profile && (
            <div className="profile-info">
              <h3>Информация о пользователе</h3>
              <p><strong>Имя:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
          )}
          {statistics && (
            <div className="statistics">
              <h3>Статистика</h3>
              <p><strong>Количество фотографий:</strong> {statistics.photoCount}</p>
              <p><strong>Средняя оценка:</strong> {statistics.averageRating}</p>
              <p><strong>Всего оценок:</strong> {statistics.totalRatings}</p>
            </div>
          )}
          <div className="user-photos">
            <h3>Мои фотографии</h3>
            {photos.length === 0 ? (
              <p>У вас пока нет загруженных фотографий.</p>
            ) : (
              <div className="photo-grid">
                {photos.map((photo) => (
                  <div key={photo._id} className="photo-card">
                    <img src={`/uploads/${photo.filename}`} alt={photo.originalName} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getUserStatistics } from '../api/userApi';
import { getUserPhotos } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import { Card, Row, Col, Alert, Spin, Typography, Descriptions } from 'antd';

const { Title } = Typography;

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
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

  return (
    <Card style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Профиль пользователя</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <div>
          {profile && (
            <div style={{ marginBottom: 24 }}>
              <Title level={3}>Информация о пользователе</Title>
              <Descriptions bordered>
                <Descriptions.Item label="Имя" span={3}>{profile.username}</Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>{profile.email}</Descriptions.Item>
              </Descriptions>
            </div>
          )}
          {statistics && (
            <div style={{ marginBottom: 24 }}>
              <Title level={3}>Статистика</Title>
              <Descriptions bordered>
                <Descriptions.Item label="Количество фотографий" span={3}>{statistics.photoCount}</Descriptions.Item>
                <Descriptions.Item label="Средняя оценка" span={3}>{statistics.averageRating}</Descriptions.Item>
                <Descriptions.Item label="Всего оценок" span={3}>{statistics.totalRatings}</Descriptions.Item>
              </Descriptions>
            </div>
          )}
          <div>
            <Title level={3}>Мои фотографии</Title>
            {photos.length === 0 ? (
              <p>У вас пока нет загруженных фотографий.</p>
            ) : (
              <Row gutter={[16, 16]}>
                {photos.map((photo) => (
                  <Col key={photo._id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={<img alt={photo.originalName} src={`/uploads/${photo.filename}`} style={{ height: 200, objectFit: 'cover' }} />}
                    >
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserProfilePage;
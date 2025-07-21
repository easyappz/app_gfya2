import React, { useState, useEffect } from 'react';
import { Card, Typography, Alert, Row, Col, Spin, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';

const { Title, Text } = Typography;

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
  }

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get('/api/photos/user');
        setPhotos(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при загрузке ваших фотографий');
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Мои фотографии</Title>
      <Card style={{ marginBottom: 24 }}>
        <Text strong>Пользователь: {user.username || 'Неизвестно'}</Text>
      </Card>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {photos.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center' }}>
              <Text>У вас пока нет загруженных фотографий.</Text>
            </Col>
          ) : (
            photos.map(photo => (
              <Col xs={24} sm={12} md={8} key={photo._id}>
                <Card
                  hoverable
                  cover={<img alt={photo.originalName} src={`/uploads/${photo.filename}`} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <Card.Meta title={photo.originalName} />
                  <div style={{ marginTop: 16 }}>
                    <Text>Средняя оценка: {photo.ratings.length > 0 ? (photo.ratings.reduce((sum, r) => sum + r.rating, 0) / photo.ratings.length).toFixed(1) : 'Нет оценок'}</Text>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
      <Button type="primary" onClick={() => navigate('/upload')} style={{ marginTop: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Загрузить новую фотографию
      </Button>
    </div>
  );
};

export default MyPhotos;

import React, { useState, useEffect } from 'react';
import { Card, Button, Rate, Typography, Alert, Select, Row, Col, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';

const { Title, Text } = Typography;
const { Option } = Select;

const RatePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minRating, setMinRating] = useState(0);
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
        const response = await instance.get(`/api/photos/filter?minRating=${minRating}`);
        setPhotos(response.data.filter(photo => photo.userId._id !== user.id));
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при загрузке фотографий');
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [minRating, user.id]);

  const handleRate = async (photoId, rating) => {
    try {
      await instance.post(`/api/photos/${photoId}/rate`, { rating });
      setPhotos(photos.map(photo => {
        if (photo._id === photoId) {
          const existingRating = photo.ratings.find(r => r.userId === user.id);
          if (existingRating) {
            existingRating.rating = rating;
          } else {
            photo.ratings.push({ userId: user.id, rating });
          }
        }
        return photo;
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при оценке фотографии');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Оценить фотографии</Title>
      <Card style={{ marginBottom: 24 }}>
        <Text strong>Пользователь: {user.username || 'Неизвестно'}</Text>
      </Card>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Text style={{ marginRight: 16 }}>Фильтр по минимальной оценке:</Text>
          <Select value={minRating} onChange={setMinRating} style={{ width: 120 }}>
            <Option value={0}>Все</Option>
            <Option value={1}>1+</Option>
            <Option value={2}>2+</Option>
            <Option value={3}>3+</Option>
            <Option value={4}>4+</Option>
            <Option value={5}>5</Option>
          </Select>
        </Col>
      </Row>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {photos.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center' }}>
              <Text>Фотографии для оценки не найдены.</Text>
            </Col>
          ) : (
            photos.map(photo => (
              <Col xs={24} sm={12} md={8} key={photo._id}>
                <Card
                  hoverable
                  cover={<img alt={photo.originalName} src={`/uploads/${photo.filename}`} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <Card.Meta title={`Автор: ${photo.userId.username}`} />
                  <div style={{ marginTop: 16 }}>
                    <Text>Ваша оценка:</Text>
                    <Rate
                      value={photo.ratings.find(r => r.userId === user.id)?.rating || 0}
                      onChange={(value) => handleRate(photo._id, value)}
                    />
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
      <Button type="link" onClick={() => navigate('/upload')} style={{ marginTop: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Загрузить свою фотографию
      </Button>
    </div>
  );
};

export default RatePhotos;

import React, { useState, useEffect } from 'react';
import { Card, Typography, Alert, Spin, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';

const { Title, Text } = Typography;

const Statistics = () => {
  const [stats, setStats] = useState({ photoCount: 0, averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
  }

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get('/api/user/statistics');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при загрузке статистики');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Статистика</Title>
      <Card style={{ marginBottom: 24 }}>
        <Text strong>Пользователь: {user.username || 'Неизвестно'}</Text>
      </Card>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Card style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: 18 }}>Количество загруженных фотографий: {stats.photoCount}</Text>
          <br />
          <Text strong style={{ fontSize: 18 }}>Средняя оценка ваших фотографий: {stats.averageRating}</Text>
          <br />
          <Text strong style={{ fontSize: 18 }}>Всего оценок: {stats.totalRatings}</Text>
        </Card>
      )}
      <Button type="primary" onClick={() => navigate('/my-photos')} style={{ marginTop: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Посмотреть мои фотографии
      </Button>
    </div>
  );
};

export default Statistics;

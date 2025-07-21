import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPhotos, ratePhoto, filterPhotosByRating } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import { Card, Row, Col, Button, Select, Alert, Spin, Typography, Rate } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const PhotoGalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [minRating, setMinRating] = useState(0);
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

  return (
    <Card style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Галерея фотографий</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>Минимальная оценка:</span>
        <Select value={minRating} onChange={setMinRating} style={{ width: 120 }}>
          <Option value={0}>Все</Option>
          <Option value={1}>1+</Option>
          <Option value={2}>2+</Option>
          <Option value={3}>3+</Option>
          <Option value={4}>4+</Option>
          <Option value={5}>5</Option>
        </Select>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {photos.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center' }}>
              <p>Фотографии не найдены.</p>
            </Col>
          ) : (
            photos.map((photo) => (
              <Col key={photo._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={photo.originalName} src={`/uploads/${photo.filename}`} style={{ height: 200, objectFit: 'cover' }} />}
                >
                  <Card.Meta
                    title={`Загрузил: ${photo.userId?.username || 'Неизвестно'}`}
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>Оценить:</div>
                        <Rate
                          value={photo.averageRating || 0}
                          onChange={(value) => handleRate(photo._id, value)}
                          allowHalf={false}
                        />
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Card>
  );
};

export default PhotoGalleryPage;
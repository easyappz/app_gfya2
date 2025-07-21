import React, { useState } from 'react';
import { Upload, Button, Typography, Alert, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';

const { Title, Text } = Typography;

const UploadPhoto = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
  }

  const handleUpload = async () => {
    if (fileList.length === 0) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('photo', fileList[0]);

    try {
      await instance.post('/api/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setFileList([]);
      setTimeout(() => {
        setSuccess(false);
        navigate('/my-photos');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке фото');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList }) => setFileList(fileList.slice(-1));

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Загрузить фотографию</Title>
      <Card style={{ marginBottom: 24 }}>
        <Text strong>Пользователь: {user.username || 'Неизвестно'}</Text>
      </Card>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {success && <Alert message="Фотография успешно загружена! Вы будете перенаправлены." type="success" showIcon style={{ marginBottom: 16 }} />}
      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/*"
        listType="picture"
      >
        <Button icon={<UploadOutlined />}>Выбрать фото</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={loading}
        disabled={fileList.length === 0 || success}
        style={{ marginTop: 16, width: '100%' }}
      >
        Загрузить
      </Button>
    </div>
  );
};

export default UploadPhoto;

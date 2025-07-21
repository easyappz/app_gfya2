import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../api/photoApi';
import { useAuth } from '../contexts/AuthContext';
import { Upload, Button, Alert, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UploadPhotoPage = () => {
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Keep only the last file
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', fileList[0].originFileObj);
      const data = await uploadPhoto(formData);
      setMessage(data.message || 'Фотография успешно загружена');
      setFileList([]);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки фотографии');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Загрузить фотографию</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {message && <Alert message={message} type="success" showIcon style={{ marginBottom: 16 }} />}
      <Upload
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false} // Prevent auto upload
        accept="image/*"
        listType="picture"
      >
        <Button icon={<UploadOutlined />} size="large">Выбрать файл</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={loading}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
        size="large"
      >
        Загрузить
      </Button>
    </Card>
  );
};

export default UploadPhotoPage;
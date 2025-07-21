import React, { useState } from 'react';
import { resetPassword } from '../api/authApi';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await resetPassword({ email: values.email, newPassword: values.password });
      setMessage(data.message || 'Пароль успешно сброшен');
    } catch (err) {
      setError(err.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto', borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Сброс пароля</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {message && <Alert message={message} type="success" showIcon style={{ marginBottom: 16 }} />}
      <Form
        name="reset-password"
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Пожалуйста, введите ваш email!' }, { type: 'email', message: 'Некорректный email!' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Пожалуйста, введите новый пароль!' }, { min: 6, message: 'Пароль должен быть не менее 6 символов!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Новый пароль" size="large" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Пожалуйста, подтвердите ваш пароль!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Сбросить пароль
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Text><a href="/login">Вернуться ко входу</a></Text>
        </div>
      </Form>
    </Card>
  );
};

export default ResetPasswordPage;
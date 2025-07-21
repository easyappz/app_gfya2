import React from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, UploadOutlined, StarOutlined, UserOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = token ? [
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: 'Загрузить фото',
      onClick: () => navigate('/upload'),
    },
    {
      key: '/rate',
      icon: <StarOutlined />,
      label: 'Оценить фото',
      onClick: () => navigate('/rate'),
    },
    {
      key: '/my-photos',
      icon: <UserOutlined />,
      label: 'Мои фото',
      onClick: () => navigate('/my-photos'),
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: 'Статистика',
      onClick: () => navigate('/statistics'),
    },
  ] : [
    {
      key: '/login',
      icon: <HomeOutlined />,
      label: 'Вход',
      onClick: () => navigate('/login'),
    },
    {
      key: '/register',
      icon: <UserOutlined />,
      label: 'Регистрация',
      onClick: () => navigate('/register'),
    },
  ];

  const isAuthPage = ['/login', '/register', '/reset-password'].includes(location.pathname);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {!isAuthPage && (
        <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ float: 'left', marginRight: 50 }}>
            <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate(token ? '/upload' : '/login')}>
              ФотоОценка
            </h2>
          </div>
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[location.pathname]}
            style={{ lineHeight: '64px' }}
          />
          {token && (
            <div style={{ float: 'right' }}>
              <span style={{ marginRight: 16 }}>{user.username || 'Пользователь'}</span>
              <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          )}
        </Header>
      )}
      <Content style={{ padding: isAuthPage ? 0 : '24px 50px', background: '#fff' }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;

import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content } = AntLayout;

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = currentUser
    ? [
        { key: '/gallery', label: 'Галерея', onClick: () => navigate('/gallery') },
        { key: '/upload', label: 'Загрузить фото', onClick: () => navigate('/upload') },
        { key: '/profile', label: 'Профиль', onClick: () => navigate('/profile') },
        { key: 'logout', label: 'Выйти', onClick: handleLogout },
      ]
    : [
        { key: '/login', label: 'Войти', onClick: () => navigate('/login') },
        { key: '/register', label: 'Регистрация', onClick: () => navigate('/register') },
      ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <div className="logo" style={{ float: 'left', fontSize: '20px', fontWeight: 'bold' }}>
          ФотоГалерея
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ float: 'right' }}
        />
      </Header>
      <Content style={{ padding: '24px', margin: '0 auto', maxWidth: '1200px' }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
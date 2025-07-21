import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PhotoGalleryPage from './pages/PhotoGalleryPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={
              <Layout>
                <LoginPage />
              </Layout>
            } />
            <Route path="/register" element={
              <Layout>
                <RegisterPage />
              </Layout>
            } />
            <Route path="/reset-password" element={
              <Layout>
                <ResetPasswordPage />
              </Layout>
            } />
            <Route path="/gallery" element={
              <Layout>
                <PhotoGalleryPage />
              </Layout>
            } />
            <Route path="/upload" element={
              <Layout>
                <UploadPhotoPage />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <UserProfilePage />
              </Layout>
            } />
            <Route path="/" element={
              <Layout>
                <LoginPage />
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
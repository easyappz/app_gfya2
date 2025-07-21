import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import UploadPhoto from './pages/UploadPhoto';
import RatePhotos from './pages/RatePhotos';
import MyPhotos from './pages/MyPhotos';
import Statistics from './pages/Statistics';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/reset-password" element={
          <Layout>
            <ResetPassword />
          </Layout>
        } />
        <Route path="/upload" element={
          <Layout>
            <UploadPhoto />
          </Layout>
        } />
        <Route path="/rate" element={
          <Layout>
            <RatePhotos />
          </Layout>
        } />
        <Route path="/my-photos" element={
          <Layout>
            <MyPhotos />
          </Layout>
        } />
        <Route path="/statistics" element={
          <Layout>
            <Statistics />
          </Layout>
        } />
        <Route path="*" element={
          <Layout>
            <Login />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { newscoonTheme } from './theme/theme';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastNotification from './components/notifications/ToastNotification';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import MainPage from './pages/MainPage';
import ArticlePage from './pages/ArticlePage';
import AllNewsPage from './pages/AllNewsPage';
import StackDetailPage from './pages/StackDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TestPage from './pages/TestPage';

function App() {
  return (
    <ThemeProvider theme={newscoonTheme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/stack/:id" element={<StackDetailPage />} />
          <Route path="/all-news" element={<AllNewsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
        <Footer />

        {/* Global Toast Notifications */}
        <ToastNotification />
      </div>
    </ThemeProvider>
  );
}

export default App;

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
import MainPage from './Pages/MainPage';
import ArticlePage from './Pages/ArticlePage';
import AllNewsPage from './Pages/AllNewsPage';
import StackDetailPage from './Pages/StackDetailPage';
import ReadingFlowPage from './Pages/ReadingFlowPage';
import AdminDashboard from './Pages/admin/AdminDashboard';
import TestPage from './Pages/TestPage';

function App() {
  return (
    <ThemeProvider theme={newscoonTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/* Ana sayfa ve diğer sayfalar - Header ve Footer ile */}
          <Route path="/" element={
            <>
              <Header />
              <MainPage />
              <Footer />
            </>
          } />
          <Route path="/article/:id" element={
            <>
              <Header />
              <ArticlePage />
              <Footer />
            </>
          } />
          <Route path="/stack/:id" element={
            <>
              <Header />
              <StackDetailPage />
              <Footer />
            </>
          } />
          <Route path="/all-news" element={
            <>
              <Header />
              <AllNewsPage />
              <Footer />
            </>
          } />
          <Route path="/admin" element={
            <>
              <Header />
              <AdminDashboard />
              <Footer />
            </>
          } />
          <Route path="/test" element={
            <>
              <Header />
              <TestPage />
              <Footer />
            </>
          } />

          {/* ReadingFlowPage - Header ve Footer olmadan */}
          <Route path="/stack/:id/read" element={<ReadingFlowPage />} />
        </Routes>

        {/* Global Toast Notifications */}
        <ToastNotification />
      </div>
    </ThemeProvider>
  );
}

export default App;

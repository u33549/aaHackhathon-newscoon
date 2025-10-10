import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { newscoonTheme } from './theme/theme';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import MainPage from './Pages/MainPage';
import ArticlePage from './Pages/ArticlePage';
import AllNewsPage from './Pages/AllNewsPage';
import StackDetailPage from './Pages/StackDetailPage';
import ReadingFlowPage from './Pages/ReadingFlowPage';
import AdminDashboard from './Pages/admin/AdminDashboard';
import TestPage from './Pages/TestPage';

// Redux hooks
import { useUserXP, useUserLevel, useXPForNextLevel } from './hooks/redux';

function App() {
  // User bilgilerini Redux'tan al
  const totalCp = useUserXP();
  const level = useUserLevel();
  const cpForNextLevel = useXPForNextLevel();

  return (
    <ThemeProvider theme={newscoonTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/* Ana sayfa ve diğer sayfalar - Header ve Footer ile */}
          <Route path="/" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <MainPage />
              <Footer />
            </>
          } />
          <Route path="/article/:id" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <ArticlePage />
              <Footer />
            </>
          } />
          <Route path="/stack/:id" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <StackDetailPage />
              <Footer />
            </>
          } />
          <Route path="/all-news" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <AllNewsPage />
              <Footer />
            </>
          } />
          <Route path="/admin" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <AdminDashboard />
              <Footer />
            </>
          } />
          <Route path="/test" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
              <TestPage />
              <Footer />
            </>
          } />

          {/* ReadingFlowPage - Header ve Footer olmadan */}
          <Route path="/stack/:id/read" element={<ReadingFlowPage />} />
        </Routes>

        {/* Scroll to top component */}
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;

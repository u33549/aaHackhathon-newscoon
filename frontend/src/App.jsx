import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { newscoonTheme } from './theme/theme';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Modal Components
import BadgeModal from './components/modals/BadgeModal';

// Pages
import MainPage from './Pages/MainPage';
import AllNewsPage from './Pages/AllNewsPage';
import StackDetailPage from './Pages/StackDetailPage';
import ReadingFlowPage from './Pages/ReadingFlowPage';
import AdminDashboard from './Pages/admin/AdminDashboard';
import TestPage from './Pages/TestPage';

// Redux hooks
import { useAppDispatch, useUserXP, useUserLevel, useXPForNextLevel, useUserAchievements, useUserBadges } from './hooks/redux';
import { loadDemoData } from './store/slices/userSlice';
import { allAchievements } from './constants/index.jsx';

function App() {
  const dispatch = useAppDispatch();

  // User bilgilerini Redux'tan al
  const totalCp = useUserXP();
  const level = useUserLevel();
  const cpForNextLevel = useXPForNextLevel();
  const userAchievements = useUserAchievements();
  const earnedBadges = useUserBadges();

  // Badge modal state
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // Uygulama ilk yüklendiğinde user verilerini yükle
  useEffect(() => {
    // Demo verilerini yükle
    dispatch(loadDemoData());
  }, [dispatch]);

  const handleOpenBadges = () => {
    setIsBadgeModalOpen(true);
  };

  const handleCloseBadges = () => {
    setIsBadgeModalOpen(false);
  };

  // Earned achievements as Set for efficient lookup
  const earnedAchievementIds = new Set(
    userAchievements?.achievements?.map(a => a.id) || []
  );

  return (
    <ThemeProvider theme={newscoonTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/* Ana sayfa ve diğer sayfalar - Header ve Footer ile */}
          <Route path="/" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} onOpenBadges={handleOpenBadges} />
              <MainPage />
              <Footer />
            </>
          } />
          <Route path="/stack/:id" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} onOpenBadges={handleOpenBadges} />
              <StackDetailPage />
              <Footer />
            </>
          } />
          <Route path="/all-news" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} onOpenBadges={handleOpenBadges} />
              <AllNewsPage />
              <Footer />
            </>
          } />
          <Route path="/admin" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} onOpenBadges={handleOpenBadges} />
              <AdminDashboard />
              <Footer />
            </>
          } />
          <Route path="/test" element={
            <>
              <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} onOpenBadges={handleOpenBadges} />
              <TestPage />
              <Footer />
            </>
          } />

          {/* ReadingFlowPage - Header ve Footer olmadan */}
          <Route path="/stack/:id/read" element={<ReadingFlowPage />} />
        </Routes>

        {/* Scroll to top component */}
        <ScrollToTop />

        {/* Badge Modal - Always render it, controlled by its own state */}
        <BadgeModal
          isOpen={isBadgeModalOpen}
          onClose={handleCloseBadges}
          badges={earnedBadges}
          totalCp={totalCp}
          earnedAchievements={earnedAchievementIds}
          level={level}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

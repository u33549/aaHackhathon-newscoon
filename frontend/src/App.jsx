import React from 'react';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { ThemeProvider, CssBaseline } from '@mui/material';
import { newscoonTheme } from './theme/theme';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastNotification from './components/notifications/ToastNotification';

// Pages
import MainPage from './pages/MainPage';
import ArticlePage from './pages/ArticlePage';
import AllNewsPage from './pages/AllNewsPage';
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
=======

// Pages
import MainPage from './Pages/MainPage';
import ArticlePage from './Pages/ArticlePage';
import TestPage from './Pages/TestPage';

// Admin Pages
import AdminDashboard from './Pages/admin/AdminDashboard';
import NewsManagement from './Pages/admin/NewsManagement';
import StackManagement from './Pages/admin/StackManagement';
import PhotoManagement from './Pages/admin/PhotoManagement';

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">🔧 Admin Panel</h1>
              <div className="flex space-x-4">
                <a href="/admin" className="hover:bg-gray-800 px-3 py-2 rounded transition">
                  Dashboard
                </a>
                <a href="/admin/news" className="hover:bg-gray-800 px-3 py-2 rounded transition">
                  Haberler
                </a>
                <a href="/admin/stacks" className="hover:bg-gray-800 px-3 py-2 rounded transition">
                  Stack'ler
                </a>
                <a href="/admin/photos" className="hover:bg-gray-800 px-3 py-2 rounded transition">
                  Fotoğraflar
                </a>
              </div>
            </div>
            <a 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Ana Siteye Dön
            </a>
          </div>
        </div>
      </nav>
      
      {/* Page Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainPage />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/test" element={<TestPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/news" element={<AdminLayout><NewsManagement /></AdminLayout>} />
      <Route path="/admin/stacks" element={<AdminLayout><StackManagement /></AdminLayout>} />
      <Route path="/admin/photos" element={<AdminLayout><PhotoManagement /></AdminLayout>} />
    </Routes>
  );
}

export default App;
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619

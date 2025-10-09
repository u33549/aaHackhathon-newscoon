import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  // Grid, Card, CardContent kaldırıldı çünkü kullanılmıyor
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Article,
  Layers, // ✅ Düzeltildi: Hatalı Stack ikonu yerine Layers kullanıldı
  Image,
  Add,
  Edit,
  Delete,
  Launch,
  Refresh
  // Dashboard ve Visibility kaldırıldı çünkü kullanılmıyor
} from '@mui/icons-material';


import {
  newsAPI,
  stacksAPI,
  imagesAPI
} from '../../services';

// --- TEMEL CRUD BİLEŞENLERİ (TASLAK) ---

const NewsCRUD = ({ data, loading, error, fetchData }) => (
  <Box sx={{ mt: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Haber Listesi ({data?.length || 0})</Typography>
      <Box>
        <Button variant="contained" startIcon={<Add />} sx={{ mr: 1 }}>Yeni Haber Ekle</Button>
        <IconButton onClick={fetchData} disabled={loading} color="primary">
          {loading ? <CircularProgress size={24} /> : <Refresh />}
        </IconButton>
      </Box>
    </Box>

    {error && <Alert severity="error" sx={{ mb: 2 }}>Veri Yükleme Hatası: {error}</Alert>}

    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>GUID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Başlık</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Stack'te Mi?</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                <CircularProgress size={24} /> Yükleniyor...
              </TableCell>
            </TableRow>
          )}
          {data?.slice(0, 10).map((item) => (
            <TableRow key={item.guid}>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item.guid.substring(0, 20)}...</TableCell>
              <TableCell>{item.title.substring(0, 40)}...</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.isInAnyStack ? 'Evet' : 'Hayır'}</TableCell>
              <TableCell>
                <IconButton size="small" color="info" title="Düzenle"><Edit /></IconButton>
                <IconButton size="small" color="error" title="Sil"><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const StacksCRUD = ({ data, loading, error, fetchData }) => (
  <Box sx={{ mt: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Yığın Listesi ({data?.length || 0})</Typography>
      <Box>
        <Button variant="contained" startIcon={<Add />} sx={{ mr: 1 }}>Yeni Yığın Oluştur</Button>
        <IconButton onClick={fetchData} disabled={loading} color="primary">
          {loading ? <CircularProgress size={24} /> : <Refresh />}
        </IconButton>
      </Box>
    </Box>

    {error && <Alert severity="error" sx={{ mb: 2 }}>Veri Yükleme Hatası: {error}</Alert>}

    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Başlık</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Haber Sayısı</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>XP</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                <CircularProgress size={24} /> Yükleniyor...
              </TableCell>
            </TableRow>
          )}
          {data?.slice(0, 10).map((item) => (
            <TableRow key={item._id}>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item._id.substring(0, 10)}...</TableCell>
              <TableCell>{item.title.substring(0, 40)}...</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.news?.length || 0}</TableCell>
              <TableCell>{item.xp}</TableCell>
              <TableCell>
                <IconButton size="small" color="primary" title="Haber Ekle/Çıkar"><Launch /></IconButton>
                <IconButton size="small" color="info" title="Düzenle"><Edit /></IconButton>
                <IconButton size="small" color="error" title="Sil"><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const ImagesCRUD = ({ data, loading, error, fetchData }) => (
  <Box sx={{ mt: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Yığın Kapak Resimleri ({data?.length || 0})</Typography>
      <IconButton onClick={fetchData} disabled={loading} color="primary">
        {loading ? <CircularProgress size={24} /> : <Refresh />}
      </IconButton>
    </Box>

    {error && <Alert severity="error" sx={{ mb: 2 }}>Veri Yükleme Hatası: {error}</Alert>}

    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Stack ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Önizleme</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Oluşturulma</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                <CircularProgress size={24} /> Yükleniyor...
              </TableCell>
            </TableRow>
          )}
          {data?.slice(0, 10).map((item) => (
            <TableRow key={item._id}>
              <TableCell sx={{ fontSize: '0.75rem' }}>{item.newsStackId?._id?.substring(0, 10) || item.newsStackId?.substring(0, 10)}...</TableCell>
              <TableCell>
                <img src={item.photoUrl} alt="kapak" style={{ width: '80px', height: '40px', objectFit: 'cover' }} />
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>Kapak Yükle</Button>
                <IconButton size="small" color="error" title="Sil"><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);


// --- ANA DASHBOARD BİLEŞENİ ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [stacksData, setStacksData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState({ news: false, stacks: false, images: false });
  const [error, setError] = useState({ news: null, stacks: null, images: null });

  // API'den veri çekme fonksiyonları
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
    setError(prev => ({ ...prev, news: null }));
    try {
      const response = await newsAPI.getAll({ limit: 20 });
      setNewsData(response.data);
    } catch (err) {
      setError(prev => ({ ...prev, news: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const fetchStacks = async () => {
    setLoading(prev => ({ ...prev, stacks: true }));
    setError(prev => ({ ...prev, stacks: null }));
    try {
      const response = await stacksAPI.getAll({ limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
      setStacksData(response.data);
    } catch (err) {
      setError(prev => ({ ...prev, stacks: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, stacks: false }));
    }
  };

  const fetchImages = async () => {
    setLoading(prev => ({ ...prev, images: true }));
    setError(prev => ({ ...prev, images: null }));
    try {
      const response = await imagesAPI.getAll({ limit: 20 });
      setImagesData(response.data);
    } catch (err) {
      setError(prev => ({ ...prev, images: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, images: false }));
    }
  };

  // İlk yüklemede ve sekme değiştiğinde ilgili veriyi çek
  useEffect(() => {
    switch (activeTab) {
      case 0: // Haberler
        if (newsData.length === 0) fetchNews();
        break;
      case 1: // Yığınlar
        if (stacksData.length === 0) fetchStacks();
        break;
      case 2: // Resimler
        if (imagesData.length === 0) fetchImages();
        break;
      default:
        break;
    }
  }, [activeTab]); 

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <NewsCRUD
            data={newsData}
            loading={loading.news}
            error={error.news}
            fetchData={fetchNews}
          />
        );
      case 1:
        return (
          <StacksCRUD
            data={stacksData}
            loading={loading.stacks}
            error={error.stacks}
            fetchData={fetchStacks}
          />
        );
      case 2:
        return (
          <ImagesCRUD
            data={imagesData}
            loading={loading.images}
            error={error.images}
            fetchData={fetchImages}
          />
        );
      default:
        return <Typography sx={{ mt: 3 }}>Sekme içeriği bulunamadı.</Typography>;
=======
import { Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { stackService } from '../../services/stackService';
import { getAllStackImages } from '../../services/imageService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    newsCount: 0,
    stackCount: 0,
    photoCount: 0,
    loading: true,
  });

  const [recentNews, setRecentNews] = useState([]);
  const [recentStacks, setRecentStacks] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, stacksRes, photosRes] = await Promise.all([
        newsService.getAllNews().catch(() => ({ data: [] })),
        stackService.getAllStacks().catch(() => ({ data: [] })),
        getAllStackImages().catch(() => ({ data: [] })),
      ]);

      setStats({
        newsCount: newsRes?.data?.length || 0,
        stackCount: stacksRes?.data?.length || 0,
        photoCount: photosRes?.data?.length || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Stats yüklenemedi:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchRecentData = async () => {
    try {
      const [newsRes, stacksRes] = await Promise.all([
        newsService.getAllNews({ limit: 5 }).catch(() => ({ data: [] })),
        stackService.getAllStacks({ limit: 5 }).catch(() => ({ data: [] })),
      ]);

      setRecentNews(newsRes?.data?.slice(0, 5) || []);
      setRecentStacks(stacksRes?.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Son veriler yüklenemedi:', error);
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    }
  };

  return (
<<<<<<< HEAD
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Admin Paneli - Tam Kontrol
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="admin tabs">
          <Tab label="Haberler (RssNews)" icon={<Article />} iconPosition="start" />
          <Tab label="Yığınlar (Stacks)" icon={<Layers />} iconPosition="start" /> {/* ✅ Düzeltildi: Layers ikonu kullanıldı */}
          <Tab label="Resimler (Images)" icon={<Image />} iconPosition="start" />
        </Tabs>
        {renderContent()}
      </Paper>
    </Container>
=======
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🎛️ Admin Paneli</h1>
          <p className="text-gray-600 mt-2">Hoş geldiniz! Sistemdeki tüm içerikleri buradan yönetebilirsiniz.</p>
        </div>

        {/* İstatistik Kartları */}
        {stats.loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/news" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Haberler</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.newsCount}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <span className="text-4xl">📰</span>
                </div>
              </div>
              <div className="mt-4 text-blue-600 font-medium hover:underline">
                Haberleri Yönet →
              </div>
            </Link>

            <Link to="/admin/stacks" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Yığınlar</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.stackCount}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
              <div className="mt-4 text-green-600 font-medium hover:underline">
                Yığınları Yönet →
              </div>
            </Link>

            <Link to="/admin/photos" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Fotoğraflar</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{stats.photoCount}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-full">
                  <span className="text-4xl">📸</span>
                </div>
              </div>
              <div className="mt-4 text-purple-600 font-medium hover:underline">
                Fotoğrafları Yönet →
              </div>
            </Link>
          </div>
        )}

        {/* Hızlı Erişim */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Son Haberler */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📰 Son Haberler</h2>
              <Link to="/admin/news" className="text-blue-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>
            <div className="space-y-3">
              {recentNews.length > 0 ? (
                recentNews.map((news) => (
                  <div key={news.guid} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 text-sm">
                      {news.title?.substring(0, 60)}...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {news.category} • {new Date(news.pubDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Henüz haber yok</p>
              )}
            </div>
          </div>

          {/* Son Yığınlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📚 Son Yığınlar</h2>
              <Link to="/admin/stacks" className="text-green-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>
            <div className="space-y-3">
              {recentStacks.length > 0 ? (
                recentStacks.map((stack) => (
                  <div key={stack._id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 text-sm">
                      {stack.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        stack.status === 'approved' ? 'bg-green-100 text-green-800' :
                        stack.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stack.status === 'approved' ? 'Onaylandı' : 
                         stack.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                      </span>
                      <span>{stack.news?.length || 0} haber</span>
                      {stack.isFeatured && <span>⭐</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Henüz yığın yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/news" 
              className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <span className="text-3xl">➕</span>
              <div>
                <div className="font-medium text-gray-900">Yeni Haber Ekle</div>
                <div className="text-sm text-gray-600">Sisteme yeni haber ekleyin</div>
              </div>
            </Link>

            <Link to="/admin/stacks"
              className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
              <span className="text-3xl">📚</span>
              <div>
                <div className="font-medium text-gray-900">Yeni Yığın Oluştur</div>
                <div className="text-sm text-gray-600">Haber yığını oluşturun</div>
              </div>
            </Link>

            <Link to="/admin/photos"
              className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
              <span className="text-3xl">📤</span>
              <div>
                <div className="font-medium text-gray-900">Fotoğraf Yükle</div>
                <div className="text-sm text-gray-600">Yığınlara fotoğraf ekleyin</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  );
};

export default AdminDashboard;
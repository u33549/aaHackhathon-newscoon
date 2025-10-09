import React, { useState, useEffect } from 'react';
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
    }
  };

  return (
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
  );
};

export default AdminDashboard;
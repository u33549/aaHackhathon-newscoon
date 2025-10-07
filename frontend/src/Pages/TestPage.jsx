import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore,
  Send,
  Clear,
  Visibility,
  Delete,
  Edit,
  Add,
  Refresh
} from '@mui/icons-material';

// API servislerini import et
import {
  newsAPI,
  stacksAPI,
  imagesAPI,
  getAllNews,
  getAllStacks,
  getAllStackImages
} from '../services';

const TestPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  // Test sonuçlarını göster
  const showResult = (result, isError = false) => {
    if (isError) {
      setError(result);
      setResponse(null);
    } else {
      setResponse(result);
      setError(null);
    }
    setLoading(false);
  };

  // Form verilerini güncelle
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // API çağrısı yap
  const makeApiCall = async (apiFunction, params = {}) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await apiFunction(params);
      showResult(result);
    } catch (err) {
      showResult(err.message, true);
    }
  };

  // JSON görüntüleyici dialog
  const showJsonDialog = (data) => {
    setDialogContent(JSON.stringify(data, null, 2));
    setDialogOpen(true);
  };

  // News API Test Bileşeni
  const NewsApiTests = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        📰 News API Testleri
      </Typography>

      <Grid container spacing={2}>
        {/* Tüm haberleri getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Tüm Haberleri Getir
              </Typography>
              <TextField
                label="Limit"
                type="number"
                value={formData.newsLimit || 10}
                onChange={(e) => updateFormData('newsLimit', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Kategori"
                value={formData.newsCategory || ''}
                onChange={(e) => updateFormData('newsCategory', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                placeholder="gündem, teknoloji, spor..."
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Send />}
                onClick={() => makeApiCall(getAllNews, {
                  limit: formData.newsLimit || 10,
                  category: formData.newsCategory || undefined
                })}
                disabled={loading}
              >
                Test Et
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Haber oluştur */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Yeni Haber Oluştur
              </Typography>
              <TextField
                label="GUID"
                value={formData.newsGuid || `news-${Date.now()}`}
                onChange={(e) => updateFormData('newsGuid', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Başlık"
                value={formData.newsTitle || 'Test Haber Başlığı'}
                onChange={(e) => updateFormData('newsTitle', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Açıklama"
                value={formData.newsDescription || 'Test haber açıklaması'}
                onChange={(e) => updateFormData('newsDescription', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                multiline
                rows={2}
              />
              <TextField
                label="Link"
                value={formData.newsLink || 'https://example.com/news'}
                onChange={(e) => updateFormData('newsLink', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Kategori"
                value={formData.newsCreateCategory || 'test'}
                onChange={(e) => updateFormData('newsCreateCategory', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Add />}
                onClick={() => makeApiCall(newsAPI.create, {
                  guid: formData.newsGuid || `news-${Date.now()}`,
                  title: formData.newsTitle || 'Test Haber Başlığı',
                  description: formData.newsDescription || 'Test haber açıklaması',
                  link: formData.newsLink || 'https://example.com/news',
                  pubDate: new Date().toUTCString(),
                  category: formData.newsCreateCategory || 'test'
                })}
                disabled={loading}
              >
                Oluştur
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* GUID ile haber getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                GUID ile Haber Getir
              </Typography>
              <TextField
                label="GUID"
                value={formData.newsGetGuid || ''}
                onChange={(e) => updateFormData('newsGetGuid', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                placeholder="Haber GUID'ini girin"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Visibility />}
                onClick={() => makeApiCall(newsAPI.getByGuid, formData.newsGetGuid)}
                disabled={loading || !formData.newsGetGuid}
              >
                Getir
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Stacks API Test Bileşeni
  const StacksApiTests = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        📚 Stacks API Testleri
      </Typography>

      <Grid container spacing={2}>
        {/* Tüm yığınları getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Tüm Yığınları Getir
              </Typography>
              <TextField
                label="Limit"
                type="number"
                value={formData.stacksLimit || 10}
                onChange={(e) => updateFormData('stacksLimit', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Status"
                value={formData.stacksStatus || ''}
                onChange={(e) => updateFormData('stacksStatus', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                placeholder="pending, approved, rejected"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Send />}
                onClick={() => makeApiCall(getAllStacks, {
                  limit: formData.stacksLimit || 10,
                  status: formData.stacksStatus || undefined
                })}
                disabled={loading}
              >
                Test Et
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Yığın oluştur */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Yeni Yığın Oluştur
              </Typography>
              <TextField
                label="Başlık"
                value={formData.stackTitle || 'Test Haber Yığını'}
                onChange={(e) => updateFormData('stackTitle', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
              <TextField
                label="Açıklama"
                value={formData.stackDescription || 'Test yığın açıklaması'}
                onChange={(e) => updateFormData('stackDescription', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                multiline
                rows={2}
              />
              <TextField
                label="Etiketler (virgülle ayır)"
                value={formData.stackTags || 'test, api'}
                onChange={(e) => updateFormData('stackTags', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Add />}
                onClick={() => makeApiCall(stacksAPI.create, {
                  title: formData.stackTitle || 'Test Haber Yığını',
                  description: formData.stackDescription || 'Test yığın açıklaması',
                  tags: (formData.stackTags || 'test, api').split(',').map(tag => tag.trim()),
                  status: 'pending'
                })}
                disabled={loading}
              >
                Oluştur
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* ID ile yığın getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                ID ile Yığın Getir
              </Typography>
              <TextField
                label="Stack ID"
                value={formData.stackId || ''}
                onChange={(e) => updateFormData('stackId', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                placeholder="Yığın ID'sini girin"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Visibility />}
                onClick={() => makeApiCall(stacksAPI.getById, formData.stackId)}
                disabled={loading || !formData.stackId}
              >
                Getir
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Öne çıkan yığınlar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Öne Çıkan Yığınları Getir
              </Typography>
              <TextField
                label="Limit"
                type="number"
                value={formData.featuredLimit || 5}
                onChange={(e) => updateFormData('featuredLimit', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Send />}
                onClick={() => makeApiCall(stacksAPI.getFeatured, formData.featuredLimit || 5)}
                disabled={loading}
              >
                Test Et
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Images API Test Bileşeni
  const ImagesApiTests = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🖼️ Images API Testleri
      </Typography>

      <Grid container spacing={2}>
        {/* Tüm resimleri getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Tüm Resimleri Getir
              </Typography>
              <TextField
                label="Limit"
                type="number"
                value={formData.imagesLimit || 10}
                onChange={(e) => updateFormData('imagesLimit', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Send />}
                onClick={() => makeApiCall(getAllStackImages, {
                  limit: formData.imagesLimit || 10
                })}
                disabled={loading}
              >
                Test Et
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Stack ID ile resim getir */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Stack ID ile Resim Getir
              </Typography>
              <TextField
                label="Stack ID"
                value={formData.imageStackId || ''}
                onChange={(e) => updateFormData('imageStackId', e.target.value)}
                size="small"
                fullWidth
                margin="dense"
                placeholder="Yığın ID'sini girin"
              />
            </CardContent>
            <CardActions>
              <Button
                startIcon={<Visibility />}
                onClick={() => makeApiCall(imagesAPI.getByStackId, formData.imageStackId)}
                disabled={loading || !formData.imageStackId}
              >
                Getir
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        🧪 API Test Sayfası
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="News API" />
          <Tab label="Stacks API" />
          <Tab label="Images API" />
        </Tabs>
      </Box>

      {/* Test bölümleri */}
      <Box sx={{ mb: 4 }}>
        {activeTab === 0 && <NewsApiTests />}
        {activeTab === 1 && <StacksApiTests />}
        {activeTab === 2 && <ImagesApiTests />}
      </Box>

      {/* Loading göstergesi */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Sonuçlar bölümü */}
      {(response || error) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {error ? '❌ Hata' : '✅ Başarılı Yanıt'}
            </Typography>
            <Box>
              <IconButton onClick={() => showJsonDialog(response || error)}>
                <Visibility />
              </IconButton>
              <IconButton onClick={() => { setResponse(null); setError(null); }}>
                <Clear />
              </IconButton>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Yanıt Özeti:
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {Array.isArray(response?.data) && (
                  <Typography>
                    📊 {response.data.length} öğe bulundu
                  </Typography>
                )}
                {response?.success !== undefined && (
                  <Typography>
                    ✅ Success: {response.success ? 'true' : 'false'}
                  </Typography>
                )}
                {response?.message && (
                  <Typography>
                    💬 Mesaj: {response.message}
                  </Typography>
                )}
                {response?.data && !Array.isArray(response.data) && (
                  <Typography>
                    🔍 Tek öğe bulundu (ID: {response.data._id || response.data.guid || 'N/A'})
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* JSON Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>JSON Yanıt</DialogTitle>
        <DialogContent>
          <Box
            component="pre"
            sx={{
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          >
            {dialogContent}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestPage;

import React, { useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';

const LoaderTestPage = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Yükleniyor...');

  // Test senaryoları
  const testScenarios = [
    {
      title: 'Temel Loader',
      message: 'Yükleniyor...',
      description: 'Varsayılan loader mesajı ile'
    },
    {
      title: 'Haber Yükleme',
      message: 'Haberler yükleniyor...',
      description: 'Ana sayfa için haber yükleme loader\'ı'
    },
    {
      title: 'Haber Yığını Yükleme',
      message: 'Haber yığını yükleniyor...',
      description: 'Stack detay sayfası için loader'
    },
    {
      title: 'Haber Yığınları Yükleme',
      message: 'Haber yığınları yükleniyor...',
      description: 'Tüm haberler sayfası için loader'
    },
    {
      title: 'Haber Verisi Yükleme',
      message: 'Haber verisi yükleniyor...',
      description: 'Reading flow sayfası için loader'
    },
    {
      title: 'Veri İşleniyor',
      message: 'Veriler işleniyor...',
      description: 'Genel veri işleme loader\'ı'
    },
    {
      title: 'İçerik Hazırlanıyor',
      message: 'İçerik hazırlanıyor...',
      description: 'İçerik hazırlama loader\'ı'
    },
    {
      title: 'Kayıt Yapılıyor',
      message: 'Kayıt yapılıyor...',
      description: 'Kayıt işlemi loader\'ı'
    }
  ];

  const handleTestLoader = (message) => {
    setLoaderMessage(message);
    setShowLoader(true);

    // 3 saniye sonra loader'ı kapat
    setTimeout(() => {
      setShowLoader(false);
    }, 3000);
  };

  if (showLoader) {
    return <LoadingScreen message={loaderMessage} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Ana Sayfaya Dön
        </Button>

        <Typography variant="h3" component="h1" gutterBottom>
          🦝 Loader Test Sayfası
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Farklı loader mesajlarını test etmek için aşağıdaki butonları kullanın.
          Her test 3 saniye sürecek ve rakun animasyonunu gösterecektir.
        </Typography>
      </Box>

      {/* Test Grid */}
      <Grid container spacing={3}>
        {testScenarios.map((scenario, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  {scenario.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: 48 }}
                >
                  {scenario.description}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    fontStyle: 'italic',
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  "{scenario.message}"
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleTestLoader(scenario.message)}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Test Et
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Info Section */}
      <Box sx={{
        mt: 6,
        p: 3,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🎯 Loader Özellikleri
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Çember etrafında koşan rakun animasyonu (rakun1.png ↔ rakun2.png)
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Özelleştirilebilir mesaj metni
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Yumuşak animasyonlar ve geçişler
        </Typography>
        <Typography variant="body1">
          • Responsive tasarım (mobil ve masaüstü uyumlu)
        </Typography>
      </Box>

      {/* Manual Test Section */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Manuel Test
        </Typography>

        <Button
          variant="outlined"
          size="large"
          onClick={() => handleTestLoader('Özel test mesajı...')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderWidth: 2,
            borderRadius: 3,
            textTransform: 'none',
            '&:hover': {
              borderWidth: 2
            }
          }}
        >
          🚀 Hızlı Test (3 saniye)
        </Button>
      </Box>
    </Container>
  );
};

export default LoaderTestPage;

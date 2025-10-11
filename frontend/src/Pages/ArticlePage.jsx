import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  CardMedia
} from '@mui/material';
import {
  Close
} from '@mui/icons-material';

// Layout Components
import Header from '../components/layout/Header';

// Redux hooks
import { useUserXP, useUserLevel, useXPForNextLevel } from '../hooks/redux';

const ArticlePage = () => {
  const { stackId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state for header
  const totalCp = useUserXP();
  const level = useUserLevel();
  const cpForNextLevel = useXPForNextLevel();

  // URL state'den haber verisini al
  const newsData = location.state?.news;

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmeyen tarih';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Geri git
  const handleGoBack = () => {
    navigate(`/stack/${stackId}`);
  };

  // Eğer haber verisi yoksa
  if (!newsData) {
    return (
      <>
        <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="error">
            Haber Bulunamadı
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            İstediğiniz haber bulunamadı veya erişilemez durumda.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <Header totalCp={totalCp} level={level} cpForNextLevel={cpForNextLevel} />

      {/* Close Button */}
      <Box sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 1000
      }}>
        <IconButton
          onClick={handleGoBack}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            width: 44,
            height: 44,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.9)'
            }
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        <article>
          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 'bold',
              lineHeight: 1.2,
              mb: 2,
              color: 'text.primary'
            }}
          >
            {newsData.title}
          </Typography>

          {/* Date */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 3,
              fontSize: '1rem'
            }}
          >
            {formatDate(newsData.pubDate)}
          </Typography>

          {/* Image */}
          {newsData.image && (
            <Box sx={{ mb: 4 }}>
              <CardMedia
                component="img"
                image={newsData.image}
                alt={newsData.title}
                sx={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
            </Box>
          )}

          {/* News Text */}
          <Box sx={{ mb: 4 }}>
            {newsData.content ? (
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  color: 'text.primary'
                }}
                dangerouslySetInnerHTML={{ __html: newsData.content }}
              />
            ) : newsData.description ? (
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  color: 'text.primary'
                }}
              >
                {newsData.description}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Bu haber için detaylı içerik bulunmuyor.
              </Typography>
            )}
          </Box>
        </article>
      </Container>
    </Box>
  );
};

export default ArticlePage;

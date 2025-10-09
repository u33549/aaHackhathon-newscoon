import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Dialog,
  Fade,
  Backdrop,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Add,
  ThumbUp,
  Share,
  BookmarkBorder,
  AccessTime,
  Visibility,
  Star,
  TrendingUp,
  Category,
  Close
} from '@mui/icons-material';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useSelectedStack,
  useStacksLoading,
  useStacksError
} from '../hooks/redux';
import {
  fetchStackById,
  setSelectedStack
} from '../store/slices/stackSlice';

// Netflix benzeri tanıtım sayfası
const StackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const selectedStack = useSelectedStack();
  const loading = useStacksLoading();
  const error = useStacksError();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playTrailer, setPlayTrailer] = useState(false);

  // Component mount olduğunda stack verilerini getir
  useEffect(() => {
    if (id) {
      dispatch(fetchStackById(id));
    }

    // Cleanup function
    return () => {
      dispatch(setSelectedStack(null));
    };
  }, [dispatch, id]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmeyen tarih';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get stack image
  const getStackImage = (stack) => {
    if (stack?.imageUrl) return stack.imageUrl;
    if (stack?.photoUrl) return stack.photoUrl;
    if (stack?.news && stack.news.length > 0) {
      const firstNews = stack.news[stack.news.length - 1];
      if (typeof firstNews === 'object' && firstNews.image) {
        return firstNews.image;
      }
    }
    return 'https://via.placeholder.com/1920x1080';
  };

  // News click handler
  const handleNewsClick = (newsGuid) => {
    navigate(`/article/${newsGuid}`);
  };

  // Close page
  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2, width: 300 }} />
          <Typography variant="h6" color="text.secondary">
            Haber yığını yükleniyor...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !selectedStack) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="error">
          Haber Yığını Bulunamadı
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error || 'İstediğiniz haber yığını bulunamadı veya erişilemez durumda.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
        >
          Ana Sayfaya Dön
        </Button>
      </Container>
    );
  }

  const stack = selectedStack;
  const heroImage = getStackImage(stack);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section - Netflix tarzı */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '80vh' },
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden'
        }}
      >
        {/* Dark gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }}
        />

        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 3,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.8)'
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: 8 }}>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              {/* Category */}
              <Chip
                label={stack.mainCategory?.charAt(0).toUpperCase() + stack.mainCategory?.slice(1) || 'Genel'}
                color="primary"
                sx={{ mb: 2, fontWeight: 'bold' }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  lineHeight: 1.1
                }}
              >
                {stack.title}
              </Typography>

              {/* Stats */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#ffd700', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {stack.xp || 0} CP
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {stack.viewCount || 0} görüntülenme
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Category sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {stack.news?.length || 0} haber
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {formatDate(stack.createdAt)}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  maxWidth: '600px',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {stack.description || 'Bu haber yığını için açıklama bulunmuyor.'}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => setPlayTrailer(true)}
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }
                  }}
                >
                  Haberleri İncele
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Add />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Listeme Ekle
                </Button>

                <IconButton
                  sx={{
                    border: '2px solid rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <ThumbUp />
                </IconButton>

                <IconButton
                  sx={{
                    border: '2px solid rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* News List */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Bu Yığındaki Haberler
            </Typography>

            {stack.news && stack.news.length > 0 ? (
              <Box sx={{ mb: 4 }}>
                {stack.news.map((news, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => {
                      if (typeof news === 'object' && news.guid) {
                        handleNewsClick(news.guid);
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mt: 0.5 }}>
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {typeof news === 'object' ? news.title : `Haber ${index + 1}`}
                          </Typography>
                          {typeof news === 'object' && news.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {news.description}
                            </Typography>
                          )}
                          {typeof news === 'object' && news.pubDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(news.pubDate)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Bu yığında henüz haber bulunmuyor.
              </Typography>
            )}

            {/* Tags */}
            {stack.tags && stack.tags.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Etiketler
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {stack.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Stack Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Yığın Bilgileri
                  </Typography>

                  <List dense>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Kategori"
                        secondary={stack.mainCategory || 'Genel'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Oluşturulma Tarihi"
                        secondary={formatDate(stack.createdAt)}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Son Güncelleme"
                        secondary={formatDate(stack.updatedAt)}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Durum"
                        secondary={
                          <Chip
                            label={stack.status === 'approved' ? 'Onaylandı' : 'Beklemede'}
                            size="small"
                            color={stack.status === 'approved' ? 'success' : 'warning'}
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hızlı İşlemler
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<BookmarkBorder />}
                      fullWidth
                    >
                      Favorilere Ekle
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      fullWidth
                    >
                      Paylaş
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      fullWidth
                    >
                      Benzer Yığınlar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* News Preview Dialog */}
      <Dialog
        open={playTrailer}
        onClose={() => setPlayTrailer(false)}
        maxWidth="lg"
        fullWidth
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.8)' },
            timeout: 500,
          },
        }}
      >
        <Fade in={playTrailer}>
          <Box sx={{ position: 'relative', backgroundColor: 'background.paper' }}>
            <IconButton
              onClick={() => setPlayTrailer(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}
            >
              <Close />
            </IconButton>

            <Box sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                {stack.title} - Haberler
              </Typography>

              {stack.news && stack.news.length > 0 ? (
                <Grid container spacing={2}>
                  {stack.news.slice(0, 6).map((news, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.02)' }
                        }}
                        onClick={() => {
                          if (typeof news === 'object' && news.guid) {
                            setPlayTrailer(false);
                            handleNewsClick(news.guid);
                          }
                        }}
                      >
                        {typeof news === 'object' && news.image && (
                          <CardMedia
                            component="img"
                            height="120"
                            image={news.image}
                            alt={news.title}
                          />
                        )}
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {typeof news === 'object' ? news.title : `Haber ${index + 1}`}
                          </Typography>
                          {typeof news === 'object' && news.description && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {news.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Bu yığında henüz haber bulunmuyor.
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Dialog>
    </Box>
  );
};

export default StackDetailPage;

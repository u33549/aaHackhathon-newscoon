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
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Add,
  Share,
  AccessTime,
  Visibility,
  Star,
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
          height: { xs: '60vh', sm: '70vh', md: '80vh' },
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

        {/* Close and Share buttons */}
        <Box sx={{
          position: 'absolute',
          top: { xs: 16, md: 20 },
          right: { xs: 16, md: 20 },
          zIndex: 3,
          display: 'flex',
          gap: { xs: 0.5, md: 1 }
        }}>
          <IconButton
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)'
              }
            }}
          >
            <Share fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>

          <IconButton
            onClick={handleClose}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)'
              }
            }}
          >
            <Close fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </Box>

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: { xs: 4, md: 8 } }}>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              {/* Category */}
              <Chip
                label={stack.mainCategory?.charAt(0).toUpperCase() + stack.mainCategory?.slice(1) || 'Genel'}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  mb: { xs: 1.5, md: 2 },
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  lineHeight: { xs: 1.2, md: 1.1 }
                }}
              >
                {stack.title}
              </Typography>

              {/* Stats */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 3 },
                mb: { xs: 2, md: 3 },
                flexWrap: 'wrap'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#ffd700', fontSize: { xs: 18, md: 20 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    {stack.xp || 0} CP
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: 18, md: 20 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    {stack.viewCount || 0} görüntülenme
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Category sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: 18, md: 20 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    {stack.news?.length || 0} haber
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  {formatDate(stack.createdAt)}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: { xs: 3, md: 4 },
                  maxWidth: { xs: '100%', md: '600px' },
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: { xs: 1.5, md: 1.6 },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  display: { xs: '-webkit-box', md: 'block' },
                  WebkitLineClamp: { xs: 3, md: 'none' },
                  WebkitBoxOrient: { xs: 'vertical', md: 'unset' },
                  overflow: { xs: 'hidden', md: 'visible' }
                }}
              >
                {stack.description || 'Bu haber yığını için açıklama bulunmuyor.'}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{
                display: 'flex',
                gap: { xs: 1.5, md: 2 },
                flexWrap: 'wrap',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  startIcon={<PlayArrow />}
                  onClick={() => setPlayTrailer(true)}
                  fullWidth={isMobile}
                  sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }
                  }}
                >
                  Haberleri İncele
                </Button>

                <Button
                  variant="outlined"
                  size={isMobile ? 'medium' : 'large'}
                  startIcon={<Add />}
                  fullWidth={isMobile}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontWeight: 'bold',
                    px: { xs: 3, md: 3 },
                    py: { xs: 1.2, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Takip Et
                </Button>

                {/* Tags - Like butonunun yerine */}
                {stack.tags && stack.tags.length > 0 && (
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 0.75, md: 1 },
                    mt: { xs: 1, md: 2 },
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    {stack.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.4)',
                          fontSize: { xs: '0.7rem', md: '0.8rem' },
                          fontWeight: 500,
                          height: { xs: 24, md: 28 },
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            borderColor: 'rgba(255,255,255,0.6)',
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                    {stack.tags.length > (isMobile ? 2 : 3) && (
                      <Chip
                        label={`+${stack.tags.length - (isMobile ? 2 : 3)} daha`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          fontSize: { xs: '0.65rem', md: '0.75rem' },
                          fontWeight: 400,
                          height: { xs: 24, md: 28 },
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Main Content - Full Width */}
        <Grid container>
          <Grid item xs={12}>
            {/* News List */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Bu Yığındaki Haberler
            </Typography>

            {stack.news && stack.news.length > 0 ? (
              <Box sx={{ mb: 4, px: { xs: 2, sm: 0 } }}>
                {stack.news.map((news, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: { xs: 1.5, md: 2 },
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
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: { xs: 1.5, md: 2 },
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <Avatar sx={{
                          bgcolor: 'primary.main',
                          mt: { xs: 0, sm: 0.5 },
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          alignSelf: { xs: 'flex-start', sm: 'flex-start' }
                        }}>
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                              lineHeight: { xs: 1.3, md: 1.4 },
                              mb: { xs: 1, md: 1.5 }
                            }}
                          >
                            {typeof news === 'object' ? news.title : `Haber ${index + 1}`}
                          </Typography>
                          {typeof news === 'object' && news.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: { xs: 1, md: 1 },
                                fontSize: { xs: '0.875rem', md: '0.875rem' },
                                lineHeight: 1.5,
                                display: { xs: '-webkit-box', md: 'block' },
                                WebkitLineClamp: { xs: 2, md: 'none' },
                                WebkitBoxOrient: { xs: 'vertical', md: 'unset' },
                                overflow: { xs: 'hidden', md: 'visible' }
                              }}
                            >
                              {news.description}
                            </Typography>
                          )}
                          {typeof news === 'object' && news.pubDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', md: '0.75rem' } }}
                              >
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
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  px: { xs: 2, sm: 0 },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Bu yığında henüz haber bulunmuyor.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* News Preview Dialog */}
      <Dialog
        open={playTrailer}
        onClose={() => setPlayTrailer(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
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
          <Box sx={{
            position: 'relative',
            backgroundColor: 'background.paper',
            height: { xs: '100vh', md: 'auto' },
            overflow: { xs: 'auto', md: 'visible' }
          }}>
            <IconButton
              onClick={() => setPlayTrailer(false)}
              sx={{
                position: 'absolute',
                top: { xs: 16, md: 8 },
                right: { xs: 16, md: 8 },
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 }
              }}
            >
              <Close fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>

            <Box sx={{
              p: { xs: 3, sm: 4, md: 4 },
              pt: { xs: 5, md: 4 },
              minHeight: { xs: '100vh', md: 'auto' }
            }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  mb: { xs: 2, md: 3 },
                  pr: { xs: 6, md: 0 }
                }}
              >
                {stack.title} - Haberler
              </Typography>

              {stack.news && stack.news.length > 0 ? (
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {stack.news.slice(0, 6).map((news, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.02)' },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
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
                            height={isMobile ? "160" : "120"}
                            image={news.image}
                            alt={news.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                        <CardContent sx={{
                          flex: 1,
                          p: { xs: 1.5, md: 2 },
                          '&:last-child': { pb: { xs: 1.5, md: 2 } }
                        }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              fontWeight: 600,
                              lineHeight: 1.3,
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {typeof news === 'object' ? news.title : `Haber ${index + 1}`}
                          </Typography>
                          {typeof news === 'object' && news.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.8rem', md: '0.875rem' },
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: { xs: 2, md: 1 },
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
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

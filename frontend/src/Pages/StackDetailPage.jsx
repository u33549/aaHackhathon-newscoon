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
  useStacksError,
  useCurrentlyReading,
  useReadingProgress
} from '../hooks/redux';
import {
  fetchStackById,
  setSelectedStack
} from '../store/slices/stackSlice';
import {
  startReadingStack
} from '../store/slices/userSlice';

// Components
import ShareModal from '../components/modals/ShareModal';
import LoadingScreen from '../components/common/LoadingScreen';

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
  const currentlyReading = useCurrentlyReading();
  const readingProgress = useReadingProgress();

  const [playTrailer, setPlayTrailer] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

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

  // Check if this stack is already being read or completed
  const getStackReadingStatus = () => {
    if (!selectedStack) return { status: 'not_started', progress: 0 };

    // Check if completed
    const completedStack = readingProgress.readStacks.find(s => s.stackId === selectedStack._id);
    if (completedStack) {
      return {
        status: 'completed',
        progress: 100,
        completedAt: completedStack.completedAt,
        xpEarned: completedStack.xpEarned
      };
    }

    // Check if currently reading
    const currentStack = currentlyReading.find(s => s.stackId === selectedStack._id);
    if (currentStack) {
      // lastReadIndex kullanarak progress hesapla
      const totalNews = currentStack.totalNews || selectedStack.news?.length || 0;
      const readCount = currentStack.lastReadIndex || 0;

      const progress = totalNews > 0
        ? Math.floor((readCount / totalNews) * 100)
        : 0;

      // Eğer hiç okunmamışsa (progress = 0), 'not_started' döndür
      if (progress === 0) {
        return { status: 'not_started', progress: 0 };
      }

      return {
        status: 'reading',
        progress: Math.max(0, progress), // Negatif değerleri engelle
        readNews: readCount,
        totalNews: totalNews
      };
    }

    return { status: 'not_started', progress: 0 };
  };

  const stackStatus = getStackReadingStatus();

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


  // Close page
  const handleClose = () => {
    navigate('/');
  };

  // Start reading handler
  const handleStartReading = () => {
    if (!selectedStack) return;

    // Stack okumaya başla
    dispatch(startReadingStack({
      stackId: selectedStack._id,
      totalNews: selectedStack.news?.length || 0
    }));

    // Reading flow page'e git
    navigate(`/stack/${id}/read`);
  };

  // Continue reading handler
  const handleContinueReading = () => {
    navigate(`/stack/${id}/read`);
  };

  // Handle news click - yeni eklendi
  const handleNewsClick = (news, index) => {
    navigate(`/stack/${id}/article/${index}`, {
      state: {
        news: news,
        stackTitle: stack.title,
        stackId: id
      }
    });
  };

  if (loading) {
    return (
      <LoadingScreen message="Haber yığını yükleniyor..." />
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
          height: { xs: '45vh', sm: '55vh', md: '65vh' },
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
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 3,
          display: 'flex',
          gap: { xs: 0.25, sm: 0.5, md: 0.75 }
        }}>
          <IconButton
            onClick={() => setShareModalOpen(true)}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              width: { xs: 32, sm: 36, md: 44 },
              height: { xs: 32, sm: 36, md: 44 },
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
              width: { xs: 32, sm: 36, md: 44 },
              height: { xs: 32, sm: 36, md: 44 },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)'
              }
            }}
          >
            <Close fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </Box>

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: { xs: 2, sm: 3, md: 6 } }}>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              {/* Category */}
              <Chip
                label={stack.mainCategory?.charAt(0).toUpperCase() + stack.mainCategory?.slice(1) || 'Genel'}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  mb: { xs: 0.75, sm: 1, md: 1.5 },
                  fontWeight: 'bold',
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' }
                }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: { xs: 0.75, sm: 1, md: 1.5 },
                  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  lineHeight: { xs: 1.05, sm: 1.1, md: 1.1 }
                }}
              >
                {stack.title}
              </Typography>

              {/* Reading Progress */}
              {stackStatus.status !== 'not_started' && (
                <Box sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.5 }, mb: 0.75 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {stackStatus.status === 'completed' ? '✅ Tamamlandı' : '📖 Devam Ediyor'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      %{stackStatus.progress}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stackStatus.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stackStatus.status === 'completed' ? '#4CAF50' : '#FFD700',
                        borderRadius: 3
                      }
                    }}
                  />
                  {stackStatus.status === 'reading' && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        mt: 0.5,
                        display: 'block'
                      }}
                    >
                      {stackStatus.readNews}/{stackStatus.totalNews} haber okundu
                    </Typography>
                  )}
                </Box>
              )}

              {/* Stats */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5, md: 2 },
                mb: { xs: 1, sm: 1.5, md: 2 },
                flexWrap: 'wrap'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <Star sx={{ color: '#ffd700', fontSize: { xs: 14, sm: 16, md: 18 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                    }}
                  >
                    {stack.xp || 0} CP
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <Visibility sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: 14, sm: 16, md: 18 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                    }}
                  >
                    {stack.viewCount || 0} görüntülenme
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <Category sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: 14, sm: 16, md: 18 } }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                    }}
                  >
                    {stack.news?.length || 0} haber
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
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
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  maxWidth: { xs: '100%', md: '600px' },
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' },
                  lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  display: { xs: '-webkit-box', md: 'block' },
                  WebkitLineClamp: { xs: 3, sm: 4, md: 'none' },
                  WebkitBoxOrient: { xs: 'vertical', md: 'unset' },
                  overflow: { xs: 'hidden', md: 'visible' }
                }}
              >
                {stack.description || 'Bu haber yığını için açıklama bulunmuyor.'}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{
                display: 'flex',
                gap: { xs: 0.75, sm: 1, md: 1.5 },
                flexWrap: 'wrap',
                alignItems: 'center',
                flexDirection: 'row'
              }}>
                {stackStatus.status === 'not_started' && (
                  <Button
                    variant="contained"
                    size={isMobile ? 'large' : 'large'}
                    startIcon={<PlayArrow />}
                    onClick={handleStartReading}
                    sx={{
                      backgroundColor: '#FFD700',
                      color: '#000',
                      fontWeight: 'bold',
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 1, sm: 1.2, md: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      flex: { xs: '1 1 auto', sm: '0 0 auto' },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      height: { xs: 44, sm: 48, md: 52 },
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        backgroundColor: '#FFA500',
                        boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)'
                      }
                    }}
                  >
                    Kaydırmaya Başla
                  </Button>
                )}

                {stackStatus.status === 'reading' && (
                  <Button
                    variant="contained"
                    size={isMobile ? 'large' : 'large'}
                    startIcon={<PlayArrow />}
                    onClick={handleContinueReading}
                    sx={{
                      backgroundColor: '#FF9800',
                      color: '#000',
                      fontWeight: 'bold',
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 1, sm: 1.2, md: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      flex: { xs: '1 1 auto', sm: '0 0 auto' },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      height: { xs: 44, sm: 48, md: 52 },
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                      '&:hover': {
                        backgroundColor: '#F57C00',
                        boxShadow: '0 6px 16px rgba(255, 152, 0, 0.4)'
                      }
                    }}
                  >
                    Okumaya Devam Et
                  </Button>
                )}

                {stackStatus.status === 'completed' && (
                  <Button
                    variant="contained"
                    size={isMobile ? 'large' : 'large'}
                    startIcon={<PlayArrow />}
                    onClick={handleContinueReading}
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontWeight: 'bold',
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 1, sm: 1.2, md: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      flex: { xs: '1 1 auto', sm: '0 0 auto' },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      height: { xs: 44, sm: 48, md: 52 },
                      borderRadius: 1,
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.8)',
                        boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)'
                      }
                    }}
                  >
                    Tekrar Oku
                  </Button>
                )}


                {/* Tags */}
                {stack.tags && stack.tags.length > 0 && (
                  <Box sx={{
                    display: 'flex',
                    flexWrap: showAllTags ? 'nowrap' : 'wrap',
                    gap: { xs: 0.25, sm: 0.5, md: 0.75 },
                    mt: { xs: 0.75, sm: 0.75, md: 0 },
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                    ...(showAllTags && {
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      // Scrollbar'ı gizle
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      // Firefox için scrollbar gizle
                      scrollbarWidth: 'none',
                      // IE ve Edge için scrollbar gizle
                      msOverflowStyle: 'none',
                    })
                  }}>
                    {showAllTags
                      ? stack.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.4)',
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                            fontWeight: 500,
                            height: { xs: 20, sm: 22, md: 26 },
                            backdropFilter: 'blur(10px)',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              borderColor: 'rgba(255,255,255,0.6)',
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))
                      : stack.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.4)',
                            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                            fontWeight: 500,
                            height: { xs: 20, sm: 22, md: 26 },
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              borderColor: 'rgba(255,255,255,0.6)',
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))
                    }
                    {!showAllTags && stack.tags.length > (isMobile ? 2 : 3) && (
                      <Chip
                        label={`+${stack.tags.length - (isMobile ? 2 : 3)} daha`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.7rem' },
                          fontWeight: 400,
                          height: { xs: 20, sm: 22, md: 26 },
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setShowAllTags(true)}
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
                    onClick={() => handleNewsClick(news, index)} // Haber kartına tıklandığında
                  >
                    <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1, md: 1.5 }
                      }}>
                        {/* İndeks ve Title - Aynı satırda */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 0.75, md: 1 }
                        }}>
                          <Avatar sx={{
                            bgcolor: 'primary.main',
                            width: { xs: 28, md: 36 },
                            height: { xs: 28, md: 36 },
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                              lineHeight: { xs: 1.3, md: 1.4 },
                              flex: 1,
                              textAlign: 'left'
                            }}
                          >
                            {typeof news === 'object' ? news.title : `Haber ${index + 1}`}
                          </Typography>
                        </Box>
                        
                        {/* Açıklama - Alt satırda */}
                        {typeof news === 'object' && news.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: { xs: 1, md: 1 },
                              fontSize: { xs: '0.875rem', md: '0.875rem' },
                              lineHeight: 1.5,
                              textAlign: 'left'
                            }}
                          >
                            {news.description}
                          </Typography>
                        )}
                        
                        {/* Tarih - Alt satırda */}
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

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={stack.title}
        description={stack.description}
        url={window.location.href}
        image={heroImage}
      />
    </Box>
  );
};

export default StackDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { 
  Close,
  KeyboardArrowDown,
  EmojiEvents,
  Visibility,
  Star,
  Category
} from '@mui/icons-material';
import { useAppDispatch, useSelectedStack } from '../hooks/redux';
import { fetchStackById } from '../store/slices/stackSlice';

// Görüntülenme sayısını kısaltılmış formatta göstermek için yardımcı fonksiyon
const formatViewCount = (count) => {
  if (!count || count === 0) return '0';

  const num = parseInt(count);
  if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  return num.toString();
};

// Kronolojik haber parçalarını simüle eden data
const generateChronologicalSteps = (stack) => {
  if (!stack || !stack.news || stack.news.length === 0) return [];

  const steps = [];
  
  // Stack'in resim verilerini al - önce stack'in kendi resmi, sonra ilk haberin resmi
  const getStackImage = (stack) => {
    // Önce stack'in kendi resim verilerini kontrol et
    if (stack?.imageUrl) return stack.imageUrl;
    if (stack?.photoUrl) return stack.photoUrl;
    // Stack'teki son haberin resmini kullan
    if (stack?.news && stack.news.length > 0) {
      const lastNews = stack.news[stack.news.length - 1];
      if (typeof lastNews === 'object' && lastNews.image) {
        return lastNews.image;
      }
    }
    return 'https://via.placeholder.com/1920x1080';
  };

  // İlk step - Giriş (Stack'in kendi bilgileriyle)
  steps.push({
    id: 'intro',
    type: 'intro',
    title: stack.title,
    content: stack.description || 'Bu haber yığınında kronolojik olarak gelişen olayları inceleceğiz.',
    image: getStackImage(stack), // Stack'in kendi resmi
    timestamp: null,
    // Stack verileri
    stackData: {
      newsCount: stack.news?.length || 0,
      viewCount: stack.viewCount || 0,
      cp: stack.xp || 0,
      category: stack.mainCategory || 'genel',
      createdAt: stack.createdAt,
      tags: stack.tags || []
    }
  });

  // Her haber için kronolojik step oluştur
  stack.news.forEach((news, index) => {
    const newsItem = typeof news === 'object' ? news : { title: `Haber ${index + 1}`, description: 'Haber içeriği' };
    
    steps.push({
      id: `step-${index}`,
      type: 'news',
      title: newsItem.title || `Gelişme ${index + 1}`,
      content:  newsItem.newstext || newsItem.description ||'Bu gelişmede önemli detaylar ortaya çıktı.',
      image: newsItem.image || getStackImage(stack),
      timestamp: newsItem.pubDate || new Date().toISOString(),
      stepNumber: index + 1,
      totalSteps: stack.news.length
    });
  });

  // Son step - Tebrik
  steps.push({
    id: 'completion',
    type: 'completion',
    title: 'Tebrikler!',
    content: `${stack.title} haber yığınını başarıyla tamamladınız!`,
    image: null,
    reward: {
      cp: stack.xp || 50,
      badge: null
    }
  });

  return steps;
};

const ReadingFlowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const selectedStack = useSelectedStack();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [steps, setSteps] = useState([]);

  // Touch/Scroll event handling için state'ler
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Stack verisini yükle
  useEffect(() => {
    if (id && (!selectedStack || selectedStack._id !== id)) {
      dispatch(fetchStackById(id));
    }
  }, [id, selectedStack, dispatch]);

  // Steps oluştur
  useEffect(() => {
    if (selectedStack) {
      const chronologicalSteps = generateChronologicalSteps(selectedStack);
      setSteps(chronologicalSteps);
    }
  }, [selectedStack]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setIsScrolling(true);

      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
        setTimeout(() => setIsScrolling(false), 500);
      }, 300);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setIsScrolling(true);

      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
        setTimeout(() => setIsScrolling(false), 500);
      }, 300);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Wheel event listener (Mouse scroll)
  useEffect(() => {
    const handleWheel = (e) => {
      if (isTransitioning || isScrolling) return;

      // Scroll direction check
      if (e.deltaY > 0) {
        // Scroll down - next step
        handleNextStep();
      } else if (e.deltaY < 0) {
        // Scroll up - previous step (if needed)
        handlePrevStep();
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (isTransitioning) return;

      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTransitioning, isScrolling, currentStep, steps.length, handleNextStep, handlePrevStep, handleClose]);

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isDownSwipe = distance > 50; // Minimum 50px swipe
    const isUpSwipe = distance < -50;

    if (isDownSwipe) {
      handleNextStep();
    }
    if (isUpSwipe) {
      handlePrevStep();
    }
  };

  if (!selectedStack || steps.length === 0) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}>
        <Typography variant="h6">Haber yükleniyor...</Typography>
      </Box>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        touchAction: 'pan-y' // Vertical scrolling için
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)'
          }
        }}
      >
        <Close />
      </IconButton>

      {/* Progress Indicator */}
      {currentStepData.type !== 'intro' && currentStepData.type !== 'completion' && (
        <Box sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="caption">
            {currentStepData.stepNumber}/{currentStepData.totalSteps}
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Fade in={!isTransitioning} timeout={500}>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: currentStepData.type === 'news' ? 'background.default' : '#000'
        }}>
          {/* Background Image - Sadece intro ve completion için */}
          {currentStepData.image && currentStepData.type !== 'news' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${currentStepData.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: currentStepData.type === 'completion' ? 'blur(5px)' : 'none'
              }}
            />
          )}

          {/* Gradient Overlay - Sadece intro ve completion için */}
          {currentStepData.type !== 'news' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: currentStepData.type === 'completion'
                  ? 'linear-gradient(135deg, rgba(76,175,80,0.9) 0%, rgba(56,142,60,0.95) 100%)'
                  : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 1
              }}
            />
          )}

          {/* Content */}
          <Box sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: currentStepData.type === 'news' ? 'flex-start' : 'flex-end',
            alignItems: 'flex-start',
            padding: { xs: 3, md: 6 },
            paddingBottom: { xs: 12, md: 15 }, // Scroll butonu için alt boşluk
            paddingTop: currentStepData.type === 'news' ? { xs: 8, md: 10 } : { xs: 3, md: 6 },
            textAlign: 'left',
            overflowY: currentStepData.type === 'news' ? 'auto' : 'hidden'
          }}>
            {/* Intro Page */}
            {currentStepData.type === 'intro' && (
              <>
                {/* Kategori Chip - Sol üstte */}
                {currentStepData.stackData && (
                  <Chip
                    label={currentStepData.stackData.category?.charAt(0).toUpperCase() + currentStepData.stackData.category?.slice(1) || 'Genel'}
                    sx={{
                      backgroundColor: '#FFD700',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      height: { xs: 32, md: 36 },
                      borderRadius: 2,
                      mb: { xs: 2, md: 3 },
                      px: { xs: 2, md: 3 }
                    }}
                  />
                )}

                {/* Ana Başlık - Daha geniş alan */}
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', md: '95%' }, // Mobilde %100, desktop'ta %95
                    lineHeight: 1.2,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                    textAlign: 'left'
                  }}
                >
                  {currentStepData.title}
                </Typography>

                {/* Metrikler - Tam genişlik kullanım */}
                {currentStepData.stackData && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    mb: { xs: 2, md: 3 },
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    width: '100%' // Tam genişlik
                  }}>
                    {/* CP */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ color: '#FFD700', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {currentStepData.stackData.cp} CP
                      </Typography>
                    </Box>

                    {/* Görüntülenme */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {formatViewCount(currentStepData.stackData.viewCount)} görüntülenme
                      </Typography>
                    </Box>

                    {/* Haber Sayısı */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Category sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {currentStepData.stackData.newsCount} haber
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Açıklama Metni - Çok daha geniş alan */}
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: { xs: 3, md: 4 },
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', sm: '95%', md: '90%' }, // Responsive genişlik
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    textAlign: 'left',
                    width: '100%' // Container'ın tam genişliğini kullan
                  }}
                >
                  {currentStepData.content}
                </Typography>
              </>
            )}

            {/* News Step - Yeni tasarım */}
            {currentStepData.type === 'news' && (
              <Box sx={{
                maxWidth: '100%',
                width: '100%',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Haber Fotoğrafı - Üstte dikdörtgen */}
                {currentStepData.image && (
                  <Box
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250, md: 300 },
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: { xs: 3, md: 4 },
                      boxShadow: 3
                    }}
                  >
                    <img
                      src={currentStepData.image}
                      alt={currentStepData.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </Box>
                )}

                {/* Haber Başlığı */}
                <Typography
                  variant={isMobile ? 'h4' : 'h2'}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    lineHeight: 1.3
                  }}
                >
                  {currentStepData.title}
                </Typography>

                {/* Tarih Bilgisi */}
                {currentStepData.timestamp && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      mb: { xs: 2, md: 3 },
                      display: 'block',
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}
                  >
                    {new Date(currentStepData.timestamp).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                )}

                {/* Haber İçeriği */}
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 400,
                    mb: { xs: 4, md: 6 }
                  }}
                >
                  {currentStepData.content}
                </Typography>

                {/* Alt boşluk - scroll için */}
                <Box sx={{ height: { xs: 100, md: 120 } }} />
              </Box>
            )}

            {/* Completion Page */}
            {currentStepData.type === 'completion' && (
              <>
                <EmojiEvents sx={{ fontSize: 80, color: 'white', mb: 3 }} />
                
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 3,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                  }}
                >
                  {currentStepData.title}
                </Typography>
                
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: 4,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', md: '90%' } // Completion için de daha geniş
                  }}
                >
                  {currentStepData.content}
                </Typography>

                {currentStepData.reward && (
                  <Box sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: 3,
                    borderRadius: 3,
                    mb: 4
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Kazandığınız Ödüller
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                      +{currentStepData.reward.cp} CP
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Permanent Scroll Animation - Always at bottom */}
          {currentStepData.type !== 'completion' && (
            <Box sx={{
              position: 'absolute',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3
            }}>
              <Box
                onClick={handleNextStep}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: 'bounce 2s infinite',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.1)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  }
                }}
              >
                <KeyboardArrowDown
                  sx={{
                    color: 'white',
                    fontSize: 32,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Fade>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Box>
  );
};

export default ReadingFlowPage;

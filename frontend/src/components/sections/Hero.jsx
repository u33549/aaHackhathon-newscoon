import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { usePopularStacks, useLatestStacks, useStacksLoading } from '../../hooks/redux';
import { fetchPopularStacks, fetchLatestStacks } from '../../store/slices/stackSlice';
import { categoryColors } from '../../constants';

const Hero = ({ onStackClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const heroRef = useRef(null);

  const popularStacks = usePopularStacks();
  const latestStacks = useLatestStacks();
  const loading = useStacksLoading();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');

  // Touch/Swipe için state'ler
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Sayfa yüklendiğinde stack'leri getir
  useEffect(() => {
    if (popularStacks.length === 0) {
      dispatch(fetchPopularStacks(20));
    }
    if (latestStacks.length === 0) {
      dispatch(fetchLatestStacks(20));
    }
  }, [dispatch, popularStacks.length, latestStacks.length]);

  // Her kategoriden 2 stack seç
  const heroStacks = useMemo(() => {
    const allStacks = [...popularStacks, ...latestStacks];

    const stacksByCategory = allStacks.reduce((acc, stack) => {
      const category = stack.category || stack.mainCategory || 'gundem';

      if (!acc[category]) {
        acc[category] = [];
      }

      const exists = acc[category].some(s => s._id === stack._id);
      if (!exists && acc[category].length < 2) {
        acc[category].push(stack);
      }

      return acc;
    }, {});

    return Object.values(stacksByCategory).flat().slice(0, 5); // 5 slide
  }, [popularStacks, latestStacks]);

  // Auto slide
  useEffect(() => {
    if (heroStacks.length > 1) {
      const interval = setInterval(() => {
        setSlideDirection('left');
        setCurrentSlide((prev) => (prev + 1) % heroStacks.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [heroStacks.length]);

  // Swipe için minimum mesafe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // Önceki touch'ı temizle
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Sol kaydırma - sonraki haber
      nextSlide();
    }
    if (isRightSwipe) {
      // Sağ kaydırma - önceki haber
      prevSlide();
    }
  };

  const nextSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev + 1) % heroStacks.length);
  };

  const prevSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev - 1 + heroStacks.length) % heroStacks.length);
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? 'left' : 'right');
    setCurrentSlide(index);
  };

  const handleSlideClick = (stack) => {
    if (onStackClick) {
      onStackClick(stack._id);
    }
  };

  if (loading && heroStacks.length === 0) {
    return (
      <Box sx={{
        height: isMobile ? '50vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Typography variant="h4" color="white" fontWeight="bold">
          Haberler Yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (heroStacks.length === 0) {
    return (
      <Box sx={{
        height: isMobile ? '50vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Typography variant="h4" color="white" fontWeight="bold">
          Henüz haber yığını bulunmuyor
        </Typography>
      </Box>
    );
  }

  const currentStack = heroStacks[currentSlide];
  const category = currentStack?.category || currentStack?.mainCategory || 'gundem';
  const categoryColor = categoryColors[category] || '#3B82F6';

  return (
    <Box
      ref={heroRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '40vh' : '60vh',
        overflow: 'hidden',
        backgroundColor: '#000',
        cursor: 'pointer',
        touchAction: 'pan-y', // Sadece dikey kaydırmaya izin ver
        '&:hover .hero-image': {
          transform: 'scale(1.03)',
        }
      }}
    >
      {/* Background Image */}
      <Box
        className="hero-image"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentStack?.imageUrl || currentStack?.photoUrl || `https://picsum.photos/1920/1080?random=${currentSlide}`})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'transform 0.4s ease',
          zIndex: 1
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.0) 70%)',
          zIndex: 2
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: isMobile ? 2 : 3,
          paddingBottom: isMobile ? 2 : 3,
          paddingRight: isMobile ? 5 : 12, // Sağ tarafta dot'lar için yer açıyoruz
          zIndex: 3,
          maxWidth: isMobile ? '100%' : '60%' // Genişliği biraz azaltıyoruz
        }}
      >

        {/* Title */}
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            marginBottom: 1,
            lineHeight: 1.1,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
            fontSize: isMobile ? '1.75rem' : '3rem',
            cursor: 'pointer'
          }}
          onClick={() => handleSlideClick(currentStack)}
        >
          {currentStack?.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'grey.300',
            maxWidth: isMobile ? '100%' : '800px', // Mobile'da tam genişlik, desktop'ta 800px
            lineHeight: 1.5,
            fontSize: isMobile ? '0.875rem' : '1rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentStack?.description}
        </Typography>
      </Box>

      {/* Navigation Arrows - Desktop only */}
      {!isMobile && heroStacks.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              },
              zIndex: 3
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              },
              zIndex: 3
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Slide Indicators (Dots) */}
      {heroStacks.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: isMobile ? 20 : 30,
            right: isMobile ? 20 : 30,
            display: 'flex',
            flexDirection: 'column', // Dikey sıralama
            gap: 1,
            zIndex: 4 // Content'ten daha üstte
          }}
        >
          {heroStacks.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? categoryColor : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: index === currentSlide ? categoryColor : 'rgba(255, 255, 255, 0.8)',
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Hero;

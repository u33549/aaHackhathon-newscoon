import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { mockNews, categoryColors } from '../../constants/index.jsx';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentNews, setCurrentNews] = useState(mockNews[0]);

  // Touch/Swipe için state'ler
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const heroRef = useRef(null);

  // Auto-rotate news every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % mockNews.length;
        setCurrentNews(mockNews[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
      nextNews();
    }
    if (isRightSwipe) {
      // Sağ kaydırma - önceki haber
      prevNews();
    }
  };

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % mockNews.length;
      setCurrentNews(mockNews[nextIndex]);
      return nextIndex;
    });
  };

  const prevNews = () => {
    setCurrentNewsIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + mockNews.length) % mockNews.length;
      setCurrentNews(mockNews[nextIndex]);
      return nextIndex;
    });
  };

  const goToNews = (index) => {
    setCurrentNewsIndex(index);
    setCurrentNews(mockNews[index]);
  };

  const categoryColor = categoryColors[currentNews.category?.toLowerCase()] || '#FFD700';

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
          backgroundImage: `url(${currentNews.image})`,
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

      {/* Swipe Indicator - Sadece mobilde göster */}
      {isMobile && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
            padding: '4px 12px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.65rem',
              textAlign: 'center'
            }}
          >
            ← Kaydırın →
          </Typography>
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: isMobile ? 2 : 3,
          paddingBottom: isMobile ? 2 : 3,
          zIndex: 3,
          maxWidth: isMobile ? '100%' : '60%'
        }}
      >
        {/* Category */}
        <Typography
          variant="body2"
          sx={{
            color: 'grey.400',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 1,
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
        >
          {currentNews.category}
        </Typography>

        {/* Title */}
        <Typography
          variant={isMobile ? 'h6' : 'h4'}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            marginBottom: 1,
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          {currentNews.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'grey.300',
            maxWidth: '500px',
            lineHeight: 1.5,
            fontSize: isMobile ? '0.875rem' : '1rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}
        >
          {currentNews.description}
        </Typography>
      </Box>

      {/* News Indicators (Dots) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          display: 'flex',
          gap: 1,
          zIndex: 3
        }}
      >
        {mockNews.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToNews(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: index === currentNewsIndex ? categoryColor : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: index === currentNewsIndex ? categoryColor : 'rgba(255, 255, 255, 0.8)',
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>

      {/* Mobil için haber sayısı göstergesi */}
      {isMobile && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
            padding: '4px 8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.65rem',
              fontWeight: 'bold'
            }}
          >
            {currentNewsIndex + 1}/{mockNews.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Hero;

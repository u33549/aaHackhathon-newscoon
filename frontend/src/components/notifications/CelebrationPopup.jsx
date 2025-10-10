import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Fade,
  Zoom,
  IconButton
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  Close,
  TrendingUp
} from '@mui/icons-material';
import { getIconComponent } from '../../constants/index.jsx';

const CelebrationPopup = ({ celebrations, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Mevcut kutlama
  const currentCelebration = celebrations[currentIndex];

  useEffect(() => {
    if (currentCelebration) {
      // Popup'ı göster
      setIsVisible(true);

      // 3 saniye sonra sonraki kutlamaya geç veya kapat
      const timer = setTimeout(() => {
        setIsVisible(false);

        // Fade out animasyonu için kısa bir bekleme
        setTimeout(() => {
          if (currentIndex < celebrations.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onClose();
          }
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentCelebration, celebrations.length, onClose]);

  if (!currentCelebration) return null;

  // Kutlama tipine göre görsel ayarları
  const getPopupConfig = () => {
    switch (currentCelebration.type) {
      case 'levelUp':
        return {
          icon: <Star sx={{ fontSize: 48, color: '#FFD700' }} />,
          title: 'Seviye Atladın! 🎉',
          bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          iconBgColor: '#FFD700',
          message: `Seviye ${currentCelebration.newLevel}`,
          subtitle: currentCelebration.xpBonus ? `+${currentCelebration.xpBonus} XP Bonus` : null
        };

      case 'badge':
        return {
          icon: currentCelebration.badge?.icon
            ? getIconComponent(currentCelebration.badge.icon)
            : <EmojiEvents sx={{ fontSize: 48, color: 'white' }} />,
          title: 'Yeni Rozet! 🏆',
          bgColor: `linear-gradient(135deg, ${currentCelebration.badge?.color || '#4CAF50'} 0%, ${currentCelebration.badge?.color || '#388E3C'} 100%)`,
          iconBgColor: currentCelebration.badge?.color || '#4CAF50',
          message: currentCelebration.badge?.name || 'Rozet Kazanıldı',
          subtitle: currentCelebration.badge?.description || null
        };

      case 'achievement':
        return {
          icon: currentCelebration.achievement?.icon
            ? getIconComponent(currentCelebration.achievement.icon)
            : <TrendingUp sx={{ fontSize: 48, color: 'white' }} />,
          title: 'Başarım Açıldı! ⭐',
          bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          iconBgColor: '#f5576c',
          message: currentCelebration.achievement?.name || 'Başarım Tamamlandı',
          subtitle: currentCelebration.achievement?.description || null
        };

      default:
        return {
          icon: <EmojiEvents sx={{ fontSize: 48, color: 'white' }} />,
          title: 'Tebrikler! 🎉',
          bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          iconBgColor: '#667eea',
          message: 'Yeni Bir Başarı',
          subtitle: null
        };
    }
  };

  const config = getPopupConfig();

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Zoom in={isVisible} timeout={400}>
          <Box
            sx={{
              position: 'relative',
              background: config.bgColor,
              borderRadius: 4,
              padding: { xs: 3, md: 4 },
              minWidth: { xs: 280, sm: 320, md: 360 },
              maxWidth: { xs: '90vw', sm: 400 },
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              animation: 'celebrationPulse 3s ease-in-out'
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>

            {/* Icon */}
            <Box sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 70, md: 80 },
                  height: { xs: 70, md: 80 },
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  animation: 'iconBounce 0.6s ease-in-out'
                }}
              >
                {config.icon}
              </Avatar>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1.5,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              {config.title}
            </Typography>

            {/* Main Message */}
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: config.subtitle ? 1 : 0,
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              {config.message}
            </Typography>

            {/* Subtitle */}
            {config.subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                  lineHeight: 1.5,
                  maxWidth: '90%',
                  mx: 'auto'
                }}
              >
                {config.subtitle}
              </Typography>
            )}

            {/* Progress indicator */}
            {celebrations.length > 1 && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 2
              }}>
                {celebrations.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === currentIndex
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Confetti effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                borderRadius: 4
              }}
            >
              {[...Array(6)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    backgroundColor: i % 2 === 0 ? '#FFD700' : 'white',
                    opacity: 0.6,
                    borderRadius: '50%',
                    animation: `confettiFall ${2 + Math.random()}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    left: `${Math.random() * 100}%`,
                    top: '-10px'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Zoom>

        {/* CSS Animations */}
        <style>{`
          @keyframes celebrationPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }

          @keyframes iconBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            25% { transform: translateY(-10px) scale(1.1); }
            50% { transform: translateY(0) scale(1); }
            75% { transform: translateY(-5px) scale(1.05); }
          }

          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.8;
            }
            100% {
              transform: translateY(400px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default CelebrationPopup;


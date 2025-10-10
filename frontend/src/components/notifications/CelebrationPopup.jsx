import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Fade,
  Zoom
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { getIconComponent } from '../../constants/index.jsx';

const CelebrationPopup = ({ celebrations, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Mevcut kutlama
  const currentCelebration = celebrations[currentIndex];

  // Backdrop'a veya popup'a tıklandığında bir sonraki celebration'a geç veya kapat
  const handleClose = () => {
    setIsVisible(false);

    // Fade out animasyonu için kısa bir bekleme
    setTimeout(() => {
      if (currentIndex < celebrations.length - 1) {
        // Sonraki kutlamaya geç
        setCurrentIndex(currentIndex + 1);
        setIsVisible(true);
      } else {
        // Tüm kutlamalar bitti, kapat
        onClose();
      }
    }, 300);
  };

  // Backdrop'a tıklandığında kapat
  const handleBackdropClick = (e) => {
    // Sadece backdrop'a tıklandıysa kapat (popup içeriğine değil)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Popup içeriğine tıklandığında da kapat
  const handlePopupClick = () => {
    handleClose();
  };

  if (!currentCelebration) return null;

  // Kutlama tipine göre görsel ayarları
  const getPopupConfig = () => {
    switch (currentCelebration.type) {
      case 'levelUp':
        return {
          icon: <Star sx={{ fontSize: 48, color: '#FFD700' }} />,
          title: 'Seviye Atladın! 🎉',
          bgColor: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          iconBgColor: 'rgba(26, 26, 26, 0.8)',
          message: `Seviye ${currentCelebration.newLevel}`,
          subtitle: currentCelebration.xpBonus ? `+${currentCelebration.xpBonus} XP Bonus` : null,
          accentColor: '#FFD700'
        };

      case 'badge':
        return {
          icon: currentCelebration.badge?.icon
            ? getIconComponent(currentCelebration.badge.icon)
            : <EmojiEvents sx={{ fontSize: 48, color: '#FFD700' }} />,
          title: 'Yeni Rozet! 🏆',
          bgColor: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          iconBgColor: 'rgba(26, 26, 26, 0.8)',
          iconColor: '#FFD700',
          message: currentCelebration.badge?.name || 'Rozet Kazanıldı',
          subtitle: currentCelebration.badge?.description || null,
          accentColor: '#FFD700'
        };

      case 'achievement':
        return {
          icon: currentCelebration.achievement?.icon
            ? getIconComponent(currentCelebration.achievement.icon)
            : <TrendingUp sx={{ fontSize: 48, color: '#FFD700' }} />,
          title: 'Başarım Açıldı! ⭐',
          bgColor: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          iconBgColor: 'rgba(26, 26, 26, 0.8)',
          message: currentCelebration.achievement?.name || 'Başarım Tamamlandı',
          subtitle: currentCelebration.achievement?.description || null,
          accentColor: '#FFD700'
        };

      default:
        return {
          icon: <EmojiEvents sx={{ fontSize: 48, color: '#FFD700' }} />,
          title: 'Tebrikler! 🎉',
          bgColor: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          iconBgColor: 'rgba(26, 26, 26, 0.8)',
          message: 'Yeni Bir Başarı',
          subtitle: null,
          accentColor: '#FFD700'
        };
    }
  };

  const config = getPopupConfig();

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        onClick={handleBackdropClick}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          cursor: 'pointer'
        }}
      >
        <Zoom in={isVisible} timeout={400}>
          <Box
            onClick={handlePopupClick}
            sx={{
              position: 'relative',
              background: config.bgColor,
              borderRadius: 4,
              padding: { xs: 3, md: 4 },
              minWidth: { xs: 280, sm: 320, md: 360 },
              maxWidth: { xs: '90vw', sm: 400 },
              boxShadow: '0 20px 60px rgba(255, 215, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #FFD700',
              textAlign: 'center',
              animation: 'celebrationPulse 3s ease-in-out',
              cursor: 'pointer'
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 70, md: 80 },
                  height: { xs: 70, md: 80 },
                  bgcolor: config.iconBgColor,
                  mx: 'auto',
                  border: '3px solid #FFD700',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                  animation: 'iconBounce 0.6s ease-in-out',
                  '& svg': {
                    color: '#FFD700'
                  }
                }}
              >
                {config.icon}
              </Avatar>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                color: '#FFD700',
                fontWeight: 700,
                mb: 1.5,
                textShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
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
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.875rem', md: '0.9375rem' },
                  lineHeight: 1.5,
                  maxWidth: '90%',
                  mx: 'auto'
                }}
              >
                {config.subtitle}
              </Typography>
            )}

            {/* Kapatma mesajı - Sadece birden fazla celebration varsa göster */}
            {celebrations.length > 1 && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 2,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem'
                }}
              >
                {currentIndex < celebrations.length - 1
                  ? 'Devam etmek için tıkla'
                  : 'Kapatmak için tıkla'}
              </Typography>
            )}

            {/* Confetti effect - Sarı tonda */}
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
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    backgroundColor: i % 3 === 0
                      ? '#FFD700'
                      : i % 3 === 1
                        ? '#FFA500'
                        : '#FFED4E',
                    opacity: 0.7,
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

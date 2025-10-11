import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import rakun1 from '../../assets/rakun1.png';
import rakun2 from '../../assets/rakun2.png';

const LoadingScreen = ({ message = "Yükleniyor..." }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        position: 'relative'
      }}
    >
      {/* Circular Track */}
      <Box
        sx={{
          position: 'relative',
          width: 250, // 200'den 250'ye artırıldı
          height: 250, // 200'den 250'ye artırıldı
          borderRadius: '50%',
          border: `3px dashed ${theme.palette.primary.main}`, // Border kalınlığı artırıldı
          opacity: 0.4,
          mb: 3,
          // Çember için glow efekti
          boxShadow: theme.palette.mode === 'dark'
            ? `0 0 20px ${theme.palette.primary.main}40`
            : `0 0 10px ${theme.palette.primary.main}20`,
        }}
      >
        {/* Running Raccoon Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: 100, // 80'den 100'e artırıldı
            height: 100, // 80'den 100'e artırıldı
            top: -50, // -40'tan -50'ye artırıldı
            left: '50%',
            transformOrigin: '50px 175px', // 40px 140px'den 50px 175px'e artırıldı
            animation: 'runAroundCircle 2s linear infinite',
            '@keyframes runAroundCircle': {
              '0%': {
                transform: 'translateX(-50%) rotate(0deg)',
              },
              '100%': {
                transform: 'translateX(-50%) rotate(360deg)',
              }
            }
          }}
        >
          {/* Outer Glow Ring - Dış halo */}
          <Box
            sx={{
              position: 'absolute',
              top: -15,
              left: -15,
              right: -15,
              bottom: -15,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(138, 43, 226, 0.3) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%)',
              zIndex: -2,
              animation: 'pulse 1.5s ease-in-out infinite alternate',
              '@keyframes pulse': {
                '0%': {
                  opacity: 0.6,
                  transform: 'scale(0.9)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }
            }}
          />

          {/* Sarımsı Arka Plan - Yeni eklendi */}
          <Box
            sx={{
              position: 'absolute',
              top: -12,
              left: -12,
              right: -12,
              bottom: -12,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFFF99 100%)',
              zIndex: -1,
              opacity: 0.8,
              animation: 'rotateBackground 2s linear infinite',
              '@keyframes rotateBackground': {
                '0%': {
                  transform: 'rotate(0deg)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFFF99 100%)'
                },
                '25%': {
                  background: 'linear-gradient(225deg, #FFA500 0%, #FF8C00 25%, #FFD700 50%, #FFFF99 75%, #FFD700 100%)'
                },
                '50%': {
                  transform: 'rotate(180deg)',
                  background: 'linear-gradient(315deg, #FF8C00 0%, #FFD700 25%, #FFFF99 50%, #FFD700 75%, #FFA500 100%)'
                },
                '75%': {
                  background: 'linear-gradient(45deg, #FFD700 0%, #FFFF99 25%, #FFD700 50%, #FFA500 75%, #FF8C00 100%)'
                },
                '100%': {
                  transform: 'rotate(360deg)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFFF99 100%)'
                }
              }
            }}
          />

          {/* Inner Background Circle - Güncellendi */}
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: -8,
              right: -8,
              bottom: -8,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 215, 0, 0.8) 100%)'
                : 'radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 215, 0, 0.9) 100%)',
              zIndex: 0,
              border: theme.palette.mode === 'dark'
                ? '2px solid rgba(255, 255, 255, 0.9)'
                : '2px solid rgba(255, 215, 0, 0.6)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.3)'
                : '0 0 15px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(255, 215, 0, 0.4)'
            }}
          />

          {/* Raccoon Image with enhanced effects - Hız ayarlandı */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${rakun1})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              // Dönme hızına göre ayarlandı: 2s dönme -> 0.25s resim değişimi (8 kare/dönüş)
              animation: 'alternateRaccoon 0.25s steps(1) infinite',
              // Güçlü kontrast ve glow efektleri
              filter: theme.palette.mode === 'dark'
                ? 'contrast(1.4) brightness(1.2) saturate(1.3) drop-shadow(0 0 8px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 24px rgba(138, 43, 226, 0.6))'
                : 'contrast(1.5) brightness(0.8) saturate(1.4) drop-shadow(0 0 6px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 215, 0, 1))',
              // Kenar yumuşatma
              borderRadius: '50%',
              // Ek z-index
              position: 'relative',
              zIndex: 1,
              '@keyframes alternateRaccoon': {
                '0%, 50%': {
                  backgroundImage: `url(${rakun1})`,
                },
                '50.1%, 100%': {
                  backgroundImage: `url(${rakun2})`,
                }
              }
            }}
          />

          {/* Moving Sparkle Effects - Güncellendi */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '80%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark' ? '#FFD700' : '#FF6B35',
              animation: 'sparkle 2s ease-in-out infinite',
              zIndex: 2,
              '@keyframes sparkle': {
                '0%, 100%': {
                  opacity: 0,
                  transform: 'scale(0) rotate(0deg)'
                },
                '50%': {
                  opacity: 1,
                  transform: 'scale(1) rotate(180deg)'
                }
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '70%',
              left: '20%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark' ? '#FF69B4' : '#4CAF50',
              animation: 'sparkle 2s ease-in-out infinite 0.7s',
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              left: '15%',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark' ? '#00FFFF' : '#9C27B0',
              animation: 'sparkle 2s ease-in-out infinite 1.4s',
              zIndex: 2,
            }}
          />
        </Box>
      </Box>

      {/* Loading Text */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          fontWeight: 500,
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 0.7,
            },
            '50%': {
              opacity: 1,
            }
          }
        }}
      >
        {message}
      </Typography>

      {/* Decorative dots */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          '& .dot': {
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            animation: 'bounce 1.4s ease-in-out infinite both',
          },
          '& .dot:nth-of-type(1)': {
            animationDelay: '-0.32s',
          },
          '& .dot:nth-of-type(2)': {
            animationDelay: '-0.16s',
          },
          '@keyframes bounce': {
            '0%, 80%, 100%': {
              transform: 'scale(0)',
              opacity: 0.5,
            },
            '40%': {
              transform: 'scale(1)',
              opacity: 1,
            }
          }
        }}
      >
        <Box className="dot" />
        <Box className="dot" />
        <Box className="dot" />
      </Box>
    </Box>
  );
};

export default LoadingScreen;

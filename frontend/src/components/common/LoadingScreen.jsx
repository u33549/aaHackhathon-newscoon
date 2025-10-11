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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ana Container */}
      <Box
        sx={{
          position: 'relative',
          width: 300,
          height: 200,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Zemin Çizgisi */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '10%',
            right: '10%',
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, 
              ${theme.palette.primary.main}40 0%, 
              ${theme.palette.primary.main} 50%, 
              ${theme.palette.primary.main}40 100%)`,
            animation: 'groundPulse 2s ease-in-out infinite',
            '@keyframes groundPulse': {
              '0%, 100%': {
                opacity: 0.3,
                transform: 'scaleX(1)'
              },
              '50%': {
                opacity: 0.8,
                transform: 'scaleX(1.1)'
              }
            }
          }}
        />

        {/* Koşan Rakun */}
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 120,
            bottom: 20,
            animation: 'raccoonRun 3s ease-in-out infinite',
            '@keyframes raccoonRun': {
              '0%': {
                left: '-60px',
                transform: 'scaleX(1) translateY(0px) rotate(-5deg)'
              },
              '25%': {
                left: '25%',
                transform: 'scaleX(1) translateY(-15px) rotate(0deg)'
              },
              '50%': {
                left: '50%',
                transform: 'scaleX(1) translateY(-5px) rotate(5deg)'
              },
              '75%': {
                left: '75%',
                transform: 'scaleX(1) translateY(-20px) rotate(0deg)'
              },
              '100%': {
                left: 'calc(100% + 60px)',
                transform: 'scaleX(1) translateY(0px) rotate(-5deg)'
              }
            }
          }}
        >
          {/* Rakun Gölgesi */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.2)',
              filter: 'blur(8px)',
              animation: 'shadowMove 3s ease-in-out infinite',
              '@keyframes shadowMove': {
                '0%, 100%': {
                  transform: 'translateX(-50%) scaleX(1)',
                  opacity: 0.3
                },
                '25%, 75%': {
                  transform: 'translateX(-50%) scaleX(0.7)',
                  opacity: 0.2
                },
                '50%': {
                  transform: 'translateX(-50%) scaleX(0.8)',
                  opacity: 0.25
                }
              }
            }}
          />

          {/* Rakun Sprite */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${rakun1})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              animation: 'raccoonSprite 0.2s steps(1) infinite',
              filter: theme.palette.mode === 'dark'
                ? 'contrast(1.2) brightness(1.1) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.3))'
                : 'contrast(1.3) brightness(0.9) drop-shadow(0 0 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.8))',
              '@keyframes raccoonSprite': {
                '0%, 50%': {
                  backgroundImage: `url(${rakun1})`,
                },
                '50.1%, 100%': {
                  backgroundImage: `url(${rakun2})`,
                }
              }
            }}
          />

          {/* Koşu Toz Efekti */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: -20,
              width: 40,
              height: 20,
              opacity: 0.6,
              animation: 'dustCloud 0.6s ease-out infinite',
              '@keyframes dustCloud': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0) translateY(0px)'
                },
                '50%': {
                  opacity: 0.6,
                  transform: 'scale(1) translateY(-10px)'
                },
                '100%': {
                  opacity: 0,
                  transform: 'scale(1.5) translateY(-20px)'
                }
              }
            }}
          >
            {/* Toz Parçacıkları */}
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.mode === 'dark' ? '#FFD700' : '#8B4513',
                  left: `${20 + i * 8}px`,
                  top: `${10 + i * 2}px`,
                  animation: `dustParticle${i} 0.8s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  [`@keyframes dustParticle${i}`]: {
                    '0%': {
                      opacity: 0,
                      transform: 'scale(0) translateY(0px)'
                    },
                    '30%': {
                      opacity: 1,
                      transform: 'scale(1) translateY(-5px)'
                    },
                    '100%': {
                      opacity: 0,
                      transform: 'scale(0.5) translateY(-15px)'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Arka Plan Dekoratif Elementler */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 20,
            width: 30,
            height: 30,
            opacity: 0.4,
            animation: 'float1 4s ease-in-out infinite',
            '@keyframes float1': {
              '0%, 100%': {
                transform: 'translateY(0px) rotate(0deg)',
                opacity: 0.4
              },
              '50%': {
                transform: 'translateY(-20px) rotate(180deg)',
                opacity: 0.8
              }
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 20,
            height: 20,
            opacity: 0.5,
            animation: 'float2 3s ease-in-out infinite 1s',
            '@keyframes float2': {
              '0%, 100%': {
                transform: 'translateY(0px) scale(1)',
                opacity: 0.5
              },
              '50%': {
                transform: 'translateY(-15px) scale(1.2)',
                opacity: 0.9
              }
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: theme.palette.warning.main,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
        </Box>

        {/* Işık Parıltıları */}
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark' ? '#FFD700' : '#FF6B35',
              top: `${20 + i * 30}px`,
              left: `${50 + i * 60}px`,
              animation: `sparkle${i} 2s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              [`@keyframes sparkle${i}`]: {
                '0%, 100%': {
                  opacity: 0,
                  transform: 'scale(0) rotate(0deg)'
                },
                '50%': {
                  opacity: 1,
                  transform: 'scale(1.5) rotate(180deg)'
                }
              }
            }}
          />
        ))}
      </Box>

      {/* Loading Text */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          animation: 'textBounce 2s ease-in-out infinite',
          '@keyframes textBounce': {
            '0%, 100%': {
              transform: 'translateY(0px)',
              opacity: 0.8
            },
            '50%': {
              transform: 'translateY(-5px)',
              opacity: 1
            }
          }
        }}
      >
        {message}
      </Typography>

      {/* Progress Dots */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 3,
          '& .dot': {
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            animation: 'dotWave 1.8s ease-in-out infinite both',
          },
          '& .dot:nth-of-type(1)': {
            animationDelay: '0s',
          },
          '& .dot:nth-of-type(2)': {
            animationDelay: '0.2s',
          },
          '& .dot:nth-of-type(3)': {
            animationDelay: '0.4s',
          },
          '& .dot:nth-of-type(4)': {
            animationDelay: '0.6s',
          },
          '@keyframes dotWave': {
            '0%, 80%, 100%': {
              transform: 'scale(0.8) translateY(0px)',
              opacity: 0.6,
            },
            '40%': {
              transform: 'scale(1.2) translateY(-8px)',
              opacity: 1,
            }
          }
        }}
      >
        <Box className="dot" />
        <Box className="dot" />
        <Box className="dot" />
        <Box className="dot" />
      </Box>
    </Box>
  );
};

export default LoadingScreen;

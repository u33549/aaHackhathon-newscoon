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
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: `2px dashed ${theme.palette.primary.main}`,
          opacity: 0.3,
          mb: 3
        }}
      >
        {/* Running Raccoon Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: 40,
            height: 40,
            top: -20,
            left: '50%',
            transformOrigin: '20px 80px',
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
          {/* Raccoon Image with alternating animation */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${rakun1})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              animation: 'alternateRaccoon 0.4s steps(1) infinite',
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

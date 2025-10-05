import React, { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const NewsSection = ({ title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Title */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        px: isMobile ? 2 : 0
      }}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          sx={{
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>

        {/* Navigation Arrows - Desktop only */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                backgroundColor: 'grey.100',
                '&:hover': {
                  backgroundColor: 'grey.200'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                backgroundColor: 'grey.100',
                '&:hover': {
                  backgroundColor: 'grey.200'
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Slider Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'scroll',
          overflowY: 'hidden',
          gap: 2,
          px: isMobile ? 2 : 0,
          pb: 1,
          // Scrollbar'ları tamamen gizle
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          // Firefox için scrollbar gizle
          scrollbarWidth: 'none',
          // IE ve Edge için
          msOverflowStyle: 'none',
        }}
      >
        {React.Children.map(children, (child, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 auto',
              width: isMobile ? '85vw' : '320px', // Tam genişlik mobilde, sabit genişlik desktop'ta
              maxWidth: isMobile ? '85vw' : '320px',
            }}
          >
            {child}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NewsSection;

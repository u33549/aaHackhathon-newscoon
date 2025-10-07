import React, { useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const NewsSection = ({ title, children, action }) => {
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Action Button (Tümünü Gör vb.) */}
          {action && action}

          {/* Navigation Arrows - Desktop only */}
          {!isMobile && (
            <>
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
            </>
          )}
        </Box>
      </Box>

      {/* Slider Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'scroll',
          gap: 2,
          px: isMobile ? 2 : 0,
          pb: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NewsSection;

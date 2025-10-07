import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { categoryColors } from '../../constants/index.jsx';

const NewsCard = ({ articles = [], article, variant = 'horizontal', onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef(null);

  // Backward compatibility için article prop'u varsa articles array'ine çevir
  const articleList = articles.length > 0 ? articles : (article ? [article] : []);

  // Touch/Swipe için state'ler
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Swipe için minimum mesafe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
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
      scrollNext();
    }
    if (isRightSwipe) {
      scrollPrev();
    }
  };

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.children[0]?.offsetWidth || 300;
      container.scrollBy({
        left: cardWidth + 16, // 16px gap
        behavior: 'smooth'
      });
    }
  };

  const scrollPrev = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.children[0]?.offsetWidth || 300;
      container.scrollBy({
        left: -(cardWidth + 16), // 16px gap
        behavior: 'smooth'
      });
    }
  };

  const handleNewsClick = (newsId) => {
    if (onClick) {
      onClick(newsId);
    }
  };

  // Horizontal variant - yatay kaydırmalı slider
  if (variant === 'horizontal' || variant === 'slider') {
    if (!articleList.length) {
      return (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Henüz haber bulunmuyor
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          '&:hover .nav-buttons': {
            opacity: 1,
          }
        }}
      >
        {/* Navigation Arrows - Desktop */}
        {!isMobile && articleList.length > 3 && (
          <>
            <IconButton
              className="nav-buttons"
              onClick={scrollPrev}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              className="nav-buttons"
              onClick={scrollNext}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Horizontal Scrollable Container */}
        <Box
          ref={scrollContainerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            pb: 1,
            px: isMobile ? 2 : 0,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            touchAction: 'pan-x'
          }}
        >
          {articleList.map((newsItem, index) => {
            const categoryColor = categoryColors[newsItem.category?.toLowerCase()] || theme.palette.primary.main;

            return (
              <Box
                key={newsItem.id || index}
                onClick={() => handleNewsClick(newsItem.id)}
                sx={{
                  minWidth: { xs: 280, sm: 320, md: 350 },
                  height: { xs: 200, sm: 220, md: 240 },
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#000',
                  flexShrink: 0,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    '& .news-image': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                {/* Background Image */}
                <Box
                  className="news-image"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${newsItem.thumbnailUrl || newsItem.imageUrl || 'https://via.placeholder.com/350x240'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease',
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
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.0) 60%)',
                    zIndex: 2
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    zIndex: 3
                  }}
                >
                  {/* Category Chip */}
                  {newsItem.category && (
                    <Chip
                      label={newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: categoryColor,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        mb: 1,
                        height: 20
                      }}
                    />
                  )}

                  {/* Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {newsItem.title}
                  </Typography>

                  {/* Age/Type */}
                  {newsItem.age && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        display: 'block',
                        mt: 0.5
                      }}
                    >
                      {newsItem.age}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  // Default/legacy variant - tek haber card (backward compatibility)
  const singleNews = articleList[0] || {};
  const categoryColor = categoryColors[singleNews.category?.toLowerCase()] || theme.palette.primary.main;

  return (
    <Box
      onClick={() => handleNewsClick(singleNews.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          '& .news-image': {
            transform: 'scale(1.02)'
          }
        }
      }}
    >
      {/* Background Image */}
      <Box
        className="news-image"
        sx={{
          height: variant === 'portrait' ? '300px' : '220px',
          backgroundImage: `url(${singleNews.thumbnailUrl || singleNews.imageUrl || 'https://via.placeholder.com/320x180'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.3s ease'
        }}
      />

      {/* Gradient Overlay for Title */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.0) 70%)',
          padding: 2,
          zIndex: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              lineHeight: 1.2,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
              minWidth: 0
            }}
          >
            {singleNews.title}
          </Typography>

          {singleNews.category && (
            <Chip
              label={singleNews.category.charAt(0).toUpperCase() + singleNews.category.slice(1)}
              size="small"
              sx={{
                backgroundColor: categoryColor,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                flexShrink: 0
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsCard;

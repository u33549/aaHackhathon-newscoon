import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { ChevronLeft, ChevronRight, AccessTime, Visibility } from '@mui/icons-material';
import { categoryColors } from '../../constants/index.jsx';

const NewsCard = ({ articles = [], article, variant = 'horizontal', onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Backward compatibility için article prop'u varsa articles array'ine çevir
  const articleList = articles.length > 0 ? articles : (article ? [article] : []);

  // Scroll durumunu kontrol et
  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);

      // Resize event listener ekle
      const handleResize = () => {
        setTimeout(checkScrollButtons, 100);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [articleList.length]);

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (container && canScrollRight) {
      const containerWidth = container.clientWidth;
      const scrollAmount = containerWidth * 0.8;

      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollPrev = () => {
    const container = scrollContainerRef.current;
    if (container && canScrollLeft) {
      const containerWidth = container.clientWidth;
      const scrollAmount = containerWidth * 0.8;

      container.scrollBy({
        left: -scrollAmount,
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
        {!isMobile && articleList.length > 1 && (
          <>
            <IconButton
              className="nav-buttons"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
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
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'action.disabled',
                  opacity: 0.3
                }
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              className="nav-buttons"
              onClick={scrollNext}
              disabled={!canScrollRight}
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
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'action.disabled',
                  opacity: 0.3
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
            scrollBehavior: 'smooth'
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
                    boxShadow: 6,
                    '& .news-overlay': {
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)'
                    }
                  }
                }}
              >
                {/* Background Image */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${newsItem.thumbnailUrl || newsItem.imageUrl || 'https://via.placeholder.com/350x240'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />

                {/* Overlay */}
                <Box
                  className="news-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)',
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Category Chip */}
                <Chip
                  label={newsItem.category?.charAt(0).toUpperCase() + newsItem.category?.slice(1) || 'Genel'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: categoryColor,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
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
                    zIndex: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 1,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: { xs: '1rem', sm: '1.1rem' }
                    }}
                  >
                    {newsItem.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {newsItem.age && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }} />
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}
                        >
                          {newsItem.age}
                        </Typography>
                      </Box>
                    )}

                    {newsItem.viewCount && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }} />
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}
                        >
                          {newsItem.viewCount}
                        </Typography>
                      </Box>
                    )}

                    {newsItem.xp && (
                      <Chip
                        label={`${newsItem.xp} XP`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    )}
                  </Box>
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

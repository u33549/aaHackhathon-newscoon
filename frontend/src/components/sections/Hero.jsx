import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, PlayArrow } from '@mui/icons-material';
import { categoryColors } from '../../constants/index.jsx';

const Hero = ({ slides, onArticleSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentArticle = slides[currentSlide];

  if (!currentArticle) return null;

  return (
    <Box sx={{
      bgcolor: 'background.default',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            position: 'relative',
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            bgcolor: 'background.paper',
            minHeight: { xs: 300, sm: 400, md: 500 }
          }}
        >
          {/* Hero Image */}
          <CardMedia
            component="img"
            height={isMobile ? (isSmall ? "250" : "300") : "300"}
            image={currentArticle.imageUrl}
            alt={currentArticle.title}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(0.7)'
            }}
          />

          {/* Navigation Arrows - Only on larger screens */}
          {slides.length > 1 && !isSmall && (
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  },
                  width: { xs: 36, md: 48 },
                  height: { xs: 36, md: 48 }
                }}
              >
                <ArrowBackIos fontSize={isMobile ? "small" : "medium"} />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  },
                  width: { xs: 36, md: 48 },
                  height: { xs: 36, md: 48 }
                }}
              >
                <ArrowForwardIos fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </>
          )}

          {/* Content Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
              p: { xs: 2, sm: 3, md: 4 }
            }}
          >
            {/* Category Chip */}
            <Chip
              label={currentArticle.superTitle}
              size={isSmall ? "small" : "medium"}
              sx={{
                bgcolor: categoryColors[currentArticle.category] || 'primary.main',
                color: 'white',
                fontWeight: 600,
                mb: { xs: 1, md: 2 },
                fontSize: { xs: '0.7rem', md: '0.8rem' }
              }}
            />

            {/* Title */}
            <Typography
              variant={isSmall ? "h5" : isMobile ? "h4" : "h3"}
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: { xs: 0.5, md: 1 },
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                lineHeight: { xs: 1.2, md: 1.3 }
              }}
            >
              {currentArticle.title}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant={isSmall ? "body1" : "h6"}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: { xs: 2, md: 3 },
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {currentArticle.subtitle}
            </Typography>

            {/* Summary - Hidden on mobile */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: { xs: 2, md: 3 },
                maxWidth: { sm: '80%', md: '70%' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                display: { xs: 'none', md: 'block' },
                fontSize: { md: '1rem', lg: '1.1rem' }
              }}
            >
              {currentArticle.summary}
            </Typography>

            {/* Read Button */}
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => onArticleSelect(currentArticle)}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Haberi Oku
            </Button>
          </Box>

          {/* Slide Indicators */}
          {slides.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: 8, md: 16 },
                right: { xs: 8, md: 16 },
                display: 'flex',
                gap: { xs: 0.5, md: 1 },
                flexDirection: { xs: 'row', sm: 'row' }
              }}
            >
              {slides.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: { xs: 6, md: 8 },
                    height: { xs: 6, md: 8 },
                    borderRadius: '50%',
                    bgcolor: index === currentSlide ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {/* Mobile swipe hint */}
          {isSmall && slides.length > 1 && (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'rgba(255, 255, 255, 0.7)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.65rem'
              }}
            >
              {currentSlide + 1}/{slides.length}
            </Typography>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Hero;

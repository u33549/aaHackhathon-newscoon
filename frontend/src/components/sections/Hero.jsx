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
  useTheme
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, PlayArrow } from '@mui/icons-material';
import { categoryColors } from '../../constants';

const Hero = ({ slides, onArticleSelect }) => {
  const theme = useTheme();
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
      py: 4
    }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            minHeight: 500
          }}
        >
          {/* Hero Image */}
          <CardMedia
            component="img"
            height="300"
            image={currentArticle.imageUrl}
            alt={currentArticle.title}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(0.7)'
            }}
          />

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <ArrowBackIos />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <ArrowForwardIos />
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
              p: 4
            }}
          >
            {/* Category Chip */}
            <Chip
              label={currentArticle.superTitle}
              size="small"
              sx={{
                bgcolor: categoryColors[currentArticle.category] || 'primary.main',
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
            />

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {currentArticle.title}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {currentArticle.subtitle}
            </Typography>

            {/* Summary */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 3,
                maxWidth: '70%',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
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
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
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
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 1
              }}
            >
              {slides.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === currentSlide ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                />
              ))}
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Hero;

import React from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { categoryColors } from '../../constants/index.jsx';

const VideoCard = ({ video, variant = 'default', onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const categoryColor = categoryColors[video.duration?.toLowerCase()] || 'primary.main';

  return (
    <Card
      onClick={() => onClick && onClick()}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 2, md: 2 },
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: onClick ? { xs: 'translateY(-2px)', md: 'translateY(-4px)' } : 'none',
          boxShadow: onClick ? { xs: theme.shadows[4], md: theme.shadows[8] } : theme.shadows[2]
        }
      }}
    >
      {/* Background Image */}
      <CardMedia
        component="img"
        height={variant === 'portrait' ? '200' : '160'}
        image={video.thumbnailUrl || 'https://via.placeholder.com/320x180'}
        alt={video.title}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      />

      {/* Hero-like Gradient Overlay for Title */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.0) 70%)',
          padding: { xs: 1.5, md: 2 },
          zIndex: 2
        }}
      >
        {/* Category Chip */}
        {video.duration && (
          <Chip
            label={video.duration}
            size="small"
            sx={{
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 600,
              mb: 1,
              fontSize: '0.7rem'
            }}
          />
        )}

        {/* Title with Hero-like styling */}
        <Typography
          variant={isSmall ? 'body1' : 'h6'}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {video.title}
        </Typography>
      </Box>

      {/* XP Badge (if exists) */}
      {video.xp && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 215, 0, 0.9)',
            color: 'black',
            borderRadius: 1,
            padding: '2px 6px',
            zIndex: 3
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            +{video.xp} XP
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default VideoCard;

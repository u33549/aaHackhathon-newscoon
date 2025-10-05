import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import { categoryColors } from '../../constants';

const VideoCard = ({ video, variant = 'default', onClick }) => {
  const theme = useTheme();

  const categoryColor = categoryColors[video.duration?.toLowerCase()] || 'primary.main';

  return (
    <Card
      onClick={() => onClick && onClick()}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? theme.shadows[8] : theme.shadows[2]
        }
      }}
    >
      {/* Thumbnail */}
      <CardMedia
        component="img"
        height={variant === 'portrait' ? 200 : 180}
        image={video.thumbnailUrl}
        alt={video.title}
        sx={{
          objectFit: 'cover'
        }}
      />

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Channel Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar
            src={video.channelIconUrl}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="caption" color="text.secondary">
            {video.age}
          </Typography>
          {video.duration && (
            <Chip
              label={video.duration}
              size="small"
              sx={{
                bgcolor: categoryColor,
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
                ml: 'auto'
              }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="body1"
          component="h3"
          sx={{
            fontWeight: 500,
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {video.title}
        </Typography>

        {/* XP Badge (if available) */}
        {video.xp && (
          <Chip
            label={`+${video.xp} XP`}
            size="small"
            color="primary"
            sx={{
              fontSize: '0.7rem',
              height: 20,
              fontWeight: 600
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;

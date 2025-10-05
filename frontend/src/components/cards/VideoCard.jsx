import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
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
        '&:hover': {
          transform: onClick ? { xs: 'translateY(-2px)', md: 'translateY(-4px)' } : 'none',
          boxShadow: onClick ? { xs: theme.shadows[4], md: theme.shadows[8] } : theme.shadows[2]
        },
        '&:active': onClick ? {
          transform: 'translateY(0px)',
          transition: 'transform 0.1s ease'
        } : {}
      }}
    >
      {/* Thumbnail */}
      <CardMedia
        component="img"
        height={variant === 'portrait' ?
          (isSmall ? 160 : isMobile ? 180 : 200) :
          (isSmall ? 140 : isMobile ? 160 : 180)
        }
        image={video.thumbnailUrl}
        alt={video.title}
        sx={{
          objectFit: 'cover'
        }}
      />

      {/* Content */}
      <CardContent sx={{
        flexGrow: 1,
        p: { xs: 1.5, md: 2 },
        '&:last-child': { pb: { xs: 1.5, md: 2 } }
      }}>
        {/* Channel Info */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.8, md: 1 },
          mb: { xs: 0.8, md: 1 }
        }}>
          <Avatar
            src={video.channelIconUrl}
            sx={{
              width: { xs: 20, md: 24 },
              height: { xs: 20, md: 24 }
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              flex: 1
            }}
          >
            {video.age}
          </Typography>
          {video.duration && (
            <Chip
              label={video.duration}
              size="small"
              sx={{
                bgcolor: categoryColor,
                color: 'white',
                fontSize: { xs: '0.65rem', md: '0.7rem' },
                height: { xs: 18, md: 20 },
                ml: 'auto'
              }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant={isSmall ? "body2" : "body1"}
          component="h3"
          sx={{
            fontWeight: 500,
            lineHeight: { xs: 1.3, md: 1.3 },
            mb: { xs: 0.8, md: 1 },
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, md: 3 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
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
              fontSize: { xs: '0.65rem', md: '0.7rem' },
              height: { xs: 18, md: 20 },
              fontWeight: 600
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;

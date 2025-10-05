import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack
} from '@mui/material';
import { EmojiEvents, Star } from '@mui/icons-material';
import { LogoIcon } from '../../constants/index.jsx';

const Header = ({ totalXp, level, xpForNextLevel, onOpenBadges }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const progressPercentage = xpForNextLevel.max > 0
    ? (xpForNextLevel.current / xpForNextLevel.max) * 100
    : 0;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isMobile ? 'rgba(18, 18, 18, 0.6)' : 'background.default',
        backdropFilter: isMobile ? 'blur(10px)' : 'none',
        minHeight: { xs: 72, md: 80 }
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{
          justifyContent: 'space-between',
          py: { xs: 1, md: 2 },
          minHeight: { xs: 72, md: 80 }
        }}>
          {/* Logo - Hem mobil hem desktop'ta göster */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, md: 2 }
          }}>
            {/* Newscoon logo'su hem mobilde hem desktop'ta */}
            <LogoIcon sx={{
              width: { xs: 20, md: 24 },
              height: { xs: 20, md: 24 }
            }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'primary.main'
              }}
            >
              Newscoon
            </Typography>
          </Box>

          {/* XP and Level Display - Sadece Desktop */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 300
            }}>
              {/* Level Badge */}
              <Chip
                icon={<Star />}
                label={`Seviye ${level}`}
                color="primary"
                variant="filled"
                sx={{ fontWeight: 600 }}
              />

              {/* XP Progress */}
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {totalXp} XP
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {xpForNextLevel.current}/{xpForNextLevel.max}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'primary.main',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>

              {/* Badges Button */}
              <Button
                variant="outlined"
                startIcon={<EmojiEvents />}
                onClick={onOpenBadges}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'rgba(253, 224, 71, 0.1)'
                  }
                }}
              >
                Rozetler
              </Button>
            </Box>
          )}

          {/* Mobile Layout - Level, XP ve Rozetler */}
          {isMobile && (
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {/* Level Display */}
              <Chip
                icon={<Star />}
                label={`L${level}`}
                color="primary"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />

              {/* XP Display */}
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                {totalXp} XP
              </Typography>

              {/* Badges Icon Button */}
              <IconButton
                onClick={onOpenBadges}
                sx={{
                  color: 'primary.main',
                  p: 1
                }}
              >
                <EmojiEvents fontSize="medium" />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

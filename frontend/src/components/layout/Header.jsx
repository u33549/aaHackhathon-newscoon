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
import { LogoIcon } from '../../constants';

const Header = ({ totalXp, level, xpForNextLevel, onOpenBadges }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const progressPercentage = xpForNextLevel.max > 0
    ? (xpForNextLevel.current / xpForNextLevel.max) * 100
    : 0;

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{
          justifyContent: 'space-between',
          py: { xs: 0.5, md: 1 },
          minHeight: { xs: 56, md: 64 }
        }}>
          {/* Logo */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 }
          }}>
            <LogoIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
            <Typography
              variant={isSmall ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                display: { xs: 'block', sm: 'block' }
              }}
            >
              {isSmall ? "NC" : "Newscoon"}
            </Typography>
          </Box>

          {/* XP and Level Display - Desktop */}
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

          {/* Mobile Layout */}
          {isMobile && (
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Compact Level Display */}
              <Chip
                icon={<Star />}
                label={level}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />

              {/* Compact XP */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                {totalXp}XP
              </Typography>

              {/* Badges Icon Button */}
              <IconButton
                onClick={onOpenBadges}
                sx={{
                  color: 'primary.main',
                  p: 1
                }}
              >
                <EmojiEvents fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Toolbar>

        {/* Mobile XP Progress Bar */}
        {isMobile && (
          <Box sx={{ px: 2, pb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.main',
                  borderRadius: 2
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 0.5
            }}>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                {xpForNextLevel.current}/{xpForNextLevel.max}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Seviye {level + 1}'e {xpForNextLevel.max - xpForNextLevel.current} XP
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </AppBar>
  );
};

export default Header;

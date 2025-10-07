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
import LogoNewscoon from '../../assets/Logo_Newscoon.png';

const Header = ({ totalXp = 0, level = 1, xpForNextLevel = { current: 0, max: 100 }, onOpenBadges = () => {} }) => {
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
        minHeight: { xs: 72, md: 80 } // Header'ı daha yüksek yaptım
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{
          justifyContent: 'space-between',
          py: { xs: 1, md: 2 }, // Padding'i artırdım
          minHeight: { xs: 72, md: 80 } // Toolbar'ı da daha yüksek yaptım
        }}>
          {/* Logo - Hem mobil hem desktop'ta göster */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, md: 2 }
          }}>
            {/* Gerçek Newscoon logosu */}
            <img
              src={LogoNewscoon}
              alt="Newscoon Logo"
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
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
              gap: 3
            }}>
              {/* Level */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Level
                </Typography>
                <Chip
                  label={level}
                  color="primary"
                  size="small"
                  sx={{
                    minWidth: 45,
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              {/* XP Progress */}
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">
                  XP: {xpForNextLevel.current}/{xpForNextLevel.max}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3
                    }
                  }}
                />
              </Box>

              {/* Badges Button */}
              <Button
                startIcon={<EmojiEvents />}
                onClick={onOpenBadges}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Rozetler
              </Button>
            </Box>
          )}

          {/* Mobile Layout - Logo, Level, XP ve Rozetler */}
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
                size="small"
                sx={{
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { levelThresholds } from '../../constants/index.jsx';

const Header = ({ totalCp = 0, level = 1, cpForNextLevel = { current: 0, max: 100 }, onOpenBadges = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Mevcut levelin minimum CP'sini al
  const currentLevelMinCp = levelThresholds[level - 1] || 0;

  // Kullanıcının levelinden fazla olan CP'yi hesapla
  const effectiveCp = totalCp - currentLevelMinCp;

  const progressPercentage = cpForNextLevel.max > 0
    ? (cpForNextLevel.current / cpForNextLevel.max) * 100
    : 0;

  // Ana sayfaya git
  const handleLogoClick = () => {
    navigate('/');
  };

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
            gap: { xs: 1.5, md: 2 },
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            },
            transition: 'opacity 0.2s ease'
          }}
          onClick={handleLogoClick}
          >
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

          {/* CP and Level Display - Sadece Desktop */}
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

              {/* CP Progress */}
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">
                  CP: {effectiveCp}/{cpForNextLevel.max}
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

              {/* Badges Button - Kupa ikonu sarı */}
              <Button
                startIcon={<EmojiEvents sx={{ color: '#FFD700' }} />}
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

          {/* Mobile Layout - Logo, Level, CP ve Rozetler */}
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

              {/* CP Display */}
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                {effectiveCp} CP
              </Typography>

              {/* Badges Icon Button - Kupa ikonu sarı */}
              <IconButton
                onClick={onOpenBadges}
                size="small"
                sx={{
                  p: 1
                }}
              >
                <EmojiEvents
                  fontSize="medium"
                  sx={{ color: '#FFD700' }}
                />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

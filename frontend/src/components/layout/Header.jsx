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
              gap: 2
            }}>
              {/* Level Button - Daha büyük tasarım */}
              <Button
                onClick={onOpenBadges}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '1.5px solid',
                  borderColor: 'divider',
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1.5,
                  minWidth: 110,
                  height: 48,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ fontSize: 20, color: 'inherit' }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    L{level}
                  </Typography>
                </Box>
              </Button>

              {/* Badges Button - Daha büyük altın rengi ama mat */}
              <Button
                startIcon={<EmojiEvents sx={{ fontSize: 20, color: '#FFD700' }} />}
                onClick={onOpenBadges}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '1.5px solid #FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  color: '#FFD700',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1.5,
                  minWidth: 120,
                  height: 48,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#FFD700'
                  }
                }}
              >
                Rozetler
              </Button>
            </Box>
          )}

          {/* Mobile Layout - Logo, Level ve Rozetler */}
          {isMobile && (
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {/* Level Button - Mobil için daha büyük tasarım */}
              <Button
                onClick={onOpenBadges}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 70,
                  height: 38,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    L{level}
                  </Typography>
                </Box>
              </Button>

              {/* Badges Button - Mobil için daha büyük altın rengi ama mat */}
              <Button
                onClick={onOpenBadges}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 46,
                  width: 46,
                  height: 38,
                  borderRadius: 2,
                  border: '1px solid #FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  color: '#FFD700',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#FFD700'
                  }
                }}
              >
                <EmojiEvents sx={{ fontSize: 18 }} />
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

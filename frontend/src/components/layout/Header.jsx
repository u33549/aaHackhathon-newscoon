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

<<<<<<< HEAD
const Header = ({ totalCp = 0, level = 1, cpForNextLevel = { current: 0, max: 100 }, onOpenBadges = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const progressPercentage = cpForNextLevel.max > 0
    ? (cpForNextLevel.current / cpForNextLevel.max) * 100
=======
const Header = ({ totalXp = 0, level = 1, xpForNextLevel = { current: 0, max: 100 }, onOpenBadges = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const progressPercentage = xpForNextLevel.max > 0
    ? (xpForNextLevel.current / xpForNextLevel.max) * 100
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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

<<<<<<< HEAD
          {/* CP and Level Display - Sadece Desktop */}
=======
          {/* XP and Level Display - Sadece Desktop */}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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

<<<<<<< HEAD
              {/* CP Progress */}
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">
                  CP: {cpForNextLevel.current}/{cpForNextLevel.max}
=======
              {/* XP Progress */}
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="caption" color="text.secondary">
                  XP: {xpForNextLevel.current}/{xpForNextLevel.max}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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

<<<<<<< HEAD
          {/* Mobile Layout - Logo, Level, CP ve Rozetler */}
=======
          {/* Mobile Layout - Logo, Level, XP ve Rozetler */}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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

<<<<<<< HEAD
              {/* CP Display */}
=======
              {/* XP Display */}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
<<<<<<< HEAD
                {totalCp} CP
=======
                {totalXp} XP
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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

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
            {!isMobile && (
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                Newscoon
              </Typography>
            )}
          </Box>

          {/* XP ve Level Bilgisi */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            {/* Level ve XP Desktop */}
            {!isMobile && (
              <Stack direction="row" spacing={2} alignItems="center">
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

                <Box sx={{ minWidth: 120 }}>
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
              </Stack>
            )}

            {/* Mobil XP ve Level */}
            {isMobile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`Lv.${level}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />

                <Box sx={{ minWidth: 60 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>

                <IconButton
                  onClick={onOpenBadges}
                  size="small"
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  }}
                >
                  <EmojiEvents />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

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
  useTheme
} from '@mui/material';
import { EmojiEvents, Star } from '@mui/icons-material';
import { LogoIcon } from '../../constants';

const Header = ({ totalXp, level, xpForNextLevel, onOpenBadges }) => {
  const theme = useTheme();

  const progressPercentage = xpForNextLevel.max > 0
    ? (xpForNextLevel.current / xpForNextLevel.max) * 100
    : 0;

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LogoIcon sx={{ fontSize: 32 }} />
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

          {/* XP and Level Display */}
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

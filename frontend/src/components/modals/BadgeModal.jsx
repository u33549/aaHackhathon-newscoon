import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import { Close, EmojiEvents, Star } from '@mui/icons-material';
import { allAchievements, levelThresholds } from '../../constants';

const BadgeModal = ({ isOpen, onClose, badges, totalXp, earnedAchievements, level }) => {
  const theme = useTheme();

  const currentLevelXp = levelThresholds[level - 1] ?? 0;
  const nextLevelXp = levelThresholds[level] ?? Infinity;
  const progressPercentage = nextLevelXp > 0
    ? ((totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
    : 0;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 600
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmojiEvents color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Rozetler & Başarımlar
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Level and XP Section */}
        <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Seviye {level}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {totalXp} XP
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${totalXp - currentLevelXp}/${nextLevelXp - currentLevelXp} XP`}
                sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 600 }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                  borderRadius: 4
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Kazanılan Rozetler ({badges.length}/4)
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {badges.map((badge) => (
            <Grid item xs={12} sm={6} key={badge.id}>
              <Card sx={{
                border: `2px solid ${badge.color}`,
                bgcolor: 'background.paper'
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: badge.color, color: 'white' }}>
                    {badge.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {badge.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {badge.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Achievements Section */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Başarımlar ({earnedAchievements.size}/{allAchievements.length})
        </Typography>

        <Grid container spacing={2}>
          {allAchievements.map((achievement) => {
            const isEarned = earnedAchievements.has(achievement.id);

            return (
              <Grid item xs={12} sm={6} key={achievement.id}>
                <Card sx={{
                  opacity: isEarned ? 1 : 0.5,
                  border: isEarned ? '2px solid' : '1px solid',
                  borderColor: isEarned ? 'success.main' : 'divider'
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                      bgcolor: isEarned ? 'success.main' : 'grey.500',
                      color: 'white'
                    }}>
                      {achievement.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                    {isEarned && (
                      <Chip
                        label="✓"
                        size="small"
                        color="success"
                        sx={{ ml: 'auto' }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BadgeModal;

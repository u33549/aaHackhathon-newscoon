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
  useTheme,
  useMediaQuery,
  IconButton,
  Stack
} from '@mui/material';
import { Close, EmojiEvents, Star } from '@mui/icons-material';
import { allAchievements, levelThresholds, getIconComponent } from '../../constants/index.jsx';

const BadgeModal = ({ isOpen, onClose, badges, totalCp, earnedAchievements, level }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const currentLevelCp = levelThresholds[level - 1] ?? 0;
  const nextLevelCp = levelThresholds[level] ?? Infinity;
  const progressPercentage = nextLevelCp > 0
    ? ((totalCp - currentLevelCp) / (nextLevelCp - currentLevelCp)) * 100
    : 0;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isSmall} // Mobilde tam ekran
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          minHeight: { xs: '100vh', sm: 600 },
          m: { xs: 0, sm: 2 },
          bgcolor: theme.palette.mode === 'dark' ? '#121212' : 'background.paper',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: { xs: 1, md: 2 },
        px: { xs: 2, md: 3 },
        pt: { xs: 2, md: 3 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
          <EmojiEvents color="primary" fontSize={isMobile ? "medium" : "large"} />
          <Typography
            variant={isSmall ? "h6" : "h5"}
            fontWeight={600}
          >
            Rozetler & Başarımlar
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            p: { xs: 0.5, md: 1 }
          }}
        >
          <Close fontSize={isMobile ? "medium" : "large"} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        p: { xs: 2, md: 3 },
        maxHeight: { xs: 'calc(100vh - 120px)', sm: 'none' },
        overflowY: 'auto'
      }}>
        {/* Level and CP Section */}
        <Card sx={{
          mb: { xs: 3, md: 4 },
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 1.5, md: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, md: 2 }
              }}>
                <Avatar sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 }
                }}>
                  <Star fontSize={isMobile ? "medium" : "large"} />
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant={isSmall ? "h6" : "h5"}
                    fontWeight={600}
                  >
                    Seviye {level}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {totalCp} CP
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${totalCp - currentLevelCp}/${nextLevelCp - currentLevelCp} CP`}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.8rem' }
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: { xs: 6, md: 8 },
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
        <Typography
          variant={isSmall ? "body1" : "h6"}
          fontWeight={600}
          sx={{ mb: { xs: 1.5, md: 2 } }}
        >
          Kazanılan Rozetler ({badges.length}/4)
        </Typography>

        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 3, md: 4 } }}>
          {badges.map((badge) => (
            <Grid item xs={12} sm={6} key={badge.id}>
              <Card sx={{
                border: `2px solid ${badge.color}`,
                bgcolor: 'background.paper'
              }}>
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, md: 2 },
                  p: { xs: 1.5, md: 2 },
                  '&:last-child': { pb: { xs: 1.5, md: 2 } }
                }}>
                  <Avatar sx={{
                    bgcolor: badge.color,
                    color: 'white',
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 }
                  }}>
                    {getIconComponent(badge.icon)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant={isSmall ? "body1" : "h6"}
                      fontWeight={600}
                      fontSize={{ xs: '0.9rem', md: '1rem' }}
                    >
                      {badge.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={{ xs: '0.75rem', md: '0.875rem' }}
                    >
                      {badge.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 2, md: 3 } }} />

        {/* Achievements Section */}
        <Typography
          variant={isSmall ? "body1" : "h6"}
          fontWeight={600}
          sx={{ mb: { xs: 1.5, md: 2 } }}
        >
          Başarımlar ({earnedAchievements.size}/{allAchievements.length})
        </Typography>

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {allAchievements.map((achievement) => {
            const isEarned = earnedAchievements.has(achievement.id);

            return (
              <Grid item xs={12} sm={6} key={achievement.id}>
                <Card sx={{
                  opacity: isEarned ? 1 : 0.5,
                  border: isEarned ? '2px solid' : '1px solid',
                  borderColor: isEarned ? 'success.main' : 'divider'
                }}>
                  <CardContent sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 2 },
                    p: { xs: 1.5, md: 2 },
                    '&:last-child': { pb: { xs: 1.5, md: 2 } }
                  }}>
                    <Avatar sx={{
                      bgcolor: isEarned ? 'success.main' : 'grey.500',
                      color: 'white',
                      width: { xs: 32, md: 40 },
                      height: { xs: 32, md: 40 }
                    }}>
                      {getIconComponent(achievement.icon)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant={isSmall ? "body1" : "h6"}
                        fontWeight={600}
                        fontSize={{ xs: '0.9rem', md: '1rem' }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={{ xs: '0.75rem', md: '0.875rem' }}
                      >
                        {achievement.description}
                      </Typography>
                    </Box>
                    {isEarned && (
                      <Chip
                        label="✓"
                        size="small"
                        color="success"
                        sx={{
                          minWidth: 32,
                          height: 24,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{
        p: { xs: 2, md: 3 },
        pt: { xs: 1, md: 0 }
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            py: { xs: 1.2, md: 1.5 },
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BadgeModal;

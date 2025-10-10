import React, { useState, useMemo } from 'react';
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
  Tabs,
  Tab
} from '@mui/material';
import { Close, EmojiEvents, Star, Leaderboard as LeaderboardIcon } from '@mui/icons-material';
import { allAchievements, allBadges, checkBadgeEarned, checkAchievementCompleted, levelThresholds, getIconComponent, getUpdatedLeaderboard } from '../../constants/index.jsx';

const BadgeModal = ({ isOpen, onClose, badges, totalCp, earnedAchievements, level }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  const currentLevelCp = levelThresholds[level - 1] ?? 0;
  const nextLevelCp = levelThresholds[level] ?? Infinity;
  const progressPercentage = nextLevelCp > 0
    ? ((totalCp - currentLevelCp) / (nextLevelCp - currentLevelCp)) * 100
    : 0;

  // Kullanıcı verisi - tam userData objesi
  const userData = useMemo(() => ({
    achievements: { badges },
    readingProgress: {
      totalNewsRead: 0, // Bu değerler gerçek verilerden gelmeli
      totalStacksCompleted: 0 // Bu değerler gerçek verilerden gelmeli
    },
    stats: {
      currentLevel: level,
      totalXP: totalCp
    }
  }), [badges, level, totalCp]);

  // Kazanılan rozetleri filtrele
  const earnedBadgeIds = new Set(badges.map(b => b.id));

  // Kazanılan başarımları hesapla - gerçek kontrolle
  const earnedAchievementsCount = useMemo(() => {
    return allAchievements.filter(achievement =>
      checkAchievementCompleted(achievement, userData)
    ).length;
  }, [userData]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isSmall}
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
        p: 0,
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        maxHeight: { xs: 'calc(100vh - 120px)', sm: 'none' },
        overflowY: 'auto'
      }}>
        {/* Level and CP Section */}
        <Box sx={{
          display: 'flex',
          gap: { xs: 2, md: 3 },
          mb: { xs: 3, md: 4 },
          mt: { xs: 3, md: 4 }
        }}>
          {/* Level Box */}
          <Card sx={{
            flex: 1,
            bgcolor: 'background.paper',
            border: '2px solid #FFD700'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
              <Avatar sx={{
                bgcolor: '#FFD700',
                color: '#000',
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                mx: 'auto',
                mb: 1.5
              }}>
                <Star fontSize={isMobile ? "medium" : "large"} />
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  mb: 0.5
                }}
              >
                Seviye
              </Typography>
              <Typography
                variant={isSmall ? "h4" : "h3"}
                fontWeight={700}
                sx={{ color: '#FFD700' }}
              >
                {level}
              </Typography>
            </CardContent>
          </Card>

          {/* CP Box */}
          <Card sx={{
            flex: 1,
            bgcolor: 'background.paper',
            border: '2px solid #FFD700'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
              <Avatar sx={{
                bgcolor: '#FFD700',
                color: '#000',
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                mx: 'auto',
                mb: 1.5
              }}>
                <EmojiEvents fontSize={isMobile ? "medium" : "large"} />
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  mb: 0.5
                }}
              >
                Toplam CP
              </Typography>
              <Typography
                variant={isSmall ? "h4" : "h3"}
                fontWeight={700}
                sx={{ color: '#FFD700' }}
              >
                {totalCp}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Progress Bar */}
        <Card sx={{
          mb: { xs: 3, md: 4 },
          bgcolor: 'background.paper',
          border: '2px solid #FFD700'
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5
            }}>
              <Typography
                variant="body2"
                sx={{ color: '#FFD700', fontWeight: 600 }}
              >
                Sonraki Seviye
              </Typography>
              <Chip
                label={`${totalCp - currentLevelCp}/${nextLevelCp - currentLevelCp} CP`}
                sx={{
                  bgcolor: '#FFD700',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.8rem' }
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: { xs: 8, md: 10 },
                borderRadius: 5,
                bgcolor: 'rgba(50, 50, 50, 0.8)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#FFD700',
                  borderRadius: 5
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 48, md: 56 }
              },
              '& .Mui-selected': {
                color: 'primary.main'
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab
              label="Rozetler"
              icon={<EmojiEvents />}
              iconPosition="start"
            />
            <Tab
              label="Başarımlar"
              icon={<Star />}
              iconPosition="start"
            />
            <Tab
              label="Leaderboard"
              icon={<LeaderboardIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content - Rozetler */}
        {currentTab === 0 && (
          <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ width: '100%', mx: 0 }}>
            {allBadges.map((badge) => {
              // Rozet kazanılmış mı kontrol et - fonksiyon kullan
              const isEarned = checkBadgeEarned(badge, userData);

              return (
                <Grid item xs={12} key={badge.id} sx={{ width: '100%', px: 0 }}>
                  <Card sx={{
                    opacity: isEarned ? 1 : 0.5,
                    border: isEarned ? `2px solid ${badge.color}` : '1px solid',
                    borderColor: isEarned ? badge.color : 'divider',
                    bgcolor: 'background.paper',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <CardContent sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 2, md: 2.5 },
                      p: { xs: 2, md: 2.5 },
                      '&:last-child': { pb: { xs: 2, md: 2.5 } }
                    }}>
                      <Avatar sx={{
                        bgcolor: isEarned ? badge.color : 'grey.500',
                        color: 'white',
                        width: { xs: 50, md: 62 },
                        height: { xs: 50, md: 62 },
                        flexShrink: 0
                      }}>
                        {getIconComponent(badge.icon)}
                      </Avatar>
                      <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography
                          variant={isSmall ? "body1" : "h6"}
                          fontWeight={600}
                          fontSize={{ xs: '1.125rem', md: '1.25rem' }}
                          sx={{
                            lineHeight: 1.3,
                            mb: 0.5
                          }}
                        >
                          {badge.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={{ xs: '0.9375rem', md: '1.09375rem' }}
                          sx={{ lineHeight: 1.5 }}
                        >
                          {badge.description}
                        </Typography>
                      </Box>
                      {isEarned && (
                        <Chip
                          label="✓"
                          size="small"
                          sx={{
                            minWidth: 40,
                            height: 30,
                            fontSize: '0.875rem',
                            flexShrink: 0,
                            bgcolor: badge.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Tab Content - Başarımlar */}
        {currentTab === 1 && (
          <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ width: '100%', mx: 0 }}>
            {allAchievements.map((achievement) => {
              // Başarım tamamlanmış mı kontrol et - fonksiyon kullan
              const isEarned = checkAchievementCompleted(achievement, userData);

              return (
                <Grid item xs={12} key={achievement.id} sx={{ width: '100%', px: 0 }}>
                  <Card sx={{
                    opacity: isEarned ? 1 : 0.5,
                    border: isEarned ? '2px solid' : '1px solid',
                    borderColor: isEarned ? 'success.main' : 'divider',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <CardContent sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 2, md: 2.5 },
                      p: { xs: 2, md: 2.5 },
                      '&:last-child': { pb: { xs: 2, md: 2.5 } }
                    }}>
                      <Avatar sx={{
                        bgcolor: isEarned ? 'success.main' : 'grey.500',
                        color: 'white',
                        width: { xs: 50, md: 62 },
                        height: { xs: 50, md: 62 },
                        flexShrink: 0
                      }}>
                        {getIconComponent(achievement.icon)}
                      </Avatar>
                      <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography
                          variant={isSmall ? "body1" : "h6"}
                          fontWeight={600}
                          fontSize={{ xs: '1.125rem', md: '1.25rem' }}
                          sx={{
                            lineHeight: 1.3,
                            mb: 0.5
                          }}
                        >
                          {achievement.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={{ xs: '0.9375rem', md: '1.09375rem' }}
                          sx={{ lineHeight: 1.5 }}
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
                            minWidth: 40,
                            height: 30,
                            fontSize: '0.875rem',
                            flexShrink: 0
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Tab Content - Leaderboard */}
        {currentTab === 2 && (
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 3,
                color: 'text.primary',
                textAlign: 'center'
              }}
            >
              🏆 Liderlik Tablosu
            </Typography>

            <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ width: '100%', mx: 0 }}>
              {getUpdatedLeaderboard(totalCp, level).map((user) => {
                const isCurrentUser = user.isCurrentUser;
                const medalColors = {
                  1: '#FFD700', // Gold
                  2: '#C0C0C0', // Silver
                  3: '#CD7F32'  // Bronze
                };
                const medalColor = medalColors[user.rank];

                return (
                  <Grid item xs={12} key={user.id} sx={{ width: '100%', px: 0 }}>
                    <Card sx={{
                      bgcolor: isCurrentUser ? 'rgba(255, 215, 0, 0.1)' : 'background.paper',
                      border: isCurrentUser ? '2px solid #FFD700' : '1px solid',
                      borderColor: isCurrentUser ? '#FFD700' : 'divider',
                      width: '100%',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}>
                      <CardContent sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 2, md: 2.5 },
                        p: { xs: 2, md: 2.5 },
                        '&:last-child': { pb: { xs: 2, md: 2.5 } }
                      }}>
                        {/* Rank Badge */}
                        <Avatar sx={{
                          bgcolor: medalColor || 'grey.700',
                          color: 'white',
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          fontWeight: 'bold',
                          fontSize: { xs: '1.25rem', md: '1.5rem' },
                          flexShrink: 0,
                          border: medalColor ? '3px solid' : 'none',
                          borderColor: medalColor || 'transparent',
                          boxShadow: medalColor ? `0 4px 12px ${medalColor}40` : 'none'
                        }}>
                          {user.rank <= 3 ? (
                            <Box sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                              {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                            </Box>
                          ) : (
                            `#${user.rank}`
                          )}
                        </Avatar>

                        {/* User Info */}
                        <Box sx={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant={isSmall ? "body1" : "h6"}
                              fontWeight={700}
                              fontSize={{ xs: '1.125rem', md: '1.25rem' }}
                              sx={{
                                lineHeight: 1.3,
                                color: isCurrentUser ? '#FFD700' : 'text.primary'
                              }}
                            >
                              {user.name}
                            </Typography>
                            {isCurrentUser && (
                              <Chip
                                label="Sen"
                                size="small"
                                sx={{
                                  bgcolor: '#FFD700',
                                  color: '#000',
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={<Star sx={{ fontSize: 16 }} />}
                              label={`Level ${user.level}`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 215, 0, 0.15)',
                                color: '#FFD700',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 24
                              }}
                            />
                          </Box>
                        </Box>

                        {/* XP Display */}
                        <Box sx={{
                          textAlign: 'right',
                          flexShrink: 0
                        }}>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              color: isCurrentUser ? '#FFD700' : 'primary.main',
                              fontSize: { xs: '1.125rem', md: '1.375rem' }
                            }}
                          >
                            {user.xp.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          >
                            XP
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Info Message */}
            <Box sx={{
              mt: 3,
              p: 2,
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontSize: '0.875rem'
                }}
              >
                💡 Daha fazla haber okuyarak sıralamada yüksel!
              </Typography>
            </Box>
          </Box>
        )}
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

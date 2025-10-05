import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack
} from '@mui/material';
import { ArrowBack, Share, EmojiEvents } from '@mui/icons-material';
import { categoryColors } from '../constants/index.jsx';

const ArticlePage = ({
  article,
  onBack,
  onArticleComplete,
  totalXp,
  level,
  xpForNextLevel,
  onOpenBadges,
  onBonusXpEarned
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const progressPercentage = xpForNextLevel.max > 0
    ? (xpForNextLevel.current / xpForNextLevel.max) * 100
    : 0;

  const checkpointProgress = ((currentCheckpoint + 1) / article.content.length) * 100;

  useEffect(() => {
    // Auto-scroll to top when checkpoint changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCheckpoint]);

  const handleNextCheckpoint = () => {
    if (currentCheckpoint < article.content.length - 1) {
      setCurrentCheckpoint(prev => prev + 1);
    } else if (!isCompleted) {
      setIsCompleted(true);
      if (article.quiz) {
        setShowQuiz(true);
      } else {
        completeArticle();
      }
    }
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === '') return;

    const isCorrect = parseInt(selectedAnswer) === article.quiz.correctAnswerIndex;
    setQuizCompleted(true);

    if (isCorrect) {
      onBonusXpEarned(article.quiz.bonusXp);
    }

    setTimeout(() => {
      completeArticle();
    }, 2000);
  };

  const completeArticle = () => {
    const baseXp = 100; // Base XP for completing an article
    onArticleComplete(baseXp, article.id);

    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const currentContent = article.content[currentCheckpoint];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{
            justifyContent: 'space-between',
            py: { xs: 0.5, md: 1 },
            minHeight: { xs: 56, md: 64 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <IconButton
                onClick={onBack}
                sx={{
                  color: 'primary.main',
                  p: { xs: 0.5, md: 1 }
                }}
              >
                <ArrowBack fontSize={isMobile ? "medium" : "large"} />
              </IconButton>
              <Typography
                variant={isSmall ? "body1" : "h6"}
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Makale
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 2 }
            }}>
              {/* Progress - Desktop */}
              {!isMobile && (
                <Box sx={{ minWidth: 200 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Seviye {level}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {xpForNextLevel.current}/{xpForNextLevel.max} XP
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
              )}

              {/* Mobile: Compact display */}
              {isMobile && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    L{level}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    {totalXp}XP
                  </Typography>
                </Stack>
              )}

              <IconButton
                onClick={onOpenBadges}
                sx={{
                  color: 'primary.main',
                  p: { xs: 0.5, md: 1 }
                }}
              >
                <EmojiEvents fontSize={isMobile ? "medium" : "large"} />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile XP Progress */}
          {isMobile && (
            <Box sx={{ px: 2, pb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Article Header */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Chip
            label={article.superTitle}
            size={isSmall ? "small" : "medium"}
            sx={{
              bgcolor: categoryColors[article.category] || 'primary.main',
              color: 'white',
              fontWeight: 600,
              mb: { xs: 1.5, md: 2 }
            }}
          />

          <Typography
            variant={isSmall ? "h4" : isMobile ? "h3" : "h3"}
            component="h1"
            sx={{
              fontWeight: 700,
              mb: { xs: 1.5, md: 2 },
              lineHeight: { xs: 1.2, md: 1.3 }
            }}
          >
            {article.title}
          </Typography>

          <Typography
            variant={isSmall ? "body1" : "h6"}
            color="text.secondary"
            sx={{
              mb: { xs: 2, md: 3 },
              lineHeight: 1.5
            }}
          >
            {article.subtitle}
          </Typography>

          {/* Reading Progress */}
          <Card sx={{ mb: { xs: 3, md: 4 }, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: { xs: 1.5, md: 2 }
              }}>
                <Typography
                  variant={isSmall ? "body1" : "h6"}
                  fontWeight={600}
                >
                  Okuma İlerlemesi
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={{ xs: '0.8rem', md: '0.875rem' }}
                >
                  {currentCheckpoint + 1} / {article.content.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={checkpointProgress}
                sx={{
                  height: { xs: 6, md: 8 },
                  borderRadius: 4,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                    borderRadius: 4
                  }
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Content */}
        {!showQuiz ? (
          <Card sx={{ mb: { xs: 3, md: 4 } }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant={isSmall ? "h5" : "h4"}
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                  lineHeight: 1.3
                }}
              >
                {currentContent.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: { xs: 1.7, md: 1.8 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  textAlign: 'justify'
                }}
              >
                {currentContent.paragraph}
              </Typography>
            </CardContent>

            <CardActions sx={{
              p: { xs: 3, md: 4 },
              pt: 0,
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'text.secondary',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Paylaş
              </Button>

              <Button
                variant="contained"
                onClick={handleNextCheckpoint}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {currentCheckpoint < article.content.length - 1 ? 'Devam Et' : 'Makaleyi Tamamla'}
              </Button>
            </CardActions>
          </Card>
        ) : (
          // Quiz Section
          <Card sx={{ mb: { xs: 3, md: 4 } }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant={isSmall ? "h5" : "h4"}
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                  lineHeight: 1.3
                }}
              >
                Bonus Soru! 🎯
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6
                }}
              >
                {article.quiz.question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={quizCompleted}
                >
                  {article.quiz.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={option}
                      sx={{
                        mb: { xs: 1.5, md: 2 },
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selectedAnswer === index.toString() ? 'primary.main' : 'divider',
                        bgcolor: selectedAnswer === index.toString() ? 'action.hover' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        },
                        '& .MuiFormControlLabel-label': {
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {quizCompleted && (
                <Box sx={{
                  mt: { xs: 2, md: 3 },
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  bgcolor: 'success.main',
                  color: 'white'
                }}>
                  <Typography
                    variant={isSmall ? "body1" : "h6"}
                    fontWeight={600}
                  >
                    {parseInt(selectedAnswer) === article.quiz.correctAnswerIndex
                      ? `Doğru! +${article.quiz.bonusXp} Bonus XP kazandın! 🎉`
                      : 'Yanlış cevap, ama endişelenme! 💪'
                    }
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{
              p: { xs: 3, md: 4 },
              pt: 0,
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="contained"
                onClick={handleQuizSubmit}
                disabled={selectedAnswer === '' || quizCompleted}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {quizCompleted ? 'Tamamlandı' : 'Cevapla'}
              </Button>
            </CardActions>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ArticlePage;

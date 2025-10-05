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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import { ArrowBack, Share, EmojiEvents } from '@mui/icons-material';
import { categoryColors } from '../constants';

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
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={onBack} sx={{ color: 'primary.main' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Makale
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Progress */}
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

              <Button
                variant="outlined"
                startIcon={<EmojiEvents />}
                onClick={onOpenBadges}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }}
              >
                Rozetler
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Article Header */}
        <Box sx={{ mb: 4 }}>
          <Chip
            label={article.superTitle}
            size="small"
            sx={{
              bgcolor: categoryColors[article.category] || 'primary.main',
              color: 'white',
              fontWeight: 600,
              mb: 2
            }}
          />

          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            {article.title}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {article.subtitle}
          </Typography>

          {/* Reading Progress */}
          <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Okuma İlerlemesi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentCheckpoint + 1} / {article.content.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={checkpointProgress}
                sx={{
                  height: 8,
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
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                {currentContent.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  textAlign: 'justify'
                }}
              >
                {currentContent.paragraph}
              </Typography>
            </CardContent>

            <CardActions sx={{ p: 4, pt: 0, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{ color: 'text.secondary', borderColor: 'text.secondary' }}
              >
                Paylaş
              </Button>

              <Button
                variant="contained"
                onClick={handleNextCheckpoint}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {currentCheckpoint < article.content.length - 1 ? 'Devam Et' : 'Makaleyi Tamamla'}
              </Button>
            </CardActions>
          </Card>
        ) : (
          // Quiz Section
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                Bonus Soru! 🎯
              </Typography>

              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
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
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selectedAnswer === index.toString() ? 'primary.main' : 'divider',
                        bgcolor: selectedAnswer === index.toString() ? 'action.hover' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {quizCompleted && (
                <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'success.main', color: 'white' }}>
                  <Typography variant="h6" fontWeight={600}>
                    {parseInt(selectedAnswer) === article.quiz.correctAnswerIndex
                      ? `Doğru! +${article.quiz.bonusXp} Bonus XP kazandın! 🎉`
                      : 'Yanlış cevap, ama endişelenme! 💪'
                    }
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ p: 4, pt: 0, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleQuizSubmit}
                disabled={selectedAnswer === '' || quizCompleted}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
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

import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  Slide
} from '@mui/material';
import { Star, TrendingUp } from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const AchievementToast = ({ data }) => {
  if (!data) return null;

  const isLevelUp = data.title.includes('Seviye');

  return (
    <Snackbar
      open={!!data}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="info"
        variant="filled"
        sx={{
          bgcolor: isLevelUp ? 'primary.main' : 'info.main',
          color: 'white',
          minWidth: 350,
          '& .MuiAlert-icon': {
            display: 'none'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            bgcolor: 'white',
            color: isLevelUp ? 'primary.main' : 'info.main'
          }}>
            {isLevelUp ? <Star /> : <TrendingUp />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {data.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {data.subtitle}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AchievementToast;

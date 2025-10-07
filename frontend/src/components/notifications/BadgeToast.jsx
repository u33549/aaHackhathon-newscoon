import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  Slide
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const BadgeToast = ({ data }) => {
  if (!data) return null;

  return (
    <Snackbar
      open={!!data}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="success"
        variant="filled"
        sx={{
          bgcolor: 'success.main',
          color: 'white',
          minWidth: 350,
          '& .MuiAlert-icon': {
            display: 'none'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: data.badge?.color || 'success.main' }}>
            {data.badge?.icon || <EmojiEvents />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Yeni Rozet Kazandın! 🎉
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {data.badge?.name} - +{data.xp} XP
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default BadgeToast;

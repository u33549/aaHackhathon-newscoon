import React, { useEffect } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useAppDispatch, useToasts } from '../../hooks/redux';
import { removeToast } from '../../store/slices/uiSlice';

const ToastNotification = () => {
  const dispatch = useAppDispatch();
  const toasts = useToasts();

  const handleClose = (toastId) => {
    dispatch(removeToast(toastId));
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration || 4000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'left' }}
          sx={{
            mt: index * 7, // Stack multiple toasts
          }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.type || 'info'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.title && (
              <strong>{toast.title}: </strong>
            )}
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default ToastNotification;

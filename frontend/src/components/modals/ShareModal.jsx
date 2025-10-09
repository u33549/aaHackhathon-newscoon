import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  useTheme,
  Snackbar,
  Alert,
  Backdrop,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  ContentCopy,
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  Instagram,
  Telegram
} from '@mui/icons-material';

const ShareModal = ({ open, onClose, url, title, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => onClose(), 1500); // 1.5 saniye sonra kapat
    } catch (err) {
      // Fallback for older browsers
      const textField = document.createElement('textarea');
      textField.innerText = url;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      setCopySuccess(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      instagram: `https://www.instagram.com/`
    };

    if (platform === 'instagram') {
      handleCopyLink();
      window.open('https://www.instagram.com/', '_blank');
      return;
    }

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onClose(); // Paylaştıktan sonra modalı kapat
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      icon: <WhatsApp sx={{ fontSize: 32 }} />,
      color: '#25D366'
    },
    {
      id: 'facebook',
      icon: <Facebook sx={{ fontSize: 32 }} />,
      color: '#1877F2'
    },
    {
      id: 'twitter',
      icon: <Twitter sx={{ fontSize: 32 }} />,
      color: '#1DA1F2'
    },
    {
      id: 'linkedin',
      icon: <LinkedIn sx={{ fontSize: 32 }} />,
      color: '#0A66C2'
    },
    {
      id: 'telegram',
      icon: <Telegram sx={{ fontSize: 32 }} />,
      color: '#0088CC'
    },
    {
      id: 'email',
      icon: <Email sx={{ fontSize: 32 }} />,
      color: '#EA4335'
    },
    {
      id: 'instagram',
      icon: <Instagram sx={{ fontSize: 32 }} />,
      color: '#E4405F'
    }
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            borderRadius: 3,
            m: { xs: 2, sm: 3 },
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <Close sx={{ fontSize: 24 }} />
        </IconButton>

        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 4 },
          pt: { xs: 4, sm: 5 },
          textAlign: 'center'
        }}>
          {/* Title */}
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              mb: { xs: 4, sm: 6 },
              fontWeight: 300,
              color: 'white',
              fontSize: { xs: '1.75rem', sm: '2.5rem' }
            }}
          >
            Paylaş
          </Typography>

          {/* Share Options Grid */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, sm: 6 },
            width: '100%',
            maxWidth: '500px'
          }}>
            {shareOptions.map((option) => (
              <Box
                key={option.id}
                onClick={() => handleShare(option.id)}
                sx={{
                  width: { xs: 55, sm: 60 },
                  height: { xs: 55, sm: 60 },
                  borderRadius: '50%',
                  backgroundColor: option.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: `0 8px 32px ${option.color}40`,
                    filter: 'brightness(1.1)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  }
                }}
              >
                {React.cloneElement(option.icon, {
                  sx: {
                    color: 'white',
                    fontSize: { xs: 22, sm: 24 }
                  }
                })}
              </Box>
            ))}
          </Box>

          {/* Link Copy Section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}>
            <TextField
              fullWidth
              value={url}
              size="medium"
              InputProps={{
                readOnly: true,
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '0.9rem'
                }
              }}
            />
            <IconButton
              onClick={handleCopyLink}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          Link kopyalandı!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareModal;

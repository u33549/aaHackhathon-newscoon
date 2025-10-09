import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
    } catch (err) {
      // Fallback for older browsers
      const textField = document.createElement('textarea');
      textField.innerText = url;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      setCopySuccess(true);
    }
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct URL sharing
    };

    if (platform === 'instagram') {
      // Instagram için link kopyalama ve kullanıcıyı yönlendirme
      handleCopyLink();
      window.open('https://www.instagram.com/', '_blank');
      return;
    }

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <WhatsApp />,
      color: '#25D366',
      description: 'WhatsApp\'ta paylaş'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook />,
      color: '#1877F2',
      description: 'Facebook\'ta paylaş'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
      description: 'Twitter\'da paylaş'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0A66C2',
      description: 'LinkedIn\'de paylaş'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Telegram />,
      color: '#0088CC',
      description: 'Telegram\'da paylaş'
    },
    {
      id: 'email',
      name: 'E-posta',
      icon: <Email />,
      color: '#EA4335',
      description: 'E-posta ile gönder'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram />,
      color: '#E4405F',
      description: 'Instagram\'da paylaş'
    }
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            minHeight: { xs: '100vh', sm: 'auto' },
            m: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          px: { xs: 2, md: 3 },
          pt: { xs: 2, md: 3 }
        }}>
          <Typography variant="h6" fontWeight={600}>
            Haber Yığını Paylaş
          </Typography>
          <IconButton onClick={onClose} sx={{ p: 1 }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Link kopyalama alanı */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Link Kopyala
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={url}
                size="small"
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: 'grey.50' }
                }}
              />
              <Button
                variant="contained"
                onClick={handleCopyLink}
                startIcon={<ContentCopy />}
                sx={{ flexShrink: 0 }}
              >
                Kopyala
              </Button>
            </Box>
          </Box>

          {/* Sosyal medya paylaşım seçenekleri */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Sosyal Medyada Paylaş
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: 2
            }}>
              {shareOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  variant="outlined"
                  startIcon={option.icon}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    flexDirection: 'column',
                    gap: 0.5,
                    height: { xs: 70, sm: 80 },
                    borderColor: option.color,
                    color: option.color,
                    '&:hover': {
                      backgroundColor: `${option.color}15`,
                      borderColor: option.color
                    }
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    {option.name}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>

          {/* Paylaşım bilgisi */}
          <Box sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {description}
            </Typography>
            <Chip
              label="Newscoon"
              size="small"
              color="primary"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Button onClick={onClose} fullWidth variant="outlined">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kopyalama başarı mesajı */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success" variant="filled">
          Link kopyalandı!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareModal;

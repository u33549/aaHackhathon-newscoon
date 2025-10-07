import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { LogoIcon } from '../../constants/index.jsx';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderTopColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Logo ve Açıklama */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LogoIcon sx={{ width: 24, height: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Newscoon
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Güncel haberleri takip edin, okuyarak XP kazanın ve rozetler toplayın.
              Haber okuma deneyiminizi gamification ile daha eğlenceli hale getirin.
            </Typography>
          </Grid>

          {/* Hızlı Linkler */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Hızlı Linkler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="body2"
                component={Link}
                to="/"
                sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Ana Sayfa
              </Typography>
              <Typography
                variant="body2"
                component={Link}
                to="/admin"
                sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Admin Panel
              </Typography>
            </Box>
          </Grid>

          {/* Kategoriler */}
          <Grid item xs={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Kategoriler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Teknoloji</Typography>
              <Typography variant="body2" color="text.secondary">Spor</Typography>
              <Typography variant="body2" color="text.secondary">Sağlık</Typography>
              <Typography variant="body2" color="text.secondary">Bilim</Typography>
            </Box>
          </Grid>

          {/* Sosyal Medya */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Bizi Takip Edin
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="primary" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="primary" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="primary" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="primary" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Newscoon. Tüm hakları saklıdır.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Route yapısı başarıyla kuruldu!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link,
  Divider,
  useTheme
} from '@mui/material';
import { LogoIcon } from '../../constants';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LogoIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                Newscoon
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Haber okuma deneyimini oyunlaştıran modern platform. 
              Öğren, kazan ve seviye atla!
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Hızlı Erişim
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Ana Sayfa
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Kategoriler
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Rozetler
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Liderlik Tablosu
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Kategoriler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Teknoloji
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Ekonomi
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Bilim
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Sağlık
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Destek
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Yardım
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                İletişim
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Geri Bildirim
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Hakkımızda
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Yasal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="text.secondary" underline="hover">
                Gizlilik
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Kullanım Şartları
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                KVKK
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Newscoon. Tüm hakları saklıdır.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Haber okuma deneyimini yeniden keşfedin
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

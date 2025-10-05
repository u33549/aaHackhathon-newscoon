import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link,
  Divider,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { LogoIcon } from '../../constants';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: { xs: 4, md: 6 },
        mt: { xs: 6, md: 8 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Logo and Description */}
          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, md: 2 },
              mb: { xs: 1.5, md: 2 },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <LogoIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              <Typography
                variant={isSmall ? "h6" : "h6"}
                fontWeight={700}
                color="primary.main"
              >
                Newscoon
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '0.85rem', md: '0.875rem' }
              }}
            >
              Haber okuma deneyimini oyunlaştıran modern platform.
              Öğren, kazan ve seviye atla!
            </Typography>
          </Grid>

          {/* Links - Mobile Stack, Desktop Grid */}
          <Grid item xs={12} md={6} lg={8}>
            {isMobile ? (
              // Mobile: Stack layout
              <Stack spacing={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                    Hızlı Erişim
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Ana Sayfa</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Kategoriler</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Rozetler</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Liderlik</Link>
                  </Stack>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                    Destek & Yasal
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Yardım</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">İletişim</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">Gizlilik</Link>
                    <Link href="#" color="text.secondary" underline="hover" fontSize="0.85rem">KVKK</Link>
                  </Stack>
                </Box>
              </Stack>
            ) : (
              // Desktop: Grid layout
              <Grid container spacing={4}>
                {/* Quick Links */}
                <Grid item sm={6} md={3}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Hızlı Erişim
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Link href="#" color="text.secondary" underline="hover">Ana Sayfa</Link>
                    <Link href="#" color="text.secondary" underline="hover">Kategoriler</Link>
                    <Link href="#" color="text.secondary" underline="hover">Rozetler</Link>
                    <Link href="#" color="text.secondary" underline="hover">Liderlik Tablosu</Link>
                  </Box>
                </Grid>

                {/* Categories */}
                <Grid item sm={6} md={3}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Kategoriler
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Link href="#" color="text.secondary" underline="hover">Teknoloji</Link>
                    <Link href="#" color="text.secondary" underline="hover">Ekonomi</Link>
                    <Link href="#" color="text.secondary" underline="hover">Bilim</Link>
                    <Link href="#" color="text.secondary" underline="hover">Sağlık</Link>
                  </Box>
                </Grid>

                {/* Support */}
                <Grid item sm={6} md={3}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Destek
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Link href="#" color="text.secondary" underline="hover">Yardım</Link>
                    <Link href="#" color="text.secondary" underline="hover">İletişim</Link>
                    <Link href="#" color="text.secondary" underline="hover">Geri Bildirim</Link>
                    <Link href="#" color="text.secondary" underline="hover">Hakkımızda</Link>
                  </Box>
                </Grid>

                {/* Legal */}
                <Grid item sm={6} md={3}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Yasal
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Link href="#" color="text.secondary" underline="hover">Gizlilik</Link>
                    <Link href="#" color="text.secondary" underline="hover">Kullanım Şartları</Link>
                    <Link href="#" color="text.secondary" underline="hover">KVKK</Link>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        {/* Copyright */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1, md: 2 },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={{ xs: '0.8rem', md: '0.875rem' }}
          >
            © 2025 Newscoon. Tüm hakları saklıdır.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={{ xs: '0.8rem', md: '0.875rem' }}
          >
            Haber okuma deneyimini yeniden keşfedin
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

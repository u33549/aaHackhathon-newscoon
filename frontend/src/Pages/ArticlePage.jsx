import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Geri Dön
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Chip label="Teknoloji" color="primary" sx={{ mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Makale Başlığı {id}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            7 Ocak 2025 • 5 dakika okuma süresi
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <img
            src={`https://picsum.photos/800/400?random=${id}`}
            alt="Makale görseli"
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </Box>

        <Typography variant="body1" paragraph>
          Bu makale #{id} için örnek içeriktir. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>

        <Typography variant="body1" paragraph>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>

        <Typography variant="body1" paragraph>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.
        </Typography>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Bu makaleyi okudunuz! Route yapısı başarıyla çalışıyor.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ArticlePage;

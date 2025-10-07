import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Dashboard, Home, Article } from '@mui/icons-material';
import { LogoIcon } from '../../constants/index.jsx';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderBottomColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{
          justifyContent: 'space-between',
          py: 1
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LogoIcon sx={{ width: 32, height: 32 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 'bold'
              }}
            >
              Newscoon
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile ? (
              <>
                <IconButton
                  component={Link}
                  to="/"
                  color={location.pathname === '/' ? 'primary' : 'default'}
                >
                  <Home />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/admin"
                  color={location.pathname === '/admin' ? 'primary' : 'default'}
                >
                  <Dashboard />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/"
                  variant={location.pathname === '/' ? 'contained' : 'text'}
                  startIcon={<Home />}
                >
                  Ana Sayfa
                </Button>
                <Button
                  component={Link}
                  to="/admin"
                  variant={location.pathname === '/admin' ? 'contained' : 'text'}
                  startIcon={<Dashboard />}
                  color="secondary"
                >
                  Admin Panel
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

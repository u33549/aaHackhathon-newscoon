import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';

const NewsSection = ({ title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Typography
          variant={isSmall ? "h5" : isMobile ? "h4" : "h4"}
          component="h2"
          sx={{
            fontWeight: 600,
            mb: { xs: 2, md: 3 },
            color: 'text.primary',
            px: { xs: 1, md: 0 }
          }}
        >
          {title}
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {React.Children.map(children, (child, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
            >
              {child}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsSection;

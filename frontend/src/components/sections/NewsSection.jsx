import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';

const NewsSection = ({ title, children }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>

        <Grid container spacing={3}>
          {React.Children.map(children, (child, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              {child}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsSection;

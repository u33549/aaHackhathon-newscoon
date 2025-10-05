import React from 'react';
import {
  Box,
  Container,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { categoryColors } from '../../constants/index.jsx';

const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { id: 'all', name: 'Tümü', color: 'primary.main' },
    { id: 'teknoloji', name: 'Teknoloji', color: categoryColors.teknoloji },
    { id: 'ekonomi', name: 'Ekonomi', color: categoryColors.ekonomi },
    { id: 'bilim', name: 'Bilim', color: categoryColors.bilim },
    { id: 'saglik', name: 'Sağlık', color: categoryColors.saglik }
  ];

  return (
    <Box sx={{
      bgcolor: 'background.default',
      py: { xs: 1.5, md: 2 },
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          gap: { xs: 0.8, md: 1 },
          overflowX: 'auto',
          pb: { xs: 1, md: 1 },
          px: { xs: 0, md: 0 },
          // Mobilde scroll bar gizle
          '&::-webkit-scrollbar': {
            height: { xs: 3, md: 6 }
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3
          },
          // Mobilde snap scroll
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth'
        }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => onSelectCategory(category.id)}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              size={isMobile ? 'medium' : 'medium'}
              sx={{
                minWidth: 'fit-content',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                height: { xs: 32, md: 36 },
                px: { xs: 1.5, md: 2 },
                flexShrink: 0, // Mobilde küçülmesin
                scrollSnapAlign: 'start',
                ...(selectedCategory === category.id ? {
                  bgcolor: category.color,
                  color: 'white',
                  '&:hover': {
                    bgcolor: category.color,
                    filter: 'brightness(0.9)'
                  }
                } : {
                  borderColor: category.color,
                  color: category.color,
                  '&:hover': {
                    bgcolor: `${category.color}20`,
                    borderColor: category.color
                  }
                })
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryPills;

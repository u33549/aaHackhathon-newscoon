import React from 'react';
import {
  Box,
  Container,
  Chip,
  useTheme
} from '@mui/material';
import { categoryColors } from '../../constants';

const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  const theme = useTheme();

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
      py: 2,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: 6
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3
          }
        }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => onSelectCategory(category.id)}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                minWidth: 'fit-content',
                fontWeight: 600,
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

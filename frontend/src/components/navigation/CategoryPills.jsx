import React from 'react';
import {
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';

<<<<<<< HEAD
const CategoryPills = ({ selectedCategory, onCategoryChange }) => {
=======
const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'gundem', label: 'Gündem' },
    { id: 'dunya', label: 'Dünya' },
    { id: 'ekonomi', label: 'Ekonomi' },
    { id: 'spor', label: 'Spor' },
    { id: 'analiz', label: 'Analiz' },
    { id: 'kultur', label: 'Kültür' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        py: 2,
        // Scrollbar'ı tamamen gizle
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE ve Edge
        '&::-webkit-scrollbar': {
          display: 'none' // Chrome, Safari, Opera
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          minWidth: 'fit-content',
          px: isMobile ? 2 : 0,
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
<<<<<<< HEAD
            onClick={() => onCategoryChange(category.id)}
=======
            onClick={() => onSelectCategory(category.id)}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
            sx={{
              borderRadius: 25, // Daha oval şekil
              px: 2,
              py: 0.5,
              fontSize: '0.9rem',
              fontWeight: 500,
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ...(selectedCategory === category.id
                ? {
                    backgroundColor: 'primary.main',
                    color: '#1a1a1a', // Koyu yazı rengi (aktif pill için)
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      color: '#1a1a1a', // Hover durumunda da koyu yazı
                    },
                  }
                : {
                    backgroundColor: 'transparent',
                    color: 'text.primary',
                    borderColor: 'grey.300',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      borderColor: 'grey.400',
                    },
                  }),
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryPills;

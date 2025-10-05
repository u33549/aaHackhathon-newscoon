import React, { useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Hero from '../components/sections/Hero';
import SearchBar from '../components/navigation/SearchBar';
import CategoryPills from '../components/navigation/CategoryPills';
import NewsSection from '../components/sections/NewsSection';

const MainPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Hero />

      {/* Search and Category Section - Ayıraç olmadan birleşik */}
      <Box sx={{ backgroundColor: 'background.default', pt: 3 }}>
        <Container maxWidth="lg">
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Haber ara..."
          />

          {/* Category Pills - SearchBar ile arasında boşluk yok */}
          <CategoryPills
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Container>
      </Box>

      {/* News Section */}
      <Container maxWidth="lg" sx={{ mt: 0 }}>
        <NewsSection
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </Container>
    </Box>
  );
};

export default MainPage;
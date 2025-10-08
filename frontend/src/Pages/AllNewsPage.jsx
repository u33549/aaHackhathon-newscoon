import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import { ArrowBack, AccessTime } from '@mui/icons-material';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useNews,
  useNewsLoading,
  useSearchQuery,
  useActiveCategory
} from '../hooks/redux';
import {
  fetchAllNews
} from '../store/slices/newsSlice';
import {
  setSearchQuery,
  setActiveCategory
} from '../store/slices/uiSlice';

// Components
import CategoryPills from '../components/navigation/CategoryPills';
import SearchBar from '../components/navigation/SearchBar';

const AllNewsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state kullan
  const { news } = useNews();
  const isLoading = useNewsLoading();
  const searchQuery = useSearchQuery();
  const selectedCategory = useActiveCategory();

  // Component mount olduğunda haberleri getir
  useEffect(() => {
    if (news.length === 0) {
      dispatch(fetchAllNews());
    }
  }, [dispatch, news.length]);

  // Timeline'a göre sıralanan tüm haberler (Redux'tan gelen gerçek veriler)
  const allNews = [...news].sort((a, b) =>
    new Date(b.pubDate || b.createdAt || Date.now()) - new Date(a.pubDate || a.createdAt || Date.now())
  );

  // Filter news by category and search
  let filteredNews = selectedCategory === 'all' || !selectedCategory
    ? allNews
    : allNews.filter(article => article.category === selectedCategory);

  if (searchQuery) {
    filteredNews = filteredNews.filter(article => {
      const title = article.title?.toLowerCase() || '';
      const summary = article.summary?.toLowerCase() || article.description?.toLowerCase() || '';

      // content array'ini string'e çevir
      let contentText = '';
      if (Array.isArray(article.content)) {
        contentText = article.content
          .map(item => `${item.title || ''} ${item.paragraph || ''}`)
          .join(' ')
          .toLowerCase();
      } else if (typeof article.content === 'string') {
        contentText = article.content.toLowerCase();
      }
      
      const searchTerm = searchQuery.toLowerCase();
      return title.includes(searchTerm) || 
             summary.includes(searchTerm) || 
             contentText.includes(searchTerm);
    });
  }

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setActiveCategory(categoryId));
  };

  const handleNewsClick = (newsId) => {
    navigate(`/article/${newsId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmeyen tarih';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && news.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6" color="text.secondary">
            Haberler yükleniyor...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Ana Sayfaya Dön
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Tüm Haberler
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {filteredNews.length} haber bulundu
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Haberlerde ara..."
        />
        
        <CategoryPills
          selectedCategory={selectedCategory || 'all'}
          onCategoryChange={handleCategoryChange}
        />
      </Box>

      {/* News Grid */}
      <Grid container spacing={3}>
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <Grid item xs={12} key={news.id || news.guid}>
              <Card
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => handleNewsClick(news.id || news.guid)}
              >
                {/* News Image */}
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', sm: 250 },
                    height: { xs: 200, sm: 150 },
                    objectFit: 'cover'
                  }}
                  image={news.imageUrl || news.image || 'https://via.placeholder.com/250x150'}
                  alt={news.title}
                />
                
                {/* News Content */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={news.category?.charAt(0).toUpperCase() + news.category?.slice(1) || 'Genel'}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {news.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {news.description || news.summary || 'Açıklama bulunmuyor'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {formatDate(news.pubDate || news.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Arama kriterlerinize uygun haber bulunamadı
              </Typography>
              <Typography variant="body2">
                Farklı anahtar kelimeler deneyin veya kategori filtresini değiştirin
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AllNewsPage;

import React, { useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { ArrowBack, AccessTime, Visibility } from '@mui/icons-material';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useStacks,
  useStacksLoading,
  useSearchQuery,
  useActiveCategory
} from '../hooks/redux';
import {
  fetchAllStacks
} from '../store/slices/stackSlice';
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

  // Redux state kullan - stacks için
  const { stacks } = useStacks();
  const isLoading = useStacksLoading();
  const searchQuery = useSearchQuery();
  const selectedCategory = useActiveCategory();

  // Component mount olduğunda haber yığınlarını getir
  useEffect(() => {
    if (stacks.length === 0) {
      dispatch(fetchAllStacks());
    }
  }, [dispatch, stacks.length]);

  // Timeline'a göre sıralanan tüm haber yığınları (Redux'tan gelen gerçek veriler)
  const allStacks = [...stacks].sort((a, b) =>
    new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
  );

  // Filter stacks by category and search
  let filteredStacks = selectedCategory === 'all' || !selectedCategory
    ? allStacks
    : allStacks.filter(stack => stack.mainCategory === selectedCategory);

  if (searchQuery) {
    filteredStacks = filteredStacks.filter(stack => {
      const title = stack.title?.toLowerCase() || '';
      const description = stack.description?.toLowerCase() || '';
      const tags = stack.tags?.join(' ').toLowerCase() || '';

      const searchTerm = searchQuery.toLowerCase();
      return title.includes(searchTerm) || 
             description.includes(searchTerm) ||
             tags.includes(searchTerm);
    });
  }

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setActiveCategory(categoryId));
  };

  const handleStackClick = (stackId) => {
    navigate(`/stack/${stackId}`);
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

  const getStackImage = (stack) => {
    // Stack'in kendi resim verilerini kullan
    if (stack.imageUrl) {
      return stack.imageUrl;
    }
    if (stack.photoUrl) {
      return stack.photoUrl;
    }
    // Stack'teki son haberin resmini kullan
    if (stack.news && stack.news.length > 0) {
      const firstNews = stack.news[stack.news.length-1];
      if (typeof firstNews === 'object' && firstNews.image) {
        return firstNews.image;
      }
    }
    return 'https://via.placeholder.com/250x150';
  };

  if (isLoading && stacks.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6" color="text.secondary">
            Haber yığınları yükleniyor...
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
          Tüm Haber Yığınları
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {filteredStacks.length} haber yığını bulundu
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Haber yığınlarında ara..."
        />
        
        <CategoryPills
          selectedCategory={selectedCategory || 'all'}
          onCategoryChange={handleCategoryChange}
        />
      </Box>

      {/* Stacks Grid */}
      <Grid container spacing={3}>
        {filteredStacks.length > 0 ? (
          filteredStacks.map((stack) => (
            <Grid item xs={12} key={stack._id}>
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
                onClick={() => handleStackClick(stack._id)}
              >
                {/* Stack Image */}
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', sm: 250 },
                    height: { xs: 200, sm: 150 },
                    objectFit: 'cover'
                  }}
                  image={getStackImage(stack)}
                  alt={stack.title}
                />
                
                {/* Stack Content */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={stack.mainCategory?.charAt(0).toUpperCase() + stack.mainCategory?.slice(1) || 'Genel'}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${stack.news?.length || 0} Haber`}
                      size="small"
                      variant="outlined"
                    />
                    {stack.xp && (
                      <Chip
                        label={`${stack.xp} XP`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
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
                    {stack.title}
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
                    {stack.description || 'Açıklama bulunmuyor'}
                  </Typography>

                  {/* Tags */}
                  {stack.tags && stack.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {stack.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {formatDate(stack.createdAt)}
                      </Typography>
                    </Box>

                    {stack.viewCount && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {stack.viewCount} görüntülenme
                        </Typography>
                      </Box>
                    )}
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
                Arama kriterlerinize uygun haber yığını bulunamadı
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

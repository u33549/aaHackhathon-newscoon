import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useNews,
  useNewsLoading,
  useSearchQuery,
  useActiveCategory,
  useStacksLoading,
  usePopularStacks,
  useLatestStacks
} from '../hooks/redux';
import {
  fetchAllNews,
  setSelectedNews
} from '../store/slices/newsSlice';
import {
  fetchPopularStacks,
  fetchLatestStacks,
  setSelectedStack
} from '../store/slices/stackSlice';
import {
  setSearchQuery,
  setActiveCategory,
  addToast,
  openBadgeModal
} from '../store/slices/uiSlice';

// Components
import Hero from '../components/sections/Hero';
import NewsSection from '../components/sections/NewsSection';
import NewsCard from '../components/cards/NewsCard';
import CategoryPills from '../components/navigation/CategoryPills';
import SearchBar from '../components/navigation/SearchBar';
import BadgeModal from '../components/modals/BadgeModal';
import AchievementToast from '../components/notifications/AchievementToast';
import BadgeToast from '../components/notifications/BadgeToast';

// Data and utilities
import {
  allBadges,
  levelThresholds,
  allAchievements
} from '../constants/index.jsx';

const MainPage = () => {
  // Redux state
  const dispatch = useAppDispatch();
  const { news, selectedNews } = useNews();
  const popularStacks = usePopularStacks();
  const latestStacks = useLatestStacks();
  const stacksLoading = useStacksLoading();
  const isLoading = useNewsLoading();
  const searchQuery = useSearchQuery();
  const selectedCategory = useActiveCategory();

  // Local state (will gradually move to Redux)
  const [totalCp, setTotalCp] = useState(0);
  const [readArticles, setReadArticles] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [notificationToast, setNotificationToast] = useState(null);
  const [streakData, setStreakData] = useState({ current: 0, lastDate: null });
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());

  // Refs for timers
  const toastTimerRef = useRef(null);
  const notificationTimerRef = useRef(null);

  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (news.length === 0) {
          dispatch(fetchAllNews());
        }
      } catch (error) {
        console.warn('News API hatası:', error);
      }

      try {
        if (popularStacks.length === 0) {
          dispatch(fetchPopularStacks(20)); // En popüler 20 stack'i getir
        }
      } catch (error) {
        console.warn('Popular Stacks API hatası:', error);
      }

      try {
        if (latestStacks.length === 0) {
          dispatch(fetchLatestStacks(20)); // En son 20 stack'i getir
        }
      } catch (error) {
        console.warn('Latest Stacks API hatası:', error);
      }
    };

    loadData();
  }, [dispatch, news.length, popularStacks.length, latestStacks.length]);

  // Utility functions
  const calculateLevel = (cp) => {
    let level = 1;
    for (let i = 1; i < levelThresholds.length; i++) {
      if (cp >= levelThresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  };

  const currentLevel = calculateLevel(totalCp);
  const currentLevelCp = levelThresholds[currentLevel - 1] ?? 0;
  const nextLevelCp = levelThresholds[currentLevel] ?? Infinity;

  // Event handlers
  const handleNewsCardClick = (articleId) => {
    // Use Redux data if available
    const newsData = news.length > 0 ? news : [];
    const articleToOpen = newsData.find(article => article.id === articleId || article.guid === articleId);
    if (articleToOpen) {
      dispatch(setSelectedNews(articleToOpen));
      // Navigate to article page
      navigate(`/article/${articleToOpen.guid || articleToOpen.id}`);
    }
  };

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setActiveCategory(categoryId));
  };

  const handleBadgeEarned = (badge) => {
    dispatch(addToast({
      type: 'success',
      title: 'Yeni Rozet!',
      message: `${badge.name} rozetini kazandınız!`,
      duration: 5000
    }));
    dispatch(openBadgeModal(badge));
  };

  const handleStackClick = (stackId) => {
    // Stack'e tıklandığında Netflix benzeri tanıtım sayfasına yönlendir
    const allStacks = [...popularStacks, ...latestStacks];
    const stackToOpen = allStacks.find(stack => stack._id === stackId);
    if (stackToOpen) {
      dispatch(setSelectedStack(stackToOpen));
      navigate(`/stack/${stackId}`);
    }
  };

  // Use Redux data
  const newsData = news.length > 0 ? news : [];

  // Filter news by category and search
  let filteredNews = selectedCategory === 'all' || !selectedCategory
    ? newsData
    : newsData.filter(article => article.category === selectedCategory);

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

  // Timeline'a göre sıralanan tüm haberler (son 20)
  const allNewsTimeline = [...filteredNews]
    .sort((a, b) => {
      const dateA = new Date(a.pubDate || a.createdAt || Date.now());
      const dateB = new Date(b.pubDate || b.createdAt || Date.now());
      return dateB - dateA; // En yeni haberler önce
    })
    .slice(0, 20);

  // Generate recommendations
  const readArticleIds = new Set(readArticles.map(a => a.id || a.guid));
  const readCategories = new Set(
    filteredNews
      .filter(slide => readArticleIds.has(slide.id || slide.guid))
      .map(slide => slide.category)
  );

  const allArticlesAsNews = filteredNews.map(slide => ({
    id: slide.id || slide.guid,
    thumbnailUrl: slide.imageUrl || slide.image,
    imageUrl: slide.imageUrl || slide.image,
    category: slide.category,
    title: slide.title,
    age: 'Öneri',
  }));

  let recommendedNews;
  if (readCategories.size > 0) {
    const recommendations = allArticlesAsNews.filter(newsItem => {
      const slide = filteredNews.find(s => (s.id || s.guid) === newsItem.id);
      return !readArticleIds.has(newsItem.id) && readCategories.has(slide?.category);
    });
    recommendedNews = recommendations.length > 0
      ? recommendations.slice(0, 8)
      : allArticlesAsNews.filter(newsItem => !readArticleIds.has(newsItem.id)).slice(0, 8);
  } else {
    recommendedNews = allArticlesAsNews.filter(newsItem => !readArticleIds.has(newsItem.id)).slice(0, 8);
  }

  // Convert stacks to NewsCard format
  const convertStackToNewsCard = (stack) => {
    // Stack'in kendi resim verilerini kullan
    let imageUrl = null;

    // Önce stack'in kendi imageUrl'ini kontrol et (Redux'tan gelen)
    if (stack.imageUrl) {
      imageUrl = stack.imageUrl;
    }
    // Eğer stack'te photoUrl field'ı varsa onu kullan
    else if (stack.photoUrl) {
      imageUrl = stack.photoUrl;
    }
    // Stack'teki son haberin resmini kullan
    else if (stack.news && stack.news.length > 0) {
      const firstNews = stack.news[stack.news.length-1];
      if (typeof firstNews === 'object' && firstNews.image) {
        imageUrl = firstNews.image;
      }
    }

    return {
      id: stack._id,
      thumbnailUrl: imageUrl,
      imageUrl: imageUrl,
      category: stack.mainCategory || 'genel', // mainCategory field'ını kullan
      title: stack.title,
      age: new Date(stack.createdAt).toLocaleDateString('tr-TR'),
      xp: stack.xp || 0,
      viewCount: stack.viewCount || 0,
      newsCount: stack.news?.length || 0
    };
  };

  // Convert popular stacks to NewsCard format with category filtering
  const popularStacksAsNews = popularStacks
    .filter(stack => {
      // Kategori filtresi uygula
      if (selectedCategory === 'all' || !selectedCategory) {
        return true;
      }
      return stack.mainCategory === selectedCategory;
    })
    .filter(stack => {
      // Arama filtresi uygula
      if (!searchQuery) return true;

      const searchTerm = searchQuery.toLowerCase();
      const title = stack.title?.toLowerCase() || '';
      const description = stack.description?.toLowerCase() || '';

      return title.includes(searchTerm) || description.includes(searchTerm);
    })
    .map(convertStackToNewsCard);

  // Convert latest stacks to NewsCard format with category filtering
  const latestStacksAsNews = latestStacks
    .filter(stack => {
      // Kategori filtresi uygula
      if (selectedCategory === 'all' || !selectedCategory) {
        return true;
      }
      return stack.mainCategory === selectedCategory;
    })
    .filter(stack => {
      // Arama filtresi uygula
      if (!searchQuery) return true;

      const searchTerm = searchQuery.toLowerCase();
      const title = stack.title?.toLowerCase() || '';
      const description = stack.description?.toLowerCase() || '';

      return title.includes(searchTerm) || description.includes(searchTerm);
    })
    .map(convertStackToNewsCard);

  if (isLoading || stacksLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        {isLoading ? 'Haberler' : 'Haber yığınları'} yükleniyor...
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      {/* Toast Notifications */}
      <BadgeToast />
      <AchievementToast data={notificationToast} />

      {/* Badge Modal */}
      <BadgeModal
        badges={earnedBadges}
        totalCp={totalCp}
        earnedAchievements={earnedAchievements}
        level={currentLevel}
      />

      <Box component="main">
        {/* Hero Section - Her kategoriden 2 stack gösterir */}
        <Hero onStackClick={handleStackClick} />

        {/* Search and Category Section */}
        <Box sx={{ backgroundColor: 'background.default', pt: 3 }}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Haber ara..."
          />

          <CategoryPills
            selectedCategory={selectedCategory || 'all'}
            onCategoryChange={handleCategoryChange}
          />
        </Box>

        {/* News Sections */}
        <Box sx={{ py: 2 }}>
          <NewsSection title="En Popüler Haberler">
            <NewsCard
              articles={popularStacksAsNews}
              variant="horizontal"
              onClick={(stackId) => handleStackClick(stackId)}
            />
          </NewsSection>

          <NewsSection
            title="En Son Paylaşılan Haberler"
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/all-news')}
                sx={{ minWidth: 'auto' }}
              >
                Tümünü Gör
              </Button>
            }
          >
            <NewsCard
              articles={latestStacksAsNews}
              variant="horizontal"
              onClick={(stackId) => handleStackClick(stackId)}
            />
          </NewsSection>

          <NewsSection title="Son okunan haberler">
            {readArticles.length > 0 ? (
              <NewsCard
                articles={readArticles}
                variant="horizontal"
                onClick={(newsId) => handleNewsCardClick(newsId)}
              />
            ) : (
              <Box sx={{ px: 2, color: 'text.secondary' }}>
                Henüz hiç haber okumadınız. Okumaya başlamak için manşetlerden birini seçin!
              </Box>
            )}
          </NewsSection>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;

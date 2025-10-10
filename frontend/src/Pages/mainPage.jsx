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
  useLatestStacks,
  useUserStats,
  useUserXP,
  useUserLevel,
  useUserLevelProgress,
  useReadingProgress,
  useUserAchievements,
  useUserBadges,
  useUserStreak
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
  setActiveCategory
} from '../store/slices/uiSlice';
import {
  loadDemoData,
  addXP,
  addBadge,
  addAchievement,
  startReadingStack,
  readNewsInStack,
  completeStack,
  clearLevelUpFlag
} from '../store/slices/userSlice';

// Components
import Hero from '../components/sections/Hero';
import NewsSection from '../components/sections/NewsSection';
import NewsCard from '../components/cards/NewsCard';
import CategoryPills from '../components/navigation/CategoryPills';
import SearchBar from '../components/navigation/SearchBar';

// Data and utilities
import {
  allBadges,
  allAchievements,
  XP_CONSTANTS
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

  // User Redux state
  const userStats = useUserStats();
  const totalXP = useUserXP();
  const currentLevel = useUserLevel();
  const levelProgress = useUserLevelProgress();
  const readingProgress = useReadingProgress();
  const userAchievements = useUserAchievements();
  const earnedBadges = userAchievements?.badges || [];
  const streakData = userAchievements?.streakData || { current: 0 };

  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Demo verilerini yükle (sadece bir kez)
      if (totalXP === 0 && currentLevel === 1) {
        dispatch(loadDemoData());
      }

      try {
        if (news.length === 0) {
          dispatch(fetchAllNews());
        }
      } catch (error) {
        console.warn('News API hatası:', error);
      }

      try {
        if (popularStacks.length === 0) {
          dispatch(fetchPopularStacks(20));
        }
      } catch (error) {
        console.warn('Popular Stacks API hatası:', error);
      }

      try {
        if (latestStacks.length === 0) {
          dispatch(fetchLatestStacks(20));
        }
      } catch (error) {
        console.warn('Latest Stacks API hatası:', error);
      }
    };

    loadData();
  }, [dispatch, news.length, popularStacks.length, latestStacks.length, totalXP, currentLevel]);

  // Level up notification
  useEffect(() => {
    if (levelProgress.hasLeveledUp) {
      dispatch(addToast({
        type: 'success',
        title: '🎉 Level Atladın!',
        message: `Tebrikler! ${levelProgress.levelUpTo}. seviyeye ulaştın!`,
        duration: 5000
      }));

      // Bonus XP ver
      dispatch(addXP(XP_CONSTANTS.LEVEL_UP_BONUS));

      // Flag'i temizle
      dispatch(clearLevelUpFlag());
    }
  }, [levelProgress.hasLeveledUp, dispatch]);

  // Achievement kontrolü - BİLDİRİM OLMADAN
  useEffect(() => {
    const checkAchievements = () => {
      const userData = {
        stats: userStats,
        readingProgress,
        achievements: userAchievements
      };

      allAchievements.forEach(achievement => {
        const alreadyEarned = userAchievements.achievements.find(a => a.id === achievement.id);

        if (!alreadyEarned && achievement.isCompleted(userData)) {
          dispatch(addAchievement(achievement));
          dispatch(addXP(achievement.xpReward));
          // Bildirim kaldırıldı
        }
      });
    };

    checkAchievements();
  }, [userStats, readingProgress, userAchievements, dispatch]);

  // Event handlers
  const handleNewsCardClick = (articleId) => {
    const newsData = news.length > 0 ? news : [];
    const articleToOpen = newsData.find(article => article.id === articleId || article.guid === articleId);
    if (articleToOpen) {
      dispatch(setSelectedNews(articleToOpen));
      navigate(`/article/${articleToOpen.guid || articleToOpen.id}`);
    }
  };

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setActiveCategory(categoryId));
  };

  const handleStackClick = (stackId) => {
    const allStacks = [...popularStacks, ...latestStacks];
    const stackToOpen = allStacks.find(stack => stack._id === stackId);
    if (stackToOpen) {
      dispatch(setSelectedStack(stackToOpen));

      // Stack okumaya başla
      dispatch(startReadingStack({
        stackId: stackToOpen._id,
        totalNews: stackToOpen.news?.length || 0
      }));

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
      return dateB - dateA;
    })
    .slice(0, 20);

  // Generate recommendations based on reading history
  const readStackIds = new Set(readingProgress.readStacks.map(s => s.stackId));
  const readCategories = new Set(
    readingProgress.readStacks
      .map(s => {
        const stack = [...popularStacks, ...latestStacks].find(st => st._id === s.stackId);
        return stack?.mainCategory;
      })
      .filter(Boolean)
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
      return readCategories.has(slide?.category);
    });
    recommendedNews = recommendations.length > 0
      ? recommendations.slice(0, 8)
      : allArticlesAsNews.slice(0, 8);
  } else {
    recommendedNews = allArticlesAsNews.slice(0, 8);
  }

  // Convert stacks to NewsCard format
  const convertStackToNewsCard = (stack) => {
    let imageUrl = null;

    if (stack.imageUrl) {
      imageUrl = stack.imageUrl;
    } else if (stack.photoUrl) {
      imageUrl = stack.photoUrl;
    } else if (stack.news && stack.news.length > 0) {
      const firstNews = stack.news[stack.news.length-1];
      if (typeof firstNews === 'object' && firstNews.image) {
        imageUrl = firstNews.image;
      }
    }

    return {
      id: stack._id,
      thumbnailUrl: imageUrl,
      imageUrl: imageUrl,
      category: stack.mainCategory || 'genel',
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
      if (selectedCategory === 'all' || !selectedCategory) {
        return true;
      }
      return stack.mainCategory === selectedCategory;
    })
    .filter(stack => {
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
      if (selectedCategory === 'all' || !selectedCategory) {
        return true;
      }
      return stack.mainCategory === selectedCategory;
    })
    .filter(stack => {
      if (!searchQuery) return true;

      const searchTerm = searchQuery.toLowerCase();
      const title = stack.title?.toLowerCase() || '';
      const description = stack.description?.toLowerCase() || '';

      return title.includes(searchTerm) || description.includes(searchTerm);
    })
    .map(convertStackToNewsCard);

  // Recently read stacks
  const recentlyReadAsNews = readingProgress.recentlyRead
    .map(recent => {
      const stack = [...popularStacks, ...latestStacks].find(s => s._id === recent.stackId);
      return stack ? convertStackToNewsCard(stack) : null;
    })
    .filter(Boolean)
    .slice(0, 8);

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

      <Box component="main">
        {/* Hero Section */}
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
            {recentlyReadAsNews.length > 0 ? (
              <NewsCard
                articles={recentlyReadAsNews}
                variant="horizontal"
                onClick={(stackId) => handleStackClick(stackId)}
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

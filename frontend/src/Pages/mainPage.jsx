import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import Hero from '../components/sections/Hero';
import NewsSection from '../components/sections/NewsSection';
import NewsCard from '../components/cards/NewsCard';
import FeaturedNewsCard from '../components/cards/FeaturedNewsCard';
import CategoryPills from '../components/navigation/CategoryPills';
import SearchBar from '../components/navigation/SearchBar';
import BadgeModal from '../components/modals/BadgeModal';
import AchievementToast from '../components/notifications/AchievementToast';
import BadgeToast from '../components/notifications/BadgeToast';

// Data and utilities
import {
  heroSlides,
  featuredNews,
  allBadges,
  levelThresholds,
  allAchievements
} from '../constants/index.jsx';

const MainPage = () => {
  // State management
  const [news] = useState(heroSlides);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [totalXp, setTotalXp] = useState(0);
  const [readArticles, setReadArticles] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [newBadgeToast, setNewBadgeToast] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);
  const [streakData, setStreakData] = useState({ current: 0, lastDate: null });
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for timers
  const toastTimerRef = useRef(null);
  const notificationTimerRef = useRef(null);

  const navigate = useNavigate();

  // Utility functions
  const calculateLevel = (xp) => {
    let level = 1;
    for (let i = 1; i < levelThresholds.length; i++) {
      if (xp >= levelThresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  };

  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = levelThresholds[currentLevel - 1] ?? 0;
  const nextLevelXp = levelThresholds[currentLevel] ?? Infinity;

  // Event handlers
  const handleNewsCardClick = (articleId) => {
    const articleToOpen = news.find(slide => slide.id === articleId);
    if (articleToOpen) {
      setSelectedArticle(articleToOpen);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Filter news by category and search
  let filteredNews = selectedCategory === 'all' ? news : news.filter(article => article.category === selectedCategory);

  if (searchQuery) {
    filteredNews = filteredNews.filter(article => {
      const title = article.title?.toLowerCase() || '';
      const summary = article.summary?.toLowerCase() || '';

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
  const allNewsTimeline = [...news]
    .sort((a, b) => {
      const dateA = new Date(a.pubDate || Date.now());
      const dateB = new Date(b.pubDate || Date.now());
      return dateB - dateA; // En yeni haberler önce
    })
    .slice(0, 20);

  const filteredFeaturedNews = selectedCategory === 'all'
    ? featuredNews
    : featuredNews.filter(item => item.category === selectedCategory);

  // Generate recommendations
  const readArticleIds = new Set(readArticles.map(a => a.id));
  const readCategories = new Set(
    news
      .filter(slide => readArticleIds.has(slide.id))
      .map(slide => slide.category)
  );

  const allArticlesAsNews = filteredNews.map(slide => ({
    id: slide.id,
    thumbnailUrl: slide.imageUrl,
    imageUrl: slide.imageUrl,
    category: slide.category,
    title: slide.title,
    age: 'Öneri',
  }));

  let recommendedNews;
  if (readCategories.size > 0) {
    const recommendations = allArticlesAsNews.filter(newsItem => {
      const slide = news.find(s => s.id === newsItem.id);
      return !readArticleIds.has(newsItem.id) && readCategories.has(slide.category);
    });
    recommendedNews = recommendations.length > 0
      ? recommendations.slice(0, 8)
      : allArticlesAsNews.filter(newsItem => !readArticleIds.has(newsItem.id)).slice(0, 8);
  } else {
    recommendedNews = allArticlesAsNews.filter(newsItem => !readArticleIds.has(newsItem.id)).slice(0, 8);
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      {/* Toast Notifications */}
      <BadgeToast data={newBadgeToast} />
      <AchievementToast data={notificationToast} />

      {/* Badge Modal */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        badges={earnedBadges}
        totalXp={totalXp}
        earnedAchievements={earnedAchievements}
        level={currentLevel}
      />

      <Box component="main">
        {/* Hero Section */}
        <Hero
          slides={filteredNews}
          onArticleSelect={setSelectedArticle}
        />

        {/* Search and Category Section */}
        <Box sx={{ backgroundColor: 'background.default', pt: 3 }}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Haber ara..."
          />

          <CategoryPills
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Box>

        {/* News Sections */}
        <Box sx={{ py: 2 }}>
          <NewsSection title="Sana Özel Haberler">
            <NewsCard
              articles={recommendedNews}
              variant="horizontal"
              onClick={(newsId) => handleNewsCardClick(newsId)}
            />
          </NewsSection>

          <NewsSection
            title="Tüm Haberler"
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
            {allNewsTimeline.map(newsItem => (
              <FeaturedNewsCard
                key={newsItem.id}
                news={{
                  id: newsItem.id,
                  category: newsItem.category,
                  summary: newsItem.summary
                }}
              />
            ))}
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

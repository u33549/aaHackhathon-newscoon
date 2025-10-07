import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

// Components
import Hero from '../components/sections/Hero';
import NewsSection from '../components/sections/NewsSection';
import VideoCard from '../components/cards/VideoCard';
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
  const handleVideoCardClick = (articleId) => {
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
    filteredNews = filteredNews.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const filteredFeaturedNews = selectedCategory === 'all'
    ? featuredNews
    : featuredNews.filter(item => item.category.toLowerCase() === selectedCategory);

  // Generate recommendations
  const readArticleIds = new Set(readArticles.map(a => a.id));
  const readCategories = new Set(
    news
      .filter(slide => readArticleIds.has(slide.id))
      .map(slide => slide.category)
  );

  const allArticlesAsVideos = filteredNews.map(slide => ({
    id: slide.id,
    thumbnailUrl: slide.imageUrl,
    duration: slide.category.charAt(0).toUpperCase() + slide.category.slice(1),
    channelIconUrl: `https://picsum.photos/seed/source${slide.id}/40/40`,
    title: slide.title,
    age: 'Öneri',
  }));

  let recommendedNews;
  if (readCategories.size > 0) {
    const recommendations = allArticlesAsVideos.filter(video => {
      const slide = news.find(s => s.id === video.id);
      return !readArticleIds.has(video.id) && readCategories.has(slide.category);
    });
    recommendedNews = recommendations.length > 0
      ? recommendations.slice(0, 8)
      : allArticlesAsVideos.filter(video => !readArticleIds.has(video.id)).slice(0, 8);
  } else {
    recommendedNews = allArticlesAsVideos.filter(video => !readArticleIds.has(video.id)).slice(0, 8);
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
            {recommendedNews.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoCardClick(video.id)}
              />
            ))}
          </NewsSection>

          <NewsSection title="Öne Çıkan Haberler">
            {filteredFeaturedNews.map(newsItem => (
              <FeaturedNewsCard
                key={newsItem.id}
                news={newsItem}
              />
            ))}
          </NewsSection>

          <NewsSection title="Son okunan haberler">
            {readArticles.length > 0 ? (
              readArticles.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  variant="portrait"
                  onClick={() => handleVideoCardClick(video.id)}
                />
              ))
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

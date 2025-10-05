import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { newscoonTheme } from './theme/theme';

// Components
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import NewsSection from './components/sections/NewsSection';
import VideoCard from './components/cards/VideoCard';
import Footer from './components/layout/Footer';
import ArticlePage from './pages/ArticlePage';
import BadgeModal from './components/modals/BadgeModal';
import AchievementToast from './components/notifications/AchievementToast';
import FeaturedNewsCard from './components/cards/FeaturedNewsCard';
import CategoryPills from './components/navigation/CategoryPills';
import BadgeToast from './components/notifications/BadgeToast';
import SearchBar from './components/navigation/SearchBar';

// Data and utilities
import {
  heroSlides,
  featuredNews,
  allBadges,
  levelThresholds,
  allAchievements
} from './constants';

function App() {
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

  // Load streak data from localStorage
  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem('newscoonStreak');
      if (savedStreak) {
        const parsedStreak = JSON.parse(savedStreak);
        const today = new Date().toDateString();
        const lastDate = parsedStreak.lastDate ? new Date(parsedStreak.lastDate).toDateString() : null;

        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate !== today && lastDate !== yesterday.toDateString()) {
            setStreakData({ current: 0, lastDate: null });
          } else {
            setStreakData(parsedStreak);
          }
        } else {
          setStreakData(parsedStreak);
        }
      }
    } catch (error) {
      console.error("Failed to load streak data from localStorage", error);
    }
  }, []);

  // Check for achievements and level ups
  useEffect(() => {
    const newAchievements = [];
    const previousLevel = calculateLevel(totalXp - 1);

    if (currentLevel > previousLevel && totalXp > 0) {
      setNotificationToast({
        title: `Seviye Atladın!`,
        subtitle: `Seviye ${currentLevel}'e ulaştın.`
      });
    }

    allAchievements.forEach(achievement => {
      if (!earnedAchievements.has(achievement.id) &&
          achievement.isCompleted({ readArticles, streak: streakData.current, totalXp, badges: earnedBadges })) {
        newAchievements.push(achievement.id);
        setNotificationToast({
          title: 'Başarım Kazanıldı!',
          subtitle: achievement.name
        });
      }
    });

    if (newAchievements.length > 0) {
      setEarnedAchievements(prev => new Set([...prev, ...newAchievements]));
    }

    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    if (newAchievements.length > 0 || (currentLevel > previousLevel && totalXp > 0)) {
      notificationTimerRef.current = window.setTimeout(() => setNotificationToast(null), 3000);
    }
  }, [readArticles, streakData, totalXp, earnedBadges, currentLevel, earnedAchievements]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, []);

  // Event handlers
  const handleArticleComplete = (xpGained, articleId) => {
    const today = new Date();
    const todayString = today.toDateString();
    let newStreak = streakData.current;
    let streakBonusXp = 0;

    if (streakData.lastDate !== todayString) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (streakData.lastDate === yesterday.toDateString()) {
        newStreak++;
      } else {
        newStreak = 1;
      }

      streakBonusXp = newStreak * 10;
      const newStreakData = { current: newStreak, lastDate: today.toISOString() };
      setStreakData(newStreakData);
      localStorage.setItem('newscoonStreak', JSON.stringify(newStreakData));
    }

    const totalXpGained = xpGained + streakBonusXp;
    setTotalXp(prevXp => prevXp + totalXpGained);

    const completedArticle = news.find(slide => slide.id === articleId);
    if (completedArticle) {
      if (!readArticles.some(article => article.id === articleId)) {
        const newReadArticle = {
          id: completedArticle.id,
          thumbnailUrl: completedArticle.imageUrl,
          duration: completedArticle.superTitle,
          channelIconUrl: `https://picsum.photos/seed/source${completedArticle.id}/40/40`,
          title: completedArticle.title,
          age: '',
          xp: xpGained,
        };
        setReadArticles(prev => [newReadArticle, ...prev]);
      }

      const category = completedArticle.category;
      const hasBadge = earnedBadges.some(badge => badge.id === category);
      if (!hasBadge) {
        const newBadge = allBadges.find(badge => badge.id === category);
        if (newBadge) {
          setEarnedBadges(prev => [...prev, newBadge]);
          setNewBadgeToast({ badge: newBadge, xp: totalXpGained });

          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastTimerRef.current = window.setTimeout(() => setNewBadgeToast(null), 3000);
        }
      }
    }
  };

  const handleBonusXpEarned = (bonusXp) => {
    setTotalXp(prevXp => prevXp + bonusXp);
  };

  const handleVideoCardClick = (articleId) => {
    const articleToOpen = news.find(slide => slide.id === articleId);
    if (articleToOpen) {
      setSelectedArticle(articleToOpen);
    }
  };

  // Filter news by category
  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(article => article.category === selectedCategory);

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

  const allArticlesAsVideos = news.map(slide => ({
    id: slide.id,
    thumbnailUrl: slide.imageUrl,
    duration: slide.category.charAt(0).toUpperCase() + slide.category.slice(1),
    channelIconUrl: `https://picsum.photos/seed/source${slide.id}/40/40`,
    title: slide.title,
    age: 'Öneri',
  }));

  const potentialRecommendations = selectedCategory === 'all'
    ? allArticlesAsVideos
    : allArticlesAsVideos.filter(video => {
        const slide = news.find(s => s.id === video.id);
        return slide.category === selectedCategory;
      });

  let recommendedNews;
  if (readCategories.size > 0) {
    const recommendations = potentialRecommendations.filter(video => {
      const slide = news.find(s => s.id === video.id);
      return !readArticleIds.has(video.id) && readCategories.has(slide.category);
    });
    recommendedNews = recommendations.length > 0
      ? recommendations
      : potentialRecommendations.filter(video => !readArticleIds.has(video.id));
  } else {
    recommendedNews = potentialRecommendations.filter(video => !readArticleIds.has(video.id)).slice(0, 4);
  }

  return (
    <ThemeProvider theme={newscoonTheme}>
      <CssBaseline />
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

        {selectedArticle ? (
          <ArticlePage
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            onArticleComplete={handleArticleComplete}
            totalXp={totalXp}
            level={currentLevel}
            xpForNextLevel={{
              current: totalXp - currentLevelXp,
              max: nextLevelXp - currentLevelXp
            }}
            onOpenBadges={() => setIsBadgeModalOpen(true)}
            onBonusXpEarned={handleBonusXpEarned}
          />
        ) : (
          <>
            <Header
              totalXp={totalXp}
              level={currentLevel}
              xpForNextLevel={{
                current: totalXp - currentLevelXp,
                max: nextLevelXp - currentLevelXp
              }}
              onOpenBadges={() => setIsBadgeModalOpen(true)}
            />

            <Box component="main">
              <Hero
                slides={filteredNews}
                onArticleSelect={setSelectedArticle}
              />

              <CategoryPills
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <SearchBar />

              <Box sx={{ py: 4 }}>
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

            <Footer />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;

// Type definitions for Newscoon App

// Badge categories
export const BADGE_CATEGORIES = {
  TEKNOLOJI: 'teknoloji',
  EKONOMI: 'ekonomi',
  BILIM: 'bilim',
  SAGLIK: 'saglik'
};

// Video/Article structure
<<<<<<< HEAD
export const createVideo = (id, thumbnailUrl, duration, channelIconUrl, title, age, cp = null) => ({
=======
export const createVideo = (id, thumbnailUrl, duration, channelIconUrl, title, age, xp = null) => ({
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  id,
  thumbnailUrl,
  duration,
  channelIconUrl,
  title,
  age,
<<<<<<< HEAD
  cp
=======
  xp
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
});

// Hero slide structure
export const createHeroSlide = (id, imageUrl, superTitle, title, subtitle, category, summary, content, quiz = null) => ({
  id,
  imageUrl,
  superTitle,
  title,
  subtitle,
  category,
  summary,
  content,
  quiz
});

// Badge structure
export const createBadge = (id, name, description, icon) => ({
  id,
  name,
  description,
  icon
});

// Streak data structure
export const createStreakData = (current = 0, lastDate = null) => ({
  current,
  lastDate
});

// Achievement structure
export const createAchievement = (id, name, description, icon, isCompletedFn) => ({
  id,
  name,
  description,
  icon,
  isCompleted: isCompletedFn
});

// Featured news structure
export const createFeaturedNews = (id, category, summary) => ({
  id,
  category,
  summary
});

// Leaderboard user structure
<<<<<<< HEAD
export const createLeaderboardUser = (id, name, cp, level, isCurrentUser = false) => ({
  id,
  name,
  cp,
=======
export const createLeaderboardUser = (id, name, xp, level, isCurrentUser = false) => ({
  id,
  name,
  xp,
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  level,
  isCurrentUser
});

// Quiz structure
<<<<<<< HEAD
export const createQuiz = (question, options, correctAnswerIndex, bonusCp) => ({
  question,
  options,
  correctAnswerIndex,
  bonusCp
=======
export const createQuiz = (question, options, correctAnswerIndex, bonusXp) => ({
  question,
  options,
  correctAnswerIndex,
  bonusXp
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
});

// Content checkpoint structure
export const createCheckpoint = (title, paragraph) => ({
  title,
  paragraph
});

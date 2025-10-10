import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { 
  Close,
  KeyboardArrowDown,
  EmojiEvents,
  Visibility,
  Star,
  Category,
  KeyboardArrowUp
} from '@mui/icons-material';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useSelectedStack,
  useCurrentlyReading,
  useUserXP,
  useUserLevel,
  useUserLevelProgress
} from '../hooks/redux';
import { fetchStackById } from '../store/slices/stackSlice';
import {
  readNewsInStack,
  completeStack,
  addXP,
  addBadge,
  updateReadingProgress
} from '../store/slices/userSlice';

// Constants
import { XP_CONSTANTS, allBadges, categoryColors } from '../constants/index.jsx';

// Görüntülenme sayısını kısaltılmış formatta göstermek için yardımcı fonksiyon
const formatViewCount = (count) => {
  if (!count || count === 0) return '0';

  const num = parseInt(count);
  if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  return num.toString();
};

// Her haber için XP hesaplama
const generateNewsXP = () => {
  return Math.floor(Math.random() * (XP_CONSTANTS.NEWS_XP_MAX - XP_CONSTANTS.NEWS_XP_MIN + 1)) + XP_CONSTANTS.NEWS_XP_MIN;
};

// Kronolojik haber parçalarını simüle eden data
const generateChronologicalSteps = (stack) => {
  if (!stack || !stack.news || stack.news.length === 0) return [];

  const steps = [];
  
  // Stack'in resim verilerini al
  const getStackImage = (stack) => {
    if (stack?.imageUrl) return stack.imageUrl;
    if (stack?.photoUrl) return stack.photoUrl;
    if (stack?.news && stack.news.length > 0) {
      const lastNews = stack.news[stack.news.length - 1];
      if (typeof lastNews === 'object' && lastNews.image) {
        return lastNews.image;
      }
    }
    return 'https://via.placeholder.com/1920x1080';
  };

  // İlk step - Giriş
  steps.push({
    id: 'intro',
    type: 'intro',
    title: stack.title,
    content: stack.description || 'Bu haber yığınında kronolojik olarak gelişen olayları inceleceğiz.',
    image: getStackImage(stack),
    timestamp: null,
    stackData: {
      newsCount: stack.news?.length || 0,
      viewCount: stack.viewCount || 0,
      cp: stack.xp || 0,
      category: stack.mainCategory || 'genel',
      createdAt: stack.createdAt,
      tags: stack.tags || []
    }
  });

  // Her haber için kronolojik step oluştur
  stack.news.forEach((news, index) => {
    const newsItem = typeof news === 'object' ? news : { title: `Haber ${index + 1}`, description: 'Haber içeriği' };
    
    steps.push({
      id: `step-${index}`,
      type: 'news',
      title: newsItem.title || `Gelişme ${index + 1}`,
      content: newsItem.newstext || newsItem.description || 'Bu gelişmede önemli detaylar ortaya çıktı.',
      image: newsItem.image || getStackImage(stack),
      timestamp: newsItem.pubDate || new Date().toISOString(),
      stepNumber: index + 1,
      totalSteps: stack.news.length,
      newsXP: generateNewsXP() // Her haber için XP
    });
  });

  // Son step - Tebrik
  const stackTotalXP = stack.xp || 0; // Sadece stack'in sahip olduğu XP
  steps.push({
    id: 'completion',
    type: 'completion',
    title: 'Tebrikler!',
    content: `${stack.title} haber yığınını başarıyla tamamladınız!`,
    image: null,
    reward: {
      cp: stackTotalXP, // Sadece stack'in sahip olduğu XP
      badge: null
    }
  });

  return steps;
};

const ReadingFlowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const selectedStack = useSelectedStack();
  const currentlyReading = useCurrentlyReading();
  const userXP = useUserXP();
  const userLevel = useUserLevel();
  const levelProgress = useUserLevelProgress();

  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [readNewsIndices, setReadNewsIndices] = useState(new Set()); // Okunan haberleri takip et

  // Hibrit scroll sistemi için state'ler
  const [pullState, setPullState] = useState({
    isAtTop: true,
    isAtBottom: false,
    pullDistance: 0,
    isPulling: false,
    pullDirection: null,
    canNavigate: false,
    isAboveThreshold: false,
    isAboveConfirmationThreshold: false,
    initialScrollPos: 0,
    isSpringBack: false
  });

  // Eşik değerleri
  const PULL_THRESHOLD = 60;
  const VISUAL_FEEDBACK_THRESHOLD = 25;
  const CONFIRMATION_THRESHOLD = 45;
  const MAX_PULL_DISTANCE = 100;
  const DAMPING_FACTOR = 0.7;
  const SPRING_BACK_DURATION = 300;

  // Refs
  const newsContentRef = useRef(null);
  const touchStartRef = useRef(null);
  const lastTouchY = useRef(null);

  // Touch/Mouse state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [initialMouseY, setInitialMouseY] = useState(null);

  // Stack verisini yükle
  useEffect(() => {
    if (id && (!selectedStack || selectedStack._id !== id)) {
      dispatch(fetchStackById(id));
    }
  }, [id, selectedStack, dispatch]);

  // Steps oluştur
  useEffect(() => {
    if (selectedStack) {
      const chronologicalSteps = generateChronologicalSteps(selectedStack);
      setSteps(chronologicalSteps);
    }
  }, [selectedStack]);

  // Kaldığımız yerden devam et - kaydedilmiş progress'i yükle
  useEffect(() => {
    if (selectedStack && steps.length > 0 && currentlyReading.length > 0) {
      const stackProgress = currentlyReading.find(r => r.stackId === selectedStack._id);
      if (stackProgress && stackProgress.lastReadIndex > 0) {
        // Kaydedilmiş adımdan devam et
        console.log(`📖 Kaldığınız yerden devam ediliyor: Adım ${stackProgress.lastReadIndex}`);
        setCurrentStep(stackProgress.lastReadIndex);
      }
    }
  }, [selectedStack, steps.length, currentlyReading]);

  // Her step değiştiğinde progress'i kaydet
  useEffect(() => {
    if (selectedStack && currentStep > 0 && steps.length > 0) {
      // Progress'i Redux'a kaydet
      dispatch(updateReadingProgress({
        stackId: selectedStack._id,
        currentStepIndex: currentStep
      }));
      console.log(`💾 Progress kaydedildi: Adım ${currentStep}`);
    }
  }, [currentStep, selectedStack, steps.length, dispatch]);

  const currentStepData = steps[currentStep];

  // Haber okuma işlemi - BİLDİRİM OLMADAN
  const handleNewsRead = useCallback((stepIndex) => {
    if (!selectedStack || readNewsIndices.has(stepIndex)) return;

    const step = steps[stepIndex + 1]; // +1 çünkü intro step var
    if (step && step.type === 'news') {
      // Local state güncelle - sadece okunan haberleri işaretle
      setReadNewsIndices(prev => new Set([...prev, stepIndex]));

      // Haber okundu bilgisi - sadece console log
      console.log(`Haber okundu: ${step.title}`);

      // Kategori bazlı rozet kontrolü - sadece ilk haber ise - BİLDİRİM OLMADAN
      const category = selectedStack.mainCategory;
      if (category && !readNewsIndices.has(0)) { // İlk haber ise
        const categoryBadge = allBadges.find(badge => badge.id === category);
        if (categoryBadge) {
          dispatch(addBadge(categoryBadge));
          // Bildirim kaldırıldı
        }
      }
    }
  }, [selectedStack, steps, readNewsIndices, dispatch]);

  // Stack tamamlama işlemi - BİLDİRİM OLMADAN
  const handleStackCompletion = useCallback(() => {
    if (!selectedStack) return;

    // Sadece stack'in sahip olduğu XP'yi al
    const stackTotalXP = selectedStack.xp || 0;

    // Stack'i tamamla - sadece stack XP'si
    dispatch(completeStack({
      stackId: selectedStack._id,
      stackXP: stackTotalXP // Sadece stack'in sahip olduğu XP
    }));

    // Sadece console log - bildirim yok
    console.log(`Stack tamamlandı: "${selectedStack.title}" - +${stackTotalXP} XP kazanıldı`);
  }, [selectedStack, dispatch]);

  // Scroll pozisyon kontrolü
  const checkScrollPosition = useCallback(() => {
    const container = newsContentRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtTop = scrollTop <= 1;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    setPullState(prev => ({
      ...prev,
      isAtTop,
      isAtBottom
    }));

    console.log('📍 Scroll Position:', { scrollTop, isAtTop, isAtBottom, scrollHeight, clientHeight });
  }, []);

  // News content scroll handler
  const handleNewsContentScroll = useCallback((e) => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  // Navigation functions - ÖNCE TANIMLA
  const handleNextStep = useCallback(() => {
    if (currentStep < steps.length - 1 && !isTransitioning) {
      setIsTransitioning(true);

      // Eğer news step'inden çıkıyorsak, haber okundu olarak işaretle
      if (currentStepData?.type === 'news' && currentStepData?.stepNumber) {
        handleNewsRead(currentStepData.stepNumber - 1);
      }

      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);

        // Eğer completion step'ine geçtiyse, stack'i tamamla
        if (currentStep + 1 === steps.length - 1) {
          handleStackCompletion();
        }
      }, 300);
    }
  }, [currentStep, steps.length, isTransitioning, currentStepData, handleNewsRead, handleStackCompletion]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentStep, isTransitioning]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Gelişmiş Pull-to-navigate logic for touch - TÜM SAYFA TİPLERİ İÇİN
  const handleTouchStart = useCallback((e) => {
    const container = newsContentRef.current;

    touchStartRef.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;

    // Çekme başladığındaki scroll pozisyonunu kaydet
    setPullState(prev => ({
      ...prev,
      isPulling: false,
      pullDistance: 0,
      initialScrollPos: container?.scrollTop || 0
    }));

    console.log('👆 Touch Start - Step Type:', currentStepData?.type, {
      touchY: touchStartRef.current,
      scrollPos: container?.scrollTop || 0
    });
  }, [currentStepData?.type]);

  const handleTouchMove = useCallback((e) => {
    if (!touchStartRef.current) return;

    const currentY = e.touches[0].clientY;
    const totalDelta = currentY - touchStartRef.current;

    // NEWS tipi için özel logic
    if (currentStepData?.type === 'news') {
      const container = newsContentRef.current;
      if (!container) return;

      // Hibrit Kaydırma Kuralı: Ortada iken sadece metin scroll
      const { scrollTop, scrollHeight, clientHeight } = container;
      const hasScrollableContent = scrollHeight > clientHeight + 5;
      const isInMiddle = scrollTop > 5 && scrollTop < scrollHeight - clientHeight - 5;

      // Eğer metin ortasındaysa, pull sistemini devre dışı bırak
      if (hasScrollableContent && isInMiddle) {
        setPullState(prev => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          pullDirection: null,
          canNavigate: false,
          isAboveThreshold: false,
          isAboveConfirmationThreshold: false
        }));
        return; // Normal scroll'a izin ver
      }

      // Scroll pozisyonu kontrolü
      checkScrollPosition();

      // Pull logic - sadece sınırlarda aktif (NEWS için)
      let shouldPreventDefault = false;

      if (pullState.isAtTop && totalDelta > 0) {
        // En üstte ve aşağı çekiliyor (previous için)
        shouldPreventDefault = true;

        const dampedDistance = totalDelta * DAMPING_FACTOR;
        const clampedDistance = Math.min(dampedDistance, MAX_PULL_DISTANCE);

        const isAboveThreshold = clampedDistance >= PULL_THRESHOLD;
        const isVisible = clampedDistance >= VISUAL_FEEDBACK_THRESHOLD;

        setPullState(prev => ({
          ...prev,
          isPulling: isVisible,
          pullDirection: 'down',
          pullDistance: clampedDistance,
          canNavigate: isAboveThreshold,
          isAboveThreshold,
          isAboveConfirmationThreshold: clampedDistance >= CONFIRMATION_THRESHOLD
        }));

      } else if (pullState.isAtBottom && totalDelta < 0) {
        // En altta ve yukarı çekiliyor (next için)
        shouldPreventDefault = true;

        const dampedDistance = Math.abs(totalDelta) * DAMPING_FACTOR;
        const clampedDistance = Math.min(dampedDistance, MAX_PULL_DISTANCE);

        const isAboveThreshold = clampedDistance >= PULL_THRESHOLD;
        const isVisible = clampedDistance >= VISUAL_FEEDBACK_THRESHOLD;

        setPullState(prev => ({
          ...prev,
          isPulling: isVisible,
          pullDirection: 'up',
          pullDistance: clampedDistance,
          canNavigate: isAboveThreshold,
          isAboveThreshold,
          isAboveConfirmationThreshold: clampedDistance >= CONFIRMATION_THRESHOLD
        }));

      } else {
        // Pull koşulları sağlanmıyorsa temizle
        setPullState(prev => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          pullDirection: null,
          canNavigate: false,
          isAboveThreshold: false,
          isAboveConfirmationThreshold: false
        }));
      }

      // preventDefault'i sadece gerekli durumlarda çağır
      if (shouldPreventDefault) {
        e.preventDefault();
      }
    }
    // INTRO ve COMPLETION tipleri için basit kaydırma mantığı
    else if (currentStepData?.type === 'intro' || currentStepData?.type === 'completion') {
      const MIN_SWIPE_DISTANCE = 50; // Minimum kaydırma mesafesi

      // Aşağı kaydırma (sonraki sayfaya geç)
      if (totalDelta < -MIN_SWIPE_DISTANCE) {
        e.preventDefault();

        const dampedDistance = Math.abs(totalDelta) * 0.5;
        const clampedDistance = Math.min(dampedDistance, 80);
        const isVisible = clampedDistance >= 20;

        setPullState(prev => ({
          ...prev,
          isPulling: isVisible,
          pullDirection: 'up',
          pullDistance: clampedDistance,
          canNavigate: clampedDistance >= 40,
          isAboveThreshold: clampedDistance >= 40,
          isAboveConfirmationThreshold: clampedDistance >= 35
        }));
      }
      // Yukarı kaydırma (önceki sayfaya geç) - sadece intro değilse
      else if (totalDelta > MIN_SWIPE_DISTANCE && currentStepData?.type !== 'intro') {
        e.preventDefault();

        const dampedDistance = totalDelta * 0.5;
        const clampedDistance = Math.min(dampedDistance, 80);
        const isVisible = clampedDistance >= 20;

        setPullState(prev => ({
          ...prev,
          isPulling: isVisible,
          pullDirection: 'down',
          pullDistance: clampedDistance,
          canNavigate: clampedDistance >= 40,
          isAboveThreshold: clampedDistance >= 40,
          isAboveConfirmationThreshold: clampedDistance >= 35
        }));
      } else {
        // Minimum mesafe aşılmadıysa temizle
        setPullState(prev => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          pullDirection: null,
          canNavigate: false,
          isAboveThreshold: false,
          isAboveConfirmationThreshold: false
        }));
      }
    }

    lastTouchY.current = currentY;
  }, [currentStepData?.type, pullState.isAtTop, pullState.isAtBottom, checkScrollPosition, PULL_THRESHOLD, VISUAL_FEEDBACK_THRESHOLD, CONFIRMATION_THRESHOLD, MAX_PULL_DISTANCE, DAMPING_FACTOR]);

  const handleTouchEnd = useCallback(() => {
    console.log('👋 Touch End - Step Type:', currentStepData?.type, {
      isPulling: pullState.isPulling,
      canNavigate: pullState.canNavigate,
      isAboveThreshold: pullState.isAboveThreshold,
      direction: pullState.pullDirection,
      pullDistance: pullState.pullDistance
    });

    // Tüm sayfa tipleri için navigation logic
    if (pullState.isPulling && pullState.isAboveThreshold) {
      if (pullState.pullDirection === 'down' && currentStep > 0) {
        console.log('✅ Navigate to Previous');
        handlePrevStep();
      } else if (pullState.pullDirection === 'up' && currentStep < steps.length - 1) {
        console.log('✅ Navigate to Next');
        handleNextStep();
      }
    }

    // State'i temizle
    setPullState(prev => ({
      ...prev,
      isPulling: false,
      pullDistance: 0,
      pullDirection: null,
      canNavigate: false,
      isAboveThreshold: false,
      isAboveConfirmationThreshold: false,
      initialScrollPos: 0
    }));

    touchStartRef.current = null;
    lastTouchY.current = null;
  }, [currentStepData?.type, pullState, currentStep, steps.length, handlePrevStep, handleNextStep]);

  // Mouse wheel handler (for desktop)
  const handleWheel = useCallback((e) => {
    if (currentStepData?.type !== 'news' || isTransitioning) return;

    const isScrollingUp = e.deltaY < 0;
    const isScrollingDown = e.deltaY > 0;

    // Chrome benzeri davranış: sadece sınırlarda navigation
    if (pullState.isAtTop && isScrollingUp) {
      e.preventDefault();
      console.log('🖱️ Wheel Up at Top -> Previous');
      handlePrevStep();
    } else if (pullState.isAtBottom && isScrollingDown) {
      e.preventDefault();
      console.log('🖱️ Wheel Down at Bottom -> Next');
      handleNextStep();
    }
    // Ortada scroll yapıyorsa hiçbir şey yapma, browser'ın normal scroll'una izin ver
  }, [currentStepData?.type, pullState.isAtTop, pullState.isAtBottom, isTransitioning]);

  // Event listeners
  useEffect(() => {
    const container = newsContentRef.current;
    if (!container || currentStepData?.type !== 'news') return;

    // Initial scroll position check
    checkScrollPosition();

    // Wheel event for desktop
    const handleWheelEvent = (e) => {
      handleWheel(e);
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [handleWheel, checkScrollPosition, currentStepData?.type]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;

      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentStepData?.type === 'news' && !pullState.isAtBottom) {
          // Scroll content down
          const container = newsContentRef.current;
          if (container) {
            container.scrollBy({ top: 200, behavior: 'smooth' });
          }
        } else {
          handleNextStep();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentStepData?.type === 'news' && !pullState.isAtTop) {
          // Scroll content up
          const container = newsContentRef.current;
          if (container) {
            container.scrollBy({ top: -200, behavior: 'smooth' });
          }
        } else {
          handlePrevStep();
        }
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, currentStepData?.type, pullState.isAtTop, pullState.isAtBottom]);

  // Loading states ve render logic
  if (!selectedStack || steps.length === 0) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}>
        <Typography variant="h6">Haber yükleniyor...</Typography>
      </Box>
    );
  }

  if (!currentStepData) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}>
        <Typography variant="h6">Haber verisi yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        touchAction: 'pan-y' // Tüm sayfa tipleri için touch desteği
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)'
          }
        }}
      >
        <Close />
      </IconButton>

      {/* Progress Indicator */}
      {currentStepData.type !== 'intro' && currentStepData.type !== 'completion' && (
        <Box sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="caption">
            {currentStepData.stepNumber}/{currentStepData.totalSteps}
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Fade in={!isTransitioning} timeout={500}>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: currentStepData.type === 'news' ? 'background.default' : '#000'
        }}>
          {/* Background Image - Sadece intro ve completion için */}
          {currentStepData.image && currentStepData.type !== 'news' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${currentStepData.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: currentStepData.type === 'completion' ? 'blur(5px)' : 'none'
              }}
            />
          )}

          {/* Gradient Overlay - Sadece intro ve completion için */}
          {currentStepData.type !== 'news' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: currentStepData.type === 'completion'
                  ? 'linear-gradient(135deg, rgba(76,175,80,0.9) 0%, rgba(56,142,60,0.95) 100%)'
                  : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 1
              }}
            />
          )}

          {/* Content */}
          <Box sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: currentStepData.type === 'news' ? 'flex-start' : 'flex-start', // intro için de flex-start
            alignItems: 'flex-start',
            padding: { xs: 3, md: 6 },
            paddingBottom: { xs: 12, md: 15 },
            paddingTop: currentStepData.type === 'news' ? { xs: 8, md: 10 } : { xs: 8, md: 10 }, // intro için de padding-top
            textAlign: 'left',
            overflow: currentStepData.type === 'intro' ? 'auto' : 'hidden', // intro için kaydırma aktif
            // Intro sayfası için özel scroll styling
            ...(currentStepData.type === 'intro' && {
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
              // Modern scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.5)'
                }
              }
            })
          }}>
            {/* Intro Page - Pull feedback UI için relative container */}
            {currentStepData.type === 'intro' && (
              <Box sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pb: { xs: 6, md: 8 }, // Alt kısımda boşluk bırak
                position: 'relative' // Pull feedback için
              }}>
                {/* Pull feedback UI - Bottom - Intro için */}
                {pullState.isPulling && pullState.pullDirection === 'up' && (
                  <Box sx={{
                    position: 'fixed',
                    bottom: 60,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    opacity: Math.min(pullState.pullDistance / 30, 1),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 3,
                    px: 3,
                    py: 2,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    minWidth: 160,
                    scale: pullState.isAboveConfirmationThreshold ? 1.05 : 1,
                  }}>
                    {/* Message */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? '#FFD700'
                          : 'rgba(255, 255, 255, 0.9)',
                        fontWeight: pullState.isAboveConfirmationThreshold ? 600 : 500,
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {pullState.isAboveConfirmationThreshold
                        ? 'Bırak ve Başla'
                        : 'Kaydırmaya Devam Et'
                      }
                    </Typography>

                    {/* Icon */}
                    <KeyboardArrowDown
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? '#FFD700'
                          : 'rgba(255, 255, 255, 0.8)',
                        fontSize: 24,
                        transform: `translateY(${pullState.isAboveConfirmationThreshold ? 2 : 0}px)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </Box>
                )}

                {/* Spacer - pushes content to bottom */}
                <Box sx={{ flex: 1, minHeight: '20vh' }} />

                {/* Kategori Chip */}
                {currentStepData.stackData && (
                  <Chip
                    label={currentStepData.stackData.category?.charAt(0).toUpperCase() + currentStepData.stackData.category?.slice(1) || 'Genel'}
                    sx={{
                      backgroundColor: '#FFD700',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      height: { xs: 32, md: 36 },
                      borderRadius: 2,
                      mb: { xs: 2, md: 3 },
                      px: { xs: 2, md: 3 },
                      alignSelf: 'flex-start'
                    }}
                  />
                )}

                {/* Ana Başlık */}
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', md: '95%' },
                    lineHeight: 1.2,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                    textAlign: 'left'
                  }}
                >
                  {currentStepData.title}
                </Typography>

                {/* Metrikler */}
                {currentStepData.stackData && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    mb: { xs: 2, md: 3 },
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    width: '100%'
                  }}>
                    {/* CP */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ color: '#FFD700', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {currentStepData.stackData.cp} CP
                      </Typography>
                    </Box>

                    {/* Görüntülenme */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {formatViewCount(currentStepData.stackData.viewCount)} görüntülenme
                      </Typography>
                    </Box>

                    {/* Haber Sayısı */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Category sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {currentStepData.stackData.newsCount} haber
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Açıklama Metni */}
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: { xs: 4, md: 6 },
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', sm: '95%', md: '90%' },
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {currentStepData.content}
                </Typography>

                {/* Mobil için kaydırma ipucu - daha prominent */}
                {isMobile && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: { xs: 3, md: 4 },
                    gap: 1,
                    opacity: 0.9,
                    animation: 'bounce 2s infinite'
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textAlign: 'center'
                      }}
                    >
                      Haberleri okumaya başlamak için
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#FFD700',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Yukarı kaydır
                    </Typography>
                    <KeyboardArrowUp
                      sx={{
                        color: '#FFD700',
                        fontSize: 28,
                        mt: 0.5
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* News Step - Yeni tasarım */}
            {currentStepData.type === 'news' && (
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                {/* Pull feedback UI - Top - Modern Tasarım */}
                {pullState.isPulling && pullState.pullDirection === 'down' && (
                  <Box sx={{
                    position: 'absolute',
                    top: -60 + (pullState.pullDistance * 0.4),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    opacity: Math.min(pullState.pullDistance / 40, 1),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    // Modern glassmorphism design
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 4,
                    px: 3,
                    py: 2,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.12)' 
                      : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    minWidth: 180,
                    scale: pullState.isAboveConfirmationThreshold ? 1.05 : 1,
                  }}>

                    {/* Subtle progress indicator */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      borderRadius: '4px 4px 0 0',
                      background: `linear-gradient(90deg, 
                        ${theme.palette.primary.main} 0%, 
                        ${theme.palette.secondary.main} 100%)`,
                      opacity: pullState.pullDistance / PULL_THRESHOLD,
                      transition: 'opacity 0.2s ease'
                    }} />

                    {/* Icon */}
                    <KeyboardArrowUp
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: 28,
                        transform: `translateY(${pullState.isAboveConfirmationThreshold ? -2 : 0}px)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Message */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        fontWeight: pullState.isAboveConfirmationThreshold ? 600 : 500,
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.025em'
                      }}
                    >
                      {pullState.isAboveConfirmationThreshold
                        ? 'Önceki Habere Geç'
                        : 'Yukarı Çek'
                      }
                    </Typography>

                    {/* Subtle animation dots */}
                    {pullState.pullDistance > VISUAL_FEEDBACK_THRESHOLD && (
                      <Box sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 0.5
                      }}>
                        {[0, 1, 2].map((index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: pullState.isAboveConfirmationThreshold
                                ? theme.palette.primary.main
                                : theme.palette.text.disabled,
                              opacity: pullState.pullDistance > (VISUAL_FEEDBACK_THRESHOLD + index * 10) ? 1 : 0.3,
                              transition: 'all 0.2s ease',
                              animationDelay: `${index * 0.1}s`
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {/* Pull feedback UI - Bottom - Modern Tasarım */}
                {pullState.isPulling && pullState.pullDirection === 'up' && (
                  <Box sx={{
                    position: 'absolute',
                    bottom: -60 + (pullState.pullDistance * 0.4),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    opacity: Math.min(pullState.pullDistance / 40, 1),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    // Modern glassmorphism design
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 4,
                    px: 3,
                    py: 2,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.12)' 
                      : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    minWidth: 180,
                    scale: pullState.isAboveConfirmationThreshold ? 1.05 : 1,
                  }}>

                    {/* Subtle animation dots */}
                    {pullState.pullDistance > VISUAL_FEEDBACK_THRESHOLD && (
                      <Box sx={{
                        display: 'flex',
                        gap: 0.5,
                        mb: 0.5
                      }}>
                        {[0, 1, 2].map((index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: pullState.isAboveConfirmationThreshold
                                ? theme.palette.primary.main
                                : theme.palette.text.disabled,
                              opacity: pullState.pullDistance > (VISUAL_FEEDBACK_THRESHOLD + index * 10) ? 1 : 0.3,
                              transition: 'all 0.2s ease',
                              animationDelay: `${index * 0.1}s`
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Message */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        fontWeight: pullState.isAboveConfirmationThreshold ? 600 : 500,
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.025em'
                      }}
                    >
                      {pullState.isAboveConfirmationThreshold
                        ? 'Sonraki Habere Geç'
                        : 'Aşağı Çek'
                      }
                    </Typography>

                    {/* Icon */}
                    <KeyboardArrowDown
                      sx={{
                        color: pullState.isAboveConfirmationThreshold
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: 28,
                        transform: `translateY(${pullState.isAboveConfirmationThreshold ? 2 : 0}px)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Subtle progress indicator */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      borderRadius: '0 0 4px 4px',
                      background: `linear-gradient(90deg, 
                        ${theme.palette.primary.main} 0%, 
                        ${theme.palette.secondary.main} 100%)`,
                      opacity: pullState.pullDistance / PULL_THRESHOLD,
                      transition: 'opacity 0.2s ease'
                    }} />
                  </Box>
                )}

                {/* Scrollable News Content */}
                <Box
                  ref={newsContentRef}
                  onScroll={handleNewsContentScroll}
                  sx={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth',
                    transform: pullState.isPulling ? `translateY(${
                      pullState.pullDirection === 'down' ? pullState.pullDistance * 0.2 : -pullState.pullDistance * 0.2
                    }px)` : 'none',
                    transition: pullState.isPulling ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    // Modern scrollbar
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      '&:hover': { width: '8px' }
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                      borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.3)'
                      }
                    }
                  }}
                >
                  {/* News Image */}
                  {currentStepData.image && (
                    <Box sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250, md: 300 },
                      borderRadius: 3,
                      overflow: 'hidden',
                      mb: { xs: 3, md: 4 },
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                      flexShrink: 0,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
                        pointerEvents: 'none'
                      }
                    }}>
                      <img
                        src={currentStepData.image}
                        alt={currentStepData.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    </Box>
                  )}

                  {/* News Title */}
                  <Typography
                    variant={isMobile ? 'h4' : 'h2'}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 700,
                      mb: { xs: 2, md: 3 },
                      lineHeight: 1.2,
                      flexShrink: 0,
                      letterSpacing: '-0.025em'
                    }}
                  >
                    {currentStepData.title}
                  </Typography>

                  {/* News Date */}
                  {currentStepData.timestamp && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: { xs: 3, md: 4 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        flexShrink: 0,
                        '&::before': {
                          content: '""',
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          display: 'inline-block'
                        }
                      }}
                    >
                      {new Date(currentStepData.timestamp).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  )}

                  {/* News Content */}
                  <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 400,
                      mb: { xs: 4, md: 6 },
                      flex: 1,
                      minHeight: 'fit-content',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {currentStepData.content}
                  </Typography>

                  {/* Bottom navigation hints - Modern tasarım */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 3,
                    mt: 4,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(18, 18, 18, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px 16px 0 0',
                    mx: -3,
                    px: 3
                  }}>
                    {currentStep > 0 && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 1 }
                      }}>
                        <KeyboardArrowUp sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                          Önceki haber
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ flex: 1 }} />
                    {currentStep < steps.length - 1 && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 1 }
                      }}>
                        <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                          Sonraki haber
                        </Typography>
                        <KeyboardArrowDown sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Completion Page */}
            {currentStepData.type === 'completion' && (
              <Box sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}>
                <EmojiEvents sx={{ fontSize: 80, color: 'white', mb: 3 }} />
                
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 3,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                  }}
                >
                  {currentStepData.title}
                </Typography>
                
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: 4,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', md: '90%' }
                  }}
                >
                  {currentStepData.content}
                </Typography>

                {currentStepData.reward && (
                  <Box sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: 3,
                    borderRadius: 3,
                    mb: 4
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Kazandığınız Ödüller
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                      +{currentStepData.reward.cp} CP
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Fade>

      {/* CSS animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  );
};

export default ReadingFlowPage;

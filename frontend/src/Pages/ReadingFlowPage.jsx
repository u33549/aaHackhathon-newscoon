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

// Asset imports
import rakun1 from '../assets/rakun1.png';
import rakun2 from '../assets/rakun2.png';
import bekle1 from '../assets/bekle1.png';
import bekle2 from '../assets/bekle2.png';
import bayrak from '../assets/bayrak.png';

// Redux hooks
import { useAppDispatch } from '../hooks/redux';
import {
  useSelectedStack,
  useCurrentlyReading,
  useUserAchievements
} from '../hooks/redux';
import { fetchStackById } from '../store/slices/stackSlice';
import {
  completeStack,
  addBadge,
  updateReadingProgress
} from '../store/slices/userSlice';
import { addCelebrationToQueue } from '../store/slices/uiSlice';

// Components - LoadingScreen'i koru, Header'ı kaldır
import LoadingScreen from '../components/common/LoadingScreen';

// Constants
import { XP_CONSTANTS, allBadges } from '../constants/index.jsx';

// Utils
import { formatNewsText, textStyles, formatNewsForJSX, richTextStyles } from '../utils/textFormatter';

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
    content: stack.description || 'Bu haber seriında kronolojik olarak gelişen olayları inceleceğiz.',
    image: getStackImage(stack),
    timestamp: null,
    stackData: {
      newsCount: stack.news?.length || 0,
      viewCount: stack.viewCount || 0,
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
    });
  });

  // Son step - Tebrik
  const stackTotalXP = stack.xp || 0; // Sadece stack'in sahip olduğu XP
  steps.push({
    id: 'completion',
    type: 'completion',
    title: 'Tebrikler!',
    content: `${stack.title} haber seriını başarıyla tamamladınız!`,
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
  const userAchievements = useUserAchievements();

  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [readNewsIndices, setReadNewsIndices] = useState(new Set()); // Okunan haberleri takip et
  const [lastDirection, setLastDirection] = useState('forward'); // 'forward' veya 'backward' - rakun yön kontrolü için
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
  const hasLoadedProgress = useRef(false); // Progress yüklenme kontrolü için flag

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
      // Stack değiştiğinde progress yükleme flag'ini sıfırla
      hasLoadedProgress.current = false;
    }
  }, [selectedStack]);

  // currentStepData'yı burada tanımla - useEffect'lerden önce
  const currentStepData = steps[currentStep];

  // Kaldığımız yerden devam et - kaydedilmiş progress'i yükle (SADECE BİR KEZ)
  useEffect(() => {
    // Sadece ilk yüklemede çalışsın
    if (hasLoadedProgress.current) return;

    if (selectedStack && steps.length > 0 && currentlyReading.length > 0) {
      const stackProgress = currentlyReading.find(r => r.stackId === selectedStack._id);
      if (stackProgress && stackProgress.lastReadIndex > 0) {
        // Kaydedilmiş adımdan devam et
        console.log(`📖 Kaldığınız yerden devam ediliyor: Adım ${stackProgress.lastReadIndex}`);
        setCurrentStep(stackProgress.lastReadIndex);
        hasLoadedProgress.current = true; // Flag'i işaretle
      } else {
        hasLoadedProgress.current = true; // Progress yoksa da işaretle
      }
    }
  }, [selectedStack, steps.length, currentlyReading]);

  // Her step değiştiğinde progress'i kaydet
  useEffect(() => {
    // Sadece progress yüklendikten sonra kaydet
    if (!hasLoadedProgress.current) return;

    if (selectedStack && currentStep > 0 && steps.length > 0) {
      // Progress'i Redux'a kaydet
      dispatch(updateReadingProgress({
        stackId: selectedStack._id,
        currentStepIndex: currentStep
      }));
      console.log(`💾 Progress kaydedildi: Adım ${currentStep}`);
    }
  }, [currentStep, selectedStack, steps.length, dispatch]);

  // Her step değiştiğinde sayfayı en üste kaydır
  useEffect(() => {
    const container = newsContentRef.current;
    if (container && currentStepData?.type === 'news') {
      // Smooth scroll to top
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep, currentStepData?.type]);

  // Haber okuma işlemi - Celebration queue ile
  const handleNewsRead = useCallback((stepIndex) => {
    if (!selectedStack || readNewsIndices.has(stepIndex)) return;

    const step = steps[stepIndex + 1]; // +1 çünkü intro step var
    if (step && step.type === 'news') {
      // Local state güncelle - sadece okunan haberleri işaretle
      setReadNewsIndices(prev => new Set([...prev, stepIndex]));

      // Haber okundu bilgisi - sadece console log
      console.log(`Haber okundu: ${step.title}`);

      // Kategori bazlı rozet kontrolü - sadece ilk haber ise ve daha önce alınmamışsa
      const category = selectedStack.mainCategory;
      if (category && !readNewsIndices.has(0)) { // İlk haber ise
        const categoryBadge = allBadges.find(badge => badge.id === category);
        if (categoryBadge) {
          // Kullanıcının zaten bu rozete sahip olup olmadığını kontrol et
          const earnedBadges = userAchievements?.badges || [];
          const alreadyHasBadge = earnedBadges.some(badge => badge.id === categoryBadge.id);
          
          if (!alreadyHasBadge) {
            dispatch(addBadge(categoryBadge));

            // Celebration queue'ya ekle
            dispatch(addCelebrationToQueue({
              type: 'badge',
              badge: categoryBadge
            }));
          }
        }
      }
    }
  }, [selectedStack, steps, readNewsIndices, dispatch, userAchievements]);

  // Stack tamamlama işlemi - BİLDİRİM OLMADAN
  const handleStackCompletion = useCallback(() => {
    if (!selectedStack) return;

    // Sadece stack'in sahip olduğu XP'yi al
    const stackTotalXP = selectedStack.xp || 0;

    // Stack'i tamamla - sadece stack XP'si
    dispatch(completeStack({
      stackId: selectedStack._id,
      stackXP: stackTotalXP
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
    console.log('📍 Scroll Position:', { scrollTop, isAtTop, isAtBottom, scrollHeight, clientHeight });
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
      setLastDirection('forward'); // İleri gittiğimizi kaydet

      if (currentStepData?.type === 'news' && currentStepData?.stepNumber) {
        handleNewsRead(currentStepData.stepNumber - 1);
      }

      // DÜZELTME: Önce currentStep'i güncelle (progress bar kayacak)
      setCurrentStep(prev => prev + 1);

      // Sonra rakun koşacak (600ms sonra koşma bitecek)
      setTimeout(() => {
        setIsTransitioning(false);

        // Eğer completion step'ine geçtiyse, stack'i tamamla
        if (currentStep + 1 === steps.length - 1) {
          handleStackCompletion();
        }
      }, 1500); // Rakun koşma süresine eşit (1.5s)
    }
  }, [currentStep, steps.length, isTransitioning, currentStepData, handleNewsRead, handleStackCompletion]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setLastDirection('backward'); // Geri gittiğimizi kaydet

      // DÜZELTME: Önce currentStep'i güncelle (progress bar kayacak)
      setCurrentStep(prev => prev - 1);

      // Sonra rakun koşacak (600ms sonra koşma bitecek)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1500); // Rakun koşma süresine eşit (1.5s)
    }
  }, [currentStep, isTransitioning]);

  const handleClose = useCallback(() => {
    // Scroll pozisyonunu en başa ayarla
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <LoadingScreen message="Haber yükleniyor..." />
    );
  }

  if (!currentStepData) {
    return (
      <LoadingScreen message="Haber verisi yükleniyor..." />
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
        touchAction: 'pan-y'
      }}
    >
      {/* Progress Road - Header yerine */}
      {selectedStack && steps.length > 1 && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          zIndex: 1001,
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {/* Grid Container */}
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto', // Progress area, text area, button area
            alignItems: 'center',
            px: 2,
            gap: 2
          }}>

            {/* Progress Road Area - Sol Grid */}
            <Box sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden', // Progress road taşmaması için
              minWidth: 0, // Grid item shrinking için
              paddingLeft: 2 // Sol başlangıçta boşluk ekle
            }}>
              {/* Progress Road Container - Kaydırılabilir */}
              <Box sx={{
                position: 'relative',
                height: 60,
                // Düzeltilmiş genişlik hesaplama - daha fazla alan + padding
                width: `${Math.max(450, (steps.length - 1) * 80 + 160)}px`, // Daha fazla alan
                display: 'flex',
                alignItems: 'center',
                // Geliştirilmiş kaydırma animasyonu - daha yumuşak
                transform: steps.length > 3 && currentStep > 1
                  ? `translateX(-${Math.min((currentStep - 1) * 70, (steps.length - 3) * 70)}px)`
                  : 'translateX(0px)',
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                // Container sınırlarını genişlet
                minWidth: '100%',
                paddingLeft: 40 // İç padding - rakun ve bayraklar için
              }}>
                {/* Yol Çizgisi */}
                <Box sx={{
                  position: 'absolute',
                  top: 'calc(50% + 20px)',
                  left: 40, // Sol padding ile hizala
                  // Progress barın tam uzunluğu - daha uzun
                  width: `${(steps.length - 1) * 80}px`, // 80px aralık
                  height: 4,
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                  borderRadius: 2,
                  transform: 'translateY(-50%)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    backgroundColor: '#FFD700',
                    borderRadius: 2,
                    // Progress hesaplama düzeltme - son step dahil
                    width: `${Math.min(100, (currentStep / Math.max(1, steps.length - 1)) * 100)}%`,
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }
                }} />

                {/* Bayraklar - Düzeltilmiş pozisyonlar */}
                {steps.slice(1, -1).map((step, index) => {
                  const isCompleted = currentStep > index + 1;
                  const isCurrent = currentStep === index + 1;
                  // Düzeltilmiş pozisyon hesaplama - 80px aralık + padding
                  const flagPosition = 40 + (index + 1) * 80;

                  return (
                    <Box
                      key={step.id}
                      sx={{
                        position: 'absolute',
                        left: `${flagPosition}px`,
                        top: 'calc(50% + 2px)',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      {/* Bayrak Görseli */}
                      <Box sx={{
                        width: 32, // Biraz daha büyük
                        height: 36, // Biraz daha büyük
                        backgroundImage: `url(${bayrak})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        filter: isCompleted
                          ? 'hue-rotate(90deg) saturate(1.2) brightness(1.1)' // Yeşil ton
                          : isCurrent
                            ? 'hue-rotate(45deg) saturate(1.3) brightness(1.2)' // Altın ton
                            : 'grayscale(0.7) opacity(0.5)', // Gri ton
                        transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: isCurrent ? 'flagWave 2s ease-in-out infinite' : 'none',
                        position: 'relative'
                      }}>
                        {/* Bayrak üzerindeki işaret */}
                        {isCompleted && (
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '11px',
                            color: '#000',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            zIndex: 1
                          }}>
                            ✓
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}

                {/* Rakun Karakteri */}
                <Box sx={{
                  position: 'absolute',
                  // DÜZELTME: Rakun bayrakların tam merkezinde olsun
                  // Step 0 = başlangıç (sol taraf), Step 1+ = bayrakların merkezinde
                  // Son step'te sağ tarafa dışarı koş
                  left: currentStep === 0
                    ? '12px' // Başlangıç pozisyonu (sol başta)
                    : currentStep >= steps.length - 1
                      ? `${40 + (steps.length - 2) * 80 + 80}px` // Son step'te dışarı koş (bayrakların ötesine)
                      : `${40 + (currentStep - 1) * 80 +51}px`, // Bayrakların tam merkezinde (offset kaldırıldı)
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  transition: 'left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Daha uzun ve yumuşak geçiş
                  width: 56,
                  height: 56
                }}>
                  {/* Rakun Sprite */}
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: isTransitioning
                      ? `url(${rakun1})`
                      : `url(${bekle1})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
                    animation: isTransitioning
                      ? 'raccoonRun 0.3s steps(2) infinite' // Daha hızlı koşma
                      : 'raccoonIdle 2s steps(2) infinite',
                    // Yön kontrolü düzeltildi:
                    // - Başlangıçta (step 0) sağa bak (normal yön)
                    // - Geri giderken (önceki step'e) sola bak ve varış noktasında da sola bak
                    // - İleri giderken sağa bak (normal yön)
                    // - Son step'te sağa bak (dışarı koşarken)
                    transform: (() => {
                      // Eğer transition sırasında hangi yöne gittiğimizi kontrol et
                      if (isTransitioning) {
                        // lastDirection state'ini kullanarak yön belirle
                        if (lastDirection === 'backward') {
                          return 'scaleX(-1) rotateY(0deg)'; // Geri giderken sola bak
                        } else {
                          return 'scaleX(1) rotateY(0deg)'; // İleri giderken sağa bak
                        }
                      }

                      // Durgun haldeyken pozisyona göre yön belirle
                      // Son hareket yönüne göre yönelim belirle
                      if (currentStep === 0) {
                        return 'scaleX(1) rotateY(0deg)'; // Başlangıçta her zaman sağa bak
                      } else if (currentStep >= steps.length - 1) {
                        return 'scaleX(1) rotateY(0deg)'; // Son step'te her zaman sağa bak (çıkış)
                      } else {
                        // Ortada - son hareket yönüne bak
                        // Eğer son hareket geri ise sola bak, ileri ise sağa bak
                        if (lastDirection === 'backward') {
                          return 'scaleX(-1) rotateY(0deg)'; // Geri geldiyse sola bak
                        } else {
                          return 'scaleX(1) rotateY(0deg)'; // İleri gittiyse sağa bak
                        }
                      }
                    })(),
                    transition: 'transform 0.3s ease-in-out'
                  }}>
                    {/* Koşu toz efekti - sadece transition sırasında */}
                    {isTransitioning && (
                      <Box sx={{
                        position: 'absolute',
                        bottom: -10,
                        left: -15,
                        width: 40,
                        height: 15,
                        opacity: 0.7,
                        pointerEvents: 'none'
                      }}>
                        {[0, 1, 2, 3].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              position: 'absolute',
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: '#FFD700',
                              left: `${i * 6}px`,
                              animation: `dustParticle 0.5s ease-out infinite`,
                              animationDelay: `${i * 0.08}s`,
                              '@keyframes dustParticle': {
                                '0%': {
                                  opacity: 0,
                                  transform: 'scale(0) translateY(0px)'
                                },
                                '40%': {
                                  opacity: 1,
                                  transform: 'scale(1.2) translateY(-8px)'
                                },
                                '100%': {
                                  opacity: 0,
                                  transform: 'scale(0.3) translateY(-18px)'
                                }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Progress Text - Orta Grid */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 'fit-content'
            }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
                İlerleme
              </Typography>
              <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {currentStep}/{steps.length - 1}
              </Typography>
            </Box>

            {/* Close Button Area - Sağ Grid */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: 'fit-content'
            }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Ana Close Button'ı kaldırıyoruz çünkü artık grid içinde */}
      {/* <IconButton
        onClick={handleClose}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1002,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)'
          }
        }}
      >
        <Close />
      </IconButton> */}

      {/* Main Content - Progress road için padding */}
      <Fade in={!isTransitioning} timeout={500}>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: currentStepData.type === 'news' ? 'background.default' : '#000',
          paddingTop: selectedStack && steps.length > 1 ? '80px' : 0 // Progress road için padding
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
              // Hide scrollbar completely
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none' // IE and Edge
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
                <Box
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: { xs: 4, md: 6 },
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', sm: '95%', md: '90%' },
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    textAlign: 'left',
                    width: '100%',
                    '& .drop-cap': richTextStyles['.drop-cap'],
                    '& .quote-box': richTextStyles['.quote-box'],
                    '& .paragraph-divider': richTextStyles['.paragraph-divider'],
                    '& .news-paragraph': richTextStyles['.news-paragraph']
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatNewsForJSX(currentStepData.content) 
                  }}
                />

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
                    // Hide scrollbar completely
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // IE and Edge
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
                <Box
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 400,
                    mb: { xs: 4, md: 6 },
                    flex: 1,
                    minHeight: 'fit-content',
                    letterSpacing: '0.01em',
                    '& .drop-cap': richTextStyles['.drop-cap'],
                    '& .quote-box': richTextStyles['.quote-box'],
                    '& .paragraph-divider': richTextStyles['.paragraph-divider'],
                    '& .news-paragraph': richTextStyles['.news-paragraph']
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatNewsForJSX(currentStepData.content) 
                  }}
                />

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
                
                <Box
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: 4,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                    maxWidth: { xs: '100%', md: '90%' },
                    '& .drop-cap': richTextStyles['.drop-cap'],
                    '& .quote-box': richTextStyles['.quote-box'],
                    '& .paragraph-divider': richTextStyles['.paragraph-divider'],
                    '& .news-paragraph': richTextStyles['.news-paragraph']
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatNewsForJSX(currentStepData.content) 
                  }}
                />

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

        @keyframes raccoonRun {
          0%, 50% { 
            background-image: url(${rakun1}); 
          }
          50.1%, 100% { 
            background-image: url(${rakun2}); 
          }
        }

        @keyframes raccoonIdle {
          0%, 50% { 
            background-image: url(${bekle1}); 
          }
          50.1%, 100% { 
            background-image: url(${bekle2}); 
          }
        }

        @keyframes flagWave {
          0%, 100% { 
            transform: scale(1.2) rotateZ(0deg);
          }
          25% { 
            transform: scale(1.25) rotateZ(2deg);
          }
          75% { 
            transform: scale(1.25) rotateZ(-2deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default ReadingFlowPage;

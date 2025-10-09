import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ana sayfa hariç diğer tüm sayfalarda scroll'u en üste al
    if (pathname !== '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Animasyon olmadan hızlı geçiş
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

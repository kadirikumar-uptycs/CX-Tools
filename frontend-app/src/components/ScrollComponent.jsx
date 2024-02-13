import React, { useState } from 'react';
import './css/ScrollComponent.css';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`scoll-button ${isVisible ? 'show' : ''}`}
      onClick={scrollToTop}
    >
        <VerticalAlignTopIcon />
    </button>
  );
};

export default ScrollToTopButton;

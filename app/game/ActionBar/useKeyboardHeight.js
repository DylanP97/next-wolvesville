import { useState, useEffect } from 'react';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Détection via visualViewport (plus précis)
    if (window.visualViewport) {
      const handleResize = () => {
        const viewport = window.visualViewport;
        const windowHeight = window.innerHeight;
        const viewportHeight = viewport.height;
        
        // La différence indique la hauteur du clavier
        const keyboardHeight = windowHeight - viewportHeight;
        setKeyboardHeight(keyboardHeight > 0 ? keyboardHeight : 0);
      };

      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('scroll', handleResize);
      };
    }
  }, []);

  return keyboardHeight;
};

export const useInputFocus = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  return { isInputFocused, handleFocus, handleBlur };
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default English
  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('hello_font_size') || '16';
  });

  const updateFontSize = (newSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('hello_font_size', newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    document.body.style.fontSize = `${newSize}px`;
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, fontSize, setFontSize: updateFontSize }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

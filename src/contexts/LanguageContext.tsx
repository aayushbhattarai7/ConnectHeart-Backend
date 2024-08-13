import { LanguageEnum } from '../types/global.types';
import { ReactNode, createContext, useEffect, useState } from 'react';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageContext = createContext<{
  lang: LanguageEnum;
  setLang: (lang: LanguageEnum) => void;
}>({
  lang: LanguageEnum.en,
  setLang: () => {
    return;
  },
});

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageEnum>(
    (localStorage.getItem('lang') as LanguageEnum) || LanguageEnum.en,
  );

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);
  return (
    <LanguageContext.Provider value={{ lang: language, setLang: setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

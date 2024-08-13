import { useContext } from 'react';
import { LanguageType } from '../types/global.types';
import { LanguageContext } from '../contexts/LanguageContext';

export const useLang = () => {
  const contextValue = useContext(LanguageContext);

  const languageType: LanguageType = {
    lang: contextValue.lang,
    setLang: contextValue.setLang,
  };
  return languageType;
};

//export default useLang

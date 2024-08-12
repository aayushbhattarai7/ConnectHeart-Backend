import { LanguageEnum } from '../types/global.types';

export const getMultiLanguageMessage = (
    language: LanguageEnum,
    messages: Record<LanguageEnum, string>
) => messages[language] || 'Invalid Input';

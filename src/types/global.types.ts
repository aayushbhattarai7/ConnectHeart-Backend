export type LabelTypes = Record<string, Record<string, string>>;

export enum LanguageEnum {
  en = 'en',
  ne = 'ne',
}
export type Language = keyof typeof LanguageEnum;

export type LanguageType = {
  lang: LanguageEnum;
  setLang: (lang: LanguageEnum) => void;
};
export type multiLanguage = Record<string, string>;

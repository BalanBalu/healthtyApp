import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { I18nManager } from 'react-native';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("./translations/en.json"),
  ta: () => require("./translations/ta.json")
};

const translate = memoize(
  (key, config) => { 
    return i18n.t(key, config) // {defaultValue: key }
  },
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = (languageShortForm) => {
  // fallback if no available language fits
  const fallback = { languageTag:  languageShortForm || 'ta', isRTL: false };

  const { languageTag, isRTL } = /* RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || */ fallback;
  console.log(languageTag);
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export { translationGetters, setI18nConfig, translate }
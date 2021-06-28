import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("./translations/en.json"),
  ta: () => require("./translations/ta.json"),
  ma: () => require("./translations/ma.json"),
  hi: () => require("./translations/hi.json"),
  ka: () => require("./translations/ka.json")

};

const translate = memoize(
  (key, config) => {
    return i18n.t(key, config) // {defaultValue: key }
  },
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = async (languageShortForm) => {
  let setDefaultLanguage = await AsyncStorage.getItem('setDefaultLanguage');

  // fallback if no available language fits
  const fallback = { languageTag: languageShortForm || setDefaultLanguage || 'en', isRTL: false };

  const { languageTag, isRTL } = /* RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || */ fallback;
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export { translationGetters, setI18nConfig, translate }
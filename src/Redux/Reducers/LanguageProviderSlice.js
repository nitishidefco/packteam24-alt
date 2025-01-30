import {createSlice} from '@reduxjs/toolkit';
import {LANGUAGE_REDUCER} from '../SliceKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../i18n/i18n';

const intitalState = {
  globalLanguage: null,
};
const languages = {
  POL: 'pl', // Polish
  GER: 'de', // German
  UK: 'en', // English
  RUS: 'ru', // Russian
  UKA: 'ua', // Ukrainian
  ZH: 'cn', //chinese
};
const languageProviderSlice = createSlice({
  name: LANGUAGE_REDUCER,
  initialState: intitalState,
  reducers: {
    setGlobalLanguage: (state, action) => {
      state.globalLanguage = action?.payload;
    },
  },
});

export const {setGlobalLanguage} = languageProviderSlice.actions;
export const initializeLanguage = () => async dispatch => {

  try {
    const savedLang = await AsyncStorage.getItem('language');
    if (savedLang) {
      dispatch(setGlobalLanguage(savedLang));
      i18n.changeLanguage(savedLang);
    } else {
      const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode;
      const defaultLang = Object.values(languages).includes(deviceLanguage)
        ? deviceLanguage
        : 'de'; // Fallback to German

      dispatch(setGlobalLanguage(defaultLang));
      i18n.changeLanguage(defaultLang);
      await AsyncStorage.setItem('language', defaultLang);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
  }
};

// Set language with storage and i18n
export const setLanguageWithStorage = language => async dispatch => {

  try {
    await AsyncStorage.setItem('language', language);
    dispatch(setGlobalLanguage(language));
    i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};
const LanguageProviderReducer = languageProviderSlice.reducer;
export default LanguageProviderReducer;

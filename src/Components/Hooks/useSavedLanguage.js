import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSavedLanguage = () => {
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const getSavedLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        setLanguage(storedLanguage);
      } catch (error) {
        console.error('Error getting language from local storage', error);
      }
    };

    getSavedLanguage();
  }, []);
  return language;
};

export default useSavedLanguage;

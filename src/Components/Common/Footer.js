import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import FlagComponent from './FlagComponent';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {setLanguageWithStorage} from '../../Redux/Reducers/LanguageProviderSlice';
import {Constants} from '../../Config';

const Footer = () => {
  const languages = {
    POL: 'pl',
    GER: 'de',
    UK: 'en',
    RUS: 'ru',
    UKA: 'ua',
    ZH: 'cn',
  };
  const {t, i18n} = useTranslation();
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);

  const dispatch = useDispatch();
  const [activeLanguage, setActiveLanguage] = useState(null);
  const BASE_URL = Constants.IS_DEVELOPING_MODE
    ? Constants.BASE_URL.DEV
    : Constants.BASE_URL.PROD;
  const privacyPolicyUrl = `${BASE_URL}de/datenschutzerklarung`;
  const applicationInformatinoUrl = `${BASE_URL}de/technischer-support`;
  const OpenURLText = ({url, children}) => {
    const handlePress = useCallback(async () => {
      const supported = true;
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.forgotPasswordText}>{children}</Text>
      </TouchableOpacity>
    );
  };
  console.log(Matrics.screenHeight);

  const handleLanguageChange = async country => {
    const selectedLang = languages[country];
    setActiveLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    dispatch(setLanguageWithStorage(selectedLang));
  };
  return (
    <>
      <View style={styles.FlagContainer}>
        {Object.keys(languages).map(country => (
          <TouchableOpacity
            key={country}
            onPress={() => handleLanguageChange(country)}
            style={[
              styles.touchable,
              globalLanguage &&
                globalLanguage !== languages[country] &&
                styles.inactive,
            ]}>
            <FlagComponent Country={country} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{marginBottom: Matrics.ms(10)}}>
        <OpenURLText url={privacyPolicyUrl}>{t('Login.pp')}</OpenURLText>
        <OpenURLText url={applicationInformatinoUrl}>
          {t('Login.ai')}
        </OpenURLText>
      </View>
      <View
        style={{
          marginTop: Matrics.vs(10),
          marginBottom: Matrics.vs(0),
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 3,
        }}>
        <Text
          style={{
            color: COLOR.PURPLE,
            fontFamily: typography.fontFamily.Montserrat.Bold,
            fontSize: typography.fontSizes.fs10,
          }}>
          TEST-TRACKER v1.1
        </Text>
      </View>
    </>
  );
};

export default Footer;
const styles = StyleSheet.create({
  FlagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: Matrics.ms(10),
  },
  touchable: {
    opacity: 1, // Default opacity
  },
  inactive: {
    opacity: 0.5, // Reduced opacity for inactive countries
  },
  forgotPasswordText: {
    color: '#307ecc',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import {useTheme} from '../../Context/ThemeContext';
import {t} from 'i18next';
import {typography} from '../../Config/AppStyling';
import {WebView} from 'react-native-webview';
import {Constants} from '../../Config';
import {useAuthActions} from '../../Redux/Hooks';
import {useSelector} from 'react-redux';
const HourlyLists = ({navigation}) => {
  const BASE_URL = Constants.IS_DEVELOPING_MODE
    ? Constants.BASE_URL.DEV
    : Constants.BASE_URL.PROD;
  const theme = useTheme();
  const {state} = useAuthActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const url = `${BASE_URL}worker/hourly-list/index?mobile_session_id=${SessionId}&lang=${globalLanguage}`;
  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader />
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.PRIMARY,
            },
          ]}>
          <Text style={styles.headerTitle}>{t('HourlyList.title')}</Text>
        </View>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.PRIMARY} />
          </View>
        )}
        <WebView
          source={{uri: url}}
          style={{flex: 1}}
          onLoadStart={() => setIsLoading(true)} // Show loader when loading starts
          onLoadEnd={() => setIsLoading(false)}
        />
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF0FA',
  },
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: typography.fontSizes.fs15,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HourlyLists;

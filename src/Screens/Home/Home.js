import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Image, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {useHomeActions} from '../../Redux/Hooks';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import {Images} from '../../Config';
import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';
import {useScanTagActions} from '../../Redux/Hooks/useScanTagActions';
import NetworkStatusComponent from '../../Components/Common/NetworkStatus';
import {clearOfflineStorage} from '../../Redux/Reducers/SaveDataOfflineSlice';
import {useDispatch, useSelector} from 'react-redux';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [hasNfc, setHasNfc] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [List, setList] = useState([]);
  const {state, homecall} = useHomeActions();
  const {state: states, scanCall} = useScanTagActions();
  const {Auth, Home} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [refreshing, setRefreshing] = useState(false);
  const CurrentMode = states?.data?.data[1];

  // Initialize NFC when component mounts
  useEffect(() => {
    const initNfc = async () => {
      await NfcManager.start();
      const isSupported = await NfcManager.isSupported();
      setHasNfc(isSupported);
    };
    
    initNfc();
    
    // Cleanup when component unmounts
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch(() => 0);
    };
  }, []);

  useEffect(() => {
    dashboardApi();
  }, []);

  function addColons(number) {
    return number.replace(/(.{2})(?=.)/g, '$1:');
  }

  const handleNfcTag = async (tag) => {
    if (tag?.id) {
      const id = addColons(tag.id);
      await getUid(id);
    }
  };

  // Separate scanning functions for iOS and Android
  const startNfcScan = async () => {
    try {
      setIsScanning(true);

      if (Platform.OS === 'ios') {
        // iOS specific implementation
        await NfcManager.requestTechnology(NfcTech.MifareIOS);
        const tag = await NfcManager.getTag();
        await handleNfcTag(tag);
      } else {
        // Android implementation
        await NfcManager.registerTagEvent();
        NfcManager.setEventListener(NfcEvents.DiscoverTag, handleNfcTag);
      }
    } catch (error) {
      console.warn('Error starting NFC scan:', error);
    }
  };

  const stopNfcScan = async () => {
    try {
      setIsScanning(false);
      await NfcManager.cancelTechnologyRequest();
      if (Platform.OS === 'android') {
        await NfcManager.unregisterTagEvent();
      }
    } catch (error) {
      console.warn('Error stopping NFC scan:', error);
    }
  };

  async function getUid(uid) {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('session_id', SessionId);
      formdata.append('device_id', '13213211');
      formdata.append('nfc_key', uid);
      // dispatch(clearOfflineStorage());
      await scanCall(formdata);
    } catch (error) {
      console.error('Error processing UID:', error);
    } finally {
      setLoading(false);
      await stopNfcScan();
    }
  }

  function dashboardApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', '13213211');
    homecall(formdata);
  }

  useEffect(() => {
    if (Home.data?.data) {
      setList(Home.data.data);
    }
    setLoading(false);
  }, [Home]);

  if (!hasNfc) {
    return (
      <DrawerSceneWrapper>
        <CustomHeader />
        <SafeAreaView style={styles.centeredContainer}>
          <Text style={styles.errorText}>
            Your device does not support NFC! If your device supports NFC turn
            it on from settings and restart the App
          </Text>
        </SafeAreaView>
      </DrawerSceneWrapper>
    );
  }

  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <CustomHeader />
        <View style={styles.container}>
          <View>
            <NetworkStatusComponent />
          </View>
          <View style={styles.nfcPromptContainer}>
            <Image source={Images.NFC} style={styles.userIcon} />
            <Text style={styles.nfcPromptText}>
              {isScanning ? 'Ready to Scan' : 'Start NFC Scan'}
            </Text>
            <Text style={styles.nfcPromptSubtext}>
              {isScanning ? 'Tap your tag to continue' : 'Press the button to start scanning'}
            </Text>
            <TouchableOpacity
              style={[
                styles.scanButton,
                isScanning && styles.scanningButton
              ]}
              onPress={isScanning ? stopNfcScan : startNfcScan}
            >
              <Text style={styles.buttonText}>
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: '#EBF0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#000',
    fontSize: 18,
  },
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modeContainer: {
    padding: 5,
    display: 'flex',
  },
  modeLabel: {
    fontSize: 25,
  },
  modeText: {
    fontSize: 19,
  },
  scanButton: {
    backgroundColor: '#0A1931',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
  },

  // NFC Tag styles
  nfcPromptContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nfcPromptText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },
  nfcPromptSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
});

export default Home;

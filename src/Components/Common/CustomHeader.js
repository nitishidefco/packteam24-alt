import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Images} from '../../Config';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import {useNavigation} from '@react-navigation/native';
import DrawerSceneWrapper from './DrawerSceneWrapper';
import DropdownAlert from 'react-native-dropdownalert';
import {useAuthActions} from '../../Redux/Hooks';
import {toastMessage} from '../../Helpers';
import {reduxStorage} from '../../Redux/Storage';
import {useUserProfileActions} from '../../Redux/Hooks/useUserProfileActions';

const CustomHeader = ({onUserPress}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const {state, logoutCall} = useAuthActions();
  // const {profileState} = useUserProfileActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    handleLogoutResponse();
  }, [Auth?.islogoutSuccess]);

  function logoutApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', '123');
    logoutCall(formdata);
    console.log(formdata, 'dataaaa');
  }
  function handleLogoutResponse() {
    if (loading && Auth.islogoutSuccess === true) {
      setLoading(false);
      toastMessage.success('Logout successful');
      navigation.navigate('Login');
      reduxStorage.removeItem('clear');
    } else if (loading && Auth.islogoutSuccess === false) {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: '#091242'}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={openDrawer}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            borderRadius: 30,
            flexDirection: 'row',
          }}>
          <Image
            source={Images.SIDEMENU}
            resizeMode={'contain'}
            style={styles.drawerIconStyle}
          />
        </TouchableOpacity>
        <Image
          source={Images.NEW_APP_LOGO}
          resizeMode={'contain'}
          style={styles.logoStyle}
        />
        <TouchableOpacity
          onPress={toggleModal}
          style={styles.userIconContainer}>
          <Image
            // source={{uri: Auth.data?.data?.avatar}}
            // source={Images.USER}
            style={styles.userIconStyle}
          />
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View
              style={[
                styles.modalContainer,
                Platform.OS === 'ios' && styles.iosModalContainer,
              ]}>
              <View style={styles.modalContent}>
                {/* Change Password */}
                <TouchableOpacity
                  onPress={() => navigation.replace('ChangePassword')}>
                  <View style={styles.optionContainer}>
                    <Image
                      source={Images.CHANGE_PASSWORD}
                      style={styles.passwordLogo}
                    />
                    <Text style={styles.modalText}>Change Password</Text>
                  </View>
                </TouchableOpacity>
                <Image
                  source={Images.SEPRATOR}
                  style={{
                    width: Matrics.ms(156),
                    marginTop: Matrics.ms(14),
                  }}></Image>

                <TouchableOpacity onPress={()=>navigation.replace('UserProfile')}>
                  <View style={[styles.optionContainer, styles.userProfile]}>
                    <Image
                      source={Images.CHANGE_PASSWORD}
                      style={{
                        width: Matrics.scale(15),
                        height: Matrics.scale(15),
                        resizeMode: 'contain',
                        right: 36,
                      }}
                    />
                    <Text style={styles.LogoutText}>User Profile</Text>
                  </View>
                </TouchableOpacity>
                <Image
                  source={Images.SEPRATOR}
                  style={{
                    width: Matrics.ms(156),
                    marginTop: Matrics.ms(14),
                  }}></Image>

                  /* ----------------------------- ChangeLanguage ----------------------------- */
                {/* Logout */}
                <TouchableOpacity onPress={logoutApi}>
                  <View style={styles.optionContainer}>
                    <Image
                      source={Images.LOGOUT_ICON}
                      style={{
                        width: Matrics.scale(15),
                        height: Matrics.scale(15),
                        resizeMode: 'contain',
                        right: 37,
                      }}
                    />
                    <Text style={styles.LogoutText}>Logout</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userProfile:{marginLeft: Matrics.s(18)},
  headerContainer: {
    height: Matrics.ms(65),
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#061439',
  },
  drawerIconStyle: {
    tintColor: COLOR.WHITE,
    width: Matrics.scale(15),
    height: Matrics.vs(15),
    alignSelf: 'center',
  },
  logoStyle: {
    width: Matrics.scale(160),
    height: Matrics.vs(35),
    alignSelf: 'center',
  },
  userIconContainer: {
    width: Matrics.scale(30),
    height: Matrics.vs(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Matrics.mvs(25),
    marginRight: Matrics.ms(16),
    marginTop: Matrics.vs(2),
  },
  userIconStyle: {
    width: Matrics.ms(40),
    height: Matrics.ms(40),
    marginBottom: Matrics.ms(0),
    borderRadius: Matrics.ms(50),
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: Matrics.ms(60),
    paddingHorizontal: 10,
  },
  iosModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: Matrics.vs(96),
    paddingHorizontal: Matrics.ms(10),
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    height: Matrics.ms(125),
    width: Matrics.ms(155),
  },
  modalText: {
    fontSize: typography.fontSizes.fs11,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontWeight: '500',
    color: 'black',
  },
  LogoutText: {
    fontSize: typography.fontSizes.fs11,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontWeight: '500',
    right: Matrics.ms(24),
    color: 'black',
  },
  passwordLogo: {
    width: Matrics.scale(13),
    height: Matrics.vs(15),
    marginRight: 10,
    resizeMode: 'contain',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Matrics.ms(10),
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
});

export default CustomHeader;

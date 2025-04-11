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
import {useNavigation, useRoute} from '@react-navigation/native';
import DrawerSceneWrapper from './DrawerSceneWrapper';
import DropdownAlert from 'react-native-dropdownalert';
import {useAuthActions} from '../../Redux/Hooks';
import {toastMessage} from '../../Helpers';
import {reduxStorage} from '../../Redux/Storage';
import {useUserProfileActions} from '../../Redux/Hooks/useUserProfileActions';
import {success} from '../../Helpers/ToastMessage';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import {clearMessageSelection} from '../../Redux/Reducers/MessageSlice';

const CustomHeader = ({onUserPress, title = 'Message Center'}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isNotificationScreen = route.name === 'NotificationScreen';
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const {state, logoutCall} = useAuthActions();
  // const {profileState} = useUserProfileActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const unreadCount = useSelector(state => state.Messages?.unreadCount || 0);
  const messages = useSelector(state => state.Messages?.messages || []);
  const [modalVisible, setModalVisible] = useState(false);

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
  }
  function handleLogoutResponse() {
    if (loading && Auth.islogoutSuccess === true) {
      setLoading(false);
      const successToast = t('Toast.LogoutSuccess');
      success(successToast);
      navigation.navigate('Login');
      reduxStorage.removeItem('clear');
    } else if (loading && Auth.islogoutSuccess === false) {
      setLoading(false);
    }
  }
  const recentMessages = messages.slice(0, 15);
  const renderMessageItem = ({item}) => {
    return (
      <View style={styles.messageItem}>
        <Text style={[styles.messageTitle, !item.read && styles.unread]}>
          {item.topic.length > 30
            ? `${item.topic.slice(0, 30)}...`
            : item.topic}
        </Text>
        <Text style={styles.messageDate}>
          {moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{backgroundColor: '#091242'}}>
      <View style={[styles.headerContainer]}>
        <TouchableOpacity
          onPress={() => {
            if (isNotificationScreen) {
              dispatch(clearMessageSelection());
              navigation.goBack();
            } else {
              navigation.openDrawer();
            }
          }}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            borderRadius: 30,
            flexDirection: 'row',
          }}>
          <Image
            source={isNotificationScreen ? Images.BACK_ICON : Images.SIDEMENU} // Back icon or menu icon
            resizeMode={'contain'}
            style={[
              styles.drawerIconStyle,
              {
                width: isNotificationScreen ? Matrics.s(25) : Matrics.scale(15),
                height: isNotificationScreen ? Matrics.vs(25) : Matrics.vs(15),
              },
            ]}
          />
        </TouchableOpacity>
        {isNotificationScreen ? (
          <Text style={styles.headerTitle}>{title}</Text>
        ) : (
          <Image
            source={Images.NEW_APP_LOGO}
            resizeMode={'contain'}
            style={styles.logoStyle}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            if (isNotificationScreen) {
              navigation.navigate('HomeDrawer', {screen: 'ArchiveScreen'});
            } else {
              navigation.navigate('HomeDrawer', {screen: 'NotificationScreen'});
            }
          }}
          style={styles.userIconContainer}>
          <Image
            source={
              isNotificationScreen
                ? Images.ARCHIVE_ICON
                : Images.NOTIFICATION_ICON
            }
            style={styles.userIconStyle}
          />
          {/* Show unread count badge only for the notification icon (not archive icon) */}
          {!isNotificationScreen && unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                padding: Matrics.s(1),
                borderRadius: Matrics.s(5),
                top: -3,
                right: -3,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs10,
                }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Modal */}
        <Modal
          visible={modalVisible} // Use modalVisible state instead of true
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: Matrics.vs(10),
                  paddingHorizontal: Matrics.s(20),
                  marginBottom: Matrics.vs(10),
                  // textAlign: 'center',
                  backgroundColor: COLOR.PURPLE,
                  borderTopLeftRadius: Matrics.s(10),
                  borderTopRightRadius: Matrics.s(10),
                }}>
                <Text style={styles.modalTitle}>Message Center</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.5}>
                  <Image
                    source={Images.CLOSE}
                    style={{
                      width: Matrics.s(20),
                      height: Matrics.vs(20),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={recentMessages}
                renderItem={renderMessageItem}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No messages</Text>
                }
                style={styles.messageList}
              />

              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('HomeDrawer', {
                    screen: 'NotificationScreen',
                  });
                }}
                activeOpacity={0.5}>
                <Text style={styles.seeAllButtonText}>See all messages</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userProfile: {marginLeft: Matrics.s(18)},
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
  headerTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: '#fff',
    fontSize: typography.fontSizes.fs16,
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
    position: 'relative',
  },
  userIconStyle: {
    width: Matrics.ms(25),
    height: Matrics.ms(25),
    marginBottom: Matrics.ms(0),
    resizeMode: 'contain',
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
  title: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(18),
    fontWeight: 'bold',
  },
  messageIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -Matrics.vs(5),
    right: -Matrics.s(5),
    backgroundColor: COLOR.ERROR, // Red background for the badge
    borderRadius: Matrics.s(10),
    width: Matrics.s(20),
    height: Matrics.s(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(12),
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Matrics.vs(50), // Adjust based on your header height
  },
  modalContent: {
    backgroundColor: '#fff', // Dark background like in the screenshot
    width: '80%',
    maxHeight: '50%',
    borderRadius: Matrics.s(10),
    marginRight: Matrics.s(10),
    // padding: Matrics.s(10),
  },
  modalTitle: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  messageList: {
    flexGrow: 0,
    paddingHorizontal: Matrics.s(14),
    marginBottom: Matrics.s(5),
  },
  messageItem: {
    paddingVertical: Matrics.vs(5),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GRAY,
  },
  messageTitle: {
    color: COLOR.PURPLE,
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  unread: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  messageDate: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(12),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginTop: Matrics.vs(3),
  },
  emptyText: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(14),
    textAlign: 'center',
    marginVertical: Matrics.vs(10),
  },
  seeAllButton: {
    backgroundColor: COLOR.PURPLE,
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(10),
    borderBottomLeftRadius: Matrics.s(10),
    borderBottomRightRadius: Matrics.s(10),
    alignSelf: 'center',
    width: '100%',
  },
  seeAllButtonText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    textAlign: 'center',
  },
});

export default CustomHeader;

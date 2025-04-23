import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  SafeAreaView,
} from 'react-native';
import {Images} from '../../Config';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuthActions} from '../../Redux/Hooks';
import {success} from '../../Helpers/ToastMessage';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import {clearMessageSelection} from '../../Redux/Reducers/MessageSlice';
import {reduxStorage} from '../../Redux/Storage';
import {clearArchiveSelection} from '../../Redux/Reducers/ArchiveSlice';
import i18n from '../../i18n/i18n';

const CustomHeader = ({
  onUserPress,
  title = i18n.t('CustomHeader.MessageCenter'),
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isNotificationScreen = route.name === 'NotificationScreen';
  const isArchiveScreen = route.name === 'ArchiveScreen';
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const {state, logoutCall} = useAuthActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.session_id;
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
            } else if (isArchiveScreen) {
              dispatch(clearArchiveSelection());
              navigation.navigate('HomeDrawer', {screen: 'NotificationScreen'});
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
            source={
              isNotificationScreen || isArchiveScreen
                ? Images.BACK_ICON
                : Images.SIDEMENU
            }
            resizeMode={'contain'}
            style={[
              styles.drawerIconStyle,
              {
                width:
                  isNotificationScreen || isArchiveScreen
                    ? Matrics.s(25)
                    : Matrics.scale(15),
                height:
                  isNotificationScreen || isArchiveScreen
                    ? Matrics.vs(25)
                    : Matrics.vs(15),
              },
            ]}
          />
        </TouchableOpacity>
        {isNotificationScreen ? (
          <Text style={styles.headerTitle}>{title}</Text>
        ) : isArchiveScreen ? (
          <Text
            style={[
              styles.headerTitle,
              {
                marginRight: 50,
              },
            ]}>
            {t('CustomHeader.Archives')}
          </Text>
        ) : (
          <Image
            source={Images.NEW_APP_LOGO}
            resizeMode={'contain'}
            style={styles.logoStyle}
          />
        )}
        {!isArchiveScreen && (
          <TouchableOpacity
            onPress={() => {
              if (isNotificationScreen) {
                navigation.navigate('HomeDrawer', {screen: 'ArchiveScreen'});
              } else {
                navigation.navigate('HomeDrawer', {
                  screen: 'NotificationScreen',
                });
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
        )}
        {modalVisible && !isNotificationScreen && !isArchiveScreen && (
          <Modal
            visible={modalVisible}
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
                    backgroundColor: COLOR.PURPLE,
                    borderTopLeftRadius: Matrics.s(10),
                    borderTopRightRadius: Matrics.s(10),
                  }}>
                  <Text style={styles.modalTitle}>
                    {t('Header.MessageCenter')}
                  </Text>
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
        )}
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
    backgroundColor: COLOR.PURPLE,
  },
  drawerIconStyle: {
    tintColor: COLOR.WHITE,
    alignSelf: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: '#fff',
    fontSize: typography.fontSizes.fs16,
    flex: 1,
    textAlign: 'center',
  },
  logoStyle: {
    width: Matrics.scale(160),
    height: Matrics.vs(35),
    alignSelf: 'center',
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Matrics.vs(50),
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '50%',
    borderRadius: Matrics.s(10),
    marginRight: Matrics.s(10),
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

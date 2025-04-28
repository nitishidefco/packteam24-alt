import React, {memo, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
  Vibration,
  Animated,
  Alert,
  Linking,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/Common/CustomHeader';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {
  filterMessages,
  setCurrentPage,
  archiveMessage,
  markAsRead,
  markAsUnread,
  setPreviewMessage,
  fetchMessagesStart,
  toggleMessageSelection,
  clearMessageSelection,
  moveToArchiveStart,
  multipleMarkMessages,
  searchMessagesStart,
  setPermissionAlertShown,
  resetPermissionAlert,
} from '../../Redux/Reducers/MessageSlice';
import {useFocusEffect} from '@react-navigation/native';
import {Store} from '../../Redux/Store';
import i18n from '../../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationItem = memo(({item, onLongPress, onPress, isSelected}) => {
  // Precompute expensive operations outside render
  const cleanedContent = item.content
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const formattedDate = moment
    .tz(item.created_at, 'Europe/Berlin')
    .format('DD-MMM HH:mm');
  const truncatedTopic =
    item.topic.length > 30 ? `${item.topic.slice(0, 40)}...` : item.topic;
  const truncatedContent =
    cleanedContent.length > 30
      ? `${cleanedContent.slice(0, 70)}...`
      : cleanedContent;

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(item.id)}
      delayLongPress={300}
      onPress={() => onPress(item.id)}
      key={item.created_at}
      style={[
        styles.notificationItem,
        {
          backgroundColor: isSelected ? '#E2DFD2' : 'white',
        },
      ]}
      activeOpacity={0.8}>
      <View
        style={[
          styles.roundElement,
          isSelected && styles.selectedRoundElement,
        ]}>
        {isSelected ? (
          <Image source={Images.TICK_ICON} style={styles.tickIcon} />
        ) : (
          <Text style={styles.roundElementText}>
            {item.topic.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.notificationContent}>
        <Text
          style={[styles.notificationTitle, item.read === 0 && styles.unread]}>
          {truncatedTopic}
        </Text>
        <Text
          style={[
            styles.notificationBody,
            item.read === 0 && styles.unreadBody,
          ]}>
          {truncatedContent}
        </Text>
      </View>
      <View style={{alignItems: 'flex-end', gap: 10, height: Matrics.vs(40)}}>
        <Text style={styles.notificationDate}>{formattedDate}</Text>
        {item.read === 0 && <View style={styles.actions} />}
      </View>
    </TouchableOpacity>
  );
});
const NotificationScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {
    messages,
    filteredMessages,
    currentPage,
    totalPages,
    unreadCount,
    previewMessage,
    isLoading,
    selectedMessages,
    hasShownPermissionAlert,
  } = useSelector(initialState => initialState.Messages);

  const deviceId = useSelector(state => state?.Network?.deviceId);
  const authState = useSelector(state => state?.Auth);
  const sessionId = authState?.data?.data?.sesssion_id;
  const globalLanguage = useSelector(
    state => state?.GlobalLanguage?.globalLanguage || 'en',
  );

  useEffect(() => {
    setIsSelectionMode(selectedMessages?.length > 0);
  }, [selectedMessages]);
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const hasShownAlert =
          (await AsyncStorage.getItem('hasShownPermissionAlert')) === 'true';
        // Check permission status
        const authStatus = await messaging().hasPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled && !hasShownAlert) {
          // Show alert only if permissions are denied and alert hasn't been shown
          Alert.alert(
            i18n.t('NotificationService.permissionsDeniedTitle'),
            i18n.t('NotificationService.permissionsDeniedMessage'),
            [
              {text: i18n.t('NotificationService.cancel'), style: 'cancel'},
              {
                text: i18n.t('NotificationService.settings'),
                onPress: async () => {
                  try {
                    if (Platform.OS === 'ios') {
                      // Try iOS-specific URL, fall back to openSettings
                      await Linking.openURL('App-Prefs:NOTIFICATIONS_ID').catch(
                        async () => {
                          console.log(
                            '[NotificationScreen] Failed to open App-Prefs:NOTIFICATIONS_ID, falling back to Settings',
                          );
                          await Linking.openSettings();
                        },
                      );
                    } else {
                      // Android: Open app settings
                      await Linking.openSettings();
                    }
                    console.log(
                      '[NotificationScreen] User prompted to enable notifications in Settings',
                    );
                    await AsyncStorage.setItem(
                      'hasShownPermissionAlert',
                      'true',
                    );
                  } catch (error) {
                    console.error(
                      '[NotificationScreen] Error opening settings:',
                      error,
                    );
                  }
                },
              },
            ],
            {cancelable: true},
          );
        }
      } catch (error) {
        console.error(
          '[NotificationScreen] Error checking permissions:',
          error,
        );
      }
    };

    checkPermissions();
  }, [dispatch, hasShownPermissionAlert]);
  const handleLoadMore = () => {
    if (filteredMessages.length === 0) {
      console.log('Loading more');

      return;
    }
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      dispatch(setCurrentPage(nextPage));
      const formData = new FormData();
      formData.append('page', nextPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      if (filterType === 'read') {
        formData.append('status', 1);
      } else if (filterType === 'unread') {
        formData.append('status', 0);
      }
      dispatch(fetchMessagesStart({payload: formData}));
    }
  };
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, []);
  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLOR.PURPLE} />
      </View>
    );
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollThreshold = Matrics.screenHeight * 1.2;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveMessageId, setArchiveMessageId] = useState(null);
  const [showMarkReadModal, setShowMarkReadModal] = useState(false);
  const [isMarkAsUnread, setIsMarkAsUnread] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const flatListRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const handleLongPress = id => {
    if (selectedMessages.length === 0) {
      Vibration.vibrate(50); // Vibrate for 50ms when the first item is selected
    }
    dispatch(toggleMessageSelection(id));
  };

  const handlePress = id => {
    if (isSelectionMode) {
      dispatch(toggleMessageSelection(id));
    } else {
      const selectedMessage = filteredMessages.find(item => item.id === id);
      if (selectedMessage) {
        dispatch(setPreviewMessage(selectedMessage));
        if (selectedMessage.read === 0) {
          const formData = new FormData();
          formData.append('id', id);
          formData.append('device_id', deviceId);
          formData.append('session_id', sessionId);
          formData.append('lang', globalLanguage);
          dispatch(markAsRead({payload: formData}));
        }
      }
    }
  };

  const handleMoveToArchive = () => {
    if (selectedMessages.length > 0) {
      setArchiveMessageId(null);
      setShowArchiveModal(true);
    }
  };

  const handlePreviewArchive = () => {
    if (previewMessage) {
      setArchiveMessageId(previewMessage.id);
      setShowArchiveModal(true);
    }
  };

  const confirmArchive = () => {
    const formData = new FormData();
    if (archiveMessageId) {
      formData.append('ids', archiveMessageId);
    } else {
      formData.append('ids', selectedMessages.join(', '));
    }
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    dispatch(moveToArchiveStart({payload: formData}));
    setShowArchiveModal(false);
    setArchiveMessageId(null);
    if (archiveMessageId) {
      dispatch(setPreviewMessage(null));
    }
  };

  const cancelArchive = () => {
    setShowArchiveModal(false);
    setArchiveMessageId(null);
  };

  const getSelectedMessagesStatus = () => {
    const selected = messages.filter(msg => selectedMessages.includes(msg.id));
    const allUnread = selected.every(msg => msg.read === 0);
    const allRead = selected.every(msg => msg.read === 1);
    return {allUnread, allRead};
  };

  const handleMultipleMarkMessages = () => {
    if (selectedMessages.length > 0) {
      const {allUnread, allRead} = getSelectedMessagesStatus();
      setIsMarkAsUnread(allRead);
      setShowMarkReadModal(true);
    }
  };

  const confirmMarkMessages = () => {
    const formData = new FormData();
    formData.append('multiple_ids', selectedMessages.join(', '));
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    formData.append('updater', '1');
    formData.append(isMarkAsUnread ? 'unread' : 'read', '1');

    dispatch(
      multipleMarkMessages({
        payload: formData,
        messageIds: selectedMessages,
        read: !isMarkAsUnread,
      }),
    );

    setShowMarkReadModal(false);
  };

  const cancelMarkMessages = () => {
    setShowMarkReadModal(false);
  };
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > scrollThreshold); // Show button after scrolling 120% of screen height
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };

  const handleSearch = () => {
    if (searchQuery) {
      const formData = new FormData();
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      formData.append('archived', '0');
      formData.append('keyword', searchQuery);
      dispatch(searchMessagesStart({payload: formData, keyword: searchQuery}));
    } else {
      dispatch(setCurrentPage(1));
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      dispatch(fetchMessagesStart({payload: formData}));
    }
  };

  const handleFilter = value => {
    console.log('Handle filter');

    dispatch(setCurrentPage(1));
    setFilterType(value);
    const formData = new FormData();
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    if (value === 'read') {
      formData.append('status', 1);
    } else if (value === 'unread') {
      formData.append('status', 0);
    }
    dispatch(fetchMessagesStart({payload: formData}));
    setShowFilterModal(false);
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
      const formData = new FormData();
      formData.append('page', newPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      dispatch(fetchMessagesStart({payload: formData}));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setSearchQuery('');

      dispatch(setCurrentPage(1));
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      dispatch(fetchMessagesStart({payload: formData}));
    }, [deviceId, sessionId, globalLanguage, dispatch]),
  );

  const openModal = () => {
    setShowFilterModal(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: Matrics.vs(300),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFilterModal(false));
  };

  const renderItem = ({item}) => {
    const isSelecteds = selectedMessages?.includes(item.id);

    return (
      <NotificationItem
        item={item}
        onLongPress={handleLongPress}
        onPress={handlePress}
        isSelected={isSelecteds}
      />
    );
  };
  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={styles.container}>
        <CustomHeader />
        <View style={styles.headerContainer}>
          <View style={styles.searchFilterContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('NotificationScreen.searchPlaceholder')}
              placeholderTextColor={'black'}
              onChangeText={text => {
                console.log('TextInput onChangeText:', text);
                setSearchQuery(text);
              }}
              onSubmitEditing={handleSearch}
              value={searchQuery}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.filterPicker} onPress={openModal}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Matrics.s(5),
                }}>
                <Image
                  source={Images.FILTER}
                  style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                />
                <Text
                  style={[
                    styles.flatListHeaderText,
                    {marginLeft: Matrics.s(5)},
                  ]}>
                  {t('NotificationScreen.filterLabel')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {selectedMessages?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: Matrics.vs(10),
                paddingHorizontal: Matrics.s(10),
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderBottomColor: COLOR.LIGHT_GRAY,
              }}>
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => dispatch(clearMessageSelection())}
                  style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                  <Image
                    source={Images.CROSS}
                    style={[
                      styles.flatListHeaderIcon,
                      {width: 25, height: 25, marginLeft: Matrics.s(5)},
                    ]}
                  />
                  <Text
                    style={[
                      styles.flatListHeaderText,
                      {fontSize: typography.fontSizes.fs17},
                    ]}>
                    {selectedMessages.length}{' '}
                    {t('NotificationScreen.selectedLabel')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowOptionsModal(true)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={Images.THREE_DOTS}
                    style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          extraData={filterMessages.length}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {t('NotificationScreen.noNotifications')}
            </Text>
          }
          contentContainerStyle={[styles.listContent]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
        {showScrollToTop && (
          <TouchableOpacity
            style={styles.scrollToTopButton}
            activeOpacity={0.7}
            onPress={scrollToTop}>
            <Image source={Images.UP_ARROW} style={styles.scrollToTopIcon} />
          </TouchableOpacity>
        )}

        <Modal
          visible={showArchiveModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelArchive}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t('NotificationScreen.confirmArchiveTitle')}
              </Text>
              <Text style={styles.modalBody}>
                {t('NotificationScreen.confirmArchiveBody', {
                  count: selectedMessages.length,
                })}
              </Text>
              <View style={{gap: 10}}>
                <TouchableOpacity style={{}} onPress={cancelArchive}>
                  <Text style={[styles.modalButtonText, {textAlign: 'center'}]}>
                    {t('NotificationScreen.filterCancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLOR.PURPLE,
                    paddingVertical: Matrics.vs(10),
                    borderRadius: Matrics.s(5),
                  }}
                  onPress={confirmArchive}>
                  <Text
                    style={[
                      styles.modalButtonText,
                      {color: COLOR.WHITE, textAlign: 'center'},
                    ]}>
                    {t('NotificationScreen.confirmArchiveButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showMarkReadModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelMarkMessages}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isMarkAsUnread
                  ? t('NotificationScreen.confirmMarkUnreadTitle')
                  : t('NotificationScreen.confirmMarkReadTitle')}
              </Text>
              <Text style={styles.modalBody}>
                {t('NotificationScreen.confirmMarkBody', {
                  count: selectedMessages.length,
                  status: isMarkAsUnread
                    ? t('NotificationScreen.unread')
                    : t('NotificationScreen.read'),
                })}
              </Text>
              <View style={{gap: 10}}>
                <TouchableOpacity style={{}} onPress={cancelMarkMessages}>
                  <Text style={[styles.modalButtonText, {textAlign: 'center'}]}>
                    {t('NotificationScreen.filterCancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLOR.PURPLE,
                    paddingVertical: Matrics.vs(10),
                    borderRadius: Matrics.s(5),
                  }}
                  onPress={confirmMarkMessages}>
                  <Text
                    style={[
                      styles.modalButtonText,
                      {color: COLOR.WHITE, textAlign: 'center'},
                    ]}>
                    {t('NotificationScreen.confirmArchiveButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={!!previewMessage}
          transparent
          animationType="slide"
          onRequestClose={() => dispatch(setPreviewMessage(null))}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{previewMessage?.topic}</Text>
                <TouchableOpacity
                  onPress={() => dispatch(setPreviewMessage(null))}>
                  <Image
                    source={Images.CLOSE}
                    style={{
                      width: Matrics.s(20),
                      height: Matrics.vs(20),
                      tintColor: COLOR.BLACK,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalDate}>
                {previewMessage &&
                  moment(previewMessage.created_at).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
              </Text>
              <Text style={styles.modalBody}>
                {previewMessage?.content.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.closeButton]}
                  onPress={handlePreviewArchive}>
                  <Text style={[styles.closeButtonText, {color: COLOR.WHITE}]}>
                    {t('NotificationScreen.moveToArchiveButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeModal}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0)',
              opacity: backdropOpacity,
            }}>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'flex-end'}}
              activeOpacity={1}
              onPress={closeModal}>
              <Animated.View
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: Matrics.s(10),
                  borderTopRightRadius: Matrics.s(10),
                  padding: Matrics.s(20),
                  width: '100%',
                  alignItems: 'center',
                  transform: [{translateY: slideAnim}],
                }}
                onPress={() => {}}>
                <Text
                  style={{
                    fontSize: typography.fontSizes.fs16,
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    color: '#000',
                    marginBottom: Matrics.s(20),
                  }}>
                  {t('NotificationScreen.filterNotifications')}
                </Text>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'all' ? COLOR.PURPLE : '#f5f5f5',
                  }}
                  onPress={() => handleFilter('all')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'all' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {t('NotificationScreen.filterAll')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'read' ? COLOR.PURPLE : '#f5f5f5',
                    marginVertical: Matrics.s(10),
                  }}
                  onPress={() => handleFilter('read')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'read' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {t('NotificationScreen.filterRead')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'unread' ? COLOR.PURPLE : '#f5f5f5',
                  }}
                  onPress={() => handleFilter('unread')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'unread' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {t('NotificationScreen.filterUnread')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    marginTop: Matrics.s(10),
                  }}
                  onPress={closeModal}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: COLOR.PURPLE,
                      fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    }}>
                    {t('NotificationScreen.filterCancel')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
        <Modal
          visible={showOptionsModal}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowOptionsModal(false)}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowOptionsModal(false)}>
            <View style={styles.optionsModal}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.optionItem}
                onPress={() => {
                  handleMultipleMarkMessages();
                  setShowOptionsModal(false);
                }}>
                <Image
                  source={Images.MARK_AS_READ}
                  style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                />
                <Text
                  style={[
                    styles.flatListHeaderText,
                    {fontSize: typography.fontSizes.fs12},
                  ]}>
                  {getSelectedMessagesStatus().allRead
                    ? t('NotificationScreen.markAsUnreadLabel')
                    : t('NotificationScreen.markAsReadLabel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.optionItem}
                onPress={() => {
                  handleMoveToArchive();
                  setShowOptionsModal(false);
                }}>
                <Image
                  source={Images.MOVE_TO_ARCHIVE}
                  style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                />
                <Text style={styles.flatListHeaderText}>
                  {t('NotificationScreen.archiveLabel')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // White background for the screen
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: Matrics.vs(12),
  },
  searchFilterContainer: {
    flexDirection: 'row',
    padding: Matrics.s(15),
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    flex: 2,
    height: Matrics.vs(40),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    borderColor: COLOR.LIGHT_GRAY,
    borderRadius: Matrics.s(8),
    paddingHorizontal: Matrics.s(10),
    backgroundColor: '#FFFFFF',
    color: COLOR.BLACK,
    marginRight: Matrics.s(10),
  },
  filterPicker: {
    flex: 1,
    // height: Matrics.vs(40),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLOR.LIGHT_GRAY,
    borderRadius: Matrics.s(8),
    color: COLOR.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    // padding: Matrics.s(5),
    paddingHorizontal: Matrics.s(10),
    marginTop: Matrics.vs(5),
    // paddingBottom: Matrics.vs(20),
  },
  selectedItem: {
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  selectedRoundElement: {
    backgroundColor: COLOR.GREEN,
  },
  roundElementText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(18),
    fontWeight: 'bold',
  },
  tickIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    tintColor: COLOR.WHITE,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF', // White background for each item
    // paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.vs(5),
    paddingHorizontal: Matrics.s(5),
    borderRadius: Matrics.s(5),
    marginBottom: Matrics.vs(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationContent: {
    width: '60%',
  },
  notificationTitle: {
    color: COLOR.BLACK,
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  unread: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs14,
  },
  notificationDate: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(11),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginTop: Matrics.vs(4),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.PURPLE,
    width: Matrics.s(7),
    height: Matrics.vs(7),
    marginRight: Matrics.s(10),
    borderRadius: Matrics.s(20),
  },
  actionIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    marginLeft: Matrics.s(15),
    tintColor: COLOR.PURPLE, // Purple color for icons
  },
  emptyText: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(16),
    textAlign: 'center',
    marginVertical: Matrics.vs(30),
    fontStyle: 'italic',
  },
  bottomContainer: {
    padding: Matrics.s(15),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLOR.LIGHT_GRAY,
  },
  markAllButton: {
    backgroundColor: COLOR.PURPLE,
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
    borderRadius: Matrics.s(8),
    alignSelf: 'center',
    marginBottom: Matrics.vs(10),
  },
  markAllButtonText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(16),
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLOR.PURPLE,
    paddingVertical: Matrics.vs(8),
    paddingHorizontal: Matrics.s(15),
    borderRadius: Matrics.s(8),
  },
  disabled: {
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(14),
    fontWeight: '500',
  },
  pageText: {
    fontSize: Matrics.s(14),
    color: COLOR.BLACK,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxHeight: '80%',
    padding: Matrics.s(20),
    borderRadius: Matrics.s(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(18),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    marginBottom: Matrics.vs(8),
  },
  modalDate: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(14),
    // marginBottom: Matrics.vs(12),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    // textAlign: 'center',
  },
  modalBody: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(16),
    lineHeight: Matrics.s(22),
    marginBottom: Matrics.vs(20),
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  closeButton: {
    backgroundColor: COLOR.PURPLE, // Purple background for the close button
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
    borderRadius: Matrics.s(8),
    alignSelf: 'center',
  },
  closeButtonText: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    textAlign: 'center',
  },
  notificationDescription: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs12,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: Matrics.vs(20),
    left: '50%',
    transform: [{translateX: -25}],
    backgroundColor: COLOR.PURPLE,
    borderRadius: Matrics.s(25),
    width: Matrics.s(50),
    height: Matrics.s(50),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollToTopIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
    tintColor: COLOR.WHITE,
  },
  roundElement: {
    width: Matrics.s(40),
    height: Matrics.s(40),
    borderRadius: Matrics.s(20),
    backgroundColor: COLOR.PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Matrics.s(10),
  },
  notificationBody: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  unreadBody: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  flatListHeaderIcon: {
    width: Matrics.s(30),
    height: Matrics.vs(30),
    resizeMode: 'contain',
  },
  flatListHeaderText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs12,
  },
  placeholderStyle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginLeft: 10,
  },
  selectedNumberOfItems: {
    fontSize: typography.fontSizes.fs16,
  },

  modalButtonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    gap: Matrics.vs(10), // Add spacing between buttons
    alignItems: 'stretch',
  },
  modalButton: {
    flex: 1,
    paddingVertical: Matrics.vs(20),
    borderRadius: Matrics.s(8),
    alignItems: 'center',
    marginHorizontal: Matrics.s(5),
  },
  cancelButton: {
    backgroundColor: COLOR.LIGHT_GRAY,
  },
  confirmButton: {
    backgroundColor: COLOR.PURPLE,
  },
  modalButtonText: {
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: COLOR.BLACK,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent backdrop
  },
  optionsModal: {
    position: 'absolute',
    top: Matrics.vs(170), // Adjust based on header height (CustomHeader + searchFilterContainer height)
    right: Matrics.s(20), // Align with the three-dot icon’s position
    backgroundColor: '#FFFFFF',
    borderRadius: Matrics.s(8),
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Matrics.vs(5),
    gap: 5,
  },
});

export default NotificationScreen;

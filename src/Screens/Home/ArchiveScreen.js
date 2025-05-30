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
  ScrollView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/Common/CustomHeader';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {Matrics, COLOR, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {BackHandler} from 'react-native';

import {
  setCurrentPage,
  markAsRead,
  markAsUnread,
  moveToMessagesStart,
  deleteMessagesStart,
  fetchArchivedMessagesStart,
  toggleArchiveSelection,
  clearArchiveSelection,
  multipleMarkMessages,
  searchArchivedMessagesStart,
  selectAllArchivedMessages,
} from '../../Redux/Reducers/ArchiveSlice';
import i18n from '../../i18n/i18n';
import {useTheme} from '../../Context/ThemeContext';

const ArchiveItem = memo(({item, onLongPress, onPress, isSelected}) => {
  const theme = useTheme();
  // Precompute expensive operations outside render
  const cleanedContent = item.content
    ? item.content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
  const formattedDate = item.created_at
    ? moment(item.created_at).format('DD-MMM HH:mm')
    : 'N/A';
  const topicFirstLetter =
    item.topic && item.topic.length > 0
      ? item.topic.charAt(0).toUpperCase()
      : 'N/A';
  const truncatedTopic =
    item.topic && item.topic.length > 30
      ? `${item.topic.slice(0, 40)}...`
      : item.topic || 'No Topic';
  const truncatedContent =
    cleanedContent.length > 30
      ? `${cleanedContent.slice(0, 70)}...`
      : cleanedContent || 'No Content';

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
          {
            backgroundColor: theme.PRIMARY,
          },
        ]}>
        {isSelected ? (
          <Image source={Images.TICK_ICON} style={styles.tickIcon} />
        ) : (
          <Text style={styles.roundElementText}>{topicFirstLetter}</Text>
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
        {item.read === 0 && (
          <View
            style={[
              styles.actions,
              {
                backgroundColor: theme.PRIMARY,
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});
const ArchiveScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    archivedMessages,
    filteredArchivedMessages,
    currentPage,
    totalPages,
    isLoading,
    archivedSelectedMessages,
  } = useSelector(state => state.Archive);

  const deviceId = useSelector(state => state?.Network?.deviceId);
  const authState = useSelector(state => state?.Auth);
  const sessionId = authState?.data?.data?.sesssion_id;
  const globalLanguage = useSelector(
    state => state?.GlobalLanguage?.globalLanguage || 'en',
  );

  useEffect(() => {
    setIsSelectionMode(archivedSelectedMessages?.length > 0);
  }, [archivedSelectedMessages, filteredArchivedMessages]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentPage(1));
      setSearchQuery('');
      setFilterType('all');
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      if (filterType === 'read') {
        formData.append('status', 1);
      } else if (filterType === 'unread') {
        formData.append('status', 0);
      }
      if (searchQuery.trim() !== '') {
        formData.append('keyword', searchQuery);
      }
      dispatch(fetchArchivedMessagesStart({payload: formData}));

      // Cleanup function to reset filter and search when screen loses focus
    }, [deviceId, sessionId, globalLanguage, dispatch]),
  );

  const handleLoadMore = () => {
    if (filteredArchivedMessages.length === 0) {
      return;
    }
    if (currentPage < totalPages && !isLoading) {
      console.log('Loading3');
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
      dispatch(fetchArchivedMessagesStart({payload: formData}));
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.PRIMARY} />
      </View>
    );
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollThreshold = Matrics.screenHeight * 1.2;
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [previewMessage, setPreviewMessage] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const flatListRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      progressAnim.setValue(0);
      // Animate to 1 over 2 seconds
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    } else {
      // Complete the animation when loading ends
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Reset after a short delay
        setTimeout(() => {
          progressAnim.setValue(0);
        }, 200);
      });
    }
  }, [isLoading, progressAnim]);

  const handleLongPress = id => {
    if (archivedSelectedMessages.length === 0 && Platform.OS === 'android') {
      Vibration.vibrate(70);
    }
    dispatch(toggleArchiveSelection(id));
  };

  const handlePress = id => {
    if (isSelectionMode) {
      dispatch(toggleArchiveSelection(id));
    } else {
      const selectedMessage = filteredArchivedMessages.find(
        item => item.id === id,
      );
      if (selectedMessage) {
        setPreviewMessage(selectedMessage);
        if (selectedMessage.read === 0) {
          const formData = new FormData();
          formData.append('multiple_ids', id);
          formData.append('device_id', deviceId);
          formData.append('session_id', sessionId);
          formData.append('lang', globalLanguage);
          formData.append('updater', '1');
          formData.append('read', '1');
          if (filterType === 'read') {
            formData.append('status', 1);
          } else if (filterType === 'unread') {
            formData.append('status', 0);
          }
          if (searchQuery.trim() !== '') {
            formData.append('keyword', searchQuery);
          }
          dispatch(markAsRead({payload: formData}));
        }
      }
    }
  };

  const handleMultipleMarkMessages = () => {
    if (archivedSelectedMessages.length > 0) {
      const selected = archivedMessages.filter(msg =>
        archivedSelectedMessages.includes(msg.id),
      );
      const allUnread = selected.every(msg => msg.read === 0);
      const allRead = selected.every(msg => msg.read === 1);
      if (allUnread || allRead) {
        const formData = new FormData();
        formData.append('multiple_ids', archivedSelectedMessages.join(', '));
        formData.append('device_id', deviceId);
        formData.append('session_id', sessionId);
        formData.append('lang', globalLanguage);
        formData.append('updater', '1');
        formData.append(allUnread ? 'read' : 'unread', '1');
        if (filterType === 'read') {
          formData.append('status', 1);
        } else if (filterType === 'unread') {
          formData.append('status', 0);
        }
        if (searchQuery.trim() !== '') {
          formData.append('keyword', searchQuery);
        }
        dispatch(
          multipleMarkMessages({
            payload: formData,
            messageIds: archivedSelectedMessages,
            read: allUnread,
          }),
        );
      }
    }
  };

  const handleDeleteMessages = () => {
    if (archivedSelectedMessages.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteMessages = () => {
    const formData = new FormData();
    formData.append('ids', archivedSelectedMessages.join(', '));
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    if (filterType === 'read') {
      formData.append('status', 1);
    } else if (filterType === 'unread') {
      formData.append('status', 0);
    }
    if (searchQuery.trim() !== '') {
      formData.append('keyword', searchQuery);
    }
    dispatch(
      deleteMessagesStart({
        payload: formData,
        messageIds: archivedSelectedMessages,
      }),
    );
    setShowDeleteModal(false);
  };

  const cancelDeleteMessages = () => {
    setShowDeleteModal(false);
  };

  const handleRestoreMessages = () => {
    if (archivedSelectedMessages.length > 0) {
      setShowRestoreModal(true);
    }
  };

  const getSelectedMessagesStatus = () => {
    const selected = archivedMessages.filter(msg =>
      archivedSelectedMessages.includes(msg.id),
    );
    const allUnread = selected.every(msg => msg.read === 0);
    const allRead = selected.every(msg => msg.read === 1);
    return {allUnread, allRead};
  };

  const confirmRestoreMessages = () => {
    const formData = new FormData();
    formData.append('restore_id', archivedSelectedMessages.join(', '));
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    formData.append('restore', '1');
    if (filterType === 'read') {
      formData.append('status', 1);
    } else if (filterType === 'unread') {
      formData.append('status', 0);
    }
    if (searchQuery.trim() !== '') {
      formData.append('keyword', searchQuery);
    }
    dispatch(
      moveToMessagesStart({
        payload: formData,
        messageIds: archivedSelectedMessages,
      }),
    );
    setShowRestoreModal(false);
  };

  const cancelRestoreMessages = () => {
    setShowRestoreModal(false);
  };

  const handleMoveToMessages = messageId => {
    const formData = new FormData();
    formData.append('restore_id', messageId);
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    formData.append('restore', '1');
    if (filterType === 'read') {
      formData.append('status', 1);
    } else if (filterType === 'unread') {
      formData.append('status', 0);
    }
    if (searchQuery.trim() !== '') {
      formData.append('keyword', searchQuery);
    }
    dispatch(moveToMessagesStart({payload: formData, messageIds: [messageId]}));
    setPreviewMessage(null);
  };

  const handleMarkAsUnread = messageId => {
    const formData = new FormData();
    formData.append('multiple_ids', messageId);
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('lang', globalLanguage);
    formData.append('updater', '1');
    formData.append('unread', '1');
    if (filterType === 'read') {
      formData.append('status', 1);
    } else if (filterType === 'unread') {
      formData.append('status', 0);
    }
    if (searchQuery.trim() !== '') {
      formData.append('keyword', searchQuery);
    }
    dispatch(markAsUnread({payload: formData, messageId}));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > scrollThreshold);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };

  const handleSearch = () => {
    console.log('Seach query', searchQuery);

    if (searchQuery) {
      const formData = new FormData();
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      formData.append('archived', '1');
      formData.append('keyword', searchQuery);
      if (filterType === 'read') {
        formData.append('status', 1);
      } else if (filterType === 'unread') {
        formData.append('status', 0);
      }
      dispatch(
        searchArchivedMessagesStart({payload: formData, keyword: searchQuery}),
      );
      dispatch(clearArchiveSelection());
    } else {
      dispatch(setCurrentPage(1));
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      dispatch(fetchArchivedMessagesStart({payload: formData}));
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === '') {
      dispatch(clearArchiveSelection());
      dispatch(setCurrentPage(1));
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
      if (filterType === 'read') {
        formData.append('status', 1);
      } else if (filterType === 'unread') {
        formData.append('status', 0);
      }
      console.log(
        '[NotificationScreen] fetchMessagesStart called from searchQuery useEffect',
      );
      dispatch(fetchArchivedMessagesStart({payload: formData}));
    }
  }, [searchQuery, deviceId, sessionId, globalLanguage, dispatch]);
  const handleFilter = value => {
    dispatch(clearArchiveSelection());

    dispatch(setCurrentPage(1));
    setFilterType(value);
    const formData = new FormData();
    formData.append('device_id', deviceId);
    formData.append('session_id', sessionId);
    formData.append('archived', '1');
    if (value === 'read') {
      formData.append('status', 1);
    } else if (value === 'unread') {
      formData.append('status', 0);
    }
    if (searchQuery.trim() !== '') {
      formData.append('keyword', searchQuery);
    }
    dispatch(fetchArchivedMessagesStart({payload: formData}));
    setShowFilterModal(false);
  };

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
    const isSelected = archivedSelectedMessages?.includes(item.id);
    return (
      <ArchiveItem
        item={item}
        onLongPress={handleLongPress}
        onPress={handlePress}
        isSelected={isSelected}
      />
    );
  };

  const handleBackPress = React.useCallback(() => {
    console.log('Handle callback');

    // Check if any modal is open
    if (
      showFilterModal ||
      showOptionsModal ||
      showRestoreModal ||
      showDeleteModal
    ) {
      // Close all modals
      setShowFilterModal(false);
      setShowOptionsModal(false);
      setShowRestoreModal(false);
      setShowDeleteModal(false);
      return true; // Prevent default back button behavior
    }

    // If any items are selected, clear selection
    if (archivedSelectedMessages.length > 0) {
      dispatch(clearArchiveSelection());
      return true; // Prevent default back button behavior
    }

    // Clear search text if it's not empty
    if (searchQuery.trim() !== '') {
      console.log('Search query cleared');

      setSearchQuery('');
      return true; // Prevent default back button behavior
    }

    // If no special conditions, allow default back navigation
    return false;
  }, [
    showFilterModal,
    showOptionsModal,
    showRestoreModal,
    showDeleteModal,
    archivedSelectedMessages,
    searchQuery,
    dispatch,
  ]);

  // Add back button event listener
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  // Modify header back icon to use the same handler
  const onHeaderBackPress = () => {
    handleBackPress();
  };

  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={styles.container}>
        <CustomHeader
          onBackPress={onHeaderBackPress}
          title={i18n.t('ArchiveScreen.title')}
        />
        <View style={styles.headerContainer}>
          <View style={styles.searchFilterContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('ArchiveScreen.searchPlaceholder')}
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
                    {
                      marginLeft: Matrics.s(5),
                      fontSize: typography.fontSizes.fs14,
                    },
                  ]}>
                  {i18n.t('ArchiveScreen.filterLabel')}
                </Text>
              </View>
            </TouchableOpacity>
            {isLoading && (
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: theme.PRIMARY,
                  },
                ]}
              />
            )}
          </View>
          {archivedSelectedMessages?.length > 0 && (
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
                  onPress={() => dispatch(clearArchiveSelection())}
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
                    {archivedSelectedMessages.length}{' '}
                    {i18n.t('NotificationScreen.selectedLabel')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
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
          data={filteredArchivedMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          // ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {i18n.t('ArchiveScreen.noArchivedMessages')}
            </Text>
          }
          contentContainerStyle={[styles.listContent]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
        />
        {showScrollToTop && (
          <TouchableOpacity
            style={[
              styles.scrollToTopButton,
              {
                backgroundColor: theme.PRIMARY,
              },
            ]}
            activeOpacity={0.7}
            onPress={scrollToTop}>
            <Image source={Images.UP_ARROW} style={styles.scrollToTopIcon} />
          </TouchableOpacity>
        )}
        {archivedSelectedMessages.length > 0 && (
          <TouchableOpacity
            style={[
              styles.floatingRestoreButton,
              {
                backgroundColor: theme.PRIMARY,
              },
            ]}
            activeOpacity={0.7}
            onPress={handleRestoreMessages}>
            <Image source={Images.RESTORE} style={styles.floatingRestoreIcon} />
          </TouchableOpacity>
        )}
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeModal}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
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
                }}>
                <Text
                  style={{
                    fontSize: typography.fontSizes.fs16,
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    color: '#000',
                    marginBottom: Matrics.s(20),
                  }}>
                  {i18n.t('ArchiveScreen.filterNotifications')}
                </Text>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'all' ? theme.PRIMARY : '#f5f5f5',
                  }}
                  onPress={() => handleFilter('all')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'all' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {i18n.t('ArchiveScreen.filterAll')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'read' ? theme.PRIMARY : '#f5f5f5',
                    marginVertical: Matrics.s(10),
                  }}
                  onPress={() => handleFilter('read')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'read' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {i18n.t('ArchiveScreen.filterRead')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingVertical: Matrics.s(10),
                    alignItems: 'center',
                    borderRadius: Matrics.s(5),
                    backgroundColor:
                      filterType === 'unread' ? theme.PRIMARY : '#f5f5f5',
                  }}
                  onPress={() => handleFilter('unread')}>
                  <Text
                    style={{
                      fontSize: typography.fontSizes.fs14,
                      color: filterType === 'unread' ? '#fff' : '#000',
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                    }}>
                    {i18n.t('ArchiveScreen.filterUnread')}
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
                      color: theme.PRIMARY,
                      fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    }}>
                    {i18n.t('ArchiveScreen.filterCancel')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelDeleteMessages}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {i18n.t('ArchiveScreen.confirmDeleteTitle')}
              </Text>
              <Text style={styles.modalBody}>
                {i18n.t('ArchiveScreen.confirmDeleteBody', {
                  count: archivedSelectedMessages.length,
                })}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={{}} onPress={cancelDeleteMessages}>
                  <Text
                    style={[
                      styles.modalButtonText,
                      {
                        textAlign: 'center',
                      },
                    ]}>
                    {i18n.t('ArchiveScreen.filterCancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.PRIMARY,
                    borderRadius: Matrics.s(5),
                    alignItems: 'center',
                    paddingVertical: Matrics.s(10),
                  }}
                  onPress={confirmDeleteMessages}>
                  <Text
                    style={[
                      styles.modalButtonText,
                      {
                        color: COLOR.WHITE,
                        textAlign: 'center',
                      },
                    ]}>
                    {i18n.t('ArchiveScreen.confirmDeleteButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showRestoreModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelRestoreMessages}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {i18n.t('ArchiveScreen.confirmRestoreTitle')}
              </Text>
              <Text style={styles.modalBody}>
                {i18n.t('ArchiveScreen.confirmRestoreBody', {
                  count: archivedSelectedMessages.length,
                })}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={{}} onPress={cancelRestoreMessages}>
                  <Text
                    style={[
                      {
                        color: theme.PRIMARY,
                        textAlign: 'center',
                        fontFamily: typography.fontFamily.Montserrat.SemiBold,
                        fontSize: typography.fontSizes.fs16,
                      },
                    ]}>
                    {i18n.t('ChangePasswordScreen.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.PRIMARY,
                    borderRadius: Matrics.s(5),
                    alignItems: 'center',
                    paddingVertical: Matrics.s(10),
                  }}
                  onPress={confirmRestoreMessages}>
                  <Text
                    style={[
                      styles.modalButtonText,
                      {
                        color: COLOR.WHITE,
                        textAlign: 'center',
                      },
                    ]}>
                    {i18n.t('ArchiveScreen.confirmRestoreButton')}
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
          onRequestClose={() => setPreviewMessage(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{previewMessage?.topic}</Text>
                <TouchableOpacity onPress={() => setPreviewMessage(null)}>
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
              <ScrollView>
                <Text style={styles.modalDate}>
                  {previewMessage &&
                    moment(previewMessage.created_at).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                </Text>
                <Text style={styles.modalBody}>
                  {previewMessage?.content.replace(/<\/?[^>]+(>|$)/g, '')}
                </Text>
              </ScrollView>
              <View style={styles.modalButtonContainer}>
                {previewMessage?.read === 1 && (
                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      {
                        backgroundColor: COLOR.LIGHT_GRAY,
                      },
                    ]}
                    onPress={() => {
                      handleMarkAsUnread(previewMessage.id);
                    }}>
                    <Text
                      style={[styles.closeButtonText, {color: COLOR.BLACK}]}>
                      {i18n.t('ArchiveScreen.markAsUnreadLabel')}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    {
                      backgroundColor: theme.PRIMARY,
                    },
                  ]}
                  onPress={() => handleMoveToMessages(previewMessage.id)}>
                  <Text style={[styles.closeButtonText, {color: COLOR.WHITE}]}>
                    {i18n.t('ArchiveScreen.moveToMessageCenterButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
                  // Handle Select All
                  const allMessageIds = filteredArchivedMessages.map(
                    item => item.id,
                  );
                  dispatch(selectAllArchivedMessages(allMessageIds));
                  setShowOptionsModal(false);
                }}>
                <Image
                  source={Images.SELECT_ALL}
                  style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                />
                <Text
                  style={[
                    styles.flatListHeaderText,
                    {fontSize: typography.fontSizes.fs12},
                  ]}>
                  {t('NotificationScreen.selectAllLabel')}
                </Text>
              </TouchableOpacity>
              {(archivedMessages
                .filter(msg => archivedSelectedMessages.includes(msg.id))
                .every(msg => msg.read === 0) ||
                archivedMessages
                  .filter(msg => archivedSelectedMessages.includes(msg.id))
                  .every(msg => msg.read === 1)) && (
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
                    {archivedMessages
                      .filter(msg => archivedSelectedMessages.includes(msg.id))
                      .every(msg => msg.read === 0)
                      ? i18n.t('ArchiveScreen.markAsReadLabel')
                      : i18n.t('ArchiveScreen.markAsUnreadLabel')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.optionItem}
                onPress={() => {
                  handleDeleteMessages();
                  setShowOptionsModal(false);
                }}>
                <Image
                  source={Images.DELETE}
                  style={[styles.flatListHeaderIcon, {width: 25, height: 25}]}
                />
                <Text style={styles.flatListHeaderText}>
                  {i18n.t('ArchiveScreen.deleteLabel')}
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
    backgroundColor: '#FFFFFF',
    flex: 1,
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
    borderColor: COLOR.GRAY1,
    borderWidth: 1,
    borderRadius: Matrics.s(8),
    paddingHorizontal: Matrics.s(10),
    backgroundColor: '#FFFFFF',
    color: COLOR.BLACK,
    marginRight: Matrics.s(10),
    fontSize: typography.fontSizes.fs14,
  },
  filterPicker: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLOR.GRAY1,
    borderRadius: Matrics.s(8),
    color: COLOR.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Matrics.s(10),
    marginTop: Matrics.vs(5),
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
    backgroundColor: '#FFFFFF',
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
    width: Matrics.s(7),
    height: Matrics.vs(7),
    marginRight: Matrics.s(10),
    borderRadius: Matrics.s(20),
  },
  emptyText: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(16),
    textAlign: 'center',
    marginVertical: Matrics.vs(30),
    fontStyle: 'italic',
  },
  footer: {
    padding: Matrics.vs(20),
    alignItems: 'center',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: Matrics.vs(20),
    left: '50%',
    transform: [{translateX: -25}],
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
  floatingRestoreButton: {
    position: 'absolute',
    bottom: Matrics.vs(20),
    right: Matrics.s(20),
    borderRadius: Matrics.s(30),
    width: Matrics.s(60),
    height: Matrics.s(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingRestoreIcon: {
    width: Matrics.s(30),
    height: Matrics.s(30),
    tintColor: COLOR.WHITE,
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
    width: '80%',
    // marginBottom: Matrics.vs(8),
  },
  modalBody: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(16),
    // lineHeight: Matrics.s(22),
    // marginBottom: Matrics.vs(20),
    fontFamily: typography.fontFamily.Montserrat.Regular,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: Matrics.vs(12),
  },
  modalDate: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(14),
    // marginBottom: Matrics.vs(12),
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },

  closeButton: {
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
    borderRadius: Matrics.s(8),
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    textAlign: 'center',
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
  roundElement: {
    width: Matrics.s(40),
    height: Matrics.s(40),
    borderRadius: Matrics.s(20),
    backgroundColor: COLOR.PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Matrics.s(10),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent backdrop
  },
  optionsModal: {
    position: 'absolute',
    top: Matrics.vs(170), // Adjust based on header height (CustomHeader + searchFilterContainer height)
    right: Matrics.s(20), // Align with the three-dot icon's position
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
  unreadBody: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  notificationBody: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 2,
    position: 'absolute',
    top: Matrics.vs(65),
    left: 0,
    right: 0,
  },
});

export default ArchiveScreen;

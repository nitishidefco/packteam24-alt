// src/Screens/NotificationScreen.js
import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
} from '../../Redux/Reducers/MessageSlice';

import {Dropdown} from 'react-native-element-dropdown';
const NotificationScreen = () => {
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

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      console.log('Loading more', nextPage);

      dispatch(setCurrentPage(nextPage));
      const formData = new FormData();
      formData.append('page', nextPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);
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
  const flatListRef = useRef(null);

  const handleLongPress = id => {
    if (selectedMessages.length === 0) {
      Vibration.vibrate(70); // Vibrate for 50ms when the first item is selected
    }
    dispatch(toggleMessageSelection(id));
  };

  const handlePress = id => {
    if (isSelectionMode) {
      dispatch(toggleMessageSelection(id));
    } else {
      dispatch(
        setPreviewMessage(filteredMessages.find(item => item.id === id)),
      );
    }
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
      dispatch(
        filterMessages({
          filterType: 'search',
          value: searchQuery.toLowerCase(),
        }),
      );
    } else {
      dispatch(filterMessages({filterType: 'all', value: ''}));
    }
  };

  const handleFilter = value => {
    setFilterType(value);
    dispatch(filterMessages({filterType: 'readStatus', value}));
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

  const handleMarkAllAsRead = () => {
    messages.forEach(message => {
      if (!message.read) {
        dispatch(markAsRead(message.id));
      }
    });
  };
  let isSelected;

  const renderNotificationItem = ({item}) => {
    const cleanedContent = item.content
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim();
    isSelected = selectedMessages?.includes(item.id);
    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        delayLongPress={300}
        onPress={() => handlePress(item.id)}
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
            <Image
              source={Images.TICK_ICON} // Replace with your tick icon
              style={styles.tickIcon}
            />
          ) : (
            <Text style={styles.roundElementText}>
              {item.topic.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unread]}>
            {item.topic.length > 30
              ? `${item.topic.slice(0, 40)}...`
              : item.topic}
          </Text>
          <Text style={[styles.notificationBody]}>
            {cleanedContent.length > 30
              ? `${cleanedContent.slice(0, 70)}...`
              : cleanedContent}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end', gap: 10, height: Matrics.vs(40)}}>
          <Text style={styles.notificationDate}>
            {moment(item.created_at).format('DD-MMM HH:mm')}
          </Text>
          <View style={styles.actions} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderHeader = () => {
    return (
      <View
        style={{
          // alignItems: 'center',
          // flexDirection: 'row',
          height: Matrics.vs(50),
          justifyContent: 'center',
          // gap: selectedMessages?.length > 0 ? 10 : 0,
        }}>
        {selectedMessages?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Images.CROSS} style={styles.flatListHeaderIcon} />
              <Text
                style={[
                  styles.flatListHeaderText,
                  {
                    fontSize: typography.fontSizes.fs17,
                  },
                ]}>
                {selectedMessages?.length} Selected
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.flatListHeaderText,
                    {
                      fontSize: typography.fontSizes.fs15,
                    },
                  ]}>
                  Mark as Read
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Images.MOVE_TO_ARCHIVE}
                  style={styles.flatListHeaderIcon}
                />
                {/* <Text style={styles.flatListHeaderText}>Archive</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View>
              <Image source={Images.SEARCH} style={styles.flatListHeaderIcon} />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '20%',
              }}>
              <Image source={Images.FILTER} style={styles.flatListHeaderIcon} />
              <Text style={styles.flatListHeaderText}>Filter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <DrawerSceneWrapper>
      <SafeAreaView style={styles.container}>
        <CustomHeader />
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications</Text>
          }
          contentContainerStyle={[styles.listContent]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
          visible={!!previewMessage}
          transparent
          animationType="slide"
          onRequestClose={() => dispatch(setPreviewMessage(null))}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{previewMessage?.topic}</Text>
              <Text style={styles.modalDate}>
                {previewMessage &&
                  moment(previewMessage.created_at).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
              </Text>
              <Text style={styles.modalBody}>
                {previewMessage?.content.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => dispatch(setPreviewMessage(null))}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: typography.fontSizes.fs12,
    fontFamily: typography.fontFamily.Montserrat.Regular,
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
    backgroundColor: COLOR.PURPLE, // Purple background for the button
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
    backgroundColor: COLOR.PURPLE, // Purple background for pagination buttons
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
    borderRadius: Matrics.s(15),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(18),
    fontWeight: '700',
    marginBottom: Matrics.vs(8),
  },
  modalDate: {
    color: COLOR.GRAY,
    fontSize: Matrics.s(14),
    marginBottom: Matrics.vs(12),
  },
  modalBody: {
    color: COLOR.BLACK,
    fontSize: Matrics.s(16),
    lineHeight: Matrics.s(22),
    marginBottom: Matrics.vs(20),
  },
  closeButton: {
    backgroundColor: COLOR.PURPLE, // Purple background for the close button
    paddingVertical: Matrics.vs(10),
    paddingHorizontal: Matrics.s(20),
    borderRadius: Matrics.s(8),
    alignSelf: 'center',
  },
  closeButtonText: {
    color: COLOR.WHITE,
    fontSize: Matrics.s(16),
    fontWeight: '600',
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
    borderRadius: Matrics.s(20), // Half of width/height to make it a circle
    backgroundColor: COLOR.PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Matrics.s(10), // Space between the round element and content
  },
  notificationBody: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  flatListHeaderIcon: {
    width: Matrics.s(30),
    height: Matrics.vs(30),
    resizeMode: 'contain',
  },
  flatListHeaderText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
  },
  placeholderStyle: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginLeft: 10,
  },
  selectedNumberOfItems: {
    fontSize: typography.fontSizes.fs16,
  },
});

export default NotificationScreen;

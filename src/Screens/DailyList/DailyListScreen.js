import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Alert,
} from 'react-native';
import {useDailyListActions} from '../../Redux/Hooks';
import {Calendar} from 'react-native-calendars';
import {Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import CustomHeader from '../../Components/Common/CustomHeader';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import {deleteDailyListItem} from '../../Redux/Reducers/DailyListSlice';
import { useNavigation } from '@react-navigation/native';

const DailyListScreen = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {state, dailyListCall, deleteItem} = useDailyListActions();
  const {Auth, DailyList} = state;
  const sessionId = Auth.data?.data?.sesssion_id;
  const [refreshing, setRefreshing] = useState(false);
  const [modalStartDate, setModalStartDate] = useState(null);
  const [modalEndDate, setModalEndDate] = useState(null);
  const navigation = useNavigation(); 
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Debug Console <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  console.log('Data length ----------------------->>>>>> ', list);
  console.log('Page Number ----------------------->>>>>> ', page);
  console.log('Start Date ----------------------->>>>>> ', startDate);
  console.log('End Date ----------------------->>>>>> ', endDate);




  const navigateToAddDailyList = () => {
    navigation.navigate('AddDailyList'); 
  };

  const navigateToeditDailyList = (item) => {
    let isFromDashboardlist = true
    navigation.navigate('EditDailyList',{ date: item.date, customer:item.company_name,location:item.location_name ,listId :item.id,isFromDashboardlist , customerId: item.customer_ids , locationId:item.location_ids}); 
  }; 
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LIfe CYCLE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  useEffect(() => {
    fetchDailyList();
  }, [page, startDate, endDate]);

  useEffect(() => {
    if (loading && DailyList.isDailyListSuccess === true) {
      setLoading(false);
      let filteredData = DailyList?.data.data.data.filter(item => {
        let itemDate = new Date(item.date);
        return itemDate;
      });

      if (filteredData.length === 1 || filteredData.length >= 0) {
        if (page === 1) {
          setList(filteredData);
        } else {
          setList(prevList => [...prevList, ...filteredData]);
        }
      }

      setIsLastPage(DailyList?.data.data.last_page === page);
      setRefreshing(false);
    } else if (loading && DailyList.isDailyListSuccess === false) {
      if (page === 1 && list.length === 0) {
        setLoading(false);
      }
    }
  }, [DailyList.isDailyListSuccess, page, startDate, endDate]);

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> API CALLING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  const fetchDailyList = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    formData.append('page', page);
    if (startDate && endDate) {
      formData.append('date_from', startDate);
      formData.append('date_to', endDate);
    }
    dailyListCall(formData);
  };

  const handleDeleteItem = itemId => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            let params = {
              session_id: sessionId,
              itemId: itemId,
            };

            deleteItem(params);

            setList(prevList => prevList.filter(item => item.id !== itemId));
          },
        },
      ],
      {cancelable: false},
    );
  };
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ONPRESS FUNCTIONALITY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  const handleDayPress = date => {
    if (startDate === date.dateString) {
      setStartDate(null);
      setEndDate(null);
      setSelectedDate(null);
    } else if (!startDate) {
      setStartDate(date.dateString);
      setSelectedDate(date.dateString);
    } else if (startDate && !endDate) {
      setEndDate(date.dateString);
      setSelectedDate(startDate + ' to ' + date.dateString);
    } else {
      setStartDate(date.dateString);
      setEndDate(null);
      setSelectedDate(date.dateString);
    }
  };

  const handleContinue = () => {
    setRefreshing(true);

    if (startDate && endDate) {
      setPage(1);
      fetchDailyList();
    }  else {
      fetchDailyList();
    }
    toggleCalendarModal();
  };

  const toggleCalendarModal = () => {
    setCalendarModalVisible(!isCalendarModalVisible);
  };
  const handleCancel = () => {
    Alert.alert(
      'Filter',
      'Are you sure want to clear filter?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            clearSelectedDates();
            setPage(1); 
            fetchDailyList(); 
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setIsLastPage(false);
  
    if (startDate && endDate) {
    
      fetchDailyList();
    } else {
      setPage(1);
      fetchDailyList();
    }
  };
  
  const renderArrow = direction => (
    <Image
      resizeMode="contain"
      source={direction === 'left' ? Images.LEFT : Images.RIGHT}
      style={styles.arrowImageStyle}
    />
  );
  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>
          <Text style={styles.bold}>Created date :</Text> {item.id}
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Author :</Text> {item.author}
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Company :</Text> {item.company_name}
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Place :</Text> {item.location_name}
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Finished :</Text> {item.finished}
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Reported :</Text> {item.reported}
        </Text>
      </View>

      <View style={{flexDirection: 'row', height: 115}}>
      <TouchableOpacity onPress={() => navigateToeditDailyList(item)}>
        <Image
          style={{height: 25, width: 25, marginRight: 5}}
          source={Images.EDIT}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Image style={{height: 25, width: 25}} source={Images.DELETE} />
        </TouchableOpacity>
      </View>
    </View>
  );
  const clearSelectedDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDate(null);
  };
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RENDER UI <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  return (
    <DrawerSceneWrapper>
      <CustomHeader />
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        {selectedDate && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              top: 7,
              justifyContent: 'center',
              marginHorizontal: 70,
              backgroundColor: '#061439',
              borderRadius: Matrics.ms(14),
              paddingVertical: Matrics.ms(10),
            }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                fontSize: 14,
                marginLeft: 5,
                color: '#ffff',
              }}>
              {selectedDate}
            </Text>
            <TouchableOpacity onPress={handleCancel}>
              <Image
                source={Images.CANCELFILL}
                style={{width: 20, height: 20, marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            paddingVertical: Matrics.ms(10),
            marginHorizontal: Matrics.ms(16),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: Matrics.ms(8),
          }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.Montserrat.SemiBold,
              fontSize: 16,
              color: '#091242',
              marginLeft: Matrics.ms(9),
            }}>
            Daily List
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={navigateToAddDailyList}>
              <Image
                source={Images.ADD}
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain',
                  bottom: Matrics.ms(5),
                  marginRight: Matrics.ms(8),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCalendarModal}>
              <Image
                source={Images.MENU}
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain',
                  bottom: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (!isLastPage) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        {loading && <ActivityIndicator style={styles.loader} />}
        <Modal
          animationType="none"
          transparent={true}
          visible={isCalendarModalVisible}
          onRequestClose={toggleCalendarModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  textAlign: 'center',
                  bottom: 50,
                  fontFamily: typography.fontFamily.Montserrat.SemiBold,
                  fontSize: 14,
                }}>
                Selected date
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 20,
                }}>
                <View style={{bottom: 32}}>
                  <View
                    style={{
                      borderBottomColor: '#DEDEDE',
                      borderWidth: 0.3,
                      top: 50,
                      marginHorizontal: -25,
                      left: 25,
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: 10,
                    }}></View>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: 10,
                      marginBottom: 10,
                      color: '#555555',
                    }}>
                    Date from...
                  </Text>

                  <Text style={styles.selectedDateText}>{startDate}</Text>
                </View>
                <View style={{bottom: 33, right: Matrics.ms(90)}}>
                  <View
                    style={{
                      borderBottomColor: '#DEDEDE',
                      borderWidth: 0.3,
                      top: 50,
                      marginHorizontal: -25,
                      left: 25,
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: 10,
                    }}></View>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: 10,
                      marginBottom: 10,
                      color: '#555555',
                    }}>
                    Date to...
                  </Text>

                  <Text style={styles.selectedDateText}>{endDate}</Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: '#DEDEDE',
                  borderWidth: 0.5,
                  bottom: 10,
                  marginTop: 10,
                  marginHorizontal: -10,
                }}></View>

              <Calendar
                theme={{
                  textDayFontFamily: typography.fontFamily.Montserrat.Regular,
                  textDayFontSize: 12,
                  textDayStyle: {textAlign: 'center', top: 4},
                  textDayHeaderFontFamily:
                    typography.fontFamily.Montserrat.Medium,
                  textDayHeaderFontSize: 11,
                  textSectionTitleColor: '#292929',
                  todayTextColor: '#292929',
                  dayTextColor: '#292929',
                  selectedDayBackgroundColor: '#091242',
                  selectedDayTextColor: 'white',
                }}
                style={{bottom: 10}}
                markedDates={{
                  [startDate]: {
                    selected: true,
                    startingDay: true,
                    color: '#091242',
                  },
                  [endDate]: {
                    selected: true,
                    // marked: true,
                    endingDay: true,
                    color: '#091242',
                  },
                }}
                minDate={startDate}
                onDayPress={handleDayPress}
                renderArrow={renderArrow}
              />

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleContinue}>
                <Text style={styles.buttonTextStyle}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 5,
    marginBottom: 9,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    paddingLeft: 15,
  },
  title: {
    fontSize: 12,
    color: 'black',
    fontFamily: typography.fontFamily.Montserrat.Regular,
    paddingVertical: 3,
    color: 'black',
  },
  bold: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: 'black',
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    paddingTop: 60,
  },
  buttonStyle: {
    backgroundColor: '#061439',
    borderWidth: 0,
    color: 'white',
    height: 49,
    width: 251,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    shadowColor: '#0A1931',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 14,
  },
  buttonTextStyle: {
    color: 'white',
    paddingTop: 15,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: 15,
  },
  selectedDateText: {
    marginTop: 5,
    color: 'black',
    fontSize: 14,
    marginBottom: -15,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: 12,
  },
  arrowImageStyle: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
  },
});

export default DailyListScreen;

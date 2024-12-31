import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import {Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import CustomHeader2 from '../../Components/Common/CustomHeader2';
import {useDailyListActions} from '../../Redux/Hooks';
import {useNavigation} from '@react-navigation/native';
import {toastMessage} from '../../Helpers';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

const AddDailyList = () => {
  const [isCustomerDropdownVisible, setIsCustomerDropdownVisible] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerid, setSelectedCustomerid] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationid, setSelectedLocationid] = useState('');
  const [isPlacesDropdownVisible, setIsPlacesDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {state, customersCall, locationsCall, saveCall} = useDailyListActions();
  const {Auth, DailyList} = state;
  const sessionId = Auth.data?.data?.sesssion_id;
  const [customerList, setCustomerList] = useState({});
  const [locationList, setLocationList] = useState({});
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();
  console.log(
    'State----------------------->>>>>> ',
    DailyList.saveData?.data.id,
  );
  console.log(
    'LocationList----------------------->>>>>> ',
    DailyList.isSaveDataSuccess,
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (loading && DailyList.isCustomerSuccess === true) {
      setLoading(false);
      setCustomerList(DailyList.Customerdata.data);
    }
  }, [DailyList.isCustomerSuccess]);
  const currentDate = moment().format('YYYY-MM-DD');

  // Create a markedDates object with custom styles for the current date
  const markedDates = {
    [currentDate]: {textColor: 'red'}, // Mark current date
  };

  // If a date is selected, mark it in the calendar
  if (selectedDate) {
    markedDates[selectedDate] = {selected: true};
  }

  const toggleCustomerDropdown = () => {
    setIsCustomerDropdownVisible(!isCustomerDropdownVisible);
  };

  const togglePlacesDropdown = () => {
    if (selectedCustomer) {
      setIsPlacesDropdownVisible(!isPlacesDropdownVisible);
    }
  };

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectCustomer(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectLocation(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectCustomer = customer => {
    setSelectedCustomer(customer.label);
    setSelectedCustomerid(customer.id);
    toggleCustomerDropdown();
    let params = {
      session_id: sessionId,
      itemId: customer.id,
    };
    locationsCall(params);
  };

  const handleNext = async () => {
    if (!selectedCustomer || !selectedLocation || !selectedDate) {
      showToastMessage();
      return;
    }
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    formData.append('customer_id', selectedCustomerid);
    formData.append('location_id', selectedLocationid);
    formData.append('date', selectedDate);
    await saveCall(formData);

    if (DailyList.isSaveDataSuccess === true) {
      setLoading(false);
      let isFromCreateDailyList = true;
      navigation.navigate('EditDailyList', {
        date: selectedDate,
        customer: selectedCustomer,
        location: selectedLocation,
        isFromCreateDailyList,
        newId: DailyList.saveData?.data.id,
      });
    }
    console.log(formData, 'formdata----------------');
  };

  const showToastMessage = message => {
    toastMessage.error('Please fill the data');
  };

  const selectLocation = location => {
    setSelectedLocation(location.label);
    setSelectedLocationid(location.id);
    togglePlacesDropdown();
  };

  const fetchCustomers = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    customersCall(formData);
  };

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  // Function to handle the selection of a date
  const handleDayPress = date => {
    if (selectedDate !== date.dateString) {
      setSelectedDate(date.dateString);
    } else {
      setSelectedDate(null);
    }
    toggleCalendarModal();
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader2
        title={'Add daily list'}
        imageSource={{}}
        // onPdfIconPress={handlePdfIconPress}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <View style={{margin: 25}}>
          <View style={{marginTop: 20, borderBottomWidth: 0.5}}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs13,
                color: '#555555',
              }}>
              Date
            </Text>
            <TouchableOpacity onPress={toggleCalendarModal}>
              <Text style={{paddingVertical: 18, fontSize: 15, color: 'black'}}>
                {' '}
                {selectedDate ? selectedDate : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 45, borderBottomWidth: 0.5}}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs13,
                color: '#555555',
              }}>
              Customer
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={toggleCustomerDropdown}>
                <Text style={{color: 'black'}}>
                  {selectedCustomer ? selectedCustomer : 'Select Customer'}
                </Text>
              </TouchableOpacity>

              <Image
                style={{marginTop: 30, bottom: 15}}
                source={Images.DOWNARROW}
              />
            </View>
          </View>
          <View style={{marginTop: 45, borderBottomWidth: 0.5}}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs13,
                color: '#555555',
              }}>
              Places
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={togglePlacesDropdown}
                disabled={!selectedCustomer}
                style={{
                  backgroundColor: !selectedCustomer
                    ? '#E6E6E6'
                    : 'transparent',
                  flex: 1,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    paddingVertical: 15,
                    fontSize: 15,
                    color: !selectedCustomer ? 'black' : 'black',
                  }}>
                  {selectedLocation
                    ? selectedLocation
                    : selectedCustomer
                    ? 'Select Places'
                    : 'Select Customer First'}
                </Text>
              </TouchableOpacity>

              <Image
                style={{marginTop: 30, bottom: 15}}
                source={Images.DOWNARROW}
              />
            </View>
          </View>
        </View>

        <Modal
          transparent={true}
          visible={isCustomerDropdownVisible}
          onRequestClose={toggleCustomerDropdown}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={Object.keys(customerList).map(key => ({
                  id: key,
                  label: customerList[key],
                }))}
                renderItem={renderDropdownItem}
                keyExtractor={item => item.id.toString()}
              />
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={isPlacesDropdownVisible}
          onRequestClose={togglePlacesDropdown}>
          <View style={styles.placemodalContainer}>
            <View style={styles.placemodalContent}>
              <FlatList
                data={Object.keys(DailyList.LocationsData?.data || {}).map(
                  key => ({
                    id: key,
                    label: DailyList.LocationsData.data[key],
                  }),
                )}
                renderItem={renderLocationItem}
                keyExtractor={item => item.id.toString()}
              />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={isCalendarModalVisible}
          onRequestClose={toggleCalendarModal}>
          <View style={styles.modalContainer1}>
            <View style={styles.modalContent1}>
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
                  arrowColor: '#091242',
                }}
                markedDates={markedDates}
                onDayPress={handleDayPress}
              />
            </View>
          </View>
        </Modal>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.buttonStyle}
            activeOpacity={0.5}
            // onPress={handleContinue}
          >
            <Text style={styles.buttonTextStyle}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
  },
  dropdownItemText: {
    fontSize: typography.fontSizes.fs14,
    color: '#555555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.select({
      ios: Matrics.ms(50),
      android: Matrics.ms(50),
    }),
    shadowColor: '#0A1931',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 14,
  },
  modalContent: {
    backgroundColor: '#EBF0FA',
    width: '90%',
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: '100%',
    borderWidth: 0.3,
  },
  placemodalContainer: {
    justifyContent: 'flex-start',
    position: 'absolute',
    top: Platform.select({
      ios: '54%',
      android: '54%',
    }),
    shadowColor: '#0A1931',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 14,
    width: '100%',
    alignItems: 'center',
  },
  placemodalContent: {
    backgroundColor: '#EBF0FA',
    width: '91%',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 0.3,
    height: 'auto',
  },
  buttonStyle: {
    backgroundColor: '#00C182',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(251),
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
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: 'white',
    paddingTop: Matrics.ms(16),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs13,
    textAlign: 'center',
    flexDirection: 'column',
  },

  modalContainer1: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    paddingTop: 20,
  },
});

export default AddDailyList;

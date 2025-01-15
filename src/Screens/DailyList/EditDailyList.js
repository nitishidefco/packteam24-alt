import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
// import Pdf from 'react-native-pdf';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import CustomHeader2 from '../../Components/Common/CustomHeader2';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {useDailyListActions} from '../../Redux/Hooks';
import {toastMessage} from '../../Helpers';
import {Calendar} from 'react-native-calendars';
import CustomHeader3 from '../../Components/Common/CustomHeader3';
// import DownloadPDF from '../../Components/Common/Download';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import Share from 'react-native-share';
const EditDailyList = () => {
  const route = useRoute();
  const [isCustomerDropdownVisible, setIsCustomerDropdownVisible] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerid, setSelectedCustomerid] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationid, setSelectedLocationid] = useState('');
  const [isPlacesDropdownVisible, setIsPlacesDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    state,
    customersCall,
    locationsCall,
    pdfCall,
    settingInfoDeleteCall,
    settingInfoCall,
    finishedCall,
    edit1SaveCall
  } = useDailyListActions();
  const {Auth, DailyList} = state;
  const sessionId = Auth.data?.data?.sesssion_id;
  const [customerList, setCustomerList] = useState({});
  const [settingInfo, setsettingInfo] = useState({});
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();
  const {date, customer, location,newId, listId,iCreateDailyList,isFromCreateDailyList,isFromDashboardlist,customerId,locationId} = route.params;
  const [pdfBase64Data, setPdfBase64Data] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  console.log(newId, 'settingInfosettingInfosettingInfosettingInfo');
  
  useEffect(() => {
    fetchCustomers();
    setSelectedDate(date);
    setSelectedCustomer(customer);
    setSelectedLocation(location);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSetting();
    }, [])
  );
  const navigateToCreateDailyList = () => {
    if(isFromCreateDailyList=== true ){
      navigation.navigate('CreateDailyList', {listItemId: DailyList.saveData.data.id});
    }else if(isFromDashboardlist === true){
      navigation.navigate('CreateDailyList', {listItemId: listId});
    }
    navigation.navigate('CreateDailyList',{listItemId: listId});
  };
  const handleArchivePress = () => {
    Alert.alert(
      'Under Development',
      'This feature is currently under development.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: false }
    );
  };
  const navigateToCreateDailyList2 = item => {
    console.log('service_type_id------------------>>>>>>>>>',item.service_type_id);
    navigation.navigate('CreateDailyList', {
      positionId: item.id,
      listItemId: listId,
      serviceLabel: item.service_type_id,
      selectedCustomerid: item.service_type_id 
    });
  };
  useEffect(() => {
    if (
      loading &&
      DailyList.isSettingInfoSuccess === true
    ) {
      setLoading(false);
      setsettingInfo(DailyList.SettingInfoData.data);
    }
    setCustomerList(DailyList.Customerdata.data);
  }, [DailyList.isSettingInfoSuccess]);

  const toggleCustomerDropdown = () => {
    setIsCustomerDropdownVisible(!isCustomerDropdownVisible);
  };

  const togglePlacesDropdown = () => {
    setIsPlacesDropdownVisible(!isPlacesDropdownVisible);
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
  const fetchCustomers = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    customersCall(formData);
  };
  const fetchSetting = () => {
    setLoading(true);
    let params = {
      session_id: sessionId,
      device_id: '123',
      itemId: listId,
    };
    settingInfoCall(params);
  };

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const handleDayPress = date => {
    setSelectedDate(date.dateString);
    toggleCalendarModal();
  };

  const selectLocation = location => {
    setSelectedLocation(location.label);
    setSelectedLocationid(location.id);
    togglePlacesDropdown();
  };
  const serviceLabels = {
    1: 'Container',
    2: 'Setbau',
    3: 'Double Pallete',
    4: 'Umpacken der Paletten',
    5: 'Wartezeit',
    6: 'Stundenarbeit',
  };
  const handleDeleteItem = itemId => {
    Alert.alert(
      'Packteam24',
      'Are you sure you want to delete this position?',
      
      [
        {
          text: 'Cancel',
          style: 'cancel',
          
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              let params = {
                session_id: sessionId,
                itemId: itemId,
              };

              await settingInfoDeleteCall(params);

             
              fetchSetting();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}) => {
    const serviceLabel = serviceLabels[item.service_type_id] || 'Unknown';
    let renderContent = null;

    if (serviceLabel === 'Container') {
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Loading/Unloading :</Text> {item.author}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Container number :</Text>{' '}
              {item.container_no}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Quantity of boxes in pieces :</Text>{' '}
              {item.cardboards_number_in_items}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Quantity of varieties in pieces :</Text>{' '}
              {item.sorts_number_in_items}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Foil :</Text>{' '}
              {item.foiling === '1' ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Type of goods :</Text>{' '}
              {item.type_of_goods}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Container size :</Text> {item.reported}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Note :</Text> {item.note}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 15,
              right: 15,
            }}>
            <TouchableOpacity
              onPress={() => navigateToCreateDailyList2(item)}
              style={{height: 25}}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{height: 25}} onPress={handleArchivePress}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id)}
              style={{height: 25}}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (serviceLabel === 'Setbau') {
      // Customize rendering for service type ID 2
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Set construction number :</Text>{' '}
              {item.set_number}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Number of parts :</Text> {item.set_type}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Quantity/number of pieces :</Text>{' '}
              {item.number_of_items}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 15,
              right: 15,
            }}>
            <TouchableOpacity onPress={() => navigateToCreateDailyList2(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleArchivePress(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (serviceLabel === 'Double Pallete') {
      // Customize rendering for service type ID 3
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Quantity / number of pieces :</Text>{' '}
              {item.number_of_items}
            </Text>
          </View>

          <View style={{flexDirection: 'row', height: 115}}>
            <TouchableOpacity onPress={() => navigateToCreateDailyList2(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleArchivePress(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (serviceLabel === 'Umpacken der Paletten') {
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Quantity / number of pieces :</Text>{' '}
              {item.author}
            </Text>
          </View>

          <View style={{flexDirection: 'row', height: 115}}>
            <TouchableOpacity onPress={() => navigateToCreateDailyList2(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleArchivePress(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (serviceLabel === 'Wartezeit') {
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Start time :</Text> {item.begin_hour}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Time from end :</Text> {item.end_hour}
            </Text>
          </View>

          <View style={{flexDirection: 'row', height: 115}}>
            <TouchableOpacity onPress={() => navigateToCreateDailyList2(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleArchivePress(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (serviceLabel === 'Stundenarbeit') {
      // Customize rendering for service type ID 6
      renderContent = (
        <View style={styles.item}>
          <View>
            <Text style={styles.titleMain}>
              <Text style={styles.bold}> {serviceLabel}</Text>
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Start time :</Text> {item.begin_hour}
            </Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>End time :</Text> {item.end_hour}
            </Text>
          </View>

          <View style={{flexDirection: 'row', height: 115}}>
            <TouchableOpacity onPress={() => navigateToCreateDailyList2(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.EDIT}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleArchivePress(item)}>
              <Image
                style={{height: 25, width: 25, marginRight: 5}}
                source={Images.ARCHIVE}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Image style={{height: 25, width: 25}} source={Images.DELETE} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
    }

    return renderContent;
  };

  const DownloadPDF = async pdfBase64Data => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/Dailylist_Position.pdf`;
      await RNFetchBlob.fs.writeFile(path, pdfBase64Data, 'base64');
      if (Platform.OS === 'android') {
        await Share.open({
          url: `file://${path}`,
          type: 'application/pdf',
        });
      } else {
        RNFetchBlob.ios.previewDocument(path);

        toastMessage.success('File downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const fetchLatestPdfData = async () => {
    try {
      let params = {
        session_id: sessionId,
        itemId: listId,
      };
      await pdfCall(params);
      setPdfBase64Data(DailyList.pdfData.data.pdf_file);
    } catch (error) {
      console.error('Error getting PDF data:', error);
    }
  };
  const handlePdfIconPress = async () => {
    await fetchLatestPdfData();
    setShowPdf(true);
  };  
  

  const handleCompleteList = async () => {
    try {
      let params = {
        session_id: sessionId,
        itemId: listId,
      };
      await finishedCall(params);
      showToastMessage('Daily list has been finished');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleEditSave =  () => {
   
      let params = {
        session_id: sessionId,
        itemId: listId,
        customerId : selectedCustomerid || customerId,
        date:date,
        locationId:selectedLocationid || locationId
      };
       edit1SaveCall(params);
    
  };
  const showToastMessage = message => {
    toastMessage.success(message);
    console.log('Toast message:', message);
  };
  const handleBackButtonPress = () => {
    setShowPdf(false);
  };
  const handleBackIconPress = () => {
    setShowPdf(false);
  };
  return (
    <View style={{flex: 1}}>
      {!showPdf ? (
        <>
          <CustomHeader2
            title={'Edit daily list'}
            imageSource={Images.PDF}
            onPdfIconPress={handlePdfIconPress}
            isPdfClickable={settingInfo.lists && settingInfo.lists.length > 0}
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
                  <Text
                    style={{paddingVertical: 18, fontSize: 15, color: 'black'}}>
                    {selectedDate}
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
                    disabled={!selectedCustomer}>
                    <Text
                      style={{
                        paddingVertical: 18,
                        fontSize: 15,
                        color: 'black',
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
            <FlatList
              data={settingInfo.lists}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
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
                      textDayFontFamily:
                        typography.fontFamily.Montserrat.Regular,
                      textDayFontSize: 12,
                      textDayStyle: {textAlign: 'center', top: 4},
                      textDayHeaderFontFamily:
                        typography.fontFamily.Montserrat.Medium,
                      textDayHeaderFontSize: Matrics.ms(11),
                      textSectionTitleColor: '#292929',
                      todayTextColor: '#292929',
                      dayTextColor: '#292929',
                      selectedDayBackgroundColor: '#091242',
                      selectedDayTextColor: 'white',
                      arrowColor: '#091242',
                    }}
                    markedDates={{
                      [selectedDate]: {selected: true},
                    }}
                    onDayPress={handleDayPress}
                  />
                </View>
              </View>
            </Modal>
            {settingInfo.lists && settingInfo.lists.length > 0 ? (
              <>
                {settingInfo.finished === '1' ? (
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      top: Matrics.ms(30),
                      backgroundColor: '#EBF0FA',
                      height: 126,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        bottom: Platform.select({
                          ios: '4%',
                          android: '7%',
                        }),
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={navigateToCreateDailyList}
                        style={styles.cancelButton}
                        activeOpacity={0.5}>
                        <Text style={styles.buttonTextStyle}>
                          Add another item
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      // onPress={handleNext}
                      style={styles.buttonStyle1}
                      activeOpacity={0.5}>
                      <Text style={styles.buttonTextStyle}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      top: Matrics.ms(30),
                      // backgroundColor: '#EBF0FA',
                      // backgroundColor:'red',
                      maxHeight: '20%',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: Platform.select({
                          ios: 65,
                          android: '15%',
                        }),
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={navigateToCreateDailyList}
                        style={styles.cancelButton}
                        activeOpacity={0.5}>
                        <Text style={styles.buttonTextStyle}>
                          Add another item
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleCompleteList}
                        style={styles.saveButton}
                        activeOpacity={0.5}>
                        <Text style={styles.buttonTextStyle}>
                          Complete list
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      // onPress={handleNext}
                      style={styles.buttonStyle1}
                      activeOpacity={0.5}
                      onPress={handleEditSave}>
                      <Text style={styles.buttonTextStyle}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : null}

            {settingInfo.lists && settingInfo.lists.length > 0 ? null : (
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={navigateToCreateDailyList}>
                  <Text style={styles.buttonTextStyle}>Add the first item</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </>
      ) : (
        // If showPdf is true, render PDF
        <>
          <CustomHeader3 title={'Pdf View'} onBackIconPress={handleBackIconPress}/>
          <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
            <Pdf
              source={{uri: `data:application/pdf;base64,${DailyList.pdfData?.data.pdf_file}`}}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              style={styles.webView}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() => {
                  fetchLatestPdfData();
                  DownloadPDF(pdfBase64Data);
                }}
                style={styles.downloadButton}>
                <Text style={styles.backButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBackButtonPress}
                style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      )}
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
      ios: '55%',
      android: '55%',
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
    backgroundColor: '#0A1931',
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
  backButton: {
    backgroundColor: '#061439',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(160),
    alignItems: 'center',
    // alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 20,
    marginRight: 16,
    marginTop: 5,
  },
  downloadButton: {
    backgroundColor: '#061439',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(160),
    alignItems: 'center',
    // alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 5,
  },
  buttonStyle1: {
    backgroundColor: '#00C182',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(251),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: Platform.select({
      ios: 20,
      android: 36,
    }),
  },
  cancelButton: {
    backgroundColor: '#061439',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(160),
    alignItems: 'center',
    // alignSelf: 'center',
    borderRadius: 16,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#061439',
    borderWidth: 0,
    color: 'white',
    height: Matrics.ms(49),
    width: Matrics.ms(160),
    alignItems: 'center',
    // alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 20,
    marginRight: 16,
    marginTop: 5,
  },
  buttonTextStyle: {
    color: 'white',
    paddingTop: Matrics.ms(16),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs13,
    textAlign: 'center',
    flexDirection: 'column',
  },
  backButtonText: {
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingTop: 0,
  },
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
  },
  bold: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: 'black',
  },
  titleMain: {
    fontSize: typography.fontSizes.fs14,
    color: 'black',
    fontFamily: typography.fontFamily.Montserrat.Regular,
    paddingVertical: 3,
    bottom: Matrics.ms(5),
    right: Matrics.ms(5),
  },
  webView: {
    flex: 1,
    backgroundColor: '#EBF0FA',
    margin: 10,
  },
});

export default EditDailyList;

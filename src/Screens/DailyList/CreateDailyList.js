import React, {useEffect, useState} from 'react';
import {styles} from '../DailyList/style';
import DatePicker from 'react-native-date-picker';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {Matrics, typography} from '../../Config/AppStyling';
import {Constants, Images} from '../../Config';
import CustomHeader2 from '../../Components/Common/CustomHeader2';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDailyListActions} from '../../Redux/Hooks';

import CountInput from '../../Components/Common/CodeInput';
import moment from 'moment';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomModal from '../../Components/Common/customModal';
const CreateDailyList = () => {
  //================================= STATE MANAGEMENT =======================================

  const route = useRoute();
  const [ImageModalVisible, setImageModalVisible] = useState(false);
  const viewImage = item => {
    setSelectedImage(Constants.BASE_URL.IMAGEURL + item.file);
    setImageModalVisible(true);
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [date, setDate] = useState(new Date());
  const [timestund, setTimestund] = useState(new Date());
  console.log(DailyList?.saveData?.data.id, 'timestundtimestund');
  const [endtime, setEndtime] = useState(new Date());
  const [date1, setDate1] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [stundopen, setStundOpen] = useState(false);
  const [stundopen1, setStundOpen1] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [blocks, setBlocks] = useState([{id: 1}]);
  const [loading, setLoading] = useState(false);
  const {
    state,
    ServicesCall,
    ContainerServiceTypeCall,
    GoodTypesCall,
    ConatinerSizesCall,
    Create1call,
    WorkersCall,
    setTypesCall,
    Create2call,
    Create3call,
    Create4call,
    Create5call,
    Create6call,
    uploadCall,
    filesCall,
    uploadRemoveCall,
  } = useDailyListActions();
  const [ServicesList, setServicesList] = useState({});
  const [WorkType, setWorkType] = useState({});
  const [GoodType, setGoodType] = useState({});
  const [workers, setworkers] = useState({});
  const [setTypes, setsetTypes] = useState({});
  const [files, setFiles] = useState({});
  const [containerSize, setcontainerSize] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState('Container');
  const [selectedCustomerid, setSelectedCustomerid] = useState('1');
  console.log('selectedCustomerid---------------->>>>>', selectedCustomerid);
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [selectedGood, setSelectedGood] = useState('');
  const [selectedWorker, setSelectedWorker] = useState([]);
  const [selectedContainerSize, setSelectedContainerSize] = useState('');
  const [selectedWorkTypeid, setSelectedWorkTypeid] = useState('');
  const [selectedGoodTypeid, setSelectedGoodTypeid] = useState('');
  const [selectedWorkerid, setSelectedWorkerid] = useState('');
  const [selectedContainerSizeid, setSelectedContainerSizeid] = useState('');
  const {Auth, DailyList} = state;
  const sessionId = Auth.data?.data?.sesssion_id;
  const {listItemId, positionId, serviceLabel} = route.params;
  console.log('listItemId---------------->>>>>', listItemId);
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [count5, setCount5] = useState(0);
  const [count6, setCount6] = useState(0);
  const [count7, setCount7] = useState(0);
  const [count8, setCount8] = useState(0);
  const [containerNo1, setContainerNo1] = useState('');
  const [containerNo2, setContainerNo2] = useState('');
  const [containerNo3, setContainerNo3] = useState('');
  const [containerNo4, setContainerNo4] = useState('');
  const [containerNo6, setContainerNo6] = useState(''); //for setbau
  const [containerNo7, setContainerNo7] = useState(''); // for double pallete
  const [containerNo8, setContainerNo8] = useState(''); // for repacking pallete
  const [containerNo9, setContainerNo9] = useState(''); // for wartezeit
  const [containerNo10, setContainerNo10] = useState(''); // for stundenarbeit
  const [selectedSetTypes, setSelectedSetTypes] = useState('');
  const [isSetTypesModalVisible, setIsSetTypesModalVisible] = useState(false);
  const [isCustomerDropdownVisible, setIsCustomerDropdownVisible] =
    useState(false);
  const [isWorkDropdownVisible, setIsWorkDropdownVisible] = useState(false);
  const [isGoodTypeDropdownVisible, setIsGoodTypeDropdownVisible] =
    useState(false);
  const [isConatinerSizesDropdownVisible, setIsContainerSizesDropdownVisible] =
    useState(false);
  const [isWorkerDropdownVisible, setIsworkerDropdownVisible] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState([{startTime: '', endTime: ''}]);
  const [selectedStartTimeIndex, setSelectedStartTimeIndex] = useState(null);
  const [selectedEndTimeIndex, setSelectedEndTimeIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(1);
  const navigation = useNavigation();
  const addBlock = () => {
    const newBlock = {id: blocks.length + 1};
    setBlocks([...blocks, newBlock]);
    setSelectedWorker([...selectedWorker, null]);
    setNote1([...note1, '']);
  };

  const handleAdd = () => {
    setTimeBlocks([...timeBlocks, {startTime: '', endTime: ''}]);
  };

  const handleStartTimeSelection = index => {
    setSelectedStartTimeIndex(index);
    setStundOpen(true);
  };

  const handleEndTimeSelection = index => {
    setSelectedEndTimeIndex(index);
    setStundOpen1(true);
  };

  const handleTimePickerConfirm = date => {
    if (selectedStartTimeIndex !== null) {
      const updatedTimeBlocks = [...timeBlocks];
      updatedTimeBlocks[selectedStartTimeIndex].startTime = date;
      setTimeBlocks(updatedTimeBlocks);
    } else if (selectedEndTimeIndex !== null) {
      const updatedTimeBlocks = [...timeBlocks];
      updatedTimeBlocks[selectedEndTimeIndex].endTime = date;
      setTimeBlocks(updatedTimeBlocks);
    }
    setStundOpen(false);
    setStundOpen1(false);
    setSelectedStartTimeIndex(null);
    setSelectedEndTimeIndex(null);
  };

  const renderTimeBlocks = () => {
    return timeBlocks.map((block, index) => (
      <View key={index}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#B3B3B3',
            bottom: Matrics.ms(1),
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginLeft: Matrics.ms(10),
            }}>
            <Text
              style={{
                marginTop: Matrics.ms(10),
                marginBottom: Matrics.ms(9),
                color: '#555555',
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs9,
              }}>
              Start Time:
            </Text>
            <TouchableOpacity onPress={() => handleStartTimeSelection(index)}>
              <Text
                style={{
                  marginTop: Matrics.ms(10),
                  marginLeft: Matrics.ms(10),
                  color: '#272727',
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs9,
                }}>
                {block.startTime
                  ? moment(block.startTime).format('HH:mm')
                  : 'HH:MM'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text
              style={{
                marginTop: Matrics.ms(10),
                marginBottom: Matrics.ms(9),
                color: '#555555',
                fontFamily: typography.fontFamily.Montserrat.Medium,
                fontSize: typography.fontSizes.fs9,
              }}>
              End Time:
            </Text>
            <TouchableOpacity onPress={() => handleEndTimeSelection(index)}>
              <Text
                style={{
                  marginTop: Matrics.ms(10),
                  marginLeft: Matrics.ms(10),
                  color: '#272727',
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs9,
                }}>
                {block.endTime
                  ? moment(block.endTime).format('HH:mm')
                  : 'HH:MM'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  const serviceLabels = {
    1: 'Container',
    2: 'Setbau',
    3: 'Double Pallete',
    4: 'Umpacken der Paletten',
    5: 'Wartezeit',
    6: 'Stundenarbeit',
  };
  useEffect(() => {
    if (route.params && route.params.selectedCustomerid) {
      const selectedServiceId = route.params.selectedCustomerid;
      setSelectedCustomerid(selectedServiceId);
      setSelectedCustomer(serviceLabels[selectedServiceId] || 'Container');
    }
  }, [route.params]);

  useEffect(() => {
    fetchServices();
    fetchConatinerServicesType();
    fetchGoodType();
    fetchContainerSizes();
    fetchWorkers();
    fetchSetTypes();
  }, []);
  useEffect(() => {
    fetchFiles();
  }, []);
  useEffect(() => {
    if (
      (loading &&
        DailyList.isServicesSuccess === true &&
        DailyList.isContainerWorkServicesSuccess === true &&
        DailyList.isGoodTypeSuccess === true &&
        DailyList.isWorkerSuccess === true &&
        DailyList.iscontainerSizesSuccess === true &&
        DailyList.isSetTypesSuccess === true) ||
      DailyList.isFilesDataSuccess === true
    ) {
      setLoading(false);
      setServicesList(DailyList.ServicesData.data);
      setWorkType(DailyList.ContainerServicesTypeData.data);
      setGoodType(DailyList.goodTypeData.data);
      setworkers(DailyList.workersData.data);
      setcontainerSize(DailyList.containerSizesData.data);
      setsetTypes(DailyList.SetTypesData.data);
      setFiles(DailyList.filesData?.data);
    }
  }, [
    DailyList.isServicesSuccess,
    DailyList.isContainerWorkServicesSuccess,
    DailyList.isGoodTypeSuccess,
    DailyList.isWorkerSuccess,
    DailyList.iscontainerSizesSuccess,
    DailyList.isSetTypesSuccess,
    DailyList.isFilesDataSuccess,
  ]);

  const toggleCustomerDropdown = () => {
    setIsCustomerDropdownVisible(!isCustomerDropdownVisible);
  };
  const toggleWorkTypeDropdown = () => {
    setIsWorkDropdownVisible(!isWorkDropdownVisible);
  };

  ///======================== SET TYPES MODAL =======================
  const toggleSetTypesModal = () => {
    setIsSetTypesModalVisible(!isSetTypesModalVisible);
  };

  ///======================== MAIN MODAL =======================
  const toggleGoodTypeDropdown = () => {
    setIsGoodTypeDropdownVisible(!isGoodTypeDropdownVisible);
  };

  const toggleContainerSizesDropdown = () => {
    setIsContainerSizesDropdownVisible(!isConatinerSizesDropdownVisible);
  };
  const toggleWorkerDropdown = () => {
    setIsworkerDropdownVisible(!isWorkerDropdownVisible);
  };
  //========================  DROPDOWN MAIN SERVICES -=====================

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectCustomer(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectCustomer = customer => {
    setSelectedCustomer(customer.label);
    setSelectedCustomerid(customer.id);
    toggleCustomerDropdown();
  };

  const renderWork = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectContainerServicesType(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );
  const selectContainerServicesType = work => {
    setSelectedWorkType(work.label);
    setSelectedWorkTypeid(work.id);
    toggleWorkTypeDropdown();
  };

  const renderGoodType = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectGoodTypeType(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectGoodTypeType = good => {
    setSelectedGood(good.label);
    setSelectedGoodTypeid(good.id);
    toggleGoodTypeDropdown();
  };

  //================== worker modal======================
  const workerType = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectworker(item)}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectworker = worker => {
    const updatedSelectedWorkers = [...selectedWorker];
    updatedSelectedWorkers[blocks.length - 1] = worker.label;

    const updatedSelectedWorkerIds = [...selectedWorkerid];
    updatedSelectedWorkerIds[blocks.length - 1] = worker.id;

    setSelectedWorker(updatedSelectedWorkers);
    setSelectedWorkerid(updatedSelectedWorkerIds);
    toggleWorkerDropdown();
  };

  //================== ContainerSize modal======================
  const renderContainerSize = ({item}) => (
    console.log(item.label, 'jgdhjadgajdajdgjg'),
    (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => selectContainerSize(item)}>
        <Text style={styles.dropdownItemText}>{item.label}</Text>
      </TouchableOpacity>
    )
  );

  const selectContainerSize = Size => {
    setSelectedContainerSize(Size.label);
    setSelectedContainerSizeid(Size.id);
    toggleContainerSizesDropdown();
  };

  //================== ContainerSize modal======================
  const renderSetTypes = ({item}) => (
    console.log(item.label, 'jgdhjadgajdajdgjg'),
    (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => selectSetTypes(item)}>
        <Text style={styles.dropdownItemText}>{item.label}</Text>
      </TouchableOpacity>
    )
  );

  const selectSetTypes = Types => {
    setSelectedSetTypes(Types.label);
    // setSelectedContainerSizeid(Types.id);
    toggleSetTypesModal();
  };

  //=================================== APIS CALLING ==================================

  const fetchFiles = () => {
    setLoading(true);
    let params = {
      session_id: sessionId,
      device_id: '123',
      positionId: positionId,
    };
    filesCall(params);
  };

  const fetchServices = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    ServicesCall(formData);
  };
  const fetchConatinerServicesType = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    ContainerServiceTypeCall(formData);
  };

  const fetchGoodType = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    GoodTypesCall(formData);
  };

  const fetchContainerSizes = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    ConatinerSizesCall(formData);
  };

  const fetchWorkers = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    WorkersCall(formData);
  };
  const fetchSetTypes = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', '123');
    setTypesCall(formData);
  };

  const Save = async () => {
    try {
      // Create an array to store the parameters for each block
      let workerData = [];

      // Iterate over selected workers and their notes
      for (let i = 0; i < selectedWorkerid.length; i++) {
        let worker = {
          id: selectedWorkerid[i],
          note: note1[i],
        };
        workerData.push(worker);
      }

      // Example of parameters to pass to the API
      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        container_work_type: selectedWorkTypeid,
        container_no1: containerNo1,
        container_no2: containerNo2,
        container_no3: containerNo3,
        container_no4: containerNo4,
        container_no5: count2,
        container_no6: count3,
        container_no7: count4,
        container_no8: count5,
        container_no9: count6,
        container_no10: count7,
        container_no11: count8,
        cardboards_number_in_items: count,
        sorts_number_in_items: count1,
        foiling: '1',
        type_of_goods: selectedGoodTypeid,
        type_of_container: selectedContainerSizeid,
        workers: workerData,
      };

      await Create1call(params);
      console.log(params, '<<<<<<<paamds>>>>>>>>>>>');

      if (DailyList.isCreate1Success === true) {
        navigation.navigate('EditDailyList', {
       
          date: null,
          customer: null,
          location: null,
          id11 : listItemId
        });
      } else {
        // Handle error or show error message
        console.error('API call failed:', response.error);
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  //============================== UPLOAD IMAGE  FUNCTIONALITY =============================

  const handleUploadImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Response contains an array of selected images
        console.log('Selected Images: ', response.assets);
        const selectedUris = response.assets.map(asset => asset.uri);
        setSelectedImages(prevImages => [...prevImages, ...selectedUris]);
        // Upload selected images to the server
        response.assets.forEach(asset => {
          const {fileName, uri} = asset;
          uploadImages(fileName, uri);
        });
      }
    });
  };

  const uploadImages = async (fileName, uri) => {
    let params = {
      session_id: sessionId,
      device_id: '123',
      positionId: positionId,
      file: [{filename: fileName, uri: uri}],
    };

    try {
      await uploadCall(params);
      fetchFiles();

      console.log('Image uploaded successfully');
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  };

  const deleteImage = index => {
    Alert.alert(
      'Packteam24',
      'Are you sure you want to delete?',
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
                itemId: index,
              };

              await uploadRemoveCall(params);

              // After successful deletion, update the settingInfo state
              fetchFiles();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item, index}) => (
    <View style={{position: 'relative'}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
        }}
        onPress={() => viewImage(item)}>
        <Image
          style={{
            width: 30,
            height: 30,
          }}
          source={Images.EYE}
        />
      </TouchableOpacity>

      <Image
        style={{
          width: 200,
          height: 200,
          margin: 5,
          borderRadius: 10,
        }}
        source={{uri: Constants.BASE_URL.IMAGEURL + item.file}}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
        onPress={() => deleteImage(item.id)}>
        <Image
          style={{
            width: 30,
            height: 30,
          }}
          source={Images.DELETEUP}
        />
      </TouchableOpacity>
    </View>
  );
  //============================== PRESS FUNCTIONALITY =============================
  // const handleAdd = () => {
  //   setTimeBlocks([...timeBlocks, {startTime: '', endTime: ''}]);
  // };

  const handleOptionSelect = value => {
    setSelectedValue(value);
    setModalVisible(false);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };
  const incrementCount1 = () => {
    setCount1(count1 + 1);
  };
  const incrementCount2 = () => {
    if (count2 < 9) {
      setCount2(count2 + 1);
    }
  };
  const incrementCount3 = () => {
    if (count3 < 9) {
      setCount3(count3 + 1);
    }
  };
  const incrementCount4 = () => {
    if (count4 < 9) {
      setCount4(count4 + 1);
    }
  };
  const incrementCount5 = () => {
    if (count5 < 9) {
      setCount5(count5 + 1);
    }
  };
  const incrementCount6 = () => {
    if (count6 < 9) {
      setCount6(count6 + 1);
    }
  };
  const incrementCount7 = () => {
    if (count7 < 9) {
      setCount7(count7 + 1);
    }
  };
  const incrementCount8 = () => {
    if (count8 < 9) {
      setCount8(count8 + 1);
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const decrementCount1 = () => {
    if (count1 > 0) {
      setCount1(count1 - 1);
    }
  };

  const decrementCount2 = () => {
    if (count2 > 0) {
      setCount2(count2 - 1);
    }
  };

  const decrementCount3 = () => {
    if (count3 > 0) {
      setCount3(count3 - 1);
    }
  };

  const decrementCount4 = () => {
    if (count4 > 0) {
      setCount4(count4 - 1);
    }
  };

  const decrementCount5 = () => {
    if (count5 > 0) {
      setCount5(count5 - 1);
    }
  };

  const decrementCount6 = () => {
    if (count6 > 0) {
      setCount6(count6 - 1);
    }
  };

  const decrementCount7 = () => {
    if (count7 > 0) {
      setCount7(count7 - 1);
    }
  };

  const decrementCount8 = () => {
    if (count8 > 0) {
      setCount8(count8 - 1);
    }
  };

  const updateCount = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount(newValue);
    }
  };
  const updateCount1 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount1(newValue);
    }
  };
  const updateCount2 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount2(newValue);
    }
  };
  const updateCount3 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount3(newValue);
    }
  };
  const updateCount4 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount4(newValue);
    }
  };
  const updateCount5 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount5(newValue);
    }
  };
  const updateCount6 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount6(newValue);
    }
  };
  const updateCount7 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount7(newValue);
    }
  };
  const updateCount8 = value => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue >= 1) {
      setCount8(newValue);
    }
  };

  //====================================== SAVE API CALLING ============================
  const handleSave = () => {
    if (selectedCustomerid === '1') {
      Save();
    } else if (selectedCustomerid === '2') {
      callSaveDataForSetbau();
    } else if (selectedCustomerid === '3') {
      callSaveDataForDoublePallete();
    } else if (selectedCustomerid === '4') {
      callSaveDataForRepackingPallete();
    } else if (selectedCustomerid === '5') {
      callSaveDataForWartezeit();
    } else if (selectedCustomerid === '6') {
      callSaveDataForStundenarbeit();
    } else {
      null;
    }
  };
  const callSaveDataForSetbau = async () => {
    try {
      // Create an array to store the parameters for each block
      let workerData = [];

      // Iterate over selected workers and their notes
      for (let i = 0; i < selectedWorkerid.length; i++) {
        let worker = {
          id: selectedWorkerid[i],
          note: noteSetBau[i],
        };
        workerData.push(worker);
      }
      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        set_number: containerNo1,
        set_type: selectedSetTypes,
        number_of_items: numberOfItems,
        workers: workerData,
      };

      // Make the API call
      await Create2call(params);

      // console.log(response, '<<<<<<<params for setbau>>>>>>>>>>>');

      if (DailyList.isCreate2Success === true) {
        navigation.navigate('EditDailyList', {
          date: null,
          customer: null,
          location: null,
        });
      } else {
        // Handle error or show error message
        console.error('API call failed:', response.error);
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const callSaveDataForDoublePallete = async () => {
    try {
      // Create an array to store the parameters for each block
      let workerData = [];

      // Iterate over selected workers and their notes
      for (let i = 0; i < selectedWorkerid.length; i++) {
        let worker = {
          id: selectedWorkerid[i],
          note: noteDouble[i],
        };
        workerData.push(worker);
      }

      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        number_of_items: '22',
        workers: workerData,
      };

      // Make the API call
      await Create3call(params);

      console.log(params, '<<<<<<<params for Double pallet>>>>>>>>>>>');

      // Check if the API call was successful
      if (DailyList.isCreate3Success === true) {
        let isCreateDailyList = true
        navigation.navigate('EditDailyList', {
          date: null,
          customer: null,
          location: null,
          isCreateDailyList
        });
      } else {
        // Handle error or show error message
        console.error('API call failed:', response.error);
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const callSaveDataForRepackingPallete = async () => {
    try {
      // Create an array to store the parameters for each block
      let workerData = [];

      // Iterate over selected workers and their notes
      for (let i = 0; i < selectedWorkerid.length; i++) {
        let worker = {
          id: selectedWorkerid[i],
          note: noteRepacking[i],
        };
        workerData.push(worker);
      }

      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        number_of_items: containerNo8,
        workers: workerData,
      };

      // Make the API call
      await Create4call(params);

      console.log(params, '<<<<<<<params for RepackingPallete>>>>>>>>>>>');

      // Check if the API call was successful
      if (DailyList.isCreate4Success === true) {
        navigation.navigate('EditDailyList', {
          date: null,
          customer: null,
          location: null,
        });
      } else {
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const callSaveDataForWartezeit = async () => {
    try {
      let workerData = [];

      for (let i = 0; i < selectedWorkerid.length; i++) {
        let worker = {
          id: selectedWorkerid[i],
          note: noteWartezeit[i],
        };
        workerData.push(worker);
      }

      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        begin_hour: moment(date).format('HH:mm'),
        end_hour: moment(date1).format('HH:mm'),
        workers: workerData,
      };

      await Create5call(params);

      console.log(params, '<<<<<<<params for Wartezeit>>>>>>>>>>>');
      if (DailyList.isCreate5Success === true) {
        navigation.navigate('EditDailyList', {
          date: null,
          customer: null,
          location: null,
        });
      } else {
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const callSaveDataForStundenarbeit = () => {
    try {
      // Create an array to store the parameters for each block
      let blockData = [];

      // Iterate over timeBlocks and gather start and end times along with worker information
      for (let i = 0; i < timeBlocks.length; i++) {
        let startTime = moment(timeBlocks[i].startTime).format('HH:mm');
        let endTime = moment(timeBlocks[i].endTime).format('HH:mm');
        let workerId = selectedWorkerid[i];
        let workerNote = noteStundenarbeit[i];

        // Add the block data including time and worker info to the array
        blockData.push({startTime, endTime, workerId, workerNote});
      }

      let params = {
        session_id: sessionId,
        device_id: '123',
        itemId: listItemId,
        service_type_id: selectedCustomerid,
        blocks: blockData, // Pass the array of time blocks with worker info to the API
      };
      Create6call(params);
      console.log(params, '<<<<<<<params for Stundenarbeit>>>>>>>>>>>');
      if (DailyList.isCreate5Success === true) {
        navigation.navigate('EditDailyList', {
          date: null,
          customer: null,
          location: null,
        });
      } else {
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  //====================================== ADD NOTES ===============================
  const [note, setNote] = useState('');
  const handleNoteChange = text => {
    setNote(text);
  };
  const [note1, setNote1] = useState([]);
  const handleNoteChange1 = (text, index) => {
    const updatedNotes = [...note1];
    updatedNotes[index] = text;
    setNote1(updatedNotes);
  };
  const [noteSetBau, setnoteSetBau] = useState([]);
  const handleNoteSetbau = (text, index) => {
    const updateNotes = [...noteSetBau];
    updateNotes[index] = text;
    setnoteSetBau(updateNotes);
  };

  const [noteDouble, setnoteDouble] = useState('');
  const handleNoteDouble = (text, index) => {
    const updateNotes = [...noteDouble];
    updateNotes[index] = text;
    setnoteDouble(updateNotes);
  };

  const [noteRepacking, setnoteRepacking] = useState('');
  const handleNoteRepacking = (text, index) => {
    const updateNotes = [...noteRepacking];
    updateNotes[index] = text;
    setnoteRepacking(updateNotes);
  };

  const [noteWartezeit, setnoteWartezeit] = useState('');
  const handleNoteWartezeit = (text, index) => {
    const updateNotes = [...noteWartezeit];
    updateNotes[index] = text;
    setnoteWartezeit(updateNotes);
  };

  const [noteStundenarbeit, setnoteStundenarbeit] = useState('');
  const handleNoteStundenarbeit = (text, index) => {
    const updateNotes = [...noteStundenarbeit];
    updateNotes[index] = text;
    setnoteStundenarbeit(updateNotes);
  };

  // ================================ VALIDATIOS ===========================================
  const handleTextInputChange = (text, setterFunction) => {
    const regex = /^[A-Z]$/;

    if (text === '' || regex.test(text)) {
      setterFunction(text);
    }
  };

  //================================= Navigation  =========================================

  const navigateToCreateDailyList = () => {
    navigation.navigate('DailyListScreen');
  };
  //================================= UI RENDER PART =========================================

  return (
    <View style={{flex: 1}}>
      <CustomHeader2 title={'Create daily list'} imageSource={{}} />
      <SafeAreaView style={{flex: 1, backgroundColor: '#EBF0FA'}}>
        <ScrollView>
          <View style={styles.typeServiceCont}>
            <Text style={styles.label}>Type of service</Text>
            <TouchableOpacity onPress={toggleCustomerDropdown}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                top: Matrics.ms(4),
              }}>
             
                <Text
                  style={{
                    fontFamily: typography.fontFamily.Montserrat.Medium,
                    fontSize: typography.fontSizes.fs13,color:'black'
                  }}>
                  {selectedCustomer ? selectedCustomer : 'Select Services'}
                </Text>
              <Image
                style={{marginTop: 30, bottom: 15}}
                source={Images.DOWNARROW}
                />
            </View>
                </TouchableOpacity>
          </View>
          <View>
            {selectedCustomer === 'Container' ? (
              <View>
                <View style={styles.TypeMaincontainer}>
                  <View
                    style={{
                      flex: 0.1,
                      // backgroundColor: 'red',
                      maxHeight: Matrics.ms(30),
                      justifyContent: 'center',
                      paddingHorizontal: Matrics.ms(15),
                      borderBottomColor: '#DEDEDE',
                      borderBottomWidth: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(20),
                    }}>
                  <TouchableOpacity onPress={toggleWorkTypeDropdown}>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          fontSize: typography.fontSizes.fs10,
                          color:'#555555'
                        }}>
                        Loading/Unloading
                      </Text>

                      <Text
                        style={{
                          left: Matrics.ms(60),
                          fontFamily: typography.fontFamily.Montserrat.SemiBold,
                          fontSize: typography.fontSizes.fs11,
                          color:'#555555'
                        }}>
                        {' '}
                        {selectedWorkType ? selectedWorkType : ''}
                      </Text>
                      <TouchableOpacity onPress={toggleWorkTypeDropdown}>
                        <Image
                          style={{
                            marginTop: Matrics.ms(30),
                            bottom: Matrics.ms(15),
                            height: Matrics.ms(10),
                            width: Matrics.ms(10),
                          }}
                          source={Images.DOWNARROW}
                        />
                      </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={styles.containerNumber}>
                      <View
                        style={{
                          flex: 0.1,
                          paddingHorizontal: Matrics.ms(15),
                          borderBottomWidth: 1,
                          maxHeight: '8%',
                          marginHorizontal: Matrics.ms(-40),
                          justifyContent: 'center',
                          borderColor: '#B3B3B3',
                        }}>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontFamily:
                                typography.fontFamily.Montserrat.Medium,
                              fontSize: typography.fontSizes.fs10,
                              color:'#555555'
                            }}>
                            Container Number
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginTop: Matrics.ms(-15),
                        maxHeight: '97%',

                        borderBottomColor: '#B3B3B3',
                      }}>
                      <View style={styles.dropdownContainer}>
                        <TextInput
                          value={containerNo1}
                          onChangeText={text =>
                            handleTextInputChange(text, setContainerNo1)
                          }
                          placeholder="-"
                          maxLength={1}
                          style={styles.input}
                        />
                      </View>
                      <View style={styles.dropdownContainer}>
                        <TextInput
                          value={containerNo2}
                          onChangeText={text =>
                            handleTextInputChange(text, setContainerNo2)
                          }
                          placeholder="-"
                          maxLength={1}
                          style={styles.input}
                        />
                      </View>
                      <View style={styles.dropdownContainer}>
                        <TextInput
                          value={containerNo3}
                          onChangeText={text =>
                            handleTextInputChange(text, setContainerNo3)
                          }
                          placeholder="-"
                          maxLength={1}
                          style={styles.input}
                        />
                      </View>
                      <View style={styles.dropdownContainer}>
                        <TextInput
                          value={containerNo4}
                          onChangeText={text =>
                            handleTextInputChange(text, setContainerNo4)
                          }
                          placeholder="-"
                          maxLength={1}
                          style={styles.input}
                        />
                      </View>
                      <View
                        style={{
                          borderWidth: 0.5,
                          marginTop: Matrics.ms(8),
                          borderColor: '#B3B3B3',
                        }}></View>
                      <CountInput
                        value={count2}
                        onIncrement={() => incrementCount2(setCount2)}
                        onDecrement={() => decrementCount2(setCount2)}
                        onUpdate={value => updateCount2(setCount2, value)}
                      />
                      <CountInput
                        value={count3}
                        onIncrement={() => incrementCount3(setCount3)}
                        onDecrement={() => decrementCount3(setCount3)}
                        onUpdate={value => updateCount3(setCount3, value)}
                      />
                      <CountInput
                        value={count4}
                        onIncrement={() => incrementCount4(setCount4)}
                        onDecrement={() => decrementCount4(setCount4)}
                        onUpdate={value => updateCount4(setCount4, value)}
                      />
                      <CountInput
                        value={count5}
                        onIncrement={() => incrementCount5(setCount5)}
                        onDecrement={() => decrementCount5(setCount5)}
                        onUpdate={value => updateCount5(setCount5, value)}
                      />
                      <CountInput
                        value={count6}
                        onIncrement={() => incrementCount6(setCount6)}
                        onDecrement={() => decrementCount6(setCount6)}
                        onUpdate={value => updateCount6(setCount6, value)}
                      />
                      <CountInput
                        value={count7}
                        onIncrement={() => incrementCount7(setCount7)}
                        onDecrement={() => decrementCount7(setCount7)}
                        onUpdate={value => updateCount7(setCount7, value)}
                      />
                      <CountInput
                        value={count8}
                        onIncrement={() => incrementCount8(setCount8)}
                        onDecrement={() => decrementCount8(setCount8)}
                        onUpdate={value => updateCount8(setCount8, value)}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderRightWidth: 1,
                    borderLeftWidth: 1,
                    borderColor: '#B3B3B3',
                    bottom: Matrics.ms(65),
                    marginHorizontal: Matrics.ms(15),
                    height: Matrics.ms(9),
                  }}>
                  <Text> </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: Matrics.ms(0)}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: 15,
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Container Number
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      // borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(10),
                      backgroundColor: '#E6E6E6',
                      marginLeft: 11,
                      marginRight: 6,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginTop: Matrics.ms(6),
                        justifyContent: 'center',
                        marginHorizontal: Matrics.ms(9),
                      }}>
                      <Text
                        style={{
                          paddingTop: Matrics.ms(4),
                          paddingLeft: Matrics.ms(5),
                          fontFamily: typography.fontFamily.Montserrat.SemiBold,
                          fontSize: typography.fontSizes.fs11,
                          color: '#ACACAC',
                        }}>
                        {containerNo1}
                        {containerNo2}
                        {containerNo3}
                        {containerNo4}
                        {count2}
                        {count3}
                        {count4}
                        {count5}
                        {count6}
                        {count7}
                        {count8}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Quantity of boxes in pcs.
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        maxHeight: Matrics.ms(35),
                        marginTop: Matrics.ms(6),
                        justifyContent: 'center',
                        marginRight: Matrics.ms(10),
                      }}>
                      <TouchableOpacity onPress={decrementCount}>
                        <Image
                          style={{
                            height: Matrics.ms(20),
                            width: Matrics.ms(20),
                            marginTop: Matrics.ms(2),
                          }}
                          source={Images.MINUS}></Image>
                      </TouchableOpacity>
                      <TextInput
                        style={{
                          paddingBottom: Matrics.ms(6),
                          paddingLeft: Matrics.ms(15),
                          fontFamily: typography.fontFamily.Montserrat.SemiBold,
                          fontSize: typography.fontSizes.fs11,
                          left: Platform.select({
                            android: Matrics.ms(10),
                          }),
                          bottom: Platform.select({
                            android: Matrics.ms(6),
                          }),
                          color:'#555555'
                        }}
                        value={count.toString()}
                        onChangeText={updateCount}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        onPress={incrementCount}
                        style={{width: 0}}>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            marginTop: 2,
                            marginLeft: Matrics.ms(12),
                          }}
                          source={Images.PLUS}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Quantity of varieties in pcs
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        maxHeight: Matrics.ms(35),
                        marginTop: Matrics.ms(6),
                        justifyContent: 'center',
                        marginRight: Matrics.ms(10),
                      }}>
                      <TouchableOpacity onPress={decrementCount1}>
                        <Image
                          style={{
                            height: Matrics.ms(20),
                            width: Matrics.ms(20),
                            marginTop: Matrics.ms(2),
                          }}
                          source={Images.MINUS}></Image>
                      </TouchableOpacity>
                      <TextInput
                        style={{
                          paddingBottom: Matrics.ms(6),
                          paddingLeft: Matrics.ms(15),
                          fontFamily: typography.fontFamily.Montserrat.SemiBold,
                          fontSize: typography.fontSizes.fs11,
                          left: Platform.select({
                            android: Matrics.ms(10),
                          }),
                          bottom: Platform.select({
                            android: Matrics.ms(6),
                          }),
                          color:'#555555'
                        }}
                        value={count1.toString()}
                        onChangeText={updateCount1}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        onPress={incrementCount1}
                        style={{width: 0}}>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            marginTop: 2,
                            marginLeft: Matrics.ms(12),
                          }}
                          source={Images.PLUS}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Foil wrapping
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <Text style={styles.dropdownText2}>{selectedValue}</Text>
                      <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                          style={styles.dropdownIcon2}
                          source={Images.DOWNARROW}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Size of goods
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <Text style={styles.dropdownText2}>
                        {selectedGood ? selectedGood : '              '}
                      </Text>
                      <TouchableOpacity onPress={toggleGoodTypeDropdown} sty>
                        <Image
                          style={{
                            height: Matrics.ms(10),
                            width: Matrics.ms(10),
                            top: Matrics.ms(5),
                            left: 20,
                          }}
                          source={Images.DOWNARROW}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color:'#555555'
                      }}>
                      Container size
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <TouchableOpacity
                        onPress={toggleContainerSizesDropdown}
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 0,
                        }}>
                        <Image
                          style={{
                            height: Matrics.ms(10),
                            width: Matrics.ms(10),
                            marginTop: 8,
                          }}
                          source={Images.DOWNARROW}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.SemiBold,
                          fontSize: typography.fontSizes.fs11,
                          marginTop: 0,
                          textAlign: 'center',
                          alignSelf: 'center',
                          color:'black'
                        }}>
                        {selectedContainerSize
                          ? selectedContainerSize
                          : 'select'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: Matrics.ms(-65),
                    borderRightWidth: 1,
                    borderColor: '#B3B3B3',
                    borderBottomWidth: 1,
                    borderLeftWidth: 1,
                    height: Matrics.ms(75),
                    marginHorizontal: 16,
                  }}>
                  <Text
                    style={{
                      marginLeft: Matrics.ms(18),
                      marginTop: Matrics.ms(10),
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: typography.fontSizes.fs10,
                      color:'#555555'
                    }}>
                    Note
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      marginHorizontal: Matrics.ms(18),
                      height: Matrics.ms(35),
                      paddingLeft: Matrics.ms(15),
                      borderRadius: Matrics.ms(5),
                      margin: Matrics.ms(5),
                      fontFamily: typography.fontFamily.Montserrat.Medium,
                      fontSize: typography.fontSizes.fs10,
                      paddingTop: Matrics.ms(10),
                      color:'black'
                    }}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter your note here..."
                    value={note}
                    onChangeText={handleNoteChange}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      marginLeft: Matrics.ms(16),
                      marginTop: Matrics.ms(40),
                      fontFamily: typography.fontFamily.Montserrat.SemiBold,
                      fontSize: typography.fontSizes.fs14,
                      color:'#555555'
                    }}>
                    Workers
                  </Text>
                  <TouchableOpacity onPress={addBlock} style={styles.addButton}>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.Montserrat.SemiBold,
                        fontSize: typography.fontSizes.fs12,
                        marginTop: Matrics.ms(40),
                        marginRight: Matrics.ms(16),
                        color:'#555555'
                      }}>
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                                color:'#555555'
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                                alignSelf: 'center',
                                color:'black'
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={styles.modalStyle}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={note1[index]}
                          onChangeText={text => handleNoteChange1(text, index)}
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        {/* <View
                          style={{
                            bottom: Matrics.ms(1),
                            width: '30%',
                            borderRightWidth: 1,
                            borderLeftWidth: 1,
                            borderColor: '#B3B3B3',
                            // marginLeft: Matrics.ms(16.2),
                          }}>
                          <Text
                            style={{
                              left: Matrics.ms(16),
                              marginTop: Matrics.ms(10),
                              color: '#555555',
                              fontFamily:
                                typography.fontFamily.Montserrat.Medium,
                              fontSize: typography.fontSizes.fs10,
                            }}>
                            Break
                          </Text>
                        </View> */}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            borderColor: '#B3B3B3',
                          }}>
                          {/* {renderTimeBlocks()} */}

                          {/* <View
                            style={{
                              flexDirection: 'row',
                              bottom: Matrics.ms(1),
                            }}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}>
                              <Image
                                style={{
                                  height: Matrics.ms(16),
                                  width: Matrics.ms(16),
                                  top: Matrics.ms(10),
                                }}
                                source={Images.ADDCREATE}></Image>
                              <TouchableOpacity onPress={handleAdd}>
                                <Text
                                  style={{
                                    marginTop: Matrics.ms(12),
                                    marginBottom: Matrics.ms(9),
                                    marginLeft: 10,
                                    fontFamily:
                                      typography.fontFamily.Montserrat.Medium,
                                    fontSize: typography.fontSizes.fs9,
                                  }}>
                                  Add
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View> */}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}

                <Text
                  style={{
                    marginLeft: Matrics.ms(16),
                    marginTop: Matrics.ms(40),
                    fontFamily: typography.fontFamily.Montserrat.SemiBold,
                    fontSize: typography.fontSizes.fs14,
                    color:'#555555'
                  }}>
                  Attachments
                </Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : selectedCustomer === 'Setbau' ? (
              <View>
                <View style={styles.TypeMaincontainer}>
                  <View style={styles.serviceTypeContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: Matrics.ms(30),
                        bottom: Matrics.ms(5),
                      }}>
                      <Text style={styles.serviceTypeText}>
                        Type of service
                      </Text>

                      <Text style={{      color:'black'}}>
                        {' '}
                        {selectedCustomer
                          ? selectedCustomer
                          : selectedService.label}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        color: '#555555',
                        left: 15,
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                      }}>
                      Set construction number
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      // borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View
                      style={{
                        // backgroundColor:'red',
                        marginHorizontal: 20,
                        borderWidth: 1,
                        marginBottom: 10,
                        top: 5,
                        left: 10,
                        borderRadius: 5,
                        height: Matrics.ms(30),
                      }}>
                      <TextInput
                        style={{
                          fontSize: typography.fontSizes.fs9,
                          left: 0,
                          textAlign: 'center',
                          top: Platform.select({
                            ios: 9,
                            android: 0,
                          }),
                        }}
                        value={containerNo6}
                        onChangeText={text =>
                          setContainerNo6(text)
                        }></TextInput>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                        color: '#555555',
                      }}>
                      Set construction size
                    </Text>
                  </View>
                  <View
                    style={{
                      // backgroundColor: 'green',
                      flex: 1,
                      // marginTop: 10,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      // borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          fontSize: typography.fontSizes.fs11,
                          alignSelf: 'center',
                        }}>
                        {selectedSetTypes}
                      </Text>
                      <TouchableOpacity
                        onPress={toggleSetTypesModal}
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 10,
                        }}>
                        <Image
                          style={{
                            height: Matrics.ms(10),
                            width: Matrics.ms(10),
                            top: Matrics.ms(8),
                            resizeMode: 'cover',
                          }}
                          source={Images.DOWNARROW}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.setConstructionNumberContainer}>
                    <Text
                      style={{
                        color: '#555555',
                        left: Matrics.ms(15),
                        fontFamily: typography.fontFamily.Montserrat.Medium,
                        fontSize: typography.fontSizes.fs10,
                      }}>
                      Number of parts
                    </Text>
                  </View>
                  <View
                    style={{
                      // backgroundColor: 'green',
                      flex: 1,
                      // marginTop: 10,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      // borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <TextInput
                        style={styles.textInput}
                        value={numberOfItems}
                        onChangeText={setNumberOfItems}
                        placeholder="Enter"
                        keyboardType="numeric"></TextInput>
                    </View>
                  </View>
                </View>
                <View style={styles.workerContainer}>
                  <Text style={styles.workersText}>Workers</Text>
                  <TouchableOpacity onPress={addBlock}>
                    <Text
                      style={{
                        fontFamily: typography.fontFamily.Montserrat.SemiBold,
                        fontSize: typography.fontSizes.fs12,
                        marginTop: Matrics.ms(0),
                        marginRight: Matrics.ms(16),
                      }}>
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                                color:'#555555'
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                alignSelf: 'center',
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={styles.SetbaumodalStyle}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={noteSetBau[index]}
                          onChangeText={text => handleNoteSetbau(text, index)}
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            borderColor: '#B3B3B3',
                          }}></View>
                      </View>
                    </View>
                  </View>
                ))}

                <Text style={styles.attachmentText}>Attachments</Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : selectedCustomer === 'Doppelte Palette' ? (
              <View>
                <View
                  style={{
                    margin: Matrics.ms(15),
                    bottom: Matrics.ms(20),
                    marginBottom: Matrics.ms(45),
                    //   paddingVertical: Matrics.ms(30),
                    paddingBottom: Matrics.ms(8),
                  }}></View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      width: '56.7%',
                      borderRightWidth: 1,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      justifyContent: 'center',
                      borderColor: '#B3B3B3',
                      marginLeft: Matrics.ms(15),
                    }}>
                    <Text style={{left: Matrics.ms(15) ,color:'#555555'}}>Number of parts</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      // borderLeftWidth: 1,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <TextInput
                        style={styles.textInput}
                        value={containerNo7}
                        onChangeText={text => setContainerNo7(text)}
                        placeholder="--"></TextInput>
                    </View>
                  </View>
                </View>
                <View style={styles.workerContainer}>
                  <Text style={styles.workersText}>Workers</Text>
                  <TouchableOpacity onPress={addBlock}>
                    <Text style={styles.addText}>ADD</Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                                color:'#555555'
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                alignSelf: 'center',
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={{marginTop: '95%'}}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={noteDouble[index]}
                          onChangeText={text => handleNoteDouble(text, index)}
                        />
                      </View>
                    </View>
                  </View>
                ))}

                <Text style={styles.attachmentText}>Attachments</Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : selectedCustomer === 'Umpacken der Paletten' ? (
              <View>
                <View
                  style={{
                    margin: Matrics.ms(15),
                    bottom: Matrics.ms(20),
                    marginBottom: Matrics.ms(45),
                    //   paddingVertical: Matrics.ms(30),
                    paddingBottom: Matrics.ms(8),
                  }}></View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      width: '56.7%',
                      borderRightWidth: 1,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      justifyContent: 'center',
                      borderColor: '#B3B3B3',
                      marginLeft: Matrics.ms(15),
                    }}>
                    <Text style={{left: Matrics.ms(15),color:'#555555'}}>Number of parts</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderColor: '#B3B3B3',
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      right: Matrics.ms(16),
                    }}>
                    <View style={styles.dropdownContainer3}>
                      <TextInput
                        style={styles.textInput}
                        value={containerNo8}
                        onChangeText={text => setContainerNo8(text)}
                        placeholder="Enter"
                        keyboardType="numeric"></TextInput>
                    </View>
                  </View>
                </View>
                <View style={styles.workerContainer}>
                  <Text style={styles.workersText}>Workers</Text>
                  <TouchableOpacity onPress={addBlock}>
                    <Text style={styles.addText}>ADD</Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                                color:'#555555'
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                alignSelf: 'center',
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={{marginTop: '95%'}}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={noteRepacking[index]}
                          onChangeText={text =>
                            handleNoteRepacking(text, index)
                          }
                        />
                      </View>
                    </View>
                  </View>
                ))}

                <Text style={styles.attachmentText}>Attachments</Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : selectedCustomer === 'Wartezeit' ? (
              <View>
                <View
                  style={{
                    margin: Matrics.ms(15),
                    bottom: Matrics.ms(20),
                    marginBottom: Matrics.ms(45),
                    paddingBottom: Matrics.ms(8),
                  }}></View>
                <View>
                  <View
                    style={{
                      flex: 1,
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      borderRightWidth: 1,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      justifyContent: 'space-between',
                      borderColor: '#B3B3B3',
                      marginHorizontal: Matrics.ms(15),
                      flexDirection: 'row',
                      paddingTop: 10,
                    }}>
                    <Text style={{left: Matrics.ms(15),color:'#555555'}}>Start Time</Text>
                    <View
                      style={{
                        flex: 0.5,
                        bottom: 5,
                        borderBottomWidth: 1,
                        borderColor: '#B3B3B3',
                        marginHorizontal: Matrics.ms(40),
                        left: Matrics.ms(25),
                      }}>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          fontSize: typography.fontSizes.fs11,
                          alignSelf: 'center',
                          paddingTop: Matrics.ms(8),
                          color:'#272727'
                        }}
                        placeholder="--:--">
                        {moment(date).format('HH:mm')}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 5,
                        }}>
                        <TouchableOpacity onPress={() => setOpen(true)}>
                          <Image
                            style={{
                              height: Matrics.ms(13),
                              width: Matrics.ms(11),
                              top: Matrics.ms(8),
                              resizeMode: 'contain',
                            }}
                            source={Images.TIMER}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      bottom: Matrics.ms(65),
                      height: Matrics.ms(40),
                      // width: '56.7%',
                      borderRightWidth: 1,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      justifyContent: 'space-between',
                      borderColor: '#B3B3B3',
                      marginHorizontal: Matrics.ms(15),
                      flexDirection: 'row',
                      paddingTop: 10,
                    }}>
                    <Text style={{left: Matrics.ms(15),color:'#555555'}}>End Time</Text>
                    <View
                      style={{
                        flex: 0.5,
                        bottom: 5,
                        borderBottomWidth: 1,
                        borderColor: '#B3B3B3',
                        marginHorizontal: Matrics.ms(40),
                        left: Matrics.ms(25),
                      }}>
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.Montserrat.Medium,
                          fontSize: typography.fontSizes.fs11,
                          alignSelf: 'center',
                          paddingTop: Matrics.ms(8),
                          color:'#272727'
                        }}
                        placeholder="--:--">
                        {' '}
                        {moment(date1).format('HH:mm')}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 5,
                        }}>
                        <TouchableOpacity onPress={() => setOpen1(true)}>
                          <Image
                            style={{
                              height: Matrics.ms(13),
                              width: Matrics.ms(11),
                              top: Matrics.ms(8),
                              resizeMode: 'contain',
                            }}
                            source={Images.TIMER}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.workerContainer}>
                  <Text style={styles.workersText}>Workers</Text>
                  <TouchableOpacity onPress={addBlock}>
                    <Text style={styles.addText}>ADD</Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                                color:'#555555'
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                                alignSelf: 'center',
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={{marginTop: '106%'}}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={noteWartezeit[index]}
                          onChangeText={text =>
                            handleNoteWartezeit(text, index)
                          }
                        />
                      </View>
                    </View>
                  </View>
                ))}

                <Text style={styles.attachmentText}>Attachments</Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : selectedCustomer === 'Stundenarbeit' ? (
              <View>
                <View
                  style={{
                    margin: Matrics.ms(15),
                    bottom: Matrics.ms(20),
                    marginBottom: Matrics.ms(30),
                    //   paddingVertical: Matrics.ms(30),
                    paddingBottom: Matrics.ms(8),
                  }}></View>
                <View style={styles.workerContainer}>
                  <Text style={styles.workersText}>Workers</Text>
                  <TouchableOpacity onPress={addBlock}>
                    <Text style={styles.addText}>ADD</Text>
                  </TouchableOpacity>
                </View>
                {blocks.map((block, index) => (
                  <View key={index} style={styles.blockContainer}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#B3B3B3',
                        margin: Matrics.ms(15),
                      }}>
                      <View
                        style={{
                          maxHeight: Matrics.ms(40),
                          justifyContent: 'center',
                          paddingHorizontal: Matrics.ms(17),
                          borderWidth: 1,
                          borderColor: '#B3B3B3',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily:
                                  typography.fontFamily.Montserrat.Medium,
                                fontSize: typography.fontSizes.fs10,
                              }}>
                              Worker
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={toggleWorkerDropdown}
                            style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                // marginLeft: Matrics.ms(150),
                                fontFamily:
                                  typography.fontFamily.Montserrat.SemiBold,
                                fontSize: typography.fontSizes.fs11,
                                alignSelf: 'center',
                              }}>
                              {selectedWorker[index]}
                            </Text>

                            <Image
                              style={styles.downArrowIcon}
                              source={Images.DOWNARROW}
                            />
                          </TouchableOpacity>
                          <CustomModal
                            visible={isWorkerDropdownVisible}
                            onRequestClose={toggleWorkerDropdown}
                            modalStyle={{marginTop: '80%'}}>
                            <View style={styles.Id1modalContent}>
                              <FlatList
                                data={Object.keys(workers).map(key => ({
                                  id: key,
                                  label: workers[key],
                                }))}
                                renderItem={workerType}
                                keyExtractor={item => item.id.toString()}
                              />
                            </View>
                          </CustomModal>
                        </View>
                      </View>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>Note</Text>
                        <TextInput
                          style={styles.noteTexInput}
                          multiline={true}
                          numberOfLines={4}
                          placeholder="Enter your note here..."
                          value={noteStundenarbeit[index]}
                          onChangeText={text =>
                            handleNoteStundenarbeit(text, index)
                          }
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            bottom: Matrics.ms(1),
                            width: '30%',
                            borderRightWidth: 1,
                            borderLeftWidth: 1,
                            borderColor: '#B3B3B3',
                          }}>
                          <Text
                            style={{
                              left: Matrics.ms(16),
                              marginTop: Matrics.ms(10),
                              color: '#555555',
                              fontFamily:
                                typography.fontFamily.Montserrat.Medium,
                              fontSize: typography.fontSizes.fs10,
                            }}>
                            Break
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            borderColor: '#B3B3B3',
                          }}>
                          {renderTimeBlocks()}
                          <View
                            style={{
                              flexDirection: 'row',
                              bottom: Matrics.ms(1),
                            }}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}>
                              <Image
                                style={{
                                  height: Matrics.ms(16),
                                  width: Matrics.ms(16),
                                  top: Matrics.ms(10),
                                }}
                                source={Images.ADDCREATE}></Image>
                              <TouchableOpacity onPress={handleAdd}>
                                <Text
                                  style={{
                                    marginTop: Matrics.ms(12),
                                    marginBottom: Matrics.ms(9),
                                    marginLeft: 10,
                                    fontFamily:
                                      typography.fontFamily.Montserrat.Medium,
                                    fontSize: typography.fontSizes.fs9,
                                  }}>
                                  Add
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                <Text style={styles.attachmentText}>Attachments</Text>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity
                    onPress={handleUploadImage}
                    style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <View>
                      <Image
                        style={styles.uploadIcon}
                        source={Images.UPLOAD}></Image>
                      <Text style={styles.uploadFileText}>Upload file...</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{marginHorizontal: 14}}
                  horizontal
                  data={files}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: Matrics.ms(15),
          backgroundColor: '#EBF0FA',
        }}>
        <TouchableOpacity
          onPress={navigateToCreateDailyList}
          style={styles.buttonStyle}
          activeOpacity={0.5}>
          <Text style={styles.buttonTextStyle}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.buttonStyle2}
          activeOpacity={0.5}>
          <Text style={styles.buttonTextStyle}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isCustomerDropdownVisible}
        onRequestClose={toggleCustomerDropdown}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={Object.keys(ServicesList).map(key => ({
                id: key,
                label: ServicesList[key],
              }))}
              renderItem={renderDropdownItem}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={isWorkDropdownVisible}
        onRequestClose={toggleWorkTypeDropdown}>
        <View style={styles.workTypemodalContainer}>
          <View style={styles.workTypemodalContent}>
            <FlatList
              data={Object.keys(WorkType).map(key => ({
                id: key,
                label: WorkType[key],
              }))}
              renderItem={renderWork}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isGoodTypeDropdownVisible}
        onRequestClose={toggleGoodTypeDropdown}>
        <View style={styles.goodTypemodalContainer}>
          <View style={styles.goodTypemodalContent}>
            <FlatList
              data={Object.keys(GoodType).map(key => ({
                id: key,
                label: GoodType[key],
              }))}
              renderItem={renderGoodType}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* //================== worker modal====================== */}
      {/* <Modal
        transparent={true}
        visible={isWorkerDropdownVisible}
        onRequestClose={toggleWorkerDropdown}>
        <View style={[styles.modalContainer1 , {marginTop:"10%"}]}>
          <View style={styles.modalContent1}>
            <FlatList
              data={Object.keys(workers).map(key => ({
                id: key,
                label: workers[key],
              }))}
              renderItem={workerType}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal> */}

      {/* //================== Container Size modal====================== */}
      <Modal
        transparent={true}
        visible={isConatinerSizesDropdownVisible}
        onRequestClose={toggleGoodTypeDropdown}>
        <View style={styles.ContainerSizemodalContainer}>
          <View style={styles.ContainerSizeModalContent}>
            <FlatList
              data={Object.keys(containerSize).map(key => ({
                id: key,
                label: containerSize[key],
              }))}
              renderItem={renderContainerSize}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* //================== Set types modal====================== */}
      <Modal
        transparent={true}
        visible={isSetTypesModalVisible}
        onRequestClose={toggleSetTypesModal}>
        <View style={styles.SetTypesmodalContainer}>
          <View style={styles.SetTypesModalContent}>
            <FlatList
              data={Object.keys(setTypes).map(key => ({
                id: key,
                label: setTypes[key],
              }))}
              renderItem={renderSetTypes}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </Modal>
      {/* //================== Foil  modal====================== */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              scrollEnabled={false}
              data={[1, 2]}
              keyExtractor={item => item.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleOptionSelect(item)}
                  style={{borderBottomWidth: 1, borderBottomColor: '#B3B3B3'}}>
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={ImageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.ImagemodalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}>
            <Image
              source={Images.CLOSE}
              style={{width: 30, height: 30, marginTop: 30}}
            />
          </TouchableOpacity>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            source={{uri: selectedImage}}
          />
        </View>
      </Modal>
      <DatePicker
        modal
        mode="time"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <DatePicker
        modal
        mode="time"
        open={stundopen}
        date={timestund}
        onConfirm={date => {
          handleTimePickerConfirm(date);
          setTimestund(date);
        }}
        onCancel={() => {
          setStundOpen(false);
          setSelectedStartTimeIndex(null);
        }}
      />
      <DatePicker
        modal
        mode="time"
        open={stundopen1}
        date={endtime}
        onConfirm={date => {
          handleTimePickerConfirm(date);
          setEndtime(date);
        }}
        onCancel={() => {
          setStundOpen1(false);
          setSelectedEndTimeIndex(null);
        }}
      />

      <DatePicker
        modal
        mode="time"
        open={open1}
        date={date1}
        onConfirm={date => {
          setOpen1(false);
          setDate1(date);
        }}
        onCancel={() => {
          setOpen1(false);
        }}
      />
    </View>
  );
};

export default CreateDailyList;

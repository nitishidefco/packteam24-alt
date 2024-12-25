import {useDispatch, useSelector} from 'react-redux';
import {
  deleteDailyItem,
  getDailyList,
  getCustomers,
  getLocations,
  getSaveData,
  getServicesData,
  getConatinerServiceTypeData,
  getGoodTypeData,
  getContainerSizesData,
  getCreate1Data,
  getCreate2Data,
  getCreate3Data,
  getCreate4Data,
  getCreate5Data,
  getCreate6Data,
  getWorkerData,
  getSetTypesData,
  getSettingInfoData,
  getSettingInfoDeleteData,
  getPdfData,
  editSaveData,
  finishedData,
  uploadData,
  uploadRemoveData,
  filesData,
  edit1SaveData
} from '../Reducers/DailyListSlice';

export const useDailyListActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const dailyListCall = params => {
    console.log('params', params);
    dispatch(getDailyList(params));
  };

  const deleteItem = params => {
    dispatch(deleteDailyItem(params));
  };
  const customersCall = params => {
    dispatch(getCustomers(params));
  };
  const locationsCall = params => {
    dispatch(getLocations(params));
  };
  const saveCall = params => {
    dispatch(getSaveData(params));
  };

  const ServicesCall = params => {
    dispatch(getServicesData(params));
  };

  const ContainerServiceTypeCall = params => {
    dispatch(getConatinerServiceTypeData(params));
  };

  const GoodTypesCall = params => {
    dispatch(getGoodTypeData(params));
  };

  const ConatinerSizesCall = params => {
    console.log(params, '=======pappapapa=======');
    dispatch(getContainerSizesData(params));
  };

  const WorkersCall = params => {
    console.log(params, '=======pappapapa=======');
    dispatch(getWorkerData(params));
  };

  //======================= CREATE DATA APIS ===========================

  const Create1call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate1Data(params));
  };
  //======================= CREATE 2 DATA APIS ===========================

  const Create2call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate2Data(params));
  };
  //======================= CREATE 3 DATA APIS ===========================

  const Create3call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate3Data(params));
  };

  //======================= CREATE 4 DATA APIS ===========================

  const Create4call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate4Data(params));
  };

  //======================= CREATE 5 DATA APIS ===========================

  const Create5call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate5Data(params));
  };

  //======================= CREATE 6 DATA APIS ===========================

  const Create6call = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getCreate6Data(params));
  };
  //======================= SET TYPES ID 2 DATA APIS ===========================

  const setTypesCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getSetTypesData(params));
  };

  //======================= SETTING INFO DATA APIS ===========================

  const settingInfoCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getSettingInfoData(params));
  };

  //======================= SETTING INFO DELETE DATA APIS ===========================

  const settingInfoDeleteCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getSettingInfoDeleteData(params));
  };
  //======================= PDF DATA APIS ===========================

  const pdfCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(getPdfData(params));
  };

  //======================= EDIT SAVE APIS ===========================

  const editSaveCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(editSaveData(params));
  };
  //======================= FINISHED APIS ===========================

  const finishedCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(finishedData(params));
  };

  //======================= UPLOAD APIS ===========================

  const uploadCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(uploadData(params));
  };

  //======================= UPLOAD REMOVE APIS ===========================

  const uploadRemoveCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(uploadRemoveData(params));
  };

  //======================= FILES APIS ===========================

  const filesCall = params => {
    // console.log(params, '=======pappapapa=======');
    dispatch(filesData(params));
  };


    //======================= FILES APIS ===========================

    const edit1SaveCall = params => {
      // console.log(params, '=======pappapapa=======');
      dispatch(edit1SaveData(params));
    };
  
  return {
    state,
    filesCall,
    dailyListCall,
    deleteItem,
    customersCall,
    locationsCall,
    saveCall,
    ServicesCall,
    ContainerServiceTypeCall,
    GoodTypesCall,
    ConatinerSizesCall,
    Create1call,
    Create2call,
    Create3call,
    Create4call,
    Create5call,
    Create6call,
    WorkersCall,
    setTypesCall,
    settingInfoCall,
    settingInfoDeleteCall,
    pdfCall,
    editSaveCall,
    finishedCall,
    uploadCall,
    uploadRemoveCall,
    edit1SaveCall
  };
};

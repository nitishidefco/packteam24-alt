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
  edit1SaveData,
} from '../Reducers/DailyListSlice';

export const useDailyListActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const dailyListCall = params => {
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
    dispatch(getContainerSizesData(params));
  };

  const WorkersCall = params => {
    dispatch(getWorkerData(params));
  };

  //======================= CREATE DATA APIS ===========================

  const Create1call = params => {
    //
    dispatch(getCreate1Data(params));
  };
  //======================= CREATE 2 DATA APIS ===========================

  const Create2call = params => {
    //
    dispatch(getCreate2Data(params));
  };
  //======================= CREATE 3 DATA APIS ===========================

  const Create3call = params => {
    //
    dispatch(getCreate3Data(params));
  };

  //======================= CREATE 4 DATA APIS ===========================

  const Create4call = params => {
    //
    dispatch(getCreate4Data(params));
  };

  //======================= CREATE 5 DATA APIS ===========================

  const Create5call = params => {
    //
    dispatch(getCreate5Data(params));
  };

  //======================= CREATE 6 DATA APIS ===========================

  const Create6call = params => {
    //
    dispatch(getCreate6Data(params));
  };
  //======================= SET TYPES ID 2 DATA APIS ===========================

  const setTypesCall = params => {
    //
    dispatch(getSetTypesData(params));
  };

  //======================= SETTING INFO DATA APIS ===========================

  const settingInfoCall = params => {
    //
    dispatch(getSettingInfoData(params));
  };

  //======================= SETTING INFO DELETE DATA APIS ===========================

  const settingInfoDeleteCall = params => {
    //
    dispatch(getSettingInfoDeleteData(params));
  };
  //======================= PDF DATA APIS ===========================

  const pdfCall = params => {
    //
    dispatch(getPdfData(params));
  };

  //======================= EDIT SAVE APIS ===========================

  const editSaveCall = params => {
    //
    dispatch(editSaveData(params));
  };
  //======================= FINISHED APIS ===========================

  const finishedCall = params => {
    //
    dispatch(finishedData(params));
  };

  //======================= UPLOAD APIS ===========================

  const uploadCall = params => {
    //
    dispatch(uploadData(params));
  };

  //======================= UPLOAD REMOVE APIS ===========================

  const uploadRemoveCall = params => {
    //
    dispatch(uploadRemoveData(params));
  };

  //======================= FILES APIS ===========================

  const filesCall = params => {
    //
    dispatch(filesData(params));
  };

  //======================= FILES APIS ===========================

  const edit1SaveCall = params => {
    //
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
    edit1SaveCall,
  };
};

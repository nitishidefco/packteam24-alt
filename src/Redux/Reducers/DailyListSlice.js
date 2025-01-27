import {createSlice} from '@reduxjs/toolkit';
import {DAILYLIST_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

export const DailyListSlice = createSlice({
  name: DAILYLIST_REDUCER,
  initialState: [],
  reducers: {
    getDailyList: state => {
      return {...state, isDailyListSuccess: NULL, error: null, message: ''};
    },
    DailyListSuccess: (state, action) => {
      return {
        ...state,
        isDailyListSuccess: SUCCESS,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    DailyListFailure: (state, action) => {
      return {
        ...state,
        isDailyListSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    deleteDailyItem: state => {
      return {
        ...state,
        isDailyListDeleteSuccess: NULL,
        error: null,
        message: '',
      };
    },
    deleteDailyListSuccess: (state, action) => {
      return {
        ...state,
        isDailyListDeleteSuccess: SUCCESS,
        message: 'Item deleted successfully',
        data: action.payload,
      };
    },

    deleteDailyListFailure: (state, action) => {
      return {
        ...state,
        isDailyListDeleteSuccess: FAIL,
        error: action.payload,
        message: 'Failed to delete item',
        data: action.payload,
      };
    },

    getCustomers: state => {
      return {
        ...state,
        isCustomerSuccess: NULL,
        error: null,
        message: '',
      };
    },
    customersSuccess: (state, action) => {
      return {
        ...state,
        isCustomerSuccess: SUCCESS,
        message: 'Fetch successfully',
        Customerdata: action.payload,
      };
    },
    customerFailure: (state, action) => {
      return {
        ...state,
        isCustomerSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getLocations: state => {
      return {
        ...state,
        isLocationSuccess: NULL,
        error: null,
        message: '',
      };
    },
    locationsSuccess: (state, action) => {
      return {
        ...state,
        isLocationSuccess: SUCCESS,
        message: 'Fetch successfully',
        LocationsData: action.payload,
      };
    },
    locationsFailure: (state, action) => {
      return {
        ...state,
        isLocationSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getSaveData: state => {
      return {
        ...state,
        isSaveDataSuccess: NULL,
        error: null,
        message: '',
      };
    },
    saveDataSuccess: (state, action) => {
      return {
        ...state,
        isSaveDataSuccess: SUCCESS,
        message: 'Fetch successfully',
        saveData: action.payload,
      };
    },
    saveDataFailure: (state, action) => {
      return {
        ...state,
        isSaveDataSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getServicesData: state => {
      return {
        ...state,
        isServicesSuccess: NULL,
        error: null,
        message: '',
      };
    },
    servicesSuccess: (state, action) => {
      return {
        ...state,
        isServicesSuccess: SUCCESS,
        message: 'Fetch successfully',
        ServicesData: action.payload,
      };
    },
    servicesFailure: (state, action) => {
      return {
        ...state,
        isServicesSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getConatinerServiceTypeData: state => {
      return {
        ...state,
        isContainerWorkServicesSuccess: NULL,
        error: null,
        message: '',
      };
    },
    conatinerServiceTypeSuccess: (state, action) => {
      return {
        ...state,
        isContainerWorkServicesSuccess: SUCCESS,
        message: 'Fetch successfully',
        ContainerServicesTypeData: action.payload,
      };
    },
    conatinerServiceTypeFailure: (state, action) => {
      return {
        ...state,
        isContainerWorkServicesSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getGoodTypeData: state => {
      return {
        ...state,
        isGoodTypeSuccess: NULL,
        error: null,
        message: '',
      };
    },
    goodTypeSuccess: (state, action) => {
      return {
        ...state,
        isGoodTypeSuccess: SUCCESS,
        message: 'Fetch successfully',
        goodTypeData: action.payload,
      };
    },
    goodTypeFailure: (state, action) => {
      return {
        ...state,
        isGoodTypeSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getContainerSizesData: state => {
      return {
        ...state,
        iscontainerSizesSuccess: NULL,
        error: null,
        message: '',
      };
    },
    containerSizesSuccess: (state, action) => {
      return {
        ...state,
        iscontainerSizesSuccess: SUCCESS,
        message: 'Fetch successfully',
        containerSizesData: action.payload,
      };
    },
    containerSizesFailure: (state, action) => {
      return {
        ...state,
        iscontainerSizesSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== CREATE 1 REDUCER ============================
    getCreate1Data: state => {
      return {
        ...state,
        isCreate1Success: NULL,
        error: null,
        message: '',
      };
    },
    create1Success: (state, action) => {
      return {
        ...state,
        isCreate1Success: SUCCESS,
        message: 'Fetch successfully',
        create1Data: action.payload,
      };
    },
    create1Failure: (state, action) => {
      return {
        ...state,
        isCreate1sSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== CREATE 2 REDUCER ============================
    getCreate2Data: state => {
      return {
        ...state,
        isCreate2Success: NULL,
        error: null,
        message: '',
      };
    },
    create2Success: (state, action) => {
      return {
        ...state,
        isCreate2Success: SUCCESS,
        message: 'Fetch successfully',
        create2Data: action.payload,
      };
    },
    create2Failure: (state, action) => {
      return {
        ...state,
        isCreate2Success: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== CREATE 3 REDUCER ============================
    getCreate3Data: state => {
      return {
        ...state,
        isCreate3Success: NULL,
        error: null,
        message: '',
      };
    },
    create3Success: (state, action) => {
      return {
        ...state,
        isCreate3Success: SUCCESS,
        message: 'Fetch successfully',
        create3Data: action.payload,
      };
    },
    create3Failure: (state, action) => {
      return {
        ...state,
        isCreate3Success: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== CREATE 4 REDUCER ============================
    getCreate4Data: state => {
      return {
        ...state,
        isCreate4Success: NULL,
        error: null,
        message: '',
      };
    },
    create4Success: (state, action) => {
      return {
        ...state,
        isCreate4Success: SUCCESS,
        message: 'Fetch successfully',
        create4Data: action.payload,
      };
    },
    create4Failure: (state, action) => {
      return {
        ...state,
        isCreate4Success: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== CREATE 5 REDUCER ============================
    getCreate5Data: state => {
      return {
        ...state,
        isCreate5Success: NULL,
        error: null,
        message: '',
      };
    },
    create5Success: (state, action) => {
      return {
        ...state,
        isCreate5Success: SUCCESS,
        message: 'Fetch successfully',
        create5Data: action.payload,
      };
    },
    create5Failure: (state, action) => {
      return {
        ...state,
        isCreate5Success: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== CREATE 6 REDUCER ============================
    getCreate6Data: state => {
      return {
        ...state,
        isCreate6Success: NULL,
        error: null,
        message: '',
      };
    },
    create6Success: (state, action) => {
      return {
        ...state,
        isCreate6Success: SUCCESS,
        message: 'Fetch successfully',
        create6Data: action.payload,
      };
    },
    create6Failure: (state, action) => {
      return {
        ...state,
        isCreate6Success: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== WORKER REDUCER ============================

    getWorkerData: state => {
      return {
        ...state,
        isWorkerSuccess: NULL,
        error: null,
        message: '',
      };
    },
    WorkerSuccess: (state, action) => {
      return {
        ...state,
        isWorkerSuccess: SUCCESS,
        message: 'Fetch successfully',
        workersData: action.payload,
      };
    },
    WorkerFailure: (state, action) => {
      return {
        ...state,
        isWorkerSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== SET TYPES ID 2 REDUCER ============================

    getSetTypesData: state => {
      return {
        ...state,
        isSetTypesSuccess: NULL,
        error: null,
        message: '',
      };
    },
    SetTypesSuccess: (state, action) => {
      return {
        ...state,
        isSetTypesSuccess: SUCCESS,
        message: 'Fetch successfully',
        SetTypesData: action.payload,
      };
    },
    SetTypesFailure: (state, action) => {
      return {
        ...state,
        isSetTypesSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== SETTING INFO REDUCER ============================

    getSettingInfoData: state => {
      return {
        ...state,
        isSettingInfoSuccess: NULL,
        error: null,
        message: '',
      };
    },
    settingInfoSuccess: (state, action) => {
      return {
        ...state,
        isSettingInfoSuccess: SUCCESS,
        message: 'Fetch successfully',
        SettingInfoData: action.payload,
      };
    },
    settingInfoFailure: (state, action) => {
      return {
        ...state,
        isSettingInfoSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== SETTING INFO DELETE REDUCER ============================

    getSettingInfoDeleteData: state => {
      return {
        ...state,
        isSettingInfoDeleteSuccess: NULL,
        error: null,
        message: '',
      };
    },
    settingInfoDeleteSuccess: (state, action) => {
      return {
        ...state,
        isSettingInfoDeleteSuccess: SUCCESS,
        message: 'Fetch successfully',
        SettingInfoDeleteData: action.payload,
      };
    },
    settingInfoDeleteFailure: (state, action) => {
      return {
        ...state,
        isSettingInfoDeleteSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== PDF REDUCER ============================

    getPdfData: state => {
      return {
        ...state,
        isPdfSuccess: NULL,
        error: null,
        message: '',
      };
    },
    pdfSuccess: (state, action) => {
      return {
        ...state,
        isPdfSuccess: SUCCESS,
        message: 'Fetch successfully',
        pdfData: action.payload,
      };
    },
    pdfFailure: (state, action) => {
      return {
        ...state,
        isPdfSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== EDIT SAVE REDUCER ============================

    editSaveData: state => {
      return {
        ...state,
        iseditSaveSuccess: NULL,
        error: null,
        message: '',
      };
    },
    editSaveSuccess: (state, action) => {
      return {
        ...state,
        iseditSaveSuccess: SUCCESS,
        message: 'Fetch successfully',
        editSaveData: action.payload,
      };
    },
    editSaveFailure: (state, action) => {
      return {
        ...state,
        iseditSaveSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== FINISHED LIST REDUCER ============================

    finishedData: state => {
      return {
        ...state,
        iseditSaveSuccess: NULL,
        error: null,
        message: '',
      };
    },
    finishedSuccess: (state, action) => {
      return {
        ...state,
        isfinishedSuccess: SUCCESS,
        message: 'Fetch successfully',
        finishedData: action.payload,
      };
    },
    finishedFailure: (state, action) => {
      return {
        ...state,
        isfinishedSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    //============================== UPLOAD IMAGES REDUCER ============================

    uploadData: state => {
      return {
        ...state,
        isUploadSuccess: NULL,
        error: null,
        message: '',
      };
    },
    uploadSuccess: (state, action) => {
      return {
        ...state,
        isUploadSuccess: SUCCESS,
        message: 'Fetch successfully',
        uploadData: action.payload,
      };
    },
    uploadFailure: (state, action) => {
      return {
        ...state,
        isUploadSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== UPLOAD REMOVE IMAGES REDUCER ============================

    uploadRemoveData: state => {
      return {
        ...state,
        isUploadRemoveSuccess: NULL,
        error: null,
        message: '',
      };
    },
    uploadRemoveSuccess: (state, action) => {
      return {
        ...state,
        isUploadRemoveSuccess: SUCCESS,
        message: 'Fetch successfully',
        uploadRemoveData: action.payload,
      };
    },
    uploadRemoveFailure: (state, action) => {
      return {
        ...state,
        isUploadRemoveSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== FILES REDUCER ============================

    filesData: state => {
      return {
        ...state,
        isFilesDataSuccess: NULL,
        error: null,
        message: '',
      };
    },
    filesDataSuccess: (state, action) => {
      return {
        ...state,
        isFilesDataSuccess: SUCCESS,
        message: 'Fetch successfully',
        filesData: action.payload,
      };
    },
    filesDataFailure: (state, action) => {
      return {
        ...state,
        isFilesDataSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    //============================== EDIT1 SAVE REDUCER ============================

    edit1SaveData: state => {
      return {
        ...state,
        isedit1SaveSuccess: NULL,
        error: null,
        message: '',
      };
    },
    edit1SaveSuccess: (state, action) => {
      return {
        ...state,
        isedit1SaveSuccess: SUCCESS,
        message: 'Fetch successfully',
        edit1SaveData: action.payload,
      };
    },
    edit1SaveFailure: (state, action) => {
      return {
        ...state,
        isedit1SaveSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
  },
});

export const {
  getDailyList,
  DailyListFailure,
  DailyListSuccess,
  deleteDailyItem,
  deleteDailyListSuccess,
  deleteDailyListFailure,
  getCustomers,
  customersSuccess,
  customerFailure,
  locationsFailure,
  locationsSuccess,
  getLocations,
  getSaveData,
  saveDataSuccess,
  saveDataFailure,
  getServicesData,
  servicesFailure,
  servicesSuccess,
  getConatinerServiceTypeData,
  conatinerServiceTypeFailure,
  conatinerServiceTypeSuccess,
  getGoodTypeData,
  goodTypeFailure,
  goodTypeSuccess,
  getContainerSizesData,
  containerSizesFailure,
  containerSizesSuccess,
  create1Failure,
  getCreate1Data,
  create1Success,
  getWorkerData,
  WorkerSuccess,
  WorkerFailure,
  getSetTypesData,
  SetTypesSuccess,
  SetTypesFailure,
  getSettingInfoData,
  settingInfoSuccess,
  settingInfoFailure,
  getCreate2Data,
  create2Failure,
  create2Success,
  getCreate3Data,
  create3Success,
  create3Failure,
  getCreate4Data,
  create4Failure,
  create4Success,
  getCreate5Data,
  create5Failure,
  create5Success,
  getCreate6Data,
  create6Failure,
  create6Success,
  getSettingInfoDeleteData,
  settingInfoDeleteFailure,
  settingInfoDeleteSuccess,
  getPdfData,
  pdfFailure,
  pdfSuccess,
  editSaveData,
  editSaveFailure,
  editSaveSuccess,
  finishedData,
  finishedFailure,
  finishedSuccess,
  uploadData,
  uploadFailure,
  uploadSuccess,
  uploadRemoveData,
  uploadRemoveFailure,
  uploadRemoveSuccess,
  filesData,
  filesDataFailure,
  filesDataSuccess,
  edit1SaveData,
  edit1SaveFailure,
  edit1SaveSuccess,
} = DailyListSlice.actions;
const DailyListReducer = DailyListSlice.reducer;
export default DailyListReducer;

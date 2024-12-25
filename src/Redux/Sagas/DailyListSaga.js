import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import API from '../Services/DailyListServices';
import {DAILYLIST_REDUCER} from '../SliceKey';
import {
  DailyListFailure,
  DailyListSuccess,
  SetTypesFailure,
  SetTypesSuccess,
  WorkerFailure,
  WorkerSuccess,
  conatinerServiceTypeFailure,
  conatinerServiceTypeSuccess,
  containerSizesFailure,
  containerSizesSuccess,
  create1Failure,
  create1Success,
  create2Failure,
  create2Success,
  create3Failure,
  create3Success,
  create4Failure,
  create4Success,
  create5Failure,
  create5Success,
  create6Failure,
  create6Success,
  customerFailure,
  customersSuccess,
  deleteDailyListFailure,
  deleteDailyListSuccess,
  goodTypeFailure,
  goodTypeSuccess,
  locationsFailure,
  locationsSuccess,
  saveDataFailure,
  saveDataSuccess,
  servicesFailure,
  servicesSuccess,
  settingInfoFailure,
  settingInfoSuccess,
  settingInfoDeleteFailure,
  settingInfoDeleteSuccess,
  pdfFailure,
  pdfSuccess,
  editSaveFailure,
  editSaveSuccess,
  finishedFailure,
  finishedSuccess,
  uploadSuccess,
  uploadFailure,
  uploadRemoveSuccess,
  uploadRemoveFailure,
  filesDataSuccess,
  filesDataFailure,
  edit1SaveSuccess,
  edit1SaveFailure,
} from '../Reducers/DailyListSlice';

const dailyListsaga = function* dailyListSaga({payload}) {
  try {
    const response = yield call(API.DailyList, payload);
    if (response?.message === 'OK') {
      yield put(DailyListSuccess(response));
    } else {
      yield put(DailyListFailure(response));
    }
  } catch (error) {
    yield put(DailyListFailure(error));
  }
};

const deleteDailyListItemSaga = function* deleteDailyListItemSaga({payload}) {
  // console.log('payloadpayload==============================.', payload);
  try {
    const response = yield call(API.deleteDailyListItem, payload);
    if (response?.message === 'OK') {
      yield put(deleteDailyListSuccess(response));
    } else {
      yield put(deleteDailyListFailure(response));
    }
  } catch (error) {
    yield put(deleteDailyListFailure(error));
  }
};
const customersaga = function* customersaga({payload}) {
  try {
    const response = yield call(API.Customers, payload);
    if (response?.message === 'OK') {
      yield put(customersSuccess(response));
    } else {
      yield put(customerFailure(response));
    }
  } catch (error) {
    yield put(customerFailure(error));
  }
};

const locationssaga = function* locationssaga({payload}) {
  try {
    const response = yield call(API.Locations, payload);
    if (response?.message === 'OK') {
      yield put(locationsSuccess(response));
    } else {
      yield put(locationsFailure(response));
    }
  } catch (error) {
    yield put(locationsFailure(error));
  }
};

const saveDatasaga = function* saveDatasaga({payload}) {
  try {
    const response = yield call(API.SaveData, payload);
    if (response?.message === 'Daten wurden gespeichert') {
      yield put(saveDataSuccess(response));
    } else {
      yield put(saveDataFailure(response));
    }
  } catch (error) {
    yield put(saveDataFailure(error));
  }
};

const servicesDatasaga = function* servicesDatasaga({payload}) {
  // console.log(payload.response,"savariiiiiiiiiiii nikalii saga");
  try {
    const response = yield call(API.Services, payload);
    if (response?.message === 'OK') {
      yield put(servicesSuccess(response));
    } else {
      yield put(servicesFailure(response));
    }
  } catch (error) {
    yield put(servicesFailure(error));
  }
};

const containerServicesTypesaga = function* containerServicesTypesaga({
  payload,
}) {
  // console.log(payload.response,"savariiiiiiiiiiii nikalii saga");
  try {
    const response = yield call(API.ContainerServiceType, payload);
    if (response?.message === 'OK') {
      yield put(conatinerServiceTypeSuccess(response));
    } else {
      yield put(conatinerServiceTypeFailure(response));
    }
  } catch (error) {
    yield put(conatinerServiceTypeFailure(error));
  }
};
const goodTypesaga = function* goodTypesaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.GoodType, payload);
    if (response?.message === 'OK') {
      yield put(goodTypeSuccess(response));
    } else {
      yield put(goodTypeFailure(response));
    }
  } catch (error) {
    yield put(goodTypeFailure(error));
  }
};

const containerSizesSaga = function* containerSizesSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.ContainerSize, payload);
    if (response?.message === 'OK') {
      yield put(containerSizesSuccess(response));
    } else {
      yield put(containerSizesFailure(response));
    }
  } catch (error) {
    yield put(containerSizesFailure(error));
  }
};

//============================== CREATE 1 SAGA ============================

const create1Saga = function* create1Saga({payload}) {
  // console.log(payload,"savariiiiiiiiiiii nikalii saga");
  try {
    const response = yield call(API.Create1, payload);
    if (response?.message === 'OK') {
      yield put(create1Success(response));
    } else {
      yield put(create1Failure(response));
    }
  } catch (error) {
    yield put(create1Failure(error));
  }
};
//============================== CREATE 2 SAGA ============================

const create2Saga = function* create2Saga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.Create2, payload);
    if (response?.message === 'OK') {
      yield put(create2Success(response));
    } else {
      yield put(create2Failure(response));
    }
  } catch (error) {
    yield put(create2Failure(error));
  }
};
//============================== CREATE 3 SAGA ============================

const create3Saga = function* create3Saga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.Create3, payload);
    if (response?.message === 'OK') {
      yield put(create3Success(response));
    } else {
      yield put(create3Failure(response));
    }
  } catch (error) {
    yield put(create3Failure(error));
  }
};
//============================== CREATE 4 SAGA ============================

const create4Saga = function* create4Saga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.Create4, payload);
    if (response?.message === 'OK') {
      yield put(create4Success(response));
    } else {
      yield put(create4Failure(response));
    }
  } catch (error) {
    yield put(create4Failure(error));
  }
};
//============================== CREATE 5 SAGA ============================

const create5Saga = function* create5Saga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.Create5, payload);
    if (response?.message === 'OK') {
      yield put(create5Success(response));
    } else {
      yield put(create5Failure(response));
    }
  } catch (error) {
    yield put(create5Failure(error));
  }
};
//============================== CREATE 6 SAGA ============================

const create6Saga = function* create6Saga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.Create6, payload);
    if (response?.message === 'OK') {
      yield put(create6Success(response));
    } else {
      yield put(create6Failure(response));
    }
  } catch (error) {
    yield put(create6Failure(error));
  }
};

//============================== Worker SAGA ============================

const WorkerSaga = function* WorkerSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.workers, payload);
    if (response?.message === 'OK') {
      yield put(WorkerSuccess(response));
    } else {
      yield put(WorkerFailure(response));
    }
  } catch (error) {
    yield put(WorkerFailure(error));
  }
};

//============================== SET TYPES ID 2 SAGA ============================

const SetTypesSaga = function* SetTypesSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.setTypes, payload);
    if (response?.message === 'OK') {
      yield put(SetTypesSuccess(response));
    } else {
      yield put(SetTypesFailure(response));
    }
  } catch (error) {
    yield put(SetTypesFailure(error));
  }
};

//============================== SETTING INFO SAGA ============================

const SettingInfoSaga = function* SettingInfoSaga({payload}) {
  // console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.settingInfoTypes, payload);
    if (response?.message === 'OK') {
      yield put(settingInfoSuccess(response));
    } else {
      yield put(settingInfoFailure(response));
    }
  } catch (error) {
    yield put(settingInfoFailure(error));
  }
};
//============================== SETTING INFO DELETE SAGA ============================

const SettingInfoDeleteSaga = function* SettingInfoDeleteSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.settingInfoDeleteTypes, payload);
    if (response?.message === 'OK') {
      yield put(settingInfoDeleteSuccess(response));
    } else {
      yield put(settingInfoDeleteFailure(response));
    }
  } catch (error) {
    yield put(settingInfoDeleteFailure(error));
  }
};

//============================== PDF SAGA ============================

const pdfSaga = function* pdfSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.pdf, payload);
    if (response?.message === 'OK') {
      yield put(pdfSuccess(response));
    } else {
      yield put(pdfFailure(response));
    }
  } catch (error) {
    yield put(pdfFailure(error));
  }
};

//============================== EDIT SAVE SAGA ============================

const editSaveSaga = function* editSaveSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.editSave, payload);
    if (response?.message === 'OK') {
      yield put(editSaveSuccess(response));
    } else {
      yield put(editSaveFailure(response));
    }
  } catch (error) {
    yield put(editSaveFailure(error));
  }
};
//============================== FINISHED LIST SAVE SAGA ============================

const finishedSaga = function* finishedSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.finished, payload);
    if (response?.message === 'OK') {
      yield put(finishedSuccess(response));
    } else {
      yield put(finishedFailure(response));
    }
  } catch (error) {
    yield put(finishedFailure(error));
  }
};

//============================== UPLOAD IMAGES  SAGA ============================

const uploadSaga = function* uploadSaga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga upload');
  try {
    const response = yield call(API.upload, payload);
    if (response?.message === 'OK') {
      yield put(uploadSuccess(response));
    } else {
      yield put(uploadFailure(response));
    }
  } catch (error) {
    yield put(uploadFailure(error));
  }
};

//============================== UPLOAD REMOVE IMAGES  SAGA ============================

const uploadRemoveSaga = function* uploadRemoveSaga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga uploadRemove');
  try {
    const response = yield call(API.uploadRemove, payload);
    if (response?.message === 'OK') {
      yield put(uploadRemoveSuccess(response));
    } else {
      yield put(uploadRemoveFailure(response));
    }
  } catch (error) {
    yield put(uploadRemoveFailure(error));
  }
};

//============================== FILES SAGA ============================

const fileSaga = function* fileSaga({payload}) {
  console.log(payload, 'savariiiiiiiiiiii nikalii saga uploadRemove');
  try {
    const response = yield call(API.file, payload);
    if (response?.message === 'OK') {
      yield put(filesDataSuccess(response));
    } else {
      yield put(filesDataFailure(response));
    }
  } catch (error) {
    yield put(filesDataFailure(error));
  }
};
//============================== EDIT1 SAVE SAGA ============================

const edit1SaveSaga = function* edit1SaveSaga({payload}) {
  console.log(payload.response, 'savariiiiiiiiiiii nikalii saga');
  try {
    const response = yield call(API.edit1Save, payload);
    if (response?.message === 'Daten wurden gespeichert') {
      yield put(edit1SaveSuccess(response));
    } else {
      yield put(edit1SaveFailure(response));
    }
  } catch (error) {
    yield put(edit1SaveFailure(error));
  }
};

function* dailyListSaga() {
  yield all([
    yield takeEvery(`${DAILYLIST_REDUCER}/getDailyList`, dailyListsaga),
  ]);
  yield takeEvery(
    `${DAILYLIST_REDUCER}/deleteDailyItem`,
    deleteDailyListItemSaga,
  );
  yield takeEvery(`${DAILYLIST_REDUCER}/getCustomers`, customersaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getLocations`, locationssaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getSaveData`, saveDatasaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getServicesData`, servicesDatasaga);
  yield takeEvery(
    `${DAILYLIST_REDUCER}/getConatinerServiceTypeData`,
    containerServicesTypesaga,
  );
  yield takeEvery(`${DAILYLIST_REDUCER}/getGoodTypeData`, goodTypesaga);
  yield takeEvery(
    `${DAILYLIST_REDUCER}/getContainerSizesData`,
    containerSizesSaga,
  );
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate1Data`, create1Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate2Data`, create2Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate3Data`, create3Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate4Data`, create4Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate5Data`, create5Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getCreate6Data`, create6Saga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getWorkerData`, WorkerSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getSetTypesData`, SetTypesSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/getSettingInfoData`, SettingInfoSaga);
  yield takeEvery(
    `${DAILYLIST_REDUCER}/getSettingInfoDeleteData`,
    SettingInfoDeleteSaga,
  );
  yield takeEvery(`${DAILYLIST_REDUCER}/getPdfData`, pdfSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/editSaveData`, editSaveSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/finishedData`, finishedSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/uploadData`, uploadSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/uploadRemoveData`, uploadRemoveSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/filesData`, fileSaga);
  yield takeEvery(`${DAILYLIST_REDUCER}/edit1SaveData`, edit1SaveSaga);
}

export default dailyListSaga;

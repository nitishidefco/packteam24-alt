import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import API from '../Services/ScanServices';
import {
  fetchNfcTags,
  FetchFailure,
  FetchSuccess,
} from '../Reducers/NFCTagsSlice';
import {GET_NFC_TAGS_FROM_SERVER_REDUCER} from '../SliceKey';
import {reduxStorage} from '../Storage';

const fetchNfcTagSaga = function* fetchNfcTagSaga({payload}) {
  try {
    const response = yield call(API.AllNFCTags, payload);
    if (response) {
      yield put(FetchSuccess(response));
      reduxStorage.setItem('nfcTags', JSON.stringify(response));
    } else if (response?.errors) {
      console.log('Fetch nfc tag response error', response);
      yield put(FetchFailure(response?.errors));
    }
  } catch (error) {
    console.error('Fetch Nfc Tag error', error);
  }
};

function* fetchNfcTagFromServerSaga() {
  yield all([
    yield takeEvery(
      `${GET_NFC_TAGS_FROM_SERVER_REDUCER}/fetchNfcTags`,
      fetchNfcTagSaga,
    ),
  ]);
}

export default fetchNfcTagFromServerSaga;

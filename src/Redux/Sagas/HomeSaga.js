import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import API from '../Services/HomeServices';
import {HOME_REDUCER} from '../SliceKey';
import {HomeFailure, HomeSuccess} from '../Reducers/HomeSlice';

const homesaga = function* homesaga({payload}) {
  //
  try {
    const response = yield call(API.Home, payload);
    if (response?.message === 'OK') {
      yield put(HomeSuccess(response));
    } else {
      yield put(HomeFailure(response));
    }
  } catch (error) {
    yield put(HomeFailure(error));
  }
};

function* homeSaga() {
  yield all([yield takeEvery(`${HOME_REDUCER}/getHome`, homesaga)]);
}

export default homeSaga;

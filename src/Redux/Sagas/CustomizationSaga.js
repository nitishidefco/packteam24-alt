import {
  changeAppColor,
  changeAppColorFailure,
  changeAppColorSuccess,
} from '../Reducers/CustomizationSlice';
import CustomizationService from '../Services/CustomizationService';
import {CUSTOMIZATION_REDUCER} from '../SliceKey';
import {all, call, put, select, takeEvery} from 'redux-saga/effects';
function* fetchAppColorSaga({payload}) {
  try {
    const response = yield call(
      CustomizationService.GetCustomization,
      payload.payload,
    );
    if (response) {
      changeAppColorSuccess({
        customizationData: response?.data?.data,
      });
      return;
    } else if (response?.errors) {
      yield put(
        changeAppColorFailure({
          error: response?.errors,
        }),
      );
    }
  } catch (error) {
    console.error('Fetching customization error', error);
  }
}

export default function* customizationSaga() {
  yield all([
    takeEvery(`${CUSTOMIZATION_REDUCER}/changeAppColor`, fetchAppColorSaga),
  ]);
}

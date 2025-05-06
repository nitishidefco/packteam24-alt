import {
  changeAppColorFailure,
  changeAppColorSuccess,
} from '../Reducers/CustomizationSlice';
import CustomizationService from '../Services/CustomizationService';
import {CUSTOMIZATION_REDUCER} from '../SliceKey';
import {all, call, put, takeEvery} from 'redux-saga/effects';

function* fetchAppColorSaga() {
  try {
    const response = yield call(CustomizationService.GetCustomization);
    console.log('Response of Customization', response);

    if (response?.success && response?.app_name) {
      yield put(
        changeAppColorSuccess({
          app_name: response.app_name,
          app_logo: response.app_logo,
          app_main_color: response.app_main_color,
        }),
      );
    } else {
      yield put(
        changeAppColorFailure({
          error: response?.errors || ['Invalid or empty response'],
        }),
      );
    }
  } catch (error) {
    console.error('Fetching customization error', error);
    yield put(
      changeAppColorFailure({
        error: [error.message || 'Failed to fetch customization'],
      }),
    );
  }
}

export default function* customizationSaga() {
  yield all([
    takeEvery(`${CUSTOMIZATION_REDUCER}/changeAppColor`, fetchAppColorSaga),
  ]);
}

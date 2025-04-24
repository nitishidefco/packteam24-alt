import {createSlice} from '@reduxjs/toolkit';
import {LOCAL_WORK_HISTORY_REDUCER} from '../SliceKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  localWorkHistory: [],
};

const localWorkHistorySlice = createSlice({
  name: LOCAL_WORK_HISTORY_REDUCER,
  initialState: initialState,
  reducers: {
    setLocalWorkHistory: (state, action) => {
      state.localWorkHistory = action?.payload;
    },
  },
});

export const {setLocalWorkHistory} = localWorkHistorySlice.actions;

export const loadLocalWorkHistory = () => async dispatch => {
  try {
    const localWorkHistory = await AsyncStorage.getItem('workHistory');
    const parsedLocalWorkHistory = JSON.parse(localWorkHistory);
    if (localWorkHistory.length > 0) {
      dispatch(setLocalWorkHistory(parsedLocalWorkHistory));
    }
  } catch (error) {
    console.error('Error setting local work history', error);
  }
};

export const setLocalWorkHistoryInStorage =
  localWorkHistory => async dispatch => {
    try {
      const stringifiedLocalWorkHistory = JSON.stringify(localWorkHistory);
      await AsyncStorage.setItem('workHistory', stringifiedLocalWorkHistory);
      dispatch(setLocalWorkHistory(localWorkHistory));
    } catch (error) {
      console.error('Error saving local work history', error);
    }
  };
const LocalWorkHistoryReducer = localWorkHistorySlice.reducer;
export default LocalWorkHistoryReducer;

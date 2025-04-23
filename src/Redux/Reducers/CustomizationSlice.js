import {createSlice} from '@reduxjs/toolkit';
import {CUSTOMIZATION_REDUCER} from '../SliceKey';

const initialState = {
  isLoading: false,
  customizationData: [],
  error: [],
};

const customizationSlice = createSlice({
  name: CUSTOMIZATION_REDUCER,
  initialState,
  reducer: {
    changeAppColor(state) {
      state.isLoading = true;
    },
    changeAppColorSuccess(state, action) {
      state.isLoading = false;
      state.customizationData = action.payload;
    },
    changeAppColorFailure(state, action) {
      state.isLoading = true;
      state.error = action.payload;
    },
  },
});

export const {changeAppColor, changeAppColorSuccess, changeAppColorFailure} =
  customizationSlice.actions;

const CustomizationReducer = customizationSlice.reducer;
export default CustomizationReducer;

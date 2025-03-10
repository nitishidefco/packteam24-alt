import {createSlice} from '@reduxjs/toolkit';

const TimeSlice = createSlice({
  name: 'time',
  initialState: {
    currentTime: null,
    isTimeValid: false,
  },
  reducers: {
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setIsTimeValid: (state, action) => {
      state.isTimeValid = action.payload;
    },
  },
});

export const {setCurrentTime, setIsTimeValid} = TimeSlice.actions;
export default TimeSlice.reducer;

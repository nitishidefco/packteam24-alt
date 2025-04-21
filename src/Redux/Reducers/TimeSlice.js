import {createSlice} from '@reduxjs/toolkit';

const TimeSlice = createSlice({
  name: 'time',
  initialState: {
    currentTime: null,
  },
  reducers: {
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
  },
});

export const {setCurrentTime} = TimeSlice.actions;
export default TimeSlice.reducer;

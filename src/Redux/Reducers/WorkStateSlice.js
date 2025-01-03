import {createSlice} from '@reduxjs/toolkit';
import {WORKSTATE_REDUCER} from '../SliceKey';

const workStateSlice = createSlice({
  name: WORKSTATE_REDUCER,
  initialState: {
    lastOnlineMode: null,
  },
  reducers: {
    setLastOnlineMode: (state, action) => {
      console.log('action inside the workstate', action.payload);

      state.lastOnlineMode = action.payload;
    },
  },
});

export const {setLastOnlineMode} = workStateSlice.actions;
const WorkStateReducer = workStateSlice.reducer;
export default WorkStateReducer;

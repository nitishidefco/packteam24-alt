import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from './AuthSlice';
import HomeReducer from './HomeSlice';
import DailyListReducer from './DailyListSlice';
import ScanReducer from './ScanSlice';
import NetworkReducer from './NetworkSlice';
import SaveDataOfflineReducer from './SaveDataOfflineSlice';
import WorkStateReducer from './WorkStateSlice';
import GetNfcTagsFromServerReducer from './NFCTagsSlice';

let appReducer = combineReducers({
  Auth: AuthReducer,
  Home: HomeReducer,
  DailyList: DailyListReducer,
  Scan: ScanReducer,
  Network: NetworkReducer,
  OfflineData: SaveDataOfflineReducer,
  WorkState: WorkStateReducer,
  FetchNfcTags: GetNfcTagsFromServerReducer,
});

const rootReducer = (state, action) => {
  // if (action.type === LOGOUTUSER.SUCCESS || action.type == DELETEACCOUNT.SUCCESS) {
  //     state = {
  //         Auth: INITIAL_AUTH,
  //     };
  // }
  return appReducer(state, action);
};

export default rootReducer;

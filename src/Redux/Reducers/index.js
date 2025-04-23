import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from './AuthSlice';
import HomeReducer from './HomeSlice';
import DailyListReducer from './DailyListSlice';
import ScanReducer from './ScanSlice';
import NetworkReducer from './NetworkSlice';
import SaveDataOfflineReducer from './SaveDataOfflineSlice';
import WorkStateReducer from './WorkStateSlice';
import GetNfcTagsFromServerReducer from './NFCTagsSlice';
import UserProfileReducer from './UserProfileSlice';
import PasswordChangeReducer from './PasswordChangeSlice';
import WorkHistoryReducer from './WorkHistorySlice';
import LanguageProviderReducer from './LanguageProviderSlice';
import LocalWorkHistoryReducer from './LocalWorkHistorySlice';
import TimeReducer from './TimeSlice';
import NotificationReducer from './NotificationSlice';
import MessageReducer from './MessageSlice';
import ArchiveReducer from './ArchiveSlice';
import CustomizationReducer from './CustomizationSlice';
let appReducer = combineReducers({
  Auth: AuthReducer,
  Home: HomeReducer,
  DailyList: DailyListReducer,
  Scan: ScanReducer,
  Network: NetworkReducer,
  OfflineData: SaveDataOfflineReducer,
  WorkState: WorkStateReducer,
  FetchNfcTags: GetNfcTagsFromServerReducer,
  UserProfile: UserProfileReducer,
  ChangePassword: PasswordChangeReducer,
  WorkHistory: WorkHistoryReducer,
  GlobalLanguage: LanguageProviderReducer,
  LocalWorkHistory: LocalWorkHistoryReducer,
  TrueTime: TimeReducer,
  Notification: NotificationReducer,
  Messages: MessageReducer,
  Archive: ArchiveReducer,
  Customization: CustomizationReducer,
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

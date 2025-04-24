import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import NotificationService from '../../Services/NotificationService';
import {useAuthActions} from '../../Redux/Hooks';
import {Store} from '../../Redux/Store';
const NotificationInitializer = ({navigationRef}) => {
  const deviceId = useSelector(state => state.Network?.deviceId);
  const {state} = useAuthActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const store = Store.getState();
  const globalLanguage = store.GlobalLanguage;

  useEffect(() => {
    if (deviceId && SessionId && navigationRef.current && globalLanguage) {
      NotificationService.initialize(navigationRef.current);
    }
  }, [deviceId, SessionId, globalLanguage]);

  return null;
};

export default NotificationInitializer;

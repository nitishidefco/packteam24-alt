import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      deviceId &&
      SessionId &&
      navigationRef.current &&
      globalLanguage &&
      dispatch
    ) {
      console.log('Calleing notification service');

      NotificationService.initialize(navigationRef.current);
    }
  }, [deviceId, SessionId, globalLanguage, dispatch]);

  return null;
};

export default NotificationInitializer;

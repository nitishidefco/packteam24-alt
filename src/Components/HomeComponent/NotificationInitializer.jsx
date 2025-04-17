import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import NotificationService from '../../Services/NotificationService';
import {useAuthActions} from '../../Redux/Hooks';
const NotificationInitializer = ({navigationRef}) => {
  const deviceId = useSelector(state => state.Network?.deviceId);
  const {state} = useAuthActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (
      deviceId &&
      SessionId &&
      navigationRef.current &&
      !isInitializedRef.current
    ) {
      NotificationService.initialize(navigationRef.current);
      isInitializedRef.current = true;
    }
  }, [deviceId, SessionId]);

  return null;
};

export default NotificationInitializer;

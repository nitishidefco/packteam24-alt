import {useDispatch, useSelector} from 'react-redux';
import {notification} from '../Reducers/NotificationSlice';

export const useNotificationActions = () => {
  const dispatch = useDispatch();
  const notificationState = useSelector(state => state?.Notification);
  console.log('Insidde notification actions');

  const notificationCall = payload => {
    console.log('Notification token', payload);

    dispatch(notification({payload: payload}));
  };

  return {
    notificationState,
    notificationCall,
  };
};

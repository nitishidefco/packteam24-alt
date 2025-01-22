import {useDispatch, useSelector} from 'react-redux';
import {changePassword} from '../Reducers/PasswordChangeSlice';

export const useChangePasswordActions = () => {
  const dispatch = useDispatch();
  const passwordState = useSelector(state => state?.changePassword);

  const changePasswordCall = params => {
    dispatch(changePassword(params));
  };

  return {
    passwordState,
    changePasswordCall,
  };
};

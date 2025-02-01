import {useDispatch, useSelector} from 'react-redux';
import {changePassword} from '../Reducers/PasswordChangeSlice';

export const useChangePasswordActions = () => {
  const dispatch = useDispatch();
  const passwordState = useSelector(state => state?.ChangePassword);

  const changePasswordCall = (params, navigation) => {
    dispatch(changePassword({payload: params, navigation}));  
  };

  return {
    passwordState,
    changePasswordCall,
  };
};

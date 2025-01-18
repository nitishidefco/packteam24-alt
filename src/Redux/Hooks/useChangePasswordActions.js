import {useDispatch, useSelector} from 'react-redux';
import {changePassword} from '../Reducers/PasswordChangeSlice';

export const useChangePasswordActions = () => {
  const dispatch = useDispatch();
  const passwordState = useSelector(state => state?.changePassword);

  const changePasswordCall = params => {
    const response = dispatch(changePassword(params));
    console.log(response);
  };

  return {
    passwordState,
    changePasswordCall,
  };
};

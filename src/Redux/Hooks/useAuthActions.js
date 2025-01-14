import {useDispatch, useSelector} from 'react-redux';
import {getLogin, getLogout, getForgotPassword} from '../Reducers/AuthSlice';

// ACTIONS WILL BE CALLED FROM HERE
export const useAuthActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const loginCall = params => {
    dispatch(getLogin(params));
  };
  const logoutCall = params => {
    dispatch(getLogout(params));
  };

  const forgotPasswordCall = params => {
    dispatch(getForgotPassword(params));
  };

  return {state, loginCall, logoutCall, forgotPasswordCall};
};

import {useDispatch, useSelector} from 'react-redux';
import {
  getLogin,
  getLogout,
  getForgotPassword,
  createAccount,
} from '../Reducers/AuthSlice';

// ACTIONS WILL BE CALLED FROM HERE
export const useAuthActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const loginCall = params => {
    console.log('Login params', params);

    dispatch(getLogin(params));
  };
  const logoutCall = (params, navigation) => {
    console.log(params);

    dispatch(getLogout({payload: params, navigation}));
  };

  const forgotPasswordCall = params => {
    dispatch(getForgotPassword(params));
  };

  const createAccountCall = (params, navigation) => {
    dispatch(createAccount({payload: params, navigation}));
  };

  return {state, loginCall, logoutCall, forgotPasswordCall, createAccountCall};
};

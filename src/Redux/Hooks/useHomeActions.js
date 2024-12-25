import {useDispatch, useSelector} from 'react-redux';
import {getHome} from '../Reducers/HomeSlice';

// ACTIONS WILL BE CALLED FROM HERE
export const useHomeActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const homecall = params => {
    dispatch(getHome(params));
  };

  return {state, homecall};
};

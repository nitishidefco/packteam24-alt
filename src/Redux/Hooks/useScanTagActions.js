import {useDispatch, useSelector} from 'react-redux';
import {getScan} from '../Reducers/ScanSlice';

export const useScanTagActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state?.Scan);
  const scanCall = params => {
    //
    dispatch(getScan(params));
  };

  return {state, scanCall};
};

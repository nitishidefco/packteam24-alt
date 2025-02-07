import {useDispatch, useSelector} from 'react-redux';
import {getScan, sendBulk} from '../Reducers/ScanSlice';

export const useScanTagActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state?.Scan);
  const scanCall = params => {
    //
    dispatch(getScan(params));
  };
  const bulkScanCall = params => {
    dispatch(bulkScanCall(params));
  };
  return {state, scanCall, bulkScanCall};
};

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
    console.log('Bulk update:', params);
    
    dispatch(sendBulk(params));
  };
  return {state, scanCall, bulkScanCall};
};

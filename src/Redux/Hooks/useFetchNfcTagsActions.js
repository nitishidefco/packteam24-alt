import {useDispatch, useSelector} from 'react-redux';
import {fetchNfcTags} from '../Reducers/NFCTagsSlice';

export const useFetchNfcTagsActions = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state?.FetchNfcTags);

  const fetchTagsCall = params => {
    console.log('fetch nfc tag actions', params);

    dispatch(fetchNfcTags(params));
  };

  return {state, fetchTagsCall};
};

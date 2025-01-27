import {useDispatch, useSelector} from 'react-redux';
import {
  fetchUserProfile,
  updateUserProfile,
  removeUserProfilePhoto,
  removeAccount,
} from '../Reducers/UserProfileSlice';

export const useUserProfileActions = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state?.UserProfile);

  const fetchUserProfileCall = async params => {
    dispatch(fetchUserProfile(params));
  };
  const updateUserProfileCall = params => {
    dispatch(updateUserProfile(params));
  };

  const removeUserProfilePhotoCall = params => {
    dispatch(removeUserProfilePhoto(params));
  };
  const removeAccountCall = (params, navigation) => {
    dispatch(removeAccount({payload: params, navigation}));
  };
  return {
    profileState,
    fetchUserProfileCall,
    updateUserProfileCall,
    removeUserProfilePhotoCall,
    removeAccountCall,
  };
};

import {useDispatch, useSelector} from 'react-redux';
import {
  fetchUserProfile,
  updateUserProfile,
  removeUserProfilePhoto,
} from '../Reducers/UserProfileSlice';

export const useUserProfileActions = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state?.UserProfile);

  const fetchUserProfileCall = params => {
    dispatch(fetchUserProfile(params));
  };
  const updateUserProfileCall = params => {
    dispatch(updateUserProfile(params));
  };

  const removeUserProfilePhotoCall = params => {
    dispatch(removeUserProfilePhoto(params));
  };
  return {
    profileState,
    fetchUserProfileCall,
    updateUserProfileCall,
    removeUserProfilePhotoCall,
  };
};

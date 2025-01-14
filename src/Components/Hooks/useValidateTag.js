import moment from 'moment';
import {useState, useEffect} from 'react';
import {reduxStorage} from '../../Redux/Storage';

const useValidateTag = (tagId, sessionItems) => {
  const [tagsFromLocalStorage, setTagsFromLocalStorage] = useState([]);
  const [tagForOfflineValidation, setTagForOfflineValidation] = useState(null);

  // Fetch tags from local storage
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = JSON.parse(await reduxStorage.getItem('nfcTags')) || [];
        const tagForOfflineValidation = await reduxStorage.getItem(
          'tagForOfflineValidation',
        );
        setTagForOfflineValidation(tagForOfflineValidation);
        setTagsFromLocalStorage(tags);
      } catch (error) {
        console.error('Error fetching tags from local storage', error);
      }
    };
    fetchTags();
  }, []);

  const effectiveLastState = tagForOfflineValidation;
  console.log(effectiveLastState);

  const currentDate = moment().format('YYYY-MM-DD');

  // Helper function to get the tag type dynamically based on localStorage tags
  function getTagType(tagId) {
    const tag = tagsFromLocalStorage.find(tag => tag.key === tagId);
    return tag ? tag.mode : null;
  }

  const isWorkEndedToday = sessionItems.some(
    item =>
      getTagType(item.tagId) === 'work_end' &&
      moment(item.timestamp).isSame(currentDate, 'day'),
  );

  const tagMode = getTagType(tagId);

  if (tagMode === 'work_start') {
    if (!effectiveLastState || effectiveLastState === 'work_not_started') {
      return {valid: true, message: 'Work started'};
    }

    if (isWorkEndedToday) {
      return {
        valid: false,
        message: 'Cannot start work again after ending it today.',
      };
    }

    if (effectiveLastState === 'work_start') {
      return {valid: false, message: 'Work is already started'};
    }

    if (effectiveLastState === 'break_start') {
      return {valid: true, message: 'Break ended, work resumed'};
    }

    return {valid: true, message: 'Work started'};
  }

  if (tagMode === 'break_start') {
    if (!effectiveLastState || effectiveLastState === 'work_end') {
      return {
        valid: false,
        message: 'Cannot take a break without starting work',
      };
    }

    if (effectiveLastState === 'break_start') {
      return {valid: false, message: 'Break is already active'};
    }

    if (effectiveLastState === 'work_start') {
      return {valid: true, message: 'Break started'};
    }

    return {valid: false, message: 'Invalid state for break'};
  }

  if (tagMode === 'work_end') {
    if (!effectiveLastState) {
      return {valid: false, message: 'Cannot end work without starting it'};
    }

    if (effectiveLastState === 'break_start') {
      return {
        valid: false,
        message: 'Cannot end work while on a break. Resume work first.',
      };
    }

    if (effectiveLastState === 'work_end') {
      return {valid: false, message: 'Work is already ended'};
    }

    if (effectiveLastState === 'work_start') {
      return {valid: true, message: 'Work ended'};
    }

    return {valid: false, message: 'Invalid state for ending work'};
  }

  return {valid: false, message: 'Unknown tag scanned'};
};

export default useValidateTag;

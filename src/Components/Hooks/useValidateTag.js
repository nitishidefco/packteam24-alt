import moment from 'moment';
import {useState, useEffect} from 'react';
import {reduxStorage} from '../../Redux/Storage';

const useValidateTag = (currentTagId, sessionItems) => {
  const [tagsFromLocalStorage, setTagsFromLocalStorage] = useState([]);
  const [tagForOfflineValidation, setTagForOfflineValidation] = useState(null);

  /* -------------------- // Fetch tags from local storage -------------------- */
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch and parse tags with error handling
        const tagsData = await reduxStorage.getItem('nfcTags');
        const tags = tagsData ? JSON.parse(tagsData) : [];

        // Fetch offline validation tag
        const offlineTag = await reduxStorage.getItem(
          'tagForOfflineValidation',
        );

        setTagForOfflineValidation(offlineTag || 'work_not_started'); // Default value
        setTagsFromLocalStorage(tags);
      } catch (error) {
        console.error('Error fetching tags from local storage', error);
        // Set default values if there's an error
        setTagsFromLocalStorage([]);
        setTagForOfflineValidation('work_not_started');
      }
    };

    fetchTags();
  }, []);

  const effectiveLastState = tagForOfflineValidation;
  console.log(
    'Effective last state of tag getting from tagForOfflineValidation',
    effectiveLastState,
  );

  const currentDate = moment().format('YYYY-MM-DD');

  /**
   * Helper function to get the tag type from localStorage
   * @param {string} tagId - The tag ID to look up
   * @returns {string|null} The tag mode or null if not found
   */
  function getTagType(tagId) {
    if (!tagId) return null;

    // First check in current localStorage
    const tag = tagsFromLocalStorage.find(tag => tag.key === tagId);
    if (tag) return tag.mode;

    // If not found in localStorage but we have a valid currentTagId and known mode
    if (
      currentTagId === tagId &&
      ['work_start', 'break_start', 'work_end'].includes(tagId)
    ) {
      return tagId; // Use the ID itself as the mode if it's a valid mode
    }

    return null;
  }

  // Check if work was ended today
  const isWorkEndedToday =
    Array.isArray(sessionItems) &&
    sessionItems.some(
      item =>
        item?.currentTagId &&
        getTagType(item.currentTagId) === 'work_end' &&
        moment(item.timestamp).isValid() &&
        moment(item.timestamp).isSame(currentDate, 'day'),
    );

  const tagMode = getTagType(currentTagId);
  console.log('Current tag mode', tagMode);

  // Work start validation
  if (tagMode === 'work_start') {
    if (!effectiveLastState || effectiveLastState === 'work_not_started') {
      console.log(
        'Block: Work started without previous state or work_not_started',
      );
      return {valid: true, message: 'Work started'};
    }

    if (isWorkEndedToday) {
      console.log('Block: Cannot start work again after ending it today');
      return {
        valid: false,
        message: 'Cannot start work again after ending it today.',
      };
    }

    if (effectiveLastState === 'work_start') {
      console.log('Block: Work is already started');
      return {valid: false, message: 'Work is already started'};
    }

    if (effectiveLastState === 'break_start') {
      console.log('Block: Break ended, work resumed');
      return {valid: true, message: 'Break ended, work resumed'};
    }

    console.log('Block: Work started');
    return {valid: true, message: 'Work started'};
  }

  if (tagMode === 'break_start') {
    if (!effectiveLastState || effectiveLastState === 'work_end') {
      console.log('Block: Cannot take a break without starting work');
      return {
        valid: false,
        message: 'Cannot take a break without starting work',
      };
    }

    if (effectiveLastState === 'break_start') {
      console.log('Block: Break is already active');
      return {valid: false, message: 'Break is already active'};
    }

    if (effectiveLastState === 'work_start') {
      console.log('Block: Break started');
      return {valid: true, message: 'Break started'};
    }

    console.log('Block: Invalid state for break');
    return {valid: false, message: 'Invalid state for break'};
  }

  if (tagMode === 'work_end') {
    if (!effectiveLastState) {
      console.log('Block: Cannot end work without starting it');
      return {valid: false, message: 'Cannot end work without starting it'};
    }

    if (effectiveLastState === 'break_start') {
      console.log(
        'Block: Cannot end work while on a break. Resume work first.',
      );
      return {
        valid: false,
        message: 'Cannot end work while on a break. Resume work first.',
      };
    }

    if (effectiveLastState === 'work_end') {
      console.log('Block: Work is already ended');
      return {valid: false, message: 'Work is already ended'};
    }

    if (effectiveLastState === 'work_start') {
      console.log('Block: Work ended');
      return {valid: true, message: 'Work ended'};
    }

    console.log('Block: Invalid state for ending work');
    return {valid: false, message: 'Invalid state for ending work'};
  }
};

// export default useValidateTag;

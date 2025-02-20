import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import {Matrics} from '../../Config/AppStyling';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguageWithStorage} from '../../Redux/Reducers/LanguageProviderSlice';
import {useWorkStatusActions} from '../../Redux/Hooks/useWorkStatusActions';
import {setLocalWorkHistoryInStorage} from '../../Redux/Reducers/LocalWorkHistorySlice';

const LanguageSelector = ({sessionId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);

  const {getWorkHistoryCall} = useWorkHistoryActions();
  const {fetchWorkStatusCall} = useWorkStatusActions();
  const {localWorkHistory} = useSelector(state => state?.LocalWorkHistory);
  const languageOptions = [
    {label: '🇬🇧 EN', value: 'en'},
    {label: '🇩🇪 DE', value: 'de'},
    {label: '🇷🇺 RU', value: 'ru'},
    {label: '🇺🇦 UA', value: 'ua'},
    {label: '🇵🇱 PL', value: 'pl'},
    {label: '🇨🇳 CN', value: 'cn'},
  ];

  const selected = languageOptions.find(opt => opt.value === globalLanguage);

  const handleLanguageChange = async language => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', language);

    dispatch(setLanguageWithStorage(language));
    try {
      getWorkHistoryCall(formData);
      fetchWorkStatusCall(formData);
    } catch (error) {
      console.log('error', error);
    }
    setIsOpen(false);
  };
  useEffect(() => {
    if (localWorkHistory?.length > 0) {
      let ldata = localWorkHistory.map(r => {
        let item = {...r};
        item.mode = i18n.t(`TagModes.${item.mode_raw}_start`);
        return item;
      });
      dispatch(setLocalWorkHistoryInStorage(ldata));
    }
  }, [globalLanguage, i18n.language]);
  return (
    <View
      style={[
        Platform.OS === 'android' ? styles.container : styles.iosContainer,
      ]}>
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Text style={styles.buttonText}>{selected?.label}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <View
            style={[
              Platform.OS === 'android' ? styles.dropdown : styles.dropdownIos,
            ]}>
            {languageOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  globalLanguage === option.value && styles.selectedOption,
                ]}
                onPress={() => handleLanguageChange(option.value)}>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Matrics.ms(30),
    right: Matrics.ms(10),
  },
  iosContainer: {
    // position: 'absolute',
    // top: Matrics.ms(40),
    // right: Matrics.ms(10),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  chevron: {
    fontSize: 10,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
  },
  dropdown: {
    position: 'absolute',
    top: Matrics.ms(80),
    right: Matrics.ms(10),
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    width: 100,
  },
  dropdownIos: {
    position: 'absolute',
    top: Matrics.ms(120),
    right: Matrics.ms(10),
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    width: 100,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedOption: {
    backgroundColor: '#f8fafc',
  },
  optionText: {
    fontSize: 14,
  },
});

export default LanguageSelector;

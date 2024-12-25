import React from 'react';
import { Modal, View } from 'react-native';
// import { styles } from '../../screens/DailyList/style';
import {styles} from "../../Screens/DailyList/style"

const CustomModal = ({ visible, onRequestClose, children, modalStyle }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={[styles.modalContainer1, modalStyle]}>
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;
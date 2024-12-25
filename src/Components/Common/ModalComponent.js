import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ModalComponent = ({ closeModal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true} 
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Change Password clicked')}>
            <Text>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Settings clicked')}>
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'red',
  },
});

export default ModalComponent;

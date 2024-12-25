import React from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Matrics, typography } from '../../Config/AppStyling';

const SetTypesModal = ({ isVisible, toggleModal, handleNumberSelection, modalStyle }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}>
      <View style={[styles.NumbermodalContainer, modalStyle]}>
        <View style={styles.NumberModalContent}>
          <FlatList
            data={[...Array(10).keys()]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleNumberSelection(item);
                  toggleModal();
                }}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};


const styles = {
  NumbermodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    shadowColor: '#0A1931',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 14,
  },
  NumberModalContent: {
    flex:1,
    backgroundColor: '#EBF0FA',
    width: '34%',
    borderRadius: 10,
    paddingVertical: 0,
    maxHeight: 100,
    borderWidth: 0.3,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
  },
  dropdownItemText: {
    fontSize: typography.fontSizes.fs14,
    color: '#555555',
  },
};

export default SetTypesModal;

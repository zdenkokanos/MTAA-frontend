import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type LevelPickerProps = {
    level: string;
    setLevel: (value: string) => void;
  };
  
  export default function LevelPicker({ level, setLevel }: LevelPickerProps) {
  
  const [modalVisible, setModalVisible] = useState(false);

  const levels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Pro', value: 'pro' },
    { label: 'All levels', value: 'all' },
  ];

  if (Platform.OS === 'android') {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Select level</Text>
        <View style={styles.androidPickerWrapper}>
          <Picker
            selectedValue={level}
            onValueChange={(itemValue) => setLevel(itemValue)}
            mode="dropdown"
          >
            <Picker.Item label="Choose level" value={null}/>
            {levels.map((l) => (
              <Picker.Item key={l.value} label={l.label} value={l.value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
  return (
    <View style={ styles.inputWrapper}>
      <Text style={styles.label}>Select level</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.selector}
      >
        <Text style={{ color: level ? '#000' : '#aaa' }}>
          {level ? levels.find((l) => l.value === level)?.label : 'Choose level'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            <Picker
              selectedValue={level}
              onValueChange={(itemValue) => {
                setLevel(itemValue);
                setModalVisible(true);
              }}
            >
              <Picker.Item label="Choose level" value={null} />
              {levels.map((l) => (
                <Picker.Item key={l.value} label={l.label} value={l.value} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginLeft: 15,
    color: '#222',
  },
  selector: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 12,
    marginLeft: 5,
  },
  androidPickerWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 52,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF', // basic iOS blue color
    paddingRight: 15,
  },
  inputWrapper: {
    flex: 1, 
  },
});

import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Môžeš použiť aj moment alebo dayjs
import { format } from 'date-fns';

export default function DateTimePickerInput({
  date,
  setDate,
}: {
  date: Date;
  setDate: (value: Date) => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View>
      <Text style={styles.label}>Date & Time</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputWrapper}>
        <Text style={styles.inputText}>{format(date, 'dd.MM.yyyy')}</Text>
        <FontAwesome6 name="calendar-days" size={20} color="black" style={styles.inputIcon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginLeft: 15,
    marginTop: 10,
    color: '#222',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 50,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  inputIcon: {
    marginLeft: 8,
  },
});
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';
import { useTheme } from '@/themes/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const options = [
  { label: 'System Default', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Black & White', value: 'bw' },
] as const;

export default function ThemeSelectorModal({ visible, onClose }: Props) {
  const setTheme = useThemeStore((s) => s.setTheme);
  const theme = useTheme();

  const handleSelect = (value: string) => {
    setTheme(value as any); // 'light' | 'dark' | 'bw' | 'system'
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          {options.map((opt) => (
            <TouchableOpacity key={opt.value} onPress={() => handleSelect(opt.value)} style={styles.option}>
              <Text style={[styles.optionText, { color: theme.text }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: theme.mutedText }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  option: {
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  cancel: {
    paddingTop: 10,
  },
  cancelText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

//** Theme switching was made with help from ChatGPT */
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import API_BASE_URL from "@/config/config";
import { useTheme } from "@/themes/theme";

type Sport = {
  id: string;
  name: string;
};

type SportPickerProps = {
  sport: string;//Sport | null;
  categoryId: number;
  setSport: (value: string) => void;
  setCategoryId: (value: number) => void;
};

type CategoryPickerProps = {
  category: { id: number, category_name: string } | null;
  setCategory: (value: { id: number, category_name: string }) => void;
};

export default function SportPicker({ sport, setSport, categoryId, setCategoryId}: SportPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [sports, setSports] = useState<any[]>([]);
  const [categoryIds, setCategoryIds] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSports = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/tournaments/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                throw new Error(data.message || "Unable to load sports.");
                }

                setSports(data); 
                setCategoryIds(data[0].id);
                setLoading(false);
                
            } catch (error) {
                console.error('❌ Error loading categories:', error);
            }
        };
        
        fetchSports();
    }, []);

    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);
  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text style={styles.label}>Sport</Text>
        <View style={styles.androidPickerWrapper}>
          <Picker
            selectedValue={sport}
            onValueChange={(itemValue) => {
              setSport(itemValue);
              setModalVisible(false);
              const selected = sports.find(s => s.category_name === itemValue);
              if (selected) {
                setCategoryId(selected.id);
              }
            }}
            style={{ flex: 1, textAlignVertical: 'center' }}
            itemStyle={{ fontSize: 16, lineHeight: 22 }}
            mode="dropdown"
          >
            <Picker.Item label="Choose category" value={null} />
            {sports.map((s) => (
              <Picker.Item key={s.id} label={s.category_name} value={s.category_name} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={ styles.inputWrapper }>
      <Text style={styles.label}>Sport</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.selector}
      >
        <Text style={{ color: sport ? '#000' : '#aaa' }}>
          { sport ? sports.find((s) => s.category_name === sport)?.category_name : 'Choose category' }
        </Text>

      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator style={{ padding: 20 }} />
            ) : (
              <Picker
                selectedValue={sport}
                onValueChange={(itemValue) => {
                  setSport(itemValue);
                  setModalVisible(true); 
                  const selected = sports.find(s => s.category_name === itemValue);
                  if (selected) {
                    setCategoryId(selected.id);
                  }
                }}
              >
                <Picker.Item label="Choose category" value={null} />
                {sports.map((s) => (
                  <Picker.Item key={s.id} label={s.category_name} value={s.category_name} />
                ))}
              </Picker>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginLeft: 15,
    color: theme.text,
    marginTop: 10,
  },
  selector: {
    backgroundColor: theme.createInputBackground,
    padding: 15,
    borderRadius: 12,
    marginRight: 5,
    borderColor: theme.createInputBorder,
    borderWidth: 1,
  },
  androidPickerWrapper: {
    backgroundColor: theme.createInputBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    justifyContent: 'center',
    borderColor: theme.createInputBorder,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    color: '#007AFF',
    paddingRight: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  inputWrapper: {
    flex: 1, 
  },
});
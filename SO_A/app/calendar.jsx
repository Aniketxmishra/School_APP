import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarPage = () => {
  const [holidays, setHolidays] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidayReason, setHolidayReason] = useState('');
  const [addHolidayEnabled, setAddHolidayEnabled] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const addHoliday = () => {
    if (!selectedDate || !holidayReason.trim()) {
      Alert.alert('Error', 'Please enter a valid reason for the holiday.');
      return;
    }
    setHolidays({
      ...holidays,
      [selectedDate]: { marked: true, dotColor: 'red', reason: holidayReason },
    });
    setModalVisible(false);
    setHolidayReason('');
    setAddHolidayEnabled(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>School Calendar</Text>
      
      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: addHolidayEnabled ? 'green' : 'gray' }]}
        onPress={() => setAddHolidayEnabled(!addHolidayEnabled)}
      >
        <Text style={styles.toggleButtonText}>{addHolidayEnabled ? 'Disable Adding Holiday' : 'Enable Adding Holiday'}</Text>
      </TouchableOpacity>
      
      <Calendar
        current={today}
        markedDates={holidays}
        monthFormat={'MMMM yyyy'}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          if (holidays[day.dateString]) {
            Alert.alert('Holiday', `Reason: ${holidays[day.dateString].reason}`);
          } else if (addHolidayEnabled) {
            setModalVisible(true);
          }
        }}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'red',
          arrowColor: 'orange',
        }}
      />
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Holiday for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason"
              value={holidayReason}
              onChangeText={setHolidayReason}
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              <Button title="Add" onPress={addHoliday} color="green" disabled={!addHolidayEnabled} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButton: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CalendarPage;

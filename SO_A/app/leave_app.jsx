import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/MaterialIcons';

const teachersData = [
  { id: "T001", name: "John Doe", date: "", remark: "" },
  { id: "T002", name: "Jane Smith", date: "", remark: "" },
  { id: "T003", name: "Jane Smith", date: "", remark: "" },
  { id: "T004", name: "Smith Jane", date: "", remark: "" },
  { id: "T005", name: "Jane Smith", date: "", remark: "" },
  { id: "T006", name: "Jane Smith", date: "", remark: "" },
  { id: "T007", name: "Smith Jane", date: "", remark: "" },
  { id: "T008", name: "Jane Smith", date: "", remark: "" },
  { id: "T009", name: "Smith Jane", date: "", remark: "" },
];

export default function ApplyForLeave() {
  const [searchText, setSearchText] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = teachersData.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(text.toLowerCase()) ||
        teacher.id.includes(text)
    );
    setFilteredTeachers(filtered);
  };

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
    setDate(null);
    setReason("");
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    Alert.alert(
      "Confirm Leave Application",
      `You want to apply for leave on ${date.toDateString()}?`,
      [
        { text: "NO", style: "cancel" },
        {
          text: "YES",
          onPress: () => {
            if (selectedTeacher) {
              selectedTeacher.date = date.toDateString();
              selectedTeacher.remark = reason;
              console.log("Updated Teacher Data:", teachersData);
              Alert.alert(
                "Leave Applied",
                `${selectedTeacher.name}, your leave is applied and waiting for approval.`
              );
            }
            setShowModal(false);
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20, backgroundColor: "#FFFECE", flex: 1 }}>
      <View style={{ padding: 10, backgroundColor: '#EABDE6', borderRadius: 20, borderWidth: 1, marginBottom: 20 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>APPLY FOR LEAVE</Text>
      </View>

      {/* Search Name */}
      <View style={{ borderBottomWidth: 1, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Icon name="search" size={20} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16 }}>Search Your Name or ID </Text>
        </View>
        <View style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
          height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginBottom: 10
        }}>
          <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0, }}
            placeholder="Enter Name or ID "
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Card View of the teachers  */}
      <FlatList
        data={filteredTeachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectTeacher(item)}>
            <View style={{ borderWidth: 2, padding: 1, borderColor: "#E5D0AC", marginTop: 20, borderRadius: 5, }}>
              <View style={{ borderWidth: 1, padding: 15, borderRadius: 5, backgroundColor: "#E4F1AC" }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Teacher Name:<Text style={{ fontWeight: "300" }}> {item.name}</Text></Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Teacher ID:<Text style={{ fontWeight: "300" }}> {item.id}</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#E4F1AC", padding: 20, borderRadius: 10, margin: 20 }}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: "flex-end", padding: 5 }}>
              <Text style={{ fontSize: 25, fontWeight: "bold", color: 'red' }}>X</Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10, }}>Apply for Leave {selectedTeacher?.name}</Text>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Teacher Name: <Text style={{ fontWeight: '400' }}> {selectedTeacher?.name}</Text></Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Teacher ID: <Text style={{ fontWeight: '400' }}> {selectedTeacher?.id}</Text></Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Date: <Text style={{ fontWeight: '400' }}> {date ? date.toDateString() : "Select Date"}</Text></Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={{ alignItems: 'center', borderWidth: 1, backgroundColor: "#FCC737", borderRadius: 20, marginTop: 10, }}>
                <Text style={{ color: "blue", marginVertical: 10 }}>Click to set the Date</Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker value={date || new Date()} mode="date" display="default" onChange={handleDateChange} />
            )}

            {/* Reason Box  */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                <Icon name="help-outline" size={20} color="#000" />
                <Text style={{ marginLeft: 5 }}>Enter your Reason</Text>
              </View>
              <View style={{ marginBottom: 10, paddingVertical: 5, flexDirection: "row", alignItems: "flex-start" }}>
                <TextInput
                  placeholder="Reason for your Leave"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    height: 100,
                    textAlignVertical: 'top',
                    backgroundColor: '#FFF2DB'
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!date || !reason}
              style={{ backgroundColor: date && reason ? "#FF9B17" : "gray", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

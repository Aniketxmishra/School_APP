import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";


export default function SchoolReport() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // studnet section======================================
  const [studnetreport, setstudentreport] = useState(false)
  const [classSelected, setClassSelected] = useState("");
  const [sectionSelected, setSectionSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  // Dummy student data
  const studentData = [
    { id: "1", name: "John Doe", class: "class1", section: "A", totalDays: 30, present: 28, absent: 2 },
    { id: "2", name: "Jane Smith", class: "class1", section: "B", totalDays: 30, present: 25, absent: 5 },
    { id: "3", name: "Michael Brown", class: "class2", section: "A", totalDays: 30, present: 27, absent: 3 },
    { id: "4", name: "Emily Johnson", class: "class2", section: "C", totalDays: 30, present: 29, absent: 1 },
    { id: "5", name: "William Lee", class: "class3", section: "B", totalDays: 30, present: 26, absent: 4 },
    { id: "6", name: "Olivia Davis", class: "class3", section: "C", totalDays: 30, present: 30, absent: 0 },
  ];

  // Filter students by Name/ID
  const filteredDatastudent = studentData.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery)) &&
      (classSelected === "" || student.class === classSelected) &&
      (sectionSelected === "" || student.section === sectionSelected)
  );

  // studnet section==========================================================

  const dummyData = [
    { id: "1", name: "John Doe", fromDate: "2025-04-01", toDate: "2025-04-10", totalDays: 10, present: 8, absent: 2 },
    { id: "2", name: "Jane Smith", fromDate: "2025-04-01", toDate: "2025-04-10", totalDays: 10, present: 9, absent: 1 },
    { id: "3", name: "Mark Johnson", fromDate: "2025-04-01", toDate: "2025-04-10", totalDays: 10, present: 10, absent: 0 },
    { id: "4", name: "Emily Davis", fromDate: "2025-04-01", toDate: "2025-04-10", totalDays: 10, present: 7, absent: 3 },
  ];

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  useEffect(() => {
    const filtered = dummyData.filter(
      (item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.id.includes(searchText)
    );
    setFilteredData(filtered);
  }, [searchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Report</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Teacher Report</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setstudentreport(true)}>
        <Text style={styles.buttonText}>Student Report</Text>
      </TouchableOpacity>

      {/* Teacher report Interface*/}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Teacher Report</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
            <Icon name="calendar-start" size={22} color="#000" />
            <Text> Select the Start Date</Text>
          </View>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>From Date: {fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker value={fromDate} mode="date" display="default" onChange={(e, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }} />
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
            <Icon name="calendar-end" size={22} color="#000" />
            <Text> Select the Start Date</Text>
          </View>
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>To Date: {toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker value={toDate} mode="date" display="default" onChange={(e, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }} />
          )}

          {/* Search Name */}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start' }}>
            <Icon name="magnify" size={20} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16 }}>Search the Student</Text>
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
            height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginRight: 10, marginBottom: 10
          }}>
            <Icon name="magnify" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0 }}
              placeholder="Enter Name"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>


          <ScrollView horizontal>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>S.No</Text>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>From Date</Text>
                <Text style={styles.headerCell}>To Date</Text>
                <Text style={styles.headerCell}>Total Days</Text>
                <Text style={styles.headerCell}>Present</Text>
                <Text style={styles.headerCell}>Absent</Text>
                <Text style={styles.headerCell}>Present %</Text>
              </View>
              {filteredData.map((item, index) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{item.name}</Text>
                  <Text style={styles.cell}>{item.fromDate}</Text>
                  <Text style={styles.cell}>{item.toDate}</Text>
                  <Text style={styles.cell}>{item.totalDays}</Text>
                  <Text style={styles.cell}>{item.present}</Text>
                  <Text style={styles.cell}>{item.absent}</Text>
                  <Text style={styles.cell}>{((item.present / item.totalDays) * 100).toFixed(1)}%</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Student report Interface*/}
      <Modal visible={studnetreport} animationType="slide" transparent={false}>
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fddd" }}>

          <TouchableOpacity onPress={() => setstudentreport(false)}>
            <Text style={{ fontSize: 20, alignSelf: 'flex-end', color: 'red' }}>X</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            Student Report
          </Text>

          {/* From Date Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom:5, }}>
            <Icon name="calendar-end" size={22} color="#000" />
            <Text> Select the Start Date</Text>
          </View>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => setShowFromDatePicker(true)}
          >
            <Text style={styles.buttonText}>From Date: {fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowFromDatePicker(false);
                if (date) setFromDate(date);
              }}
            />
          )}

          {/* To Date Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom:5, }}>
            <Icon name="calendar-end" size={22} color="#000" />
            <Text> Select the Start Date</Text>
          </View>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => setShowToDatePicker(true)}
          >
            <Text style={styles.buttonText}>To Date: {toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowToDatePicker(false);
                if (date) setToDate(date);
              }}
            />
          )}

          {/* Class Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom:5, }}>
            <Icon name="book-open" size={22} color="#000" />
            <Text> Select Class</Text>
          </View>
          <View style={{borderWidth:1, borderColor:'black', borderRadius:30,backgroundColor:'#FFF1D5'}}>
          <Picker
            selectedValue={classSelected}
            style={{}}
            onValueChange={(itemValue) => setClassSelected(itemValue)}
          >
            <Picker.Item label="Select Class" value="" />
            <Picker.Item label="Class 1" value="class1" />
            <Picker.Item label="Class 2" value="class2" />
            <Picker.Item label="Class 3" value="class3" />
          </Picker>
          </View>

          {/* Section Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom:5, }}>
            <Icon name="folder" size={22} color="#000" />
            <Text> Select Section</Text>
          </View>
          <View style={{borderWidth:1, borderColor:'black', borderRadius:30,backgroundColor:'#FFF1D5'}}>
          <Picker
            selectedValue={sectionSelected}
            style={{}}
            onValueChange={(itemValue) => setSectionSelected(itemValue)}
          >
            <Picker.Item label="Select Section" value="" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>
          </View>


          {/* Search Input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start' }}>
            <Icon name="magnify" size={20} style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16 }}>Search the Student</Text>
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
            height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginRight: 10, marginBottom: 10
          }}>
            <Icon name="magnify" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0 }}
              placeholder="Enter Name"
              value={searchText}
              onChangeText={(text) => setSearchQuery(text)}
              placeholderTextColor="#999"
            />
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerTexts}>S.No</Text>
            <Text style={styles.headerTexts}>Name</Text>
            <Text style={styles.headerTexts}>Class</Text>
            <Text style={styles.headerTexts}>Section</Text>
            <Text style={styles.headerTexts}>Total</Text>
            <Text style={styles.headerTexts}>Present</Text>
            <Text style={styles.headerTexts}>Absent</Text>
            <Text style={styles.headerTexts}>Present %</Text>
          </View>


          {/* Table Body */}
          <FlatList
            data={filteredDatastudent}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.tableRow}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.class}</Text>
                <Text style={styles.cell}>{item.section}</Text>
                <Text style={styles.cell}>{item.totalDays}</Text>
                <Text style={styles.cell}>{item.present}</Text>
                <Text style={styles.cell}>{item.absent}</Text>
                <Text style={styles.cell}>{((item.present / item.totalDays) * 100).toFixed(1)}%</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: '#FFECDB' },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, marginTop: 20, },
  button: { padding: 15, backgroundColor: "#4CAF50", borderRadius: 8, marginBottom: 15, paddingHorizontal: 80, alignItems: 'center', borderWidth: 1, },
  buttonText: { fontSize: 22, color: "#fff", fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 10, alignItems: "center", backgroundColor: "#FFF1D5" },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginVertical: 10, marginBottom: 20, },
  closeButton: { alignSelf: 'flex-end', marginBottom: 10 },
  closeButtonText: { fontSize: 26, padding: 10, color: '#f44336' },
  dateButton: { padding: 10, backgroundColor: "#eee", marginVertical: 5, width: "90%", borderRadius: 6, borderWidth: 1 },
  dateText: { fontSize: 16, },
  input: { borderWidth: 1, padding: 10, width: "90%", marginVertical: 10, borderRadius: 6 },
  tableHeader: { flexDirection: "row", backgroundColor: "#ddd", paddingVertical: 10 },
  headerCell: { width: 100, fontWeight: "bold", textAlign: "center" },
  row: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#ccc" },
  cell: { width: 100, textAlign: "center" },
  buttons: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    borderWidth:1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    marginTop: 10,
  },
  headerTexts: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",

  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
});
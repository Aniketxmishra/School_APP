import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView, Button, StyleSheet, KeyboardAvoidingView, Platform, Alert, FlatList, Switch } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import { RadioButton, Checkbox } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { fetchStudentsFromDB, createStudent, mapDBStudentToAppFormat } from './api/studentService';

export default function StudentApp() {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [selectedTab, setSelectedTab] = useState("basic");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false); // For custom dropdown
  const [selectedSection, setSelectedSection] = useState("all"); // filter menu slection 
  const sections = ["All Sections", "Section A", "Section B", "Section C", "Section D"]; // section Select for filter
  const [documents, setDocuments] = useState([{ type: "", file: null, remarks: "" }]);// document upload function 
  const [showEffFromPicker, setShowEffFromPicker] = useState(false);
  const [showEffToPicker, setShowEffToPicker] = useState(false);
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [documentPreview, setDocumentPreview] = useState(null); // document large view
  const [medicalImageUploaded, setMedicalImageUploaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // form mediale image view 
  const section = ["Section A", "Section B", "Section C", "Section D"]; // the selcet section radiobutton 
  const classOptions = [
    { label: "Class I", value: "Class I" },
    { label: "Class II", value: "Class II" },
    { label: "Class III", value: "Class III" },
    { label: "Class IV", value: "Class IV" },
    { label: "Class V", value: "Class V" },
    { label: "Class VI", value: "Class VI" },
    { label: "Class VII", value: "Class VII" },
    { label: "Class VIII", value: "Class VIII" },
    { label: "Class IX", value: "Class IX" },
    { label: "Class X", value: "Class X" },
    { label: "Class XI", value: "Class XI" },
    { label: "Class XII", value: "Class XII" },
  ];



  const [studentData, setStudentData] = useState({
    photo: null,
    id: null,
    enrollNumber: "",
    name: "",
    gender: "",
    religion: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    joiningDate: "",
    documentsaadhar: null,
    documentsbirthcerti: null,
    documentsfamilycard: null,
    fatherName: "",
    motherName: "",
    familyMobile: "",
    familyEmail: "",
    notification: false,
    classDetails: {
      standard: "",
      section: "",
      effFrom: "",
      effTo: "",
      teacherName: "",
    },
    subjectDetails: {
      classid: "",
      subjects: "",
      category: "",
      status: "",
      SubjectTeacher: "",
    },
    medical: {
      bloodType: "",
      diseases: "",
      medicalDetails: null,
      medicalRemark: "",
    },
    specialAttentiontype: "",
    specialAttentiondisease: "",
    specialAttentionspecialRemark: "",
    specialAttentionstatus: "",
  });

  // Fetch students from database when component loads
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const dbStudents = await fetchStudentsFromDB();
        const mappedStudents = dbStudents.map(mapDBStudentToAppFormat);
        setStudents(mappedStudents);
        console.log('Loaded students from database:', mappedStudents.length);
      } catch (error) {
        console.error('Failed to load students:', error);
        Alert.alert('Error', 'Failed to load students from database');
      }
    };

    loadStudents();
  }, []);

  const handleAddstudent = async () => {
    try {
      // Save to database first
      const savedStudent = await createStudent(studentData);
      console.log('Student saved to database:', savedStudent);
      
      // Then add to local state
      const newStudent = { ...studentData, id: savedStudent.id || Date.now() };
      setStudents([...students, newStudent]);
      
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      console.error('Failed to save student:', error);
      Alert.alert('Error', 'Failed to save student to database');
      // Still add to local state as fallback
      setStudents([...students, { ...studentData, id: Date.now() }]);
    }
    
    setModalVisible(false);
    setCurrentTab("basic");
    setStudentData({
      photo: null,
      id: null,
      enrollNumber: "",
      name: "",
      gender: "",
      religion: "",
      address: "",
      city: "",
      country: "",
      pincode: "",
      joiningDate: "",
      documentsaadhar: null,
      documentsbirthcerti: null,
      documentsfamilycard: null,
      fatherName: "",
      motherName: "",
      familyMobile: "",
      familyEmail: "",
      notification: false,
      classDetails: {
        standard: "",
        section: "",
        effFrom: "",
        effTo: "",
        teacherName: "",
      },
      subjectDetails: {
        classid: "",
        subjects: "",
        category: "",
        status: "",
        SubjectTeacher: "",
      },
      medical: {
        bloodType: "",
        diseases: "",
        medicalDetails: null,
        medicalRemark: "",
      },
      specialAttentiontype: "",
      specialAttentiondisease: "",
      specialAttentionspecialRemark: "",
      specialAttentionstatus: "",
    });
    setImageUploaded(false); // Reset the image upload state
    setModalVisible(false); // Close the modal
    setCurrentTab("basic"); // Reset to the first tab
  };

  // filters the student ///
  const filteredStudents =
    selectedSection === "all"
      ? students
      : students.filter((student) => student.classDetails.section === selectedSection);

  // date handler for Joining date
  const handleJoiningDateChange = (event, selectedDate) => {
    setShowJoiningPicker(false);                                // Hide the picker
    if (selectedDate) {
      setStudentData((prevData) => ({
        ...prevData,
        JoiningDate: selectedDate.toDateString(),               // Store as a readable string
      }));
    }
  };

  // Date Handling
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setStudentData(prev => ({ ...prev, joiningDate: date.toISOString() }));
    }
  };

  // Handle section selection
  const handleSectionSelect = (section) => {
    if (section === "All Sections") {
      setSelectedSection("all");
    } else {
      setSelectedSection(section.replace("Section ", ""));  // More flexible parsing
    }
  };

  // Form Submission with submit is pressed
  const handleAddStudent = () => {
    setStudents([...students, studentData]);
    setModalVisible(false);
    // Reset form data
    setStudentData({ /* ...initial state... */ });
  };

  //// auto silder next button click 
  const handleNextTab = () => {
    if (currentTab === "basic") setCurrentTab("document");
    else if (currentTab === "document") setCurrentTab("Family");
    else if (currentTab === "Family") setCurrentTab("class");
    else if (currentTab === "class") setCurrentTab("subject");
    else if (currentTab === "subject") setCurrentTab("medical");
    else if (currentTab === "medical") setCurrentTab("special");
  };

  // the document upload Section 
  // Add new row
  const fixedDocumentOptions = [
    { key: 1, label: "Birth Certificate", value: "Birth Certificate" },
    { key: 2, label: "Aadhar Card", value: "Aadhar Card" },
    { key: 3, label: "Family Card", value: "Family Card" },
  ];

  const [fixedDocuments, setFixedDocuments] = useState([
    { type: "Aadhar Card", file: null, remarks: "" },
    { type: "Birth Certificate", file: null, remarks: "" },
    { type: "Family Card", file: null, remarks: "" },
  ]);

  const handleFixedDocumentUpload = async (index) => {
    let result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
    if (!result.canceled) {
      const newDocs = [...fixedDocuments];
      newDocs[index].file = result.assets[0].uri;
      setFixedDocuments(newDocs);
    }
  };

  const handleFixedInputChange = (index, field, value) => {
    const newDocs = [...fixedDocuments];
    newDocs[index][field] = value;
    setFixedDocuments(newDocs);
  };

  const handleFixedAddStudent = () => {
    setStudents([...students, {
      ...studentData,
      id: Date.now(),
      documentsaadhar: fixedDocuments[0].file,
      documentsbirthcerti: fixedDocuments[1].file,
      documentsfamilycard: fixedDocuments[2].file
    }]);
    setModalVisible(false);
    setCurrentTab("basic");
    setStudentData((prev) => ({
      ...prev,
      documentsaadhar: null,
      documentsbirthcerti: null,
      documentsfamilycard: null,
    }));
  };

  // Reset form
  const resetForm = () => {
    setDocuments([{ type: "", file: null, remarks: "" }]); // Reset to initial empty state
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(documents); // Pass data to parent component (studentData)
    resetForm(); // Clear all input fields
  };

  // Handle modal close
  const handleClose = () => {
    resetForm(); // Clear data on close
  };

  // Dropdown Options
  const documentOptions = [
    { key: 1, label: "Aadhar", value: "Aadhar" },
    { key: 2, label: "PAN", value: "PAN" },
    { key: 3, label: "Marksheets", value: "Marksheets" },
  ];

  const handlePress = () => {
    handleAddstudent();  // First action
    handleClose();       // Second action
  };

  /// medical file upload section
  const handleMedicalFileUpload = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;

      console.log("Selected Medical Image:", newImage);

      setStudentData((prevData) => ({
        ...prevData,
        medical: {
          ...prevData.medical,
          medicalDetails: [...(prevData.medical?.medicalDetails || []), newImage], // ✅ Ensures array
        },
      }));

      setMedicalImageUploaded(true);
    }
  };

  // image pick function and setter camera area 
  const handleImagePick = async () => {
    Alert.alert(
      "Select Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickFromGallery(),
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions (using ImagePicker's permission method)
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "We need camera access to take photos");
        return;
      }
  
      // Launch camera directly
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        setStudentData({ ...studentData, photo: uri });
        setImageUploaded(true);
        
        // Optional: Get file info
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          Alert.alert("Success", `Image uploaded: ${info.size} bytes`);
        }
      }
    } catch (error) {
      console.error("Camera Error:", error);
      Alert.alert("Error", "Failed to access camera");
    }
  };

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResult(result);
  };

  const handleImageResult = (result) => {
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setStudentData({ ...studentData, photo: uri });
      setImageUploaded(true);

      // Optional: Get file info
      FileSystem.getInfoAsync(uri).then(info => {
        Alert.alert("Success", `Image uploaded: ${info.size} bytes`);
      });
    }
  };

  const ViewDocuments = ({ studentData }) => {
    if (!studentData || !studentData.documents.length) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>No documents uploaded yet.</Text>
        </View>
      );
    }

    // Function to open the document
    const openDocument = async (fileName) => {
      try {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          Alert.alert("File Not Found", "This document is not available.");
          return;
        }

        if (Platform.OS === "android") {
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: fileUri,
            flags: 1,
          });
        } else {
          await Linking.openURL(fileUri);
        }
      } catch (error) {
        console.error("Error opening document:", error);
        Alert.alert("Error", "Unable to open the document.");
      }
    }
  };



  return (
    <View style={{ flex: 1, padding: 20, }}>
      <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: "bold", marginBottom: 10, padding: 1, }}>Students of School</Text>
      {/* Section Filter */}
      <View>
        {/* Section Filter - Custom Dropdown */}
        <TouchableOpacity
          style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderWidth: 1, borderColor: "#ccc",
            borderRadius: 5, marginBottom: 20,
          }}
          onPress={() => setShowSectionDropdown(!showSectionDropdown)}
        >
          <Text style={{ fontSize: 16, }}>
            {selectedSection === "all" ? "All Sections" : `Section ${selectedSection}`}
          </Text>
          <Icon name={showSectionDropdown ? "arrow-drop-up" : "arrow-drop-down"} size={24} />
        </TouchableOpacity>

        {showSectionDropdown && (
          <View style={{
            position: "absolute", top: 60, left: 20, right: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc",
            borderRadius: 5, zIndex: 1,
          }}>
            {sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
                onPress={() => handleSectionSelect(section)}
              >
                <Text>{section}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "space-between" }}>
          {filteredStudents.map((student, index) => (
            <TouchableOpacity
              key={student.id}
              style={styles.card}
              onPress={() => {
                setSelectedStudent(student);
                setDetailModalVisible(true);
              }}
              onLongPress={() => {
                Alert.alert(
                  "Delete student",
                  "Are you sure you want to delete this student?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => setStudents(students.filter((t) => t !== student)) }
                  ]
                );
              }}
            >
              {student.photo && <Image source={{ uri: student.photo }} style={styles.studentImage} />}
              <Text style={{ fontWeight: 'bold' }}>{student.name}</Text>
              <Text>Class: {student.classDetails.standard}</Text>
              <Text>Section: {student.classDetails.section}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={{
        position: 'absolute', bottom: 20, right: 20, backgroundColor: 'blue', width: 60, height: 60, borderRadius: 30,
        justifyContent: 'center', alignItems: 'center', 
      }} onPress={() => setModalVisible(true)}>
        <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
      </TouchableOpacity>
      {/* Example of how to use the new Button component:
      <Button 
        title="Add Student"
        onPress={() => setModalVisible(true)}
        variant="primary"
        size="medium"
        icon="add"
      />
      */}


      {/* add student Function */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modal}>
          <ScrollView contentContainerStyle={{ padding: 10, backgroundColor: "#f8f8e8" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#f8f8e8', bottom: 10 }}>
              {/* "Add student" text in the center */}
              <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                Add Student
              </Text>

              {/* Close button on the right (absolute positioning) */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 1,
                  backgroundColor: 'red',
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'black', fontSize: 15 }}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Add Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "basic" && styles.activeTab]}
                onPress={() => setCurrentTab("basic")}
              >
                <Text style={styles.tabText}>Basic</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "document" && styles.activeTab]}
                onPress={() => setCurrentTab("document")}
              >
                <Text style={styles.tabText}>Document Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "Family" && styles.activeTab]}
                onPress={() => setCurrentTab("Family")}
              >
                <Text style={styles.tabText}>Family details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "class" && styles.activeTab]}
                onPress={() => setCurrentTab("class")}
              >
                <Text style={styles.tabText}>Class details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "subject" && styles.activeTab]}
                onPress={() => setCurrentTab("subject")}
              >
                <Text style={styles.tabText}>Subject details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "medical" && styles.activeTab]}
                onPress={() => setCurrentTab("medical")}
              >
                <Text style={styles.tabText}>Medical Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === "special" && styles.activeTab]}
                onPress={() => setCurrentTab("special")}
              >
                <Text style={styles.tabText}>Special Details</Text>
              </TouchableOpacity>
            </View>

            {/* Basic Details Tab */}
            {currentTab === "basic" && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 10, }}>Enter the Following Details</Text>
                {/* EnrollMent Number */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="face-retouching-natural" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="EnrollMent Number" style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, enrollNumber: text })} />
                </View>

                {/* student Name */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="person" size={25} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Name" style={{ borderBottomWidth: 1, flex: 1 }} value={studentData.name}
                    onChangeText={(text) => setStudentData({ ...studentData, name: text })} />
                </View>

                {/* Gender Selection */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5, }}>
                    <Icon name="wc" size={20} style={{ marginRight: 5 }} />
                    <Text>Genders:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setStudentData((prevData) => ({ ...prevData, gender: value }))
                    }
                    value={studentData.gender}>
                    <View style={{ flexDirection: "row", }}>
                      {["Male", "Female", "Others"].map((item) => (
                        <View
                          key={item}
                          style={{ flexDirection: "row", alignItems: "center", marginRight: 5, marginLeft: 25, }}
                        >
                          <RadioButton value={item} />
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                {/* Religion Selection */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
                    <Icon name="supervised-user-circle" size={20} style={{ marginRight: 5 }} />
                    <Text>Religion:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setStudentData((prevData) => ({ ...prevData, religion: value }))
                    }
                    value={studentData.religion}
                  >
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {["Christianity", "Islam", "Hinduism", "Buddhism", "Others"].map((item) => (
                        <View
                          key={item}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "30%", // Ensures two items per row
                            marginBottom: 5, // Adds spacing
                            marginLeft: 10,
                          }}
                        >
                          <RadioButton value={item} />
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                {/* Address */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="home" size={25} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Address" style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, address: text })} />
                </View>


                {/* City */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="location-city" size={25} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="City"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, city: text })}
                  />
                </View>

                {/* Country */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="public" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Country"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, country: text })}
                  />
                </View>

                {/* Pin code */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="vpn-key" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="PINCODE"
                    keyboardType="phone-pad"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, pincode: text })}
                  />
                </View>

                {/* Joining Date */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
                    <Icon name="event" size={20} style={{ marginRight: 5 }} />
                    <Text>Joining Date:</Text>
                  </View>
                  <Button
                    title={studentData.joiningDate ? new Date(studentData.joiningDate).toDateString() : "Select Date"}
                    onPress={() => setShowJoiningPicker(true)}
                  />
                  {showJoiningPicker && (
                    <DateTimePicker
                      value={studentData.joiningDate ? new Date(studentData.joiningDate) : new Date()}  // Ensure it's a Date object
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowJoiningPicker(false); // Hide picker after selection
                        if (selectedDate) {
                          setStudentData(prevData => ({
                            ...prevData,
                            joiningDate: selectedDate.toISOString(),  // Store as ISO string
                          }));
                        }
                      }}
                    />
                  )}
                </View>
                {/* Next button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginLeft: 180, }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, borderWidth: 1, }}
                    onPress={handleNextTab}
                  >
                    <Text style={{ textAlign: 'center', color: 'white' }}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}


            {/* Document Details Tab */}
            {currentTab === "document" && (
              <>
                <ScrollView style={{ flex: 1, padding: 10, backgroundColor: "#f8f8e8", }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 5, }}>Upload the Following Documents</Text>
                  <View style={{ marginVertical: 20 }}>
                    <View style={{ flexDirection: "row", padding: 5, backgroundColor: "#ddd" }}>
                      <Text style={{ flex: 1, fontWeight: "bold", fontSize: 10 }}>S.NO</Text>
                      <Text style={{ flex: 3, fontWeight: "bold", fontSize: 10, paddingLeft: 5 }}>Document Type</Text>
                      <Text style={{ fontWeight: "bold", fontSize: 10, paddingRight: 60 }}>Upload</Text>
                      <Text style={{ fontWeight: "bold", fontSize: 10, paddingRight: 25 }}>Documenet Number</Text>
                    </View>


                    {fixedDocuments.map((item, index) => (
                      <View key={index} style={{ flexDirection: "row", padding: 5, borderBottomWidth: 1 }}>
                        <Text style={{ flex: 1 }}>{index + 1}</Text>

                        <View style={{ flex: 2 }}>
                          <Text style={{ padding: 5, textAlign: "center", fontSize: 10, backgroundColor: "#f9f9f9", borderWidth: 1, borderRadius: 5 }}>
                            {item.type}
                          </Text>
                        </View>

                        <TouchableOpacity style={{ flex: 2, alignItems: "center" }} onPress={() => handleFixedDocumentUpload(index)}>
                          <Ionicons name="cloud-upload-outline" size={24} color="black" />
                          {item.file && <Text numberOfLines={1} ellipsizeMode="tail">{item.file}</Text>}
                        </TouchableOpacity>

                        <TextInput
                          style={{ flex: 3, borderWidth: 1, padding: 5, textAlignVertical: "top", fontSize: 10, height: 40 }}
                          multiline
                          value={item.remarks}
                          onChangeText={(text) => handleFixedInputChange(index, "remarks", text)}
                        />
                      </View>

                    ))}
                  </View>
                  <View style={[styles.buttonRow_i, { marginVertical: 160, top: 160 }]}>
                    {/*Previous Button*/}
                    <TouchableOpacity
                      style={styles.prevButton_i}
                      onPress={() => setCurrentTab("basic")}
                    >
                      <Text style={styles.buttonText_i}>Previous</Text>
                    </TouchableOpacity>
                    {/*Next Button*/}
                    <TouchableOpacity
                      style={styles.nextButton_i}
                      onPress={handleNextTab}
                    >
                      <Text style={styles.buttonText_i}>Next</Text>
                    </TouchableOpacity>
                  </View>

                </ScrollView>
              </>
            )}

            {/* Document Details Tab */}
            {currentTab === "Family" && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 20, }}>Enter the Following Details</Text>
                {/* Family Details Section */}
                <View style={{ marginBottom: 10, paddingVertical: 5, marginVertical: 10 }}>
                  {/* Father's Name */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="person" size={20} style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="Father's Name"
                      style={{ borderBottomWidth: 1, flex: 1 }}
                      onChangeText={(text) => setStudentData({ ...studentData, fatherName: text })}
                    />
                  </View>

                  {/* Mother's Name */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="person" size={20} style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="Mother's Name"
                      style={{ borderBottomWidth: 1, flex: 1 }}
                      onChangeText={(text) => setStudentData({ ...studentData, motherName: text })}
                    />
                  </View>

                  {/* Mobile Number */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="phone" size={20} style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="Mobile Number"
                      keyboardType="phone-pad"
                      style={{ borderBottomWidth: 1, flex: 1 }}
                      onChangeText={(text) => setStudentData({ ...studentData, familyMobile: text })}
                    />
                  </View>

                  {/* Email ID */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="email" size={20} style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="Email ID"
                      keyboardType="email-address"
                      style={{ borderBottomWidth: 1, flex: 1 }}
                      onChangeText={(text) => setStudentData({ ...studentData, familyEmail: text })}
                    />
                  </View>

                  {/* Notification Toggle (Yes/No) */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="notifications" size={20} style={{ marginRight: 10 }} />
                    <Text>Notification</Text>
                    <Switch
                      value={studentData.notification}
                      onValueChange={(value) => setStudentData({ ...studentData, notification: value })}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={{ marginLeft: 5 }}>{studentData.notification ? "Yes" : "No"}</Text>
                  </View>
                </View>




                <View style={[styles.buttonRow_i, { marginVertical: 70, top: 70 }]}>
                  <TouchableOpacity
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("document")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextButton_i}
                    onPress={handleNextTab}
                  >
                    <Text style={styles.buttonText_i}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* class Tab */}
            {currentTab === "class" && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 10, }}>Enter the Following Details</Text>
                {/* Show image preview if a photo is uploaded */}
                <View style={{ marginBottom: 20, marginVertical: 5, }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="camera-alt" size={20} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16 }}>Profile Picture</Text>
                  </View>



                  {studentData.photo && (
                    <View style={styles.imagePreview}>
                      <Image
                        source={{ uri: studentData.photo }}
                        style={styles.previewImage}
                      />
                      <Text style={styles.fileName}>
                        {studentData.photo.split('/').pop()}
                      </Text>
                    </View>
                  )}

                  {/* Upload Button */}
                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      imageUploaded && styles.uploadedButton, // Apply blue style if image is uploaded
                    ]}
                    onPress={handleImagePick}
                  >
                    <Icon
                      name={imageUploaded ? "check-circle" : "add-a-photo"}
                      size={20}
                      color="white"
                    />
                    <Text style={styles.buttonText}>
                      {imageUploaded ? "Image Uploaded!" : "Upload Photo"}
                    </Text>
                  </TouchableOpacity>
                </View>


                {/* Class Details */}
                <View style={{ marginBottom: 10, paddingVertical: 5 }}>

                  {/* class */}
                  <View style={{ marginBottom: 10, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Icon name="school" size={20} style={{ marginRight: 10 }} />
                      <Text style={{ fontSize: 16 }}>Select Class</Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,      // Border around the container
                        borderColor: 'black', // Black border color
                        borderRadius: 5,      // Optional: Rounded corners for the container 
                        marginBottom: 10,     // Space below the container
                      }}
                    >
                      <RNPickerSelect
                        style={{
                          inputAndroid: {
                            borderWidth: 1,
                            borderRadius: 5,
                          },
                          inputIOS: {
                            borderWidth: 1,
                            borderRadius: 5,
                          },
                        }}
                        onValueChange={(value) => {
                          setStudentData({
                            ...studentData,
                            classDetails: { ...studentData.classDetails, standard: value },
                          });
                        }}
                        value={studentData.classDetails.standard}
                        items={classOptions}
                        placeholder={{
                          label: 'Select Class',
                          value: null,
                        }}
                      />
                    </View>
                  </View>

                  {/* Section */}
                  <View style={{ marginBottom: 10, paddingVertical: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <Icon name="list" size={20} style={{ marginRight: 10 }} />
                      <Text style={{ fontSize: 16 }}>Select Section</Text>
                    </View>


                    {section.map((sec) => (
                      <TouchableOpacity
                        key={sec}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5,
                          padding: 10,
                          borderWidth: 1,
                          borderColor: studentData.classDetails.section === sec ? "#2E86C1" : "#ccc",
                          backgroundColor: studentData.classDetails.section === sec ? "#2E86C1" : "white",
                          borderRadius: 5,
                        }}
                        onPress={() =>
                          setStudentData({ ...studentData, classDetails: { ...studentData.classDetails, section: sec } })
                        }
                      >
                        <Text style={{ color: studentData.classDetails.section === sec ? "white" : "black" }}>{sec}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Effective From Date */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="event" size={20} style={{ marginRight: 10 }} />
                    <Button
                      title={studentData.classDetails.effFrom || "Effective From"}
                      onPress={() => setShowEffFromPicker(true)}
                    />
                    {showEffFromPicker && (
                      <DateTimePicker
                        mode="date"
                        display="default"
                        value={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowEffFromPicker(false);
                          if (selectedDate) {
                            setStudentData(prev => ({
                              ...prev,
                              classDetails: { ...prev.classDetails, effFrom: selectedDate.toDateString() }
                            }));
                          }
                        }}
                      />
                    )}
                  </View>

                  {/* Effective To Date */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="event" size={20} style={{ marginRight: 10 }} />
                    <Button
                      title={studentData.classDetails.effTo || "Effective To"}
                      onPress={() => setShowEffToPicker(true)}
                    />
                    {showEffToPicker && (
                      <DateTimePicker
                        mode="date"
                        display="default"
                        value={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowEffToPicker(false);
                          if (selectedDate) {
                            setStudentData(prev => ({
                              ...prev,
                              classDetails: { ...prev.classDetails, effTo: selectedDate.toDateString() }
                            }));
                          }
                        }}
                      />
                    )}
                  </View>

                  {/* Teacher's Name */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="person" size={20} style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="Teacher's Name"
                      style={{ borderBottomWidth: 1, flex: 1 }}
                      onChangeText={(text) => setStudentData({
                        ...studentData,
                        classDetails: { ...studentData.classDetails, teacherName: text }
                      })}
                    />
                  </View>
                </View>



                <View style={styles.buttonRow_i}>
                  <TouchableOpacity
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("document")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextButton_i}
                    onPress={handleNextTab}
                  >
                    <Text style={styles.buttonText_i}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* subject Tab */}
            {currentTab === "subject" && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 10, }}>Enter the Following Details</Text>
                {/* Class ID */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="school" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Class ID"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        subjectDetails: { ...studentData.subjectDetails, classid: text },
                      })
                    }
                  />
                </View>

                {/* Subjects */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="book" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Subjects"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        subjectDetails: { ...studentData.subjectDetails, subjects: text },
                      })
                    }
                  />
                </View>

                {/* Category */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="layers" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Category"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        subjectDetails: { ...studentData.subjectDetails, category: text },
                      })
                    }
                  />
                </View>

                {/* Status */}
                <View style={{ marginBottom: 10, marginTop: 5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                    <Icon name="check-circle" size={20} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16 }}>Status</Text>
                  </View>

                  <RadioButton.Group
                    onValueChange={(value) =>
                      setStudentData({
                        ...studentData,
                        subjectDetails: { ...studentData.subjectDetails, status: value },
                      })
                    }
                    value={studentData.subjectDetails.status}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                      {["Active", "Inactive"].map((option) => (
                        <View key={option} style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
                          <RadioButton value={option} />
                          <Text>{option}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                {/* Subject Teacher */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="person" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Subject Teacher"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        subjectDetails: { ...studentData.subjectDetails, SubjectTeacher: text },
                      })
                    }
                  />
                </View>


                <View style={[styles.buttonRow_i, { marginVertical: 100, top: 100 }]}>
                  <TouchableOpacity
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("class")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextButton_i}
                    onPress={handleNextTab}
                  >
                    <Text style={styles.buttonText_i}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* medical Details Tab */}
            {currentTab === "medical" && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 10, }}>Enter the Following Medical Details</Text>
                {/* Blood Groups */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
                    <Icon name="opacity" size={20} style={{ marginRight: 5 }} />
                    <Text>Blood Group:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setStudentData((prevData) => ({
                        ...prevData,
                        medical: { ...prevData.medical, bloodType: value }
                      }))
                    }
                    value={studentData.medical.bloodType}
                  >
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                        <View key={group} style={{ flexDirection: "row", alignItems: "center", marginRight: 15, marginBottom: 5 }}>
                          <RadioButton value={group} />
                          <Text>{group}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>


                {/* Diseases */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Ionicons name="warning-outline" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Diseases (if any)"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    value={studentData.medical.diseases}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        medical: { ...studentData.medical, diseases: text },
                      })
                    }
                  />
                </View>


                {/*Medical Document Area*/}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="insert-drive-file" size={20} style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 16 }}>Medical Document</Text>
                </View>

                <View>
                  {studentData.medical?.medicalDetails?.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item }}
                        style={{ width: 50, height: 50, marginRight: 10, borderRadius: 5 }}
                      />
                      <Text style={{ fontSize: 14, flex: 1 }}>{item.split("/").pop()}</Text>
                    </View>
                  ))}
                </View>

                {/* Upload Button */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: medicalImageUploaded ? "#28A745" : "#2E86C1",
                    padding: 10,
                    borderRadius: 5,
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                  onPress={handleMedicalFileUpload}
                >
                  <Ionicons
                    name={medicalImageUploaded ? "checkmark-circle" : "cloud-upload-outline"}
                    size={24}
                    color="white"
                  />
                  <Text style={{ color: "white", marginLeft: 10, fontSize: 16 }}>
                    {medicalImageUploaded ? "Image Uploaded!" : "Upload Medical Document"}
                  </Text>
                </TouchableOpacity>


                {/* Medical Remark */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, paddingVertical: 5, marginVertical:10 }}>
                  <Icon name="comment" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Medical Remark"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({
                      ...studentData,
                      medical: { ...studentData.medical, medicalRemark: text }
                    })}
                  />
                </View>

                <View style={[styles.buttonRow_i, {marginVertical: 30, top: 30}]}>
                  <TouchableOpacity
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("subject")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextButton_i}
                    onPress={handleNextTab}
                  >
                    <Text style={styles.buttonText_i}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* special Tab */}
            {currentTab === "special" && (
              <>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginVertical: 10, }}>Enter the Following Special Attenation Details</Text>
               
                {/* Attention Type */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="report" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="EnrollMent Number" style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setStudentData({ ...studentData, specialAttentiontype: text })} />
                </View>

                {/* Disease */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="healing" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Disease"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        specialAttentiondisease: text, 
                      })
                    }
                    value={studentData.specialAttentiondisease}
                  />
                </View>

                {/* Special Remark */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Icon name="chat" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Special Remark"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) =>
                      setStudentData({
                        ...studentData,
                        specialAttentionspecialRemark: text, 
                      })
                    }
                    value={studentData.specialAttentionspecialRemark} 
                  />
                </View>

                {/* Status - Radio Button */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                    <Icon name="check-circle" size={20} style={{ marginRight: 10 }} />
                    <Text>Status:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setStudentData({
                        ...studentData,
                        specialAttentionstatus: value, 
                      })
                    }
                    value={studentData.specialAttentionstatus} 
                  >
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {["Active", "Inactive"].map((option) => (
                        <View key={option} style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
                          <RadioButton value={option} />
                          <Text>{option}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>




                <View style={[styles.buttonRow_i, {marginVertical:160, top:160}]}>
                  <TouchableOpacity
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("medical")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton_i}
                    onPress={handlePress}
                  >
                    <Text style={styles.buttonText_i}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent={true} animationType="slide">
        <View style={styles.detailModal}>
          {selectedStudent && (
            <ScrollView>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.button} onPress={() => setDetailModalVisible(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Student Image */}
              {selectedStudent.photo && (
                <Image source={{ uri: selectedStudent.photo }} style={styles.detailImage} />
              )}

              {/* Tabs */}
              <View style={ { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", backgroundColor: "#fff", padding: 5, borderRadius: 15, 
                elevation: 5,  shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, marginTop:10, }}>
                {["basic", "document", "family", "class", "subject", "medical", "special"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[{ flexDirection: "row", alignItems: "center", justifyContent: "center", flexGrow: 1, paddingVertical: 10, paddingHorizontal: 5, margin: 4,  borderRadius: 15, backgroundColor: "#f2f2f2", elevation: 3, }, selectedTab === tab && styles.activeTab]}
                    onPress={() => setSelectedTab(tab)}
                  >
                  <Text style={{fontSize: 12, fontWeight: "bold"}}>{tab.charAt(0).toUpperCase() + tab.slice(1)} Details</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Dynamic Content */}
              <View style={styles.detailContainer}>
                {selectedTab === "basic" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Basic Student Details</Text>
                    <View style={styles.containe_t}>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Enrollment Number:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.enrollNumber}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Student Name:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.name}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Gender :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.gender}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Religion :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.religion}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Address :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.address}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>City:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.city}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Country:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.country}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Pin code:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.pincode}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Joining Date</Text>
                        <Text style={styles.cell_t}>{selectedStudent.joiningDate}</Text>
                      </View>
                    </View>
                  </>
                )}
                {selectedTab === "document" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Document Details</Text>
                    <View style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, }}>
                      <ScrollView horizontal>
                        <FlatList
                          data={fixedDocuments}
                          keyExtractor={(item, index) => index.toString()}
                          nestedScrollEnabled={true}
                          ListHeaderComponent={() => (
                            <View style={{ flexDirection: "row", backgroundColor: "#fcf5a4", padding: 5, borderBottomWidth: 1, borderColor: "black" }}>
                              <Text style={{ paddingLeft:1, fontWeight: "bold", fontSize:10 }}>S.NO</Text>
                              <Text style={{ paddingLeft:20, fontWeight: "bold", fontSize:10  }}>Document Type</Text>
                              <Text style={{ paddingLeft:25, fontWeight: "bold", fontSize:10  }}>Uploaded Document</Text>
                              <Text style={{ paddingLeft:30, fontWeight: "bold", fontSize:10  }}>Remarks</Text>
                            </View>
                          )}
                          renderItem={({ item, index }) => (
                            <View style={{ flexDirection: "row", padding: 1, borderBottomWidth: 1, borderColor: "black" }}>
                              <Text style={{ flex: 1, fontSize: 12, textAlign: "center",backgroundColor: "#f3d1c9", }}>{index + 1}</Text>
                              <Text style={{ flex: 2, fontSize: 12, textAlign: "center", backgroundColor: "#f3d1c9", }}>{item.type || "-"}</Text>
                              <TouchableOpacity style={{ flex: 3, alignItems: "center", backgroundColor: "#f3d1c9",}} onPress={() => setDocumentPreview(item.file)}>
                                {item.file ? (
                                  <Image source={{ uri: item.file }} style={{ width: 80, height: 50, borderRadius: 5, resizeMode: "cover" }} />
                                ) : (
                                  <Text style={{ fontSize: 12, textAlign: "center" }}>No File</Text>
                                )}
                              </TouchableOpacity>
                              <Text style={{ flex: 3, fontSize: 12, textAlign: "center", backgroundColor: "#f3d1c9", }}>{item.remarks || "-"}</Text>
                            </View>
                          )}
                        />
                      </ScrollView> 
                    </View>

                    {documentPreview && (
                      <Modal visible={true} transparent={true} onRequestClose={() => setDocumentPreview(null)}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
                          <TouchableOpacity onPress={() => setDocumentPreview(null)}>
                            <Image source={{ uri: documentPreview }} style={{ width: 300, height: 300, resizeMode: "contain" }} />
                          </TouchableOpacity>
                        </View>
                      </Modal>
                    )}
                  </>
                )}

                {selectedTab === "family" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Family Details</Text>
                    <View style={styles.containe_t}>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Father Name:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.fatherName}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Mother Name:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.motherName}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Mobile Number:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.familyMobile}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Family Email:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.familyEmail}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Notifications Status:</Text>
                        <Text style={styles.cell_t}>
                          {selectedStudent.notification ? "Yes" : "No"}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                {selectedTab === "class" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Class Details</Text>
                    <View style={styles.containe_t}>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Standard :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.standard}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Section :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.section}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Effective Date From:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.effFrom}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Effective Date From:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.effFrom}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Section :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.section}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Effective Date From:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.effFrom}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Effective Date Upto:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.effTo}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Class Teacher:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.classDetails.teacherName}</Text>
                      </View>
                    </View>
                  </>
                )}

                {selectedTab === "subject" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Subject Details</Text>
                    <View style={styles.containe_t}>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Class ID:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.subjectDetails.classid}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Subjects Names:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.subjectDetails.subjects}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Category:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.subjectDetails.category}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Status:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.subjectDetails.status}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Teacher Name:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.subjectDetails.SubjectTeacher}</Text>
                      </View>
                    </View>
                  </>
                )}

                {selectedTab === "medical" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Medical Attention Details</Text>
                  <View style={styles.containe_t}>
                    <View style={styles.row_t}>
                        <Text style={styles.header_t}>Blood Type:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.medical.bloodType}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Disease:</Text>
                        <Text style={styles.cell_t}>{selectedStudent.medical.diseases || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Medical Remark :</Text>
                        <Text style={styles.cell_t}>{selectedStudent.medical.medicalRemark || "N/A"}</Text>
                      </View>
                  </View>

                    <View style={{ padding: 1, backgroundColor: "#fff", borderRadius: 8, elevation: 3, borderWidth:1, }}>
                      {selectedStudent.medical?.medicalDetails?.length > 0 && (
                        <>
                        <View style={{borderTopColor:"black",}}>
                          <Text style={{ fontWeight: "bold", fontSize: 16, color: "black", marginTop: 1, backgroundColor: "#fcf5a4" }}>
                            Medical Documents:
                          </Text>
                          <View style={{backgroundColor: "#fcf5a4",alignItems: "flex-end"}}>
                          <FlatList
                            data={selectedStudent.medical.medicalDetails}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={{
                                  marginRight: 10,
                                  borderRadius: 8,
                                  overflow: "hidden",
                                  borderWidth: 1,
                                  borderColor: "#ddd",
                                  backgroundColor: "#fcf5a4"
                                }}
                                onPress={() => setPreviewImage(item)}
                              >
                                <Image source={{ uri: item }} style={{ width: 70, height: 70, borderRadius: 8 }} />
                              </TouchableOpacity>
                              
                            )}
                          />
                          </View>
                          </View>
                        </>
                      )}

                      {/* Full-Screen Image Modal */}
                      {previewImage && (
                        <Modal visible={true} transparent={true} onRequestClose={() => setPreviewImage(null)}>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "rgba(0,0,0,0.9)",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              style={{ position: "absolute", top: 40, right: 20 }}
                              onPress={() => setPreviewImage(null)}
                            >
                              <Ionicons name="close-circle" size={35} color="white" />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: previewImage }}
                              style={{ width: "90%", height: "80%", borderRadius: 10 }}
                              resizeMode="contain"
                            />
                          </View>
                        </Modal>
                      )}

                      
                    </View>
                  </>
                )}

                {selectedTab === "special" && (
                  <>
                  <Text style={{fontSize:14, fontWeight: 'bold',textAlign: 'center', padding: 5, marginBottom: 10 }}>Special Attention Details</Text>

                    <View style={styles.containe_t}>
                      {/* Attention Type */}
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Attention Type:</Text>
                        <Text style={styles.cell_t}>
                          {selectedStudent?.specialAttentiontype || "N/A"} {/* Use selectedStudent instead of studentData */}
                        </Text>
                      </View>

                      {/* Disease */}
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Disease:</Text>
                        <Text style={styles.cell_t}>
                          {selectedStudent?.specialAttentiondisease || "N/A"} {/* Use selectedStudent instead of studentData */}
                        </Text>
                      </View>

                      {/* Special Care Remark */}
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Special Care Remark:</Text>
                        <Text style={styles.cell_t}>
                          {selectedStudent?.specialAttentionspecialRemark || "N/A"} {/* Use selectedStudent instead of studentData */}
                        </Text>
                      </View>

                      {/* Status */}
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Status:</Text>
                        <Text
                          style={[
                            styles.cell_t,
                            selectedStudent?.specialAttentionstatus === "Active"
                              ? styles.activeStatus
                              : styles.inactiveStatus,
                          ]}
                        >
                          {selectedStudent?.specialAttentionstatus || "N/A"} {/* Use selectedStudent instead of studentData */}
                        </Text>
                      </View>
                    </View>

                  </>
                )}

              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /// Tab CSS 
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",  // Prevents overlapping if too many tabs
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 15,
    elevation: 5,  // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    margin: 4,
    borderRadius: 15,
    backgroundColor: "#f2f2f2",
    elevation: 3,  // Adds shadow effect
  },

  activeTab: {
    backgroundColor: "#eacb4e",
    borderWidth: 2,
    borderColor: "#d4a017",
  },

  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },

  tabText: {
    fontSize: 12,  // Increased for better readability
    fontWeight: "bold",
    marginLeft: 1, // Space between icon & text
  },

  // input form  buttons 
  buttonRow_i: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton_i: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  nextButton_i: {
    backgroundColor: '#4CAF50',
    padding: 10,
    fontWeight: 'bold',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: 10,
  },
  submitButton_i: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
  },
  buttonText_i: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  /// document
  container_m: {
    padding: 15,
    backgroundColor: "#F8F9FA",
  },
  uploadButton_m: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86C1",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadText_m: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  fileList_m: {
    marginTop: 10,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },

  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadedButton: {
    backgroundColor: '#2196F3',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 15,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 12,
    color: '#666',
    maxWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },


  // detail contrainer
  detailModal: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: '#f8f8e8',
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'black',
  },
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f7190e',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    justifyContent: 'flex-start', // Align to the top
    alignItems: 'flex-end', // Align to the right
    backgroundColor: '#f8f8e8', // Semi-transparent background
  },
  button: {
    flex: 1,
    backgroundColor: 'red', // Button color
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
  },

  detailContainer: {
    marginTop: 15,
    padding: 10,
  },

  card: {
    width: "40%",
    padding:1,
    paddingHorizontal:1,
    backgroundColor: "#f9f6e0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    margin: 4,
    alignItems: "center",
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
  },

  // TABLE IN DEATIL VIEW 
  containe_t: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    overflow: "hidden",
  },
  row_t: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  header_t: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontWeight: "bold",
    backgroundColor: "#fcf5a4",
    fontSize: 12,
  },
  cell_t: {
    flex: 2,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f3d1c9",
  },

});
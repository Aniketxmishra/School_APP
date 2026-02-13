import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView, Button, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RadioButton, Checkbox } from "react-native-paper";
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchTeachersFromDB, createTeacher, mapDBTeacherToAppFormat } from './api/teacherService';



export default function TeacherApp() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("basic"); // Default to "basic" tab
  const [currentTab, setCurrentTab] = useState("basic"); // input tab 
  const [showPicker, setShowPicker] = useState(false);
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);

  // Load teachers from database on component mount
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await fetchTeachersFromDB();
      const mappedTeachers = teachersData.map(mapDBTeacherToAppFormat);
      setTeachers(mappedTeachers);
    } catch (error) {
      console.error('Error loading teachers:', error);
      Alert.alert('Error', 'Failed to load teachers from database');
    } finally {
      setLoading(false);
    }
  };

  // Set only one category at a time
  const toggleSubject = (subject) => {
    setTeacherData((prev) => ({
      ...prev,
      Category: subject, 
    }));
  };

  // date handler for Joining date
  const handleJoiningDateChange = (event, selectedDate) => {
    setShowJoiningPicker(false);                                // Hide the picker
    if (selectedDate) {
      setTeacherData((prevData) => ({
        ...prevData,
        JoiningDate: selectedDate.toDateString(),               // Store as a readable string
      }));
    }
  };

  // date handler for DOB date
  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);                                                 // Hide the picker
    if (selectedDate) {
      setTeacherData((prevData) => ({
        ...prevData,
        DOB: selectedDate.toDateString(),                               // Store selected date as a string
      }));
    }
  };

  // Function for Storing data for form 
  const [teacherData, setTeacherData] = useState({
    photo: null,
    Name: "",
    Address: "",
    City: "",
    Country: "",
    PinCode: "",
    DOB:"",
    JoiningDate: "",
    Category: "",
    StaffCode: "",
    Gender: "",
    FathersHusbandName:"",
    MobileNumber: "",
    EmailId: "",
    PanNo: "",
    Qualification: "",
    AadharNo: "",
    BloodGroup: "",
    ReportingTo: "",
    BankName: "",
    IfscCode: "",
    AccountNo: "",
    NameInBank: "",
  });


    
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
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "We need camera access to take photos");
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    handleImageResult(result);
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
      setTeacherData({ ...teacherData, photo: uri });
      setImageUploaded(true);
      
      // Optional: Get file info
      FileSystem.getInfoAsync(uri).then(info => {
        Alert.alert("Success", `Image uploaded: ${info.size} bytes`);
      });
    }
  };

  // function to add the data on press button
  const handleAddTeacher = async () => {
    try {
      // Map form data to API format
      const teacherPayload = {
        staffCode: teacherData.StaffCode,
        firstName: teacherData.Name.split(' ')[0] || teacherData.Name,
        lastName: teacherData.Name.split(' ').slice(1).join(' ') || '',
        fatherOrHusbandName: teacherData.FathersHusbandName,
        gender: teacherData.Gender,
        dateOfBirth: teacherData.DOB,
        bloodGroup: teacherData.BloodGroup,
        mobile: teacherData.MobileNumber,
        email: teacherData.EmailId,
        address: teacherData.Address,
        city: teacherData.City,
        state: teacherData.Country, // Using Country as state for now
        pincode: teacherData.PinCode,
        joiningDate: teacherData.JoiningDate,
        aadharNo: teacherData.AadharNo,
        pan: teacherData.PanNo,
        qualification: teacherData.Qualification,
        experience: 0, // Default experience
        reportsTo: teacherData.ReportingTo
      };

      await createTeacher(teacherPayload);
      Alert.alert('Success', 'Teacher added successfully!');
      
      // Reload teachers from database
      await loadTeachers();
      
      // Reset form
      setTeacherData({
        photo: null,
        Name: "",
        Address: "",
        City: "",
        Country: "",
        DOB:"",
        PinCode: "",
        JoiningDate: "",
        Category: "",
        StaffCode: "",
        Gender: "",
        FathersHusbandName:"",
        BankName: "",
        IfscCode: "",
        AccountNo: "",
        NameInBank: "",
        MobileNumber: "",
        EmailId: "",
        PanNo: "",
        Qualification: "",
        AadharNo: "",
        BloodGroup: "",
        ReportingTo: ""
      });
      setImageUploaded(false);
      setModalVisible(false);
      setCurrentTab("basic");
    } catch (error) {
      console.error('Error adding teacher:', error);
      Alert.alert('Error', 'Failed to add teacher. Please try again.');
    }
  };
  
  const handleNextTab = () => {
    if (currentTab === "basic") setCurrentTab("document");
    else if (currentTab === "document") setCurrentTab("bank");
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={styles.header}>Teacher of School</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 }}
          onPress={loadTeachers}
        >
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.teacherList}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text>Loading teachers...</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {teachers.map((teacher, index) => (
              <TouchableOpacity
                key={teacher.id || index}
                style={styles.card}
                onPress={() => { setSelectedTeacher(teacher); setDetailModalVisible(true); }}
                onLongPress={() => {
                  Alert.alert(
                    "Delete Teacher",
                    "Are you sure you want to delete this teacher?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "OK", onPress: () => setTeachers(teachers.filter((t) => t.id !== teacher.id)) }
                    ]
                  );
                }}
              >
                {teacher.photo && <Image source={{ uri: teacher.photo }} style={styles.teacherImage} />}
                <Text style={{ fontWeight: 'bold' }}>{teacher.fullName || teacher.firstName + ' ' + teacher.lastName}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{teacher.staffCode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>



      {/* Add Teacher Modal to add teacher*/}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1, padding: 5, paddingLeft:1, backgroundColor:'#f8f8e8'}}>
          <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#f8f8e8" }}>
            
             {/* Close button for add teacher */}
             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#f8f8e8', bottom:10 }}>
              {/* "Add Teacher" text in the center */}
              <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                Add Teacher
              </Text>

              {/* Close button on the right (absolute positioning) */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 1,
                  backgroundColor: 'red',
                  paddingHorizontal: 10,
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
                <Text style={styles.tabText}>Document</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, currentTab === "bank" && styles.activeTab]}
                onPress={() => setCurrentTab("bank")}
              >
                <Text style={styles.tabText}>Bank</Text>
              </TouchableOpacity>
            </View>

            {/* Basic Details Tab */}
            {currentTab === "basic" && (
              <>
                {/* First Name */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="person" size={25} style={{ marginRight: 10 }} />
                  <TextInput placeholder="First Name" style={{ borderBottomWidth: 1, flex: 1 }} value={teacherData.Name} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, Name: text })}/>
                </View>

                {/* Address */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon  name="home" size={25} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Address" style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, Address: text })}/>
                </View>

                {/* City */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon  name="location-city" size={25} style={{ marginRight: 10 }} />
                  <TextInput placeholder="City"  style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, City: text })}/>
                </View>

                {/* COUNTRY */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon  name="public" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Country" style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, Country: text })}/>
                </View>


                {/* PIN code */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="vpn-key" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="PINCODE" keyboardType="phone-pad" style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, PinCode: text })}/>
                </View>

                
                {/* Joining Date */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5,}}>
                    <Icon name="event" size={20} style={{ marginRight: 5 }} />
                    <Text>Joining Date:</Text>
                  </View>
                  <Button title={teacherData.JoiningDate || "Select Date"} onPress={() => setShowJoiningPicker(true)} />
                  {showJoiningPicker && (
                    <DateTimePicker
                      value={teacherData.JoiningDate ? new Date(teacherData.JoiningDate) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleJoiningDateChange}
                    />
                  )}
                </View>


                {/* Category */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5, }}>
                    <Icon name="category" size={20} style={{ marginRight: 5 }} />
                    <Text>Category:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setTeacherData((prevData) => ({ ...prevData, Category: value }))
                    }
                    value={teacherData.Category}>
                    <View style={{ flexDirection: "row",}}>
                      {["Principle", "Head Teacher", "Teacher"].map((item) => (
                        <View
                          key={item}
                          style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}
                        >
                          <RadioButton value={item} />
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>


                {/* Staff Code */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon name="badge" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Staff code"  style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, StaffCode: text })}/>
                </View>

                {/* Gender Selection */}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5, }}>
                    <Icon name="wc" size={20} style={{ marginRight: 5 }} />
                    <Text>Genders:</Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setTeacherData((prevData) => ({ ...prevData, Gender: value }))
                    }
                    value={teacherData.Gender}>
                    <View style={{ flexDirection: "row",}}>
                      {["Male", "Female", "Others"].map((item) => (
                        <View
                          key={item}
                          style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}
                        >
                          <RadioButton value={item} />
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                {/* Mobile Number */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="phone" size={20} style={{ marginRight: 10 }} />
                  <TextInput placeholder="Mobile Number" keyboardType="phone-pad" style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, MobileNumber: text })}/>
                </View>
                    
                <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop: 20, marginLeft:180,}}>
                  <TouchableOpacity 
                    style={{flex:1, backgroundColor: '#4CAF50', padding:10, borderRadius:5, borderWidth:1, }}
                    onPress={handleNextTab}
                  >
                    <Text style={{textAlign: 'center', color: 'white'}}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Document Details Tab */}
            {currentTab === "document" && (
              <>
                {/*FathersHusbandName:*/}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="person" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Father/Husband Name:"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setTeacherData({ ...teacherData, FathersHusbandName: text })} 
                  />
                </View>

              

                {/* Email ID */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                  <Icon name="email" size={20} style={{ marginRight: 10 }} />
                  <TextInput 
                    placeholder="Email ID" 
                    keyboardType="email-address" 
                    style={{ borderBottomWidth: 1, flex: 1 }} 
                    onChangeText={(text) => setTeacherData({ ...teacherData, EmailId: text })} 
                  />
                </View>
                


                {/* Upload Profile Picture */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>Profile Picture</Text>

                  {/* Show image preview if a photo is uploaded */}
                  {teacherData.photo && (
                    <View style={styles.imagePreview}>
                      <Image
                        source={{ uri: teacherData.photo }}
                        style={styles.previewImage}
                      />
                      <Text style={styles.fileName}>
                        {teacherData.photo.split('/').pop()}
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



              {/* PAN No */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                <Icon name="fingerprint" size={20} style={{ marginRight: 10 }} />
                <TextInput 
                  placeholder="PAN No" 
                  keyboardType="default" 
                  style={{ borderBottomWidth: 1, flex: 1 }} 
                  onChangeText={(text) => setTeacherData({ ...teacherData, PanNo: text })} 
                />
              </View>

              {/* Qualification */}
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5, }}>
                  <Icon name="school" size={20} style={{ marginRight: 5 }} />
                  <Text>Qualification:</Text>
                </View>

                  {/* Radio Buttons for Qualification */}
                <RadioButton.Group
                  onValueChange={(value) =>
                    setTeacherData((prevData) => ({ ...prevData, Qualification: value }))
                  }
                  value={teacherData.Qualification}
                >
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {["High School", "Bachelor", "Master", "Doctorate"].map((item) => (
                      <View
                        key={item}
                        style={{ flexDirection: "row", alignItems: "center", marginRight: 10, marginBottom: 5 }}
                      >
                        <RadioButton value={item} />
                        <Text>{item}</Text>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
            </View>



              {/*Adhaar card */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5, }}>
                <Icon name="credit-card" size={20} style={{ marginRight: 10 }} />
                <TextInput
                  placeholder="Aadhar Number"
                  keyboardType="numeric"
                  maxLength={12}
                  style={{ borderBottomWidth: 1, flex: 1 }}
                  onChangeText={(text) => setTeacherData({ ...teacherData, AadharNo: text })}
                />
              </View>


              {/*Blood Groups */}
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5,}}>
                  <Icon name="opacity" size={20} style={{ marginRight: 5 }} />
                  <Text>Blood Group:</Text>
                </View>
                <RadioButton.Group
                  onValueChange={(value) => setTeacherData((prevData) => ({ ...prevData, BloodGroup: value }))}
                  value={teacherData.BloodGroup}
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


                {/*DOB*/}
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5,}}>
                    <Icon name="calendar-today" size={20} style={{ marginRight: 5 }} />
                    <Text>Date of Birth:</Text>
                  </View>
                  <Button title={teacherData.DOB || "Select Date"} onPress={() => setShowPicker(true)}/>
                  {showPicker && (
                    <DateTimePicker
                      value={teacherData.DOB ? new Date(teacherData.DOB) : new Date()} // Convert DOB to Date if exists
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                {/*Reporting To*/}
                <View style={{ marginBottom: 10, paddingVertical: 5, }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                    <Icon name="supervisor-account" size={20} style={{ marginRight: 5 }} />
                    <Text>Reporting To:</Text>
                  </View>
                  
                  <RadioButton.Group
                    onValueChange={(value) => setTeacherData((prevData) => ({ ...prevData, ReportingTo: value }))}
                    value={teacherData.ReportingTo}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {["Principal", "Head", "Finance", "Management"].map((item) => (
                        <View key={item} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                          <RadioButton value={item} />
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>

                <View style={styles.buttonRow_i}>
                  <TouchableOpacity 
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("basic")}
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
            
            {/* Bank Details Tab */}
            {currentTab === "bank" && (
              <>
                {/* Name in Bank */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon name="account-circle" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Name in Bank"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setTeacherData({ ...teacherData, NameInBank: text })}
                  />
                </View>

                {/* Bank Name */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon name="account-balance" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Bank Name"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setTeacherData({ ...teacherData, BankName: text })}
                  />
                </View>

                {/* Account Number */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon name="credit-card" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Account Number"
                    keyboardType="numeric"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setTeacherData({ ...teacherData, AccountNo: text })}
                  />
                </View>


                {/* IFSC Code */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5,}}>
                  <Icon name="payment" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="IFSC Code"
                    style={{ borderBottomWidth: 1, flex: 1 }}
                    onChangeText={(text) => setTeacherData({ ...teacherData, IfscCode: text })}
                  />
                </View>

                <View style={styles.buttonRow_i}>
                  <TouchableOpacity 
                    style={styles.prevButton_i}
                    onPress={() => setCurrentTab("document")}
                  >
                    <Text style={styles.buttonText_i}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.submitButton_i}
                    onPress={handleAddTeacher}
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
      <Modal visible={detailModalVisible} animationType="slide">
        <View style={styles.detailModal}>
          {selectedTeacher && (
            <ScrollView>
              <View style={styles.modalView}>
              <TouchableOpacity style={styles.button} onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              </View>
              {/* Teacher Image */}
              {selectedTeacher.photo && (
                <Image source={{ uri: selectedTeacher.photo }} style={styles.detailImage} />
              )}

              {/* Tab Buttons */}
              <View style={styles.tabContainer}>
                  <TouchableOpacity style={[styles.tabButton, selectedTab === "basic" && styles.activeTab]} onPress={() => setSelectedTab("basic")}>
                    <Text style={styles.tabText}>Basic Detail</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tabButton, selectedTab === "document" && styles.activeTab]} onPress={() => setSelectedTab("document")}>
                    <Text style={styles.tabText}>Document Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tabButton, selectedTab === "bank" && styles.activeTab]} onPress={() => setSelectedTab("bank")}>
                    <Text style={styles.tabText}>Bank Detail</Text>
                  </TouchableOpacity>
              </View>
            

              {/* Dynamic Details based on selected tab */}
              <View style={styles.detailContainer}>
                {selectedTab === "basic" ? (
                  <>
                    <View style={styles.containe_t}> 
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Staff Code:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.staffCode || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Name:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.fullName || `${selectedTeacher.firstName} ${selectedTeacher.lastName}` || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Category:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.category || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Address:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.address || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>City:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.city || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>State:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.state || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Pin Code:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.pincode || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Gender:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.gender || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Reports To:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.reportsTo || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Joining Date:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.joiningDate ? new Date(selectedTeacher.joiningDate).toLocaleDateString() : "N/A"}</Text>
                      </View>
                    </View>
                  </>
                ) : selectedTab === "document" ? (
                  <>
                    <View style={styles.containe_t}> 
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Father/Husband Name:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.fatherOrHusbandName || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Mobile Number:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.mobile || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Email ID:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.email || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>PAN No:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.pan || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Qualification:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.qualification || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Aadhar No:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.aadharNo || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Blood Group:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.bloodGroup || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Date of Birth:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.dateOfBirth ? new Date(selectedTeacher.dateOfBirth).toLocaleDateString() : "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Religion:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.religion || "N/A"}</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Experience:</Text>
                        <Text style={styles.cell_t}>{selectedTeacher.experience ? `${selectedTeacher.experience} years` : "N/A"}</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.containe_t}> 
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Bank Details:</Text>
                        <Text style={styles.cell_t}>Not Available in Database</Text>
                      </View>
                      <View style={styles.row_t}>
                        <Text style={styles.header_t}>Note:</Text>
                        <Text style={styles.cell_t}>Bank information is not stored in the current database schema. This feature can be added later.</Text>
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
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "bold",
    marginBottom: 10,
  },
  teacherList: {
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: '16px',
    justifyContent: "space-between",
  },

// card view of teacher

  card: {
    width: "25%",
    padding: 15,
    backgroundColor: "#f9f6e0",
    borderWidth:1,
    borderRadius: 10,
    marginBottom: 10,
    margin:4,
    alignItems: "center",
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'gray',
    borderWidth:1,
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

// add teacher form 

  modalContent: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8e8',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },

  buttonRow_i: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton_i: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderWidth:1,
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
    borderWidth:1,
    borderRadius: 5,
    flex: 1,
  },
  buttonText_i: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // View the teacher details CSS

  detailModal: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor:'#f8f8e8',
    borderRadius: 5,
    borderWidth: 5,
    borderColor:'black',
  },
  detailImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth:5,
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
    flex:1,
    backgroundColor: 'red', // Button color
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth:1,
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
  },

  detailContainer: {
    marginTop: 15,
    padding: 10,
  },
  
  // tab CSS


  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    justifyContent: 'flex-end',
    top:10,
    borderWidth: 1,
    borderRadius:12,
    borderColor: "black",
    backgroundColor: "#f8f8f8",
    marginBottom:10,
  },
  
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  
  activeTab: {
    fontSize:15,
    fontWeight:'bold',
    backgroundColor: "#eacb4e",
  },
  
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  
  // Upload Image 
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


  
  // table CSS
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
    paddingVertical:12,
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




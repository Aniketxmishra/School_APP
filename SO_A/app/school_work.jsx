import React, { useState } from "react";
import { View, Text, Button, Modal, TextInput, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeworkClassworkScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [formData, setFormData] = useState({ teacher: "", date: "", class: "", section: "", subject: "", title: "", description: "", targetDate: "", image: null, showDatePicker: false, });
  const [uploadedWork, setUploadedWork] = useState([]);

  const sections = ['A', 'B', 'C', 'D', 'E', 'ALL'];

  // Function to format date as "Day Month Year"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long', // "Monday"
      year: 'numeric', // "2025"
      month: 'long', // "March"
      day: 'numeric', // "25"
    });
  };

  // input handler
  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
    setFormData({ teacher: "", date: "", class: "", subject: "", title: "", description: "", targetDate: "", image: null });
  };

  // image handler
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  // hander 
  const handleSubmit = () => {
    setUploadedWork([...uploadedWork, { ...formData, type: modalType }]);
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, padding: 20, backgroundColor: '#FFFECE' }}>
      <ScrollView>
        {/*Title page text */}
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>ADD HomeWork & ClassWork</Text>

        {/*Add Classwork*/}
        <TouchableOpacity
          style={{
            backgroundColor: '#FFA500',
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginTop: 20,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => openModal("Class Work")}
        >
          <Text style={{
            color: 'black',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 16,
          }}>
            ADD CLASSWORK
          </Text>
        </TouchableOpacity>

        {/*Add HomeWork */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FFA500',
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginTop: 20,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => openModal("Home Work")}
        >
          <Text style={{
            color: 'black',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 16,
          }}>
            ADD HOMEWORK
          </Text>
        </TouchableOpacity>


        {/*Text recently Uploded*/}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, borderBottomWidth: 1, paddingTop: 30, }}>Recently Uploaded Work</Text>

        {/*Image zoom Function */}
        {uploadedWork.map((work, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedImage(work.image);
              setImageModalVisible(true);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor:'#FFD0C7', padding:1,borderRadius:15,marginTop:5 }}
          >
            {work.image && (
              <Image
                source={{ uri: work.image }}
                style={{ width: 100, height: 100, marginRight: 10, marginLeft:5 }}
              />
            )}
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{work.type}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Date:
                <Text style={{ fontWeight: '300' }}>
                  {new Date(work.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Class: <Text style={{ fontWeight: '300' }}>{work.class}</Text>
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Section: <Text style={{ fontWeight: '300' }}>{work.section}</Text>
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Subject: <Text style={{ fontWeight: '300' }}>{work.subject}</Text>
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Title: <Text style={{ fontWeight: '300' }}>{work.title}</Text>
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                Description: <Text style={{ fontWeight: '300' }}>{work.description}</Text>
              </Text>
              {work.type === "Home Work" && (
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                  Target Date:
                  <Text style={{ fontWeight: '300' }}>
                    {new Date(work.targetDate).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/*Model input Class & home WORK*/}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
            <Text style={{ fontSize: 20 }}>✖</Text>
          </TouchableOpacity>

          {/*Title Homework */}
          {modalType === "Home Work" && <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1, marginBottom: 10 }}>
            Add HomeWork
          </Text>}

          {/*Title Classwork */}
          {modalType === "Class Work" && <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1, marginBottom: 10 }}>
            Add ClassWork
          </Text>}


          {/* Teacher's Name */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 15 }}>
            <Icon name="person" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Teacher's Name"
              style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
              value={formData.teacher} // Add the value from formData
              onChangeText={(text) => setFormData({ ...formData, teacher: text })} // Update the formData
            />
          </View>


          {/* TextInput for the Date */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Icon name="event" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Select Date"
              value={formData.date ? formatDate(new Date(formData.date)) : "Select Date"}
              onFocus={() => setShowDatePicker(true)}
              onTouchStart={() => setShowDatePicker(true)}
              style={{
                borderWidth: 1,
                padding: 8,
                borderRadius: 4,
                flex: 1,
                marginBottom: 10,
              }}
            />
          </View>

          {/* Show Date Picker if showDatePicker is true */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date ? new Date(formData.date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({
                    ...formData,
                    date: selectedDate.toISOString(),
                  });
                }
              }}
            />
          )}


          {/* Select Class Picker */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
              <Icon name="school" size={20} style={{ marginRight: 5 }} />
              <Text>Select Class:</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderRadius: 5, marginLeft: 30, }}>
              <Picker
                selectedValue={formData.class}
                onValueChange={(itemValue) => setFormData({ ...formData, class: itemValue })}
                style={{
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 4,
                  flex: 1,
                  marginBottom: 1,

                }}
              >
                <Picker.Item label="Class I" value="Class I" />
                <Picker.Item label="Class II" value="Class II" />
                <Picker.Item label="Class III" value="Class III" />
                <Picker.Item label="Class IV" value="Class IV" />
                <Picker.Item label="Class V" value="Class V" />
                <Picker.Item label="Class VI" value="Class VI" />
                <Picker.Item label="Class VII" value="Class VII" />
                <Picker.Item label="Class VIII" value="Class VIII" />
                <Picker.Item label="Class IX" value="Class IX" />
                <Picker.Item label="Class X" value="Class X" />
                <Picker.Item label="Class XI" value="Class XI" />
                <Picker.Item label="Class XII" value="Class XII" />
              </Picker>
            </View>
          </View>

          {/*Select Section Radio Button*/}
          <View style={{ marginBottom: 10, paddingVertical: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Icon name="list" size={20} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 16 }}>Select Section</Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 10 }}>
              {sections.map((sec) => (
                <TouchableOpacity
                  key={sec}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    marginLeft: 10,
                    paddingleft: 1,
                    borderWidth: 2,
                    borderColor: formData.section === sec ? "#2E86C1" : "#ccc",  // Use formData.section
                    backgroundColor: formData.section === sec ? "#2E86C1" : "white",  // Change color based on selection
                    borderRadius: 100,
                    marginLeft: 25,
                  }}
                  onPress={() => setFormData({ ...formData, section: sec })}  // Update formData with the selected section
                >
                  <Text style={{ color: formData.section === sec ? "white" : "black", paddingLeft: 5, paddingRight: 5 }}>
                    {sec}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          {/* Subject Input */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 5 }}>
            <Icon name="book" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Subject"
              style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />
          </View>

          {/* Title Input */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Icon name="title" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Title"
              style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          {/* Description Input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Icon
              name="description"
              size={20}
              color="#333"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Enter a detailed description"
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderColor: 'black',
                paddingVertical: 8,
                paddingHorizontal: 10,
                fontSize: 16,
                color: '#333',
              }}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholderTextColor="#999"
              accessibilityLabel="Description input field"
            />
          </View>

          {modalType === "Home Work" &&
            (<>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 1, paddingVertical: 5 }}>
                <Icon name="event" size={20} style={{ marginRight: 5 }} />
                <Text>Select Target Date:</Text>
              </View>
              <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => setFormData({ ...formData, showDatePicker: true })}
              >
                <Text style={styles.selectDateText}>
                  {formData.targetDate ? formatDate(new Date(formData.targetDate)) : 'Tap to select a date'}
                </Text>
                <Icon name="calendar-today" size={24} color="blue" style={styles.icon} />
              </TouchableOpacity>

              {/* DateTimePicker */}
              {formData.showDatePicker && (
                <DateTimePicker
                  value={formData.targetDate ? new Date(formData.targetDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setFormData({
                      ...formData,
                      showDatePicker: false,
                      targetDate: selectedDate ? selectedDate.toISOString() : formData.targetDate,
                    });
                  }}
                />
              )}
            </>)
          }

          {/* Select Upload image */}
          <View>
            <TouchableOpacity
              onPress={handleImagePick}
              style={{
                backgroundColor: '#FF7F00', // Orange color
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000', // Adding shadow for better appearance
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                marginBottom: 20, // Adds shadow on Android
              }}
            >
              {/* Icon (optional) */}
              <Icon name="image" size={20} color="#fff" style={{ marginRight: 10 }} />

              {/* Button Text */}
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600', // Makes the text bold
              }}>
                Upload Image
              </Text>
            </TouchableOpacity>
          </View>
          {formData.image &&
            <Image source={{ uri: formData.image }} style={{ width: 200, height: 200 }} />
          }

          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </Modal>

      <Modal visible={imageModalVisible} transparent={true} onRequestClose={() => setImageModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: "90%", height: "80%", resizeMode: "contain" }} />}
          <Button title="Close" onPress={() => setImageModalVisible(false)} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold', // To make the title more prominent
    color: '#333', // Dark color for the title
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#e0e0e0', // Light grey background for the date selector
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc', // Light border around the date selector
  },
  selectDateText: {
    fontSize: 16,
    color: '#007bff', // Blue text for the date label
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  selectedDateText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333', // Dark color for selected date
    fontWeight: '600', // Make selected date text bold
  },
  button: {
    backgroundColor: '#4CAF50',  // A professional green color
    paddingVertical: 12,  // Vertical padding for the button
    paddingHorizontal: 20,  // Horizontal padding for the button
    borderRadius: 8,  // Rounded corners
    shadowColor: '#000',  // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,  // Elevation for Android shadow
  },
  buttonText: {
    color: '#fff',  // White text color
    fontSize: 16,  // Font size for the text
    fontWeight: 'bold',  // Bold text for emphasis
    textAlign: 'center',  // Centering the text within the button
  },
});


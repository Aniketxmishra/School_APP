import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, ScrollView } from "react-native";
import * as Linking from "expo-linking";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LiveClassZone() {
  const [modalVisible, setModalVisible] = useState(false);
  const [liveClasses, setLiveClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    teacher: "",
    class: "",
    section: "",
    subject: "",
    startTime: new Date(),
    endTime: new Date(),
    link: ""
  });
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const [section, setSection] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    Linking.canOpenURL("https://www.google.com").then((supported) => {
      if (!supported) {
        console.log("Opening links is not supported on this device.");
      }
    });
  }, []);

  const handleAddClass = () => {
    setLiveClasses([...liveClasses, newClass]);
    setModalVisible(false);
    setNewClass({ teacher: "", class: "", section: "", subject: "", startTime: new Date(), endTime: new Date(), link: "" });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#EDF4C2' }}>
      <View style={{ backgroundColor: "#EFDCAB", borderRadius: 30, marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>Live Class Zone</Text>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: '#99BC85', padding: 10, marginVertical: 10, borderRadius: 20, borderWidth: 1, }}>
        <Text style={{ color: "#000", textAlign: "center", fontSize: 20, fontWeight: 'bold' }}>Add Online Class</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center", borderBottomWidth: 1, marginBottom: 10, borderRadius: 50, }}>
        <Text style={{ fontSize: 18, marginTop: 10 }}>Available Live Classes:</Text>
      </View>

      <FlatList
        data={liveClasses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              const url = item.link.startsWith("http://") || item.link.startsWith("https://")
                ? item.link
                : `https://${item.link}`;
              Linking.openURL(url).catch(err => console.error("Failed to open link:", err));
            }}
            style={{ padding: 15, marginVertical: 5, backgroundColor: "#FFDFEF", borderRadius: 8, borderWidth:1, }}
          >
            <Text style={{fontWeight:'bold'}}>Class & Section : <Text style={{fontWeight:"300"}}>{item.class}-{item.section}</Text></Text>
            <Text style={{fontWeight:'bold'}}>Teacher: <Text style={{fontWeight:"300"}}>{item.teacher}</Text></Text>
            <Text style={{fontWeight:'bold'}}>Subject: <Text style={{fontWeight:"300"}}>{item.subject}</Text></Text>
            <Text style={{fontWeight:'bold'}}>Time: <Text style={{fontWeight:"300"}}>{item.startTime.toLocaleTimeString()} - {item.endTime.toLocaleTimeString()}</Text></Text>
            <Text style={{ color: "blue", textAlign:"center" }}>Click to Join the Class </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <KeyboardAvoidingView>
            <ScrollView>
              <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, backgroundColor: '#F6F1DE' }}>

                {/*Close model button */}
                <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
                  <Text style={{ fontSize: 30, color: 'red' }}>✖</Text>
                </TouchableOpacity>

                {/*title of the Input form  */}
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Add Online Class</Text>
                </View>

                {/* Teacher Name Box */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="account" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Teacher Name"
                    value={newClass.teacher}
                    onChangeText={(text) => setNewClass({ ...newClass, teacher: text })}
                    style={{ borderBottomWidth: 1, flex: 1, marginRight: 10 }}
                  />
                </View>

                {/* Class Selection */}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
                    <Icon name="school" size={20} style={{ marginRight: 10 }} />
                    <Text>Select Class:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderRadius: 5, marginLeft: 30 }}>
                    <Picker
                      selectedValue={newClass.class}
                      onValueChange={(value) => setNewClass({ ...newClass, class: value })}
                      style={{ flex: 1 }}
                    >
                      <Picker.Item label="Class I" value="I" />
                      <Picker.Item label="Class II" value="II" />
                      <Picker.Item label="Class III" value="III" />
                      <Picker.Item label="Class IV" value="IV" />
                      <Picker.Item label="Class V" value="V" />
                      <Picker.Item label="Class VI" value="VI" />
                      <Picker.Item label="Class VII" value="VII" />
                      <Picker.Item label="Class VIII" value="VIII" />
                      <Picker.Item label="Class IX" value="IX" />
                      <Picker.Item label="Class X" value="X" />
                      <Picker.Item label="Class XI" value="XI" />
                      <Picker.Item label="Class XII" value="XII" />
                    </Picker>
                  </View>
                </View>

                {/* section Selection */}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="clipboard-text" size={20} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16 }}>Select Section</Text>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10, marginLeft: 30 }}>
                    {sections.map((sec) => (
                      <TouchableOpacity
                        key={sec}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5,
                          borderWidth: 2,
                          borderColor: newClass.section === sec ? "#183B4E" : "#ccc",
                          backgroundColor: newClass.section === sec ? "#FF9B17" : "white",
                          borderRadius: 100,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginRight: 25,
                        }}
                        onPress={() => setNewClass({ ...newClass, section: sec })}
                      >
                        <Text style={{ color: newClass.section === sec ? "white" : "black" }}>{sec}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Subject Box */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="book-open-page-variant" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Subject"
                    value={newClass.subject}
                    onChangeText={(text) => setNewClass({ ...newClass, subject: text })}
                    style={{ borderBottomWidth: 1, flex: 1, marginRight: 10 }}
                  />
                </View>

                {/* START TIME  */}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                    <Icon name="clock-start" size={22} color="#4A4A4A" style={{ marginRight: 12 }} />
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>Select Start Time:</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 15
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
                      Selected Start Time:
                      <Text
                        style={{
                          backgroundColor: '#ffdd23',
                          borderRadius: 5,
                          paddingVertical: 3,
                          paddingHorizontal: 8,
                          fontWeight: 'bold',
                          color: '#4A4A4A',
                          marginLeft: 5
                        }}
                      >
                        {newClass.startTime.toLocaleTimeString()}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={newClass.startTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowStartPicker(false);
                        if (selectedTime) setNewClass({ ...newClass, startTime: selectedTime });
                      }}
                    />
                  )}
                </View>

                {/* END TIME */}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon name="clock-end" size={20} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16 }}>Select End Time: </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 15
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
                      Selected Start Time:
                      <Text
                        style={{
                          backgroundColor: '#ffdd23',
                          borderRadius: 5,
                          paddingVertical: 3,
                          paddingHorizontal: 8,
                          fontWeight: 'bold',
                          color: '#4A4A4A',
                          marginLeft: 5
                        }}
                      >
                        {newClass.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  {showEndPicker && (
                    <DateTimePicker
                      value={newClass.startTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowEndPicker(false);
                        if (selectedTime) setNewClass({ ...newClass, endTime: selectedTime });
                      }}
                    />
                  )}
                </View>

                {/* Subject Box */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                  <Icon name="link" size={20} style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="LINK FOR CLASS"
                    value={newClass.link}
                    onChangeText={(text) => setNewClass({ ...newClass, link: text })}
                    style={{ borderBottomWidth: 1, flex: 1, marginRight: 10 }}
                  />
                </View>

                {/*SUbmit Button */}
                <TouchableOpacity onPress={handleAddClass} style={{
                  backgroundColor: '#FF9B17',
                  padding: 10,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  marginTop: 10,
                  marginLeft: 20,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}>
                  <Text style={{ color: 'black', fontSize: 16, fontWeight: '600', }}>Submit</Text>
                </TouchableOpacity>


              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
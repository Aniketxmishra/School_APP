import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, Modal, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { RadioButton, Title } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const NotificationScreen = () => {
    const [showForm, setShowForm] = useState(false);
    const [notificationType, setNotificationType] = useState("Student");
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [classSelection, setClassSelection] = useState("ALL");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [section, setSection] = useState("ALL");

    const sections = ['A', 'B', 'C', 'D', 'E', 'ALL'];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        const newNotification = {
            id: Math.random().toString(),
            type: notificationType,
            date: date.toDateString(),
            endDate: endDate.toDateString(),
            title,
            class: classSelection,
            section,
            description,
            image,
        };
        setNotifications([...notifications, newNotification]);
        setShowForm(false);
        setImage(null);
        setTitle("");
        setDescription("");
        setSection("ALL");
        setClassSelection("ALL")
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setImage(null);
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor:"#FFFECE" }}>
            {/*ADD Notification Button */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#FF8C00', // Orange color
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderWidth: 1,
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                }}
                onPress={() => setShowForm(true)}
            >
                <Icon name="bell" size={20} color="green" style={{ marginRight: 10 }} />
                <Text style={{ color: 'black', fontSize: 16, fontWeight: '600', }}>Add Notification</Text>
                <Icon name="bell" size={20} color="green" style={{ marginLeft: 10 }} />
            </TouchableOpacity>


            <Modal visible={showForm} animationType="slide">
                <ScrollView style={{ padding: 10  }}>
                    <KeyboardAvoidingView>

                        {/*Close model button */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleCloseForm}>
                            <Text style={{ fontSize: 20 }}>✖</Text>
                        </TouchableOpacity>

                        {/*Title of model */}
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1, paddingBottom: 20, }}>
                            Add Notification
                        </Text>

                        {/*Select the Notifcation Type */}
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Icon name="bell" size={20} style={{ marginRight: 10 }} />
                                <Text style={{ fontSize: 16 }}>Select Notification For:</Text>
                            </View>

                            <RadioButton.Group
                                onValueChange={(value) => setNotificationType(value)}
                                value={notificationType}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 25, padding: 1, marginBottom: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 30 }}>
                                        <RadioButton value="Student" />
                                        <Text>Student</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 30 }}>
                                        <RadioButton value="Staff" />
                                        <Text>Staff</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
                                        <RadioButton value="For All" />
                                        <Text>ALL</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>

                        {/* Class Selection */}
                        <View>
                            {notificationType === "Student" && (
                                <>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5 }}>
                                        <Icon name="school" size={20} style={{ marginRight: 5 }} />
                                        <Text>Select Class:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderRadius: 5, marginLeft: 30 }}>
                                        <Picker
                                            selectedValue={classSelection} // Use classSelection here
                                            onValueChange={(itemValue) => setClassSelection(itemValue)} // Update the state
                                            style={{
                                                height: 50,
                                                borderWidth: 1,
                                                borderRadius: 4,
                                                flex: 1,
                                                marginBottom: 1,
                                            }}
                                        >
                                            <Picker.Item label="ALL" value="ALL" />
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
                                </>
                            )}
                        </View>

                        {/* Section Selection */}
                        <View>
                            {notificationType === "Student" && (
                                <>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                        <Icon name="school" size={20} style={{ marginRight: 10 }} />
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
                                                    borderWidth: 2,
                                                    borderColor: section === sec ? "#2E86C1" : "#ccc",  // Use section state
                                                    backgroundColor: section === sec ? "#2E86C1" : "white",  // Change color based on selection
                                                    borderRadius: 100,
                                                    marginLeft: 25,
                                                }}
                                                onPress={() => setSection(sec)}  // Update section state with selected value
                                            >
                                                <Text style={{ color: section === sec ? "white" : "black", paddingLeft: 5, paddingRight: 5 }}>
                                                    {sec}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </>
                            )}
                        </View>

                        {/*Select the date function  */}
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Icon name="calendar" size={20} style={{ marginRight: 10 }} />
                                <Text style={{ fontSize: 16 }}>Select Date:</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Text>Selected Date: </Text>
                                    <View style={{ backgroundColor: '#fdd', padding: 5, borderRadius: 30, borderWidth: 1, alignItems: 'center', paddingHorizontal: 50 }}>
                                        <Text>{date.toDateString()}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setDate(selectedDate);
                                    }}
                                />
                            )}
                        </View>

                        {/*Select the END date function  */}
                        <View style={{ marginTop: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Icon name="calendar" size={20} style={{ marginRight: 10 }} />
                                <Text style={{ fontSize: 16 }}>Select End Date:</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Text>Selected End Date:</Text>
                                    <View style={{ backgroundColor: '#fdd', padding: 5, borderRadius: 30, borderWidth: 1, alignItems: 'center', paddingHorizontal: 38 }}>
                                        <Text>{endDate.toDateString()}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) setEndDate(selectedDate);
                                    }}
                                />
                            )}
                        </View>

                        {/* title input Box */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                            <Icon name="label" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Title"
                                value={title}
                                onChangeText={setTitle}
                                style={{ borderBottomWidth: 1, flex: 1, marginRight: 10 }}
                            />
                        </View>

                        {/* Descripton Box */}
                        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10, paddingVertical: 5 }}>
                            <Icon name="comment" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    flex: 1,
                                    padding: 10,
                                    height: 100,
                                    textAlignVertical: 'top',
                                    marginRight: 10,
                                    backgroundColor: '#FFF2DB'
                                }}
                                multiline
                            />
                        </View>

                        {/* Upload image Box */}
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, paddingVertical: 5, marginTop: 15 }}>
                                <Ionicons name="image" size={20} color="#4CAF50" />
                                <Text style={{ fontSize: 16, marginLeft: 5 }}> Click to upload Images</Text>
                            </View>

                            <TouchableOpacity onPress={pickImage}>
                                <View style={{ borderRadius: 10, borderwith: 1, padding: 10, backgroundColor: "gray", left: 30, marginRight: 40 }}>
                                    <Text style={{ textAlign: 'center' }}>Upload Images</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <ScrollView horizontal>
                                    {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}
                                </ScrollView>
                            </View>
                        </View>

                        {/*Submint button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#E69DB8', // Orange color
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                marginTop: 10,
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
                            }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600', }}>Submit Notification</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Modal>

            <View style={{marginTop:10, alignItems:'center', padding:10, backgroundColor:"#fff", borderRadius: 100, borderBottomWidth:1,}}>
                <Text style={{fontSize:16}}> Recent Notification </Text>
            </View>

            <ScrollView>
                {notifications.map((item) => (
                    <View key={item.id} style={{ marginTop: 10, padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor:"#eded" }}>
                        <View style={{alignItems:'center', backgroundColor:'#fddd', borderRadius:10,borderWidth:1, padding:5,}}>
                            <Text style={{ fontWeight: 'bold' }}>{item.type} Notification </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop:10 }}>
                            {item.image && (
                                <TouchableOpacity onPress={() => setZoomedImage(item.image)} style={{ marginRight: 10 }}>
                                    <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                                </TouchableOpacity>
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Duration Time: <Text style={{ fontWeight: '300' }}>{item.date} - {item.endDate}</Text></Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Title: <Text style={{ fontWeight: '300' }}>{item.title}</Text></Text>
                                {item.type === "Student" && (
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>CLass: <Text style={{ fontWeight: '300' }}>{item.class}</Text></Text>
                                )}
                                {item.type === "Student" && (
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Section: <Text style={{ fontWeight: '300' }}>{item.section}</Text></Text>
                                )}
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Description: <Text style={{ fontWeight: '300' }}>{item.description}</Text></Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={!!zoomedImage} transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
                    <Image source={{ uri: zoomedImage }} style={{ width: 300, height: 300 }} />
                    <Button onPress={() => setZoomedImage(null)}>Close</Button>
                </View>
            </Modal>
        </View>
    );
};

export default NotificationScreen;

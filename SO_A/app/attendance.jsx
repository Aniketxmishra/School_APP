import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Modal, Button, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Checkbox } from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

const AttendanceZone = () => {
    const [studentModalVisible, setStudentModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [attendanceData, setAttendanceData] = useState([
        { id: '1', name: 'John Doe', class: 'I', section: 'A', status: '', remark: '' },
        { id: '2', name: 'Jane Doe', class: 'I', section: 'B', status: '', remark: '' },
        { id: '3', name: 'Sam Smith', class: 'II', section: 'B', status: '', remark: '' },
        { id: '4', name: 'Sara Connor', class: 'XII', section: 'C', status: '', remark: '' },
        { id: '5', name: 'John Doe', class: 'III', section: 'A', status: '', remark: '' },
        { id: '6', name: 'Jane Doe', class: 'IV', section: 'A', status: '', remark: '' },
        { id: '7', name: 'Sam Smith', class: 'V', section: 'B', status: '', remark: '' },
        { id: '8', name: 'Sara Connor', class: 'XII', section: 'B', status: '', remark: '' },
        { id: '9', name: 'John Doe', class: 'IV', section: 'A', status: '', remark: '' },
        { id: '10', name: 'Jane Doe', class: 'VI', section: 'A', status: '', remark: '' },
        { id: '11', name: 'Sam Smith', class: 'IX', section: 'B', status: '', remark: '' },
        { id: '12', name: 'Sara Connor', class: 'XII', section: 'C', status: '', remark: '' },
        { id: '13', name: 'John Doe', class: 'VII', section: 'A', status: '', remark: '' },
        { id: '14', name: 'Jane Doe', class: 'VI', section: 'A', status: '', remark: '' },
        { id: '15', name: 'Sam Smith', class: 'III', section: 'B', status: '', remark: '' },
        { id: '16', name: 'Sara Connor', class: 'IV', section: 'C', status: '', remark: '' }
    ]);
    const [submitted, setSubmitted] = useState(false);
    const currentDate = new Date().toLocaleDateString();
    const [teacherDialogVisible, setTeacherDialogVisible] = useState(false);

    // Teacher section 
    const [teacherselfattendance, setteacherselfattendance] = useState(false);
    const dummyTeachers = [
        { id: "T001", name: "John Doe" },
        { id: "T002", name: "Jane Smith" },
    ];

    const [showSearch, setShowSearch] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [present, setPresent] = useState(false);
    const [image, setImage] = useState(null);

    const handleSelectTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    };

    // Teacher section 

    // Teachr Subordnitae 

    const teachersData = [
        { id: "1", name: "Pump", teacherId: "C2183" },
        { id: "2", name: "John", teacherId: "C2184" },
        { id: "3", name: "Doe", teacherId: "C2185" },
    ];


    const [showsubattend, setshowsubattend] = useState(false);
    const [search, setSearch] = useState("");
    const [attendance, setAttendance] = useState({});
    const [showInput, setShowInput] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formVisible, setFormVisible] = useState(true);

    const handleStatusToggle = (id) => {
        setAttendance((prev) => {
            let newStatus = "Enter Status";
            if (prev[id] === "Enter Status") newStatus = "Present";
            else if (prev[id] === "Present") newStatus = "Absent";
            else newStatus = "Enter Status";
            return { ...prev, [id]: newStatus };
        });
    };

    const handleSubmitsub = () => {
        Alert.alert("Success", `Teacher attendance is stored for ${date.toDateString()}`);
        console.log("Attendance Stored", attendance);
        setFormVisible(false);
    };

    const filteredTeachers = teachersData.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.teacherId.toLowerCase().includes(search.toLowerCase())
    );

    if (!formVisible) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Attendance Stored</Text>

                {/* First button to mark again */}
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: "blue" }}
                    onPress={() => {
                        setAttendance({});
                        setFormVisible(true);
                    }}
                >
                    <Text style={{ color: "white" }}>Mark Again</Text>
                </TouchableOpacity>

                {/* Second button to exit the current screen */}
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: "red" }}
                    onPress={() => {
                        setAttendance({});
                        setFormVisible(true);
                        navigation.goBack();  // Use goBack to exit the current screen
                    }}
                >
                    <Text style={{ color: "white" }}>Exit</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Teachr Subordnitae 

    const handleDateChange = (event, date) => {
        if (date) setSelectedDate(date.toDateString());
    };

    const togglePresent = () => {
        setPresent((prev) => !prev);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            cameraType: ImagePicker.CameraType.front,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmitteacher = () => {
        if (selectedDate && present && image) {
            Alert.alert("Attendance Stored", `Teacher: ${selectedTeacher.name}\nID: ${selectedTeacher.id}\nYour attendance has been stored successfully.`);
            setModalVisible(false);
            setSelectedTeacher(null);
            setSelectedDate(null);
            setPresent(false);
            setImage(null);
        } else {
            alert("Please select Date, mark Present and upload a selfie!");
        }
    };

    const handleSubmit = () => {
        if (!submitted) {
            setSubmitted(true);
            setTimeout(() => {
                setStudentModalVisible(false);
                setSubmitted(false);
            }, 500);
            setSelectedClass('')
            setSelectedSection('')
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={{ backgroundColor: "#E4EFE7" }}>
                {/*Title Page */}
                <View style={{ alignItems: 'center', padding: 10, marginTop: 5, backgroundColor: "#E4EFE7" }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20 }}>Attendance Zone</Text>
                </View>

                {/*Attendance Buttons*/}
                <View style={{ padding: 20, backgroundColor: "#E4EFE7", marginBottom: 500 }}>
                    {/*Button Student Attendance  */}
                    <TouchableOpacity style={{
                        backgroundColor: '#FF8C00',
                        paddingVertical: 12,
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderRadius: 30,
                        borderBottomWidth: 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                    }}
                        onPress={() => setStudentModalVisible(true)}>
                        <Text style={{ fontSize: 20, color: 'black', fontSize: 16, fontWeight: '600' }}>Student Attendance</Text>
                    </TouchableOpacity>

                    {/*Button teacher Attendance  */}
                    <TouchableOpacity style={{
                        marginTop: 10,
                        backgroundColor: '#FF8C00',
                        paddingVertical: 12,
                        paddingHorizontal: 18,
                        borderWidth: 1,
                        borderBottomWidth: 2,
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
                        onPress={() => setTeacherDialogVisible(true)}>
                        <Text style={{ fontSize: 20, color: 'black', fontSize: 16, fontWeight: '600' }}>Teacher Attendance / Self</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Student attendence section  */}
            <Modal visible={studentModalVisible} animationType="slide" transparent={false}>
                <View style={{ flex: 1, padding: 10, backgroundColor: '#DBDBDB' }}>

                    {/* Close Button */}
                    <TouchableOpacity onPress={() => setStudentModalVisible(false)}>
                        <Text style={{ fontSize: 20, alignSelf: 'flex-end', padding: 5 }}>✕</Text>
                    </TouchableOpacity>

                    {/* Title  */}
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>Student Attendance</Text>
                    </View>

                    {/* Time Vlaue */}
                    <View style={{ flexWrap: "wrap-reverse" }}>
                        <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: "bold" }}>Date: {currentDate}</Text>
                    </View>

                    {/* Filter Section */}
                    <View >
                        {/* Class Picker */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon name="school" size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16 }}>Select Class</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderBottomWidth: 2, borderRadius: 25, marginLeft: 20, marginRight: 10, backgroundColor: '#E4EFE7' }}>
                            <Picker
                                selectedValue={selectedClass}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue) => setSelectedClass(itemValue)}>
                                <Picker.Item label="Select Class" value="" />
                                <Picker.Item label="I" value="I" />
                                <Picker.Item label="II" value="II" />
                                <Picker.Item label="III" value="III" />
                                <Picker.Item label="IV" value="IV" />
                                <Picker.Item label="V" value="V" />
                                <Picker.Item label="VI" value="VI" />
                                <Picker.Item label="VII" value="VII" />
                                <Picker.Item label="VIII" value="VIII" />
                                <Picker.Item label="IX" value="IX" />
                                <Picker.Item label="X" value="X" />
                                <Picker.Item label="XI" value="XI" />
                                <Picker.Item label="XII" value="XII" />
                            </Picker>
                        </View>

                        {/* Section Picker */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
                            <Icon name="list" size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16 }}>Select Class</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderBottomWidth: 2, borderRadius: 25, marginLeft: 20, marginRight: 10, backgroundColor: '#E4EFE7' }}>
                            <Picker
                                selectedValue={selectedSection}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue) => setSelectedSection(itemValue)}>
                                <Picker.Item label="Select Section" value="" />
                                <Picker.Item label="A" value="A" />
                                <Picker.Item label="B" value="B" />
                                <Picker.Item label="C" value="C" />
                            </Picker>
                        </View>
                    </View>

                    {/* Search Name */}
                    <View style={{ borderBottomWidth: 1, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon name="search" size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16 }}>Search the Student</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
                            height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginLeft: 30, marginRight: 10, marginBottom: 10
                        }}>
                            <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                            <TextInput
                                style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0 }}
                                placeholder="Search Student"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {selectedClass && selectedSection && (
                        <>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Available Student Details</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>S.No</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 25 }}>Name</Text>
                                <View style={{ alignItems: 'center', marginLeft: 20 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>class</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Section</Text>
                                </View>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 20 }}>Status</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 60 }}>Remark</Text>
                            </View>
                            <FlatList
                                data={attendanceData.filter(student =>
                                    student.class === selectedClass &&
                                    student.section === selectedSection &&
                                    student.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.row}>
                                        <Text>{item.id}</Text>
                                        <Text>{item.name}</Text>
                                        <Text>{item.class}-{item.section}</Text>

                                        {/* Present Checkbox */}
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                                <Checkbox
                                                    value={item.status === 'Present'}
                                                    onValueChange={() => {
                                                        const newStatus = item.status === 'Present' ? '' : 'Present';
                                                        const newData = attendanceData.map(student =>
                                                            student.id === item.id ? { ...student, status: newStatus } : student
                                                        );
                                                        setAttendanceData(newData);
                                                    }}
                                                    color={item.status === 'Present' ? '#5F8B4C' : undefined}
                                                />
                                                <Text style={styles.label}>Present</Text>
                                            </View>

                                            {/* Absent Checkbox */}
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                                <Checkbox
                                                    value={item.status === 'Absent'}
                                                    onValueChange={() => {
                                                        const newStatus = item.status === 'Absent' ? '' : 'Absent';
                                                        const newData = attendanceData.map(student =>
                                                            student.id === item.id ? { ...student, status: newStatus } : student
                                                        );
                                                        setAttendanceData(newData);
                                                    }}
                                                    color={item.status === 'Absent' ? '#F72C5B' : undefined}
                                                />
                                                <Text style={styles.label}>Absent</Text>
                                            </View>
                                        </View>

                                        <TextInput
                                            style={styles.input}
                                            placeholder="Remarks"
                                            value={item.remark}
                                            onChangeText={(text) => {
                                                const newData = attendanceData.map(student =>
                                                    student.id === item.id ? { ...student, remark: text } : student
                                                );
                                                setAttendanceData(newData);
                                            }}
                                        />
                                    </View>
                                )}
                            />
                            <Button title="Submit" onPress={handleSubmit} disabled={submitted} />
                        </>
                    )}
                </View>
            </Modal>

            {/* Teacher Attendance Dialog */}
            <Modal visible={teacherDialogVisible} transparent={true} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, alignItems: 'center', backgroundColor: '#F5EEDC', justifyContent: 'center', margin: 50, borderRadius: 10, width: 300 }}>
                        <View style={{ alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setTeacherDialogVisible(false)}>
                                <Text style={{ fontSize: 20, alignSelf: 'flex-end', marginTop: 10 }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: '#FED2E2', marginVertical: 5, borderRadius: 10, width: 200 }}
                            onPress={() => {
                                setTeacherDialogVisible(false);
                                setteacherselfattendance(true);
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Self Attendance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: '#FED2E2', marginVertical: 5, borderRadius: 10, width: 200 }}
                            onPress={() => {
                                setTeacherDialogVisible(false);
                                setshowsubattend(true);
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Subordinate Attendance</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Teacher Self seach Attendance */}
            <Modal visible={teacherselfattendance} transparent={false} animationType='slide'>
                <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#DDEB9D", }}>
                    <TouchableOpacity onPress={() => { setteacherselfattendance(false); setSearchQuery('') }}>
                        <Text style={{ alignSelf: 'flex-end', padding: 10, fontWeight: 'bold', color: 'red', fontSize: 20, }}>X</Text>
                    </TouchableOpacity>

                    <View style={{ padding: 10, backgroundColor: '#fdd', borderRadius: 30, }}>
                        <Text style={{ color: "black", textAlign: "center", fontSize: 25, fontWeight: 'bold' }}>Self Attendance</Text>
                    </View>

                    <View>
                        {/* Search Name */}
                        <View style={{ borderBottomWidth: 1, marginBottom: 10, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Icon name="search" size={20} style={{ marginRight: 10 }} />
                                <Text style={{ fontSize: 16 }}>Search Your Name</Text>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
                                height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginLeft: 30, marginRight: 10, marginBottom: 10
                            }}>
                                <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                                <TextInput
                                    style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0 }}
                                    placeholder="Search Teacher Name or ID"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <FlatList
                            data={dummyTeachers.filter(t => t.name.includes(searchQuery) || t.id.includes(searchQuery))}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{ borderColor: '#FED2E2', borderWidth: 2, borderRadius: 6, marginVertical: 6, backgroundColor: '#FFFECE' }}>
                                    <TouchableOpacity onPress={() => handleSelectTeacher(item)} style={{ padding: 10, borderWidth: 1, borderRadius: 5 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: '300', color: 'blue' }}>Click to Mark Attendance</Text>
                                        <Text style={{ fontWeight: 'bold' }}>Teacher Name: <Text style={{ fontWeight: '400' }}>{item.name}</Text></Text>
                                        <Text style={{ fontWeight: 'bold' }}>Teacher ID: <Text style={{ fontWeight: '400' }}>{item.id}</Text></Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>

                </View>
            </Modal>

            {/* Teacher Self Attendance */}
            <Modal visible={modalVisible} animationType="slide" transparent={false}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                            <Text style={{ fontSize: 18, color: 'red' }}>✖</Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginBottom: 15, }}>Your details</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Teacher ID: <Text style={{ fontWeight: '400' }}>{selectedTeacher?.id}</Text></Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Teacher Name: <Text style={{ fontWeight: '400' }}>{selectedTeacher?.name}</Text></Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5 }}>
                            <Icon name="event" size={18} color="#000" />
                            <Text>Click The Button to set the date</Text>
                        </View>
                        <Button title={selectedDate || "Select Date"} onPress={() => setSelectedDate(new Date().toDateString())} />

                        <View style={{ marginBottom: 10, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
                                <Icon name="check-circle" size={18} color="#000" />
                                <Text>Click to Make Your Attendance </Text>
                            </View>
                            <TouchableOpacity onPress={togglePresent} style={{ backgroundColor: present ? "green" : "gray", padding: 10, borderRadius: 5 }}>
                                <Text style={{ color: "white", textAlign: "center" }}>Present</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 5 }}>
                                <Icon name="photo-camera" size={18} color="#000" />
                                <Text>Upload Selfie </Text>
                            </View>
                            <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}>
                                <Text style={{ color: "white", textAlign: "center" }}>Upload Selfie</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', }}>
                                {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmitteacher}
                            style={{ backgroundColor: selectedDate && present && image ? "blue" : "gray", padding: 10, marginVertical: 10, borderRadius: 5 }}
                            disabled={!selectedDate || !present || !image}
                        >
                            <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Sub-ordinates Mark Attendance */}
            <Modal visible={showsubattend} animationType='slide' transparent={false}>
                <View style={{ padding: 15, backgroundColor: "#FAF1E6" }}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: 'red', padding: 5, paddingHorizontal: 12, borderRadius: 50 }}>
                        <TouchableOpacity onPress={() => setshowsubattend(false)}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10, marginTop: 20, textAlign: 'center' }}>
                        Sub-ordinates Mark Attendance
                    </Text>

                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start' }}>
                            <Icon name="search" size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16 }}>Search the Teacher</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 30, paddingHorizontal: 15,
                            height: 30, borderWidth: 1, borderColor: '#ddd', marginTop: 10, marginRight: 10, marginBottom: 10
                        }}>
                            <Icon name="search" size={20} color="#999" style={{ marginRight: 10 }} />

                                <TextInput
                                    placeholder="Enter Teacher Name/ Teacher ID"
                                    value={search}
                                    onChangeText={setSearch}
                                    style={{ flex: 1, height: 40, fontSize: 16, color: '#333', paddingVertical: 0 }}
                                />
                            
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={{fontSize:19, fontWeight:'bold'}}>Date: {date.toLocaleDateString("en-GB", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    <View style={{flexDirection:'row', borderWidth:1, borderColor:'gray', marginTop:20}}>
                        <Text style={{marginLeft:1, fontWeight:'bold'}}>S.NO</Text>
                        <Text style={{marginLeft:30, fontWeight:'bold'}}>Name</Text>
                        <Text style={{marginLeft:50, fontWeight:'bold'}}>Teacher ID</Text>
                        <Text style={{marginLeft:50, fontWeight:'bold'}}>Status</Text>
                    </View>

                    <FlatList
                        data={filteredTeachers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    borderWidth: 1,
                                    padding: 10,
                                    
                                }}
                            >
                                <Text>{index + 1}</Text>
                                <Text>{item.name}</Text>
                                <Text>{item.teacherId}</Text>
                                <TouchableOpacity
                                    onPress={() => handleStatusToggle(item.id)}
                                    style={{
                                        padding: 5,
                                        backgroundColor:
                                            attendance[item.id] === "Present" ? "green" : attendance[item.id] === "Absent" ? "red" : "gray",
                                    }}
                                >
                                    <Text style={{ color: "white" }}>{attendance[item.id] || "Enter Status"}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity
                        style={{ marginTop: 20, padding: 10, backgroundColor: "#EF9651", borderWidth:1, borderRadius:20, }}
                        onPress={handleSubmitsub}
                    >
                        <Text style={{ color: "white", textAlign:'center' }}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    );
};

const styles = {
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    closeButton: {
        fontSize: 20,
        alignSelf: 'flex-end'
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1
    },
    input: {
        borderWidth: 1,
        padding: 5,
        width: 100
    },
    searchInput: {
        borderWidth: 1,
        padding: 8,
        width: '100%',
        marginBottom: 10
    }
};

export default AttendanceZone;

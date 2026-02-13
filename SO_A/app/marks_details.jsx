import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Button, FlatList, Image, TextInput, ScrollView, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

const StudentAcademicDetails = () => {
    const [selectedClass, setSelectedClass] = useState("Class 1");
    const [selectedSection, setSelectedSection] = useState("A");
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (modalVisible) {
                    setModalVisible(false);
                    return true;
                }
                return false;
            };

            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

            return () => backHandler.remove();
        }, [modalVisible])
    );

    const classes = ["Class 1", "Class 2", "Class 3"];
    const sections = ["A", "B", "C"];
    const studentData = [
        { name: "John Doe", class: "Class 1", section: "A", percentage: "85%", image: null },
        { name: "Alice Smith", class: "Class 1", section: "B", percentage: "78%", image: "https://example.com/alice.jpg" },
        { name: "Bob Johnson", class: "Class 2", section: "A", percentage: "92%", image: null },
        { name: "Charlie Brown", class: "Class 2", section: "C", percentage: "60%", image: "https://example.com/charlie.jpg" },
        { name: "David White", class: "Class 3", section: "B", percentage: "88%", image: null },
        { name: "Ella Green", class: "Class 3", section: "C", percentage: "74%", image: "https://example.com/ella.jpg" },
    ];
    const marksData = studentData.flatMap(student => [
        { name: student.name, subject: "Math", maxMarks: 100, obtained: Math.floor(Math.random() * 100) },
        { name: student.name, subject: "Science", maxMarks: 100, obtained: Math.floor(Math.random() * 100) },
        { name: student.name, subject: "English", maxMarks: 100, obtained: Math.floor(Math.random() * 100) },
    ]);

    const filteredStudents = studentData.filter(
        (student) =>
            student.class === selectedClass &&
            student.section === selectedSection &&
            student.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f0efeb" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", verticalAlign: 10, paddingHorizontal: 10, marginBottom: 20 }}>Student Academic Details</Text>

            {/* Dropdowns */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, backgroundColor: "#f0efeb", borderRadius: 20, shadowColor: "#000", }}>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#eacb4e", borderWidth: 1, borderRadius: 20, paddingHorizontal: 5, marginHorizontal: 2, marginLeft: 1 }}>
                    <FontAwesome name="list" size={20} color="black" style={{ marginRight: 5 }} />
                    <Picker selectedValue={selectedClass} onValueChange={(itemValue) => setSelectedClass(itemValue)} style={{ height: 50, width: 150 }}>
                        {classes.map((cls, index) => (
                            <Picker.Item key={index} label={cls} value={cls} />
                        ))}
                    </Picker>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, backgroundColor: "#eacb4e", borderRadius: 20, paddingHorizontal: 5 }}>
                    <FontAwesome name="list" size={20} color="black" style={{ marginRight: 5 }} />
                    <Picker selectedValue={selectedSection} onValueChange={(itemValue) => setSelectedSection(itemValue)} style={{ height: 50, width: 100 }}>
                        {sections.map((sec, index) => (
                            <Picker.Item key={index} label={sec} value={sec} />
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Search Bar */}
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#fff' }}>
                <FontAwesome name="search" size={20} color="gray" style={{ marginRight: 5 }} />
                <TextInput
                    style={{ height: 40, flex: 1 }}
                    placeholder="Search Student"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>

            {/* Student Cards in Scrollable View */}
            <ScrollView>
                {filteredStudents.map((student, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ borderWidth: 2, padding: 10, alignItems: "center", marginVertical: 10, backgroundColor: "#fef1bc" }}
                        onPress={() => {
                            setSelectedStudent(student);
                            setModalVisible(true);
                        }}
                    >
                        {student.image ? (
                            <Image source={{ uri: student.image }} style={{ width: 50, height: 50, borderRadius: 25, marginBottom: 10 }} />
                        ) : (
                            <FontAwesome name="user" size={50} color="gray" style={{ marginBottom: 10 }} />
                        )}
                        <Text style={{ fontWeight: "bold" }}>{student.name}</Text>
                        <Text style={{ fontWeight: "bold", color: "red" }}>{student.percentage}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modal for Marks */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", flex: 1 }}>Student Marks</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedStudent && (
                        <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, alignItems: "center" }}>
                            {selectedStudent.image ? (
                                <Image source={{ uri: selectedStudent.image }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }} />
                            ) : (
                                <FontAwesome name="user" size={80} color="gray" style={{ marginBottom: 10 }} />
                            )}
                            <Text style={{ fontWeight: "bold" }}>Exam: <Text style={{ fontWeight: "normal" }}>Mid-Term Exam</Text></Text>
                            <Text style={{ fontWeight: "bold" }}>Class: <Text style={{ fontWeight: "normal" }}>{selectedStudent.class}</Text></Text>
                            <Text style={{ fontWeight: "bold" }}>Section: <Text style={{ fontWeight: "normal" }}>{selectedStudent.section}</Text></Text>
                            <Text style={{ fontWeight: "bold" }}>Student: <Text style={{ fontWeight: "normal" }}>{selectedStudent.name}</Text></Text>

                        </View>
                    )}

                    <View style={{ borderWidth: 1, borderRadius: 5, overflow: "hidden" }}>
                        <View style={{ flexDirection: "row", backgroundColor: "lightgray", padding: 10 }}>
                            <Text style={{ flex: 1, fontWeight: "bold" }}>Subject</Text>
                            <Text style={{ flex: 1, fontWeight: "bold" }}>Max Marks</Text>
                            <Text style={{ flex: 1, fontWeight: "bold" }}>Obtained</Text>
                        </View>
                        <FlatList
                            data={marksData.filter(mark => mark.name === selectedStudent?.name)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 }}>
                                    <Text style={{ flex: 1 }}>{item.subject}</Text>
                                    <Text style={{ flex: 1 }}>{item.maxMarks}</Text>
                                    <Text style={{ flex: 1 }}>{item.obtained}</Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default StudentAcademicDetails;
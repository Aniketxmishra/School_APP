import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SyllabusZone = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [yearStart, setYearStart] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [yearEnd, setYearEnd] = useState("");
    const [file, setFile] = useState(null);
    const [pdfUri, setPdfUri] = useState(null);
    const [syllabusList, setSyllabusList] = useState([]);
    const [loading, setLoading] = useState(false);

    const classes = ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];

    // Function to handle document picking
    const pickDocument = async () => {
        try {
            setLoading(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                Alert.alert('Cancelled', 'Document selection was cancelled');
                return;
            }

            const [file] = result.assets;
            setPdfUri(file.uri);
            setFile(file);
            Alert.alert('Success', 'PDF selected successfully');

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to select PDF file');
        } finally {
            setLoading(false);
        }
    };

    const viewPdf = async (uri) => {
        if (!uri) return;
        try {
            // For Android, use the system's PDF viewer
            if (Platform.OS === 'android') {
                const contentUri = await FileSystem.getContentUriAsync(uri);
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: contentUri,
                    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                    type: 'application/pdf',
                });
            } else {
                // For iOS, open in WebBrowser (Safari)
                await WebBrowser.openBrowserAsync(uri);
            }
        } catch (error) {
            console.error('Error viewing PDF:', error);
            Alert.alert('Error', 'Could not open PDF. Make sure you have a PDF viewer app installed.');
        }
    };

    const handleDateChange = (event, selectedDate, type) => {
        const currentDate = selectedDate || date;
        if (type === 'start') {
            setShowStartDatePicker(false);
            setYearStart(formatDate(currentDate));
        } else {
            setShowEndDatePicker(false);
            setYearEnd(formatDate(currentDate));
        }
    };

    const formatDate = (date) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        return `${month} ${year}`;
    };

    const handleSubmit = () => {
        // Check if all required fields are filled
        if (teacherName && selectedClass && yearStart && pdfUri) {
            // Add a new notification to the syllabus list with relevant data
            const newSyllabus = { teacherName, selectedClass, yearStart, pdfUri };
            setSyllabusList([
                ...syllabusList,
                newSyllabus,
            ]);
            // Alert that the notification has been created successfully
            Alert.alert('Success', `Syllabus for class ${newSyllabus.selectedClass} has been added successfully!`);

            // Reset the form fields after submitting
            setTeacherName('');
            setSelectedClass('');
            setYearStart('');
            setPdfUri(null);
            setFile(null);

            // Close the modal
            setModalVisible(false);

        } else {
            // Alert if any of the required fields are missing
            Alert.alert('Error', 'Please fill in all required fields and select a PDF file.');
        }
    };

    const renderHeader = () => (
        <View style={{ padding: 20, backgroundColor: '#FEFAE0' }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
                E-Library Zone and Books
            </Text>

            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#EF9651", // Orange color
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
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>ADD E-BOOKS</Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', borderBottomWidth: 1, backgroundColor: '#EFEFEF', borderRadius: 20 }}>
                <Text style={{ fontSize: 18, marginTop: 5, fontWeight: "bold", paddingHorizontal: 10 }}>Available Books</Text>
            </View>

            <View style={{ borderWidth: 1, borderRadius: 30, marginTop: 10, borderBottomWidth: 2 }}>
                <Picker
                    selectedValue={selectedClass}
                    onValueChange={(itemValue) => setSelectedClass(itemValue)}
                    style={{ marginVertical: 1 }}
                >
                    <Picker.Item label="Select Class" value="" />
                    {classes.map((cls, index) => (
                        <Picker.Item key={index} label={cls} value={cls} />
                    ))}
                </Picker>
            </View>
        </View>
    );

    return (
        <View style={{ padding: 10, backgroundColor: '#FEFAE0'}}>
            <View>
            <FlatList
                ListHeaderComponent={renderHeader} // Adds the header to the FlatList
                data={syllabusList.filter((item) => item.selectedClass === selectedClass || selectedClass === "")}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => viewPdf(item.pdfUri)}
                        style={{ padding: 10, borderWidth: 1, marginTop: 10, marginBottom: 5, borderRadius: 5 }}
                    >
                        <View style={{ alignItems: 'center', marginBottom: 5, backgroundColor: "#B4EBE6", borderRadius: 30 }}>
                            <Text style={{ fontWeight: 'bold' }}>For Class: {item.selectedClass}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Publishing Year and Month: <Text style={{ fontWeight: '300' }}>{item.yearStart}</Text></Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Uploaded By: <Text style={{ fontWeight: '300' }}>{item.teacherName}</Text></Text>
                        <View style={{ alignItems: 'center', marginTop: 5 }}>
                            <Text style={[styles.listItemText, { color: 'blue' }]}>Tap to view the E-Book PDF</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ backgroundColor: '#FEFAE0' }} // Ensures background color for the whole list
            />
            </View>

            {/*Student syllabus Input View*/}
            <Modal visible={modalVisible} animationType="slide">
                <KeyboardAvoidingView>
                    <ScrollView>
                        <View style={{ padding: 20, backgroundColor: "#FFFECE", paddingBottom: 200, }}>

                            {/*CLose Button */}
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
                                <Text style={{ fontSize: 20 }}>✖</Text>
                            </TouchableOpacity>

                            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>ADD Syllabus</Text>

                            {/*Enter Teacher Name */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                                <Ionicons name="person" size={20} color="black" />
                                <TextInput
                                    placeholder="Teacher Name"
                                    value={teacherName}
                                    onChangeText={setTeacherName}
                                    style={{ borderBottomWidth: 1, flex: 1, marginRight: 10, marginLeft: 10 }}
                                />
                            </View>

                            {/*Select Class Drop menu */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name="school" size={20} style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 16 }}>Select Class</Text>
                                </View>
                                <View style={{ borderWidth: 1, borderRadius: 20, marginLeft: 20, marginTop: 5, backgroundColor: '#FEFAE0' }}>
                                    <Picker
                                        selectedValue={selectedClass}
                                        onValueChange={(itemValue) => setSelectedClass(itemValue)}
                                        style={{ padding: 1 }}
                                    >
                                        <Picker.Item label="Select Class" value="" />
                                        {classes.map((cls, index) => (
                                            <Picker.Item key={index} label={cls} value={cls} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            {/*Select Publish Year*/}
                            <View style={{ paddingTop: 10 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="calendar" size={20} color="black" style={{ marginRight: 10 }} />
                                        <Text style={{ fontSize: 16 }}>Select Publish Year : </Text>
                                    </View>
                                </View>

                                {/* Year Start Date Input */}
                                <View style={{ marginLeft: 20, marginTop: 5 }}>
                                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                                        <TextInput
                                            placeholder="Press to set the start Year "
                                            value={yearStart}
                                            style={styles.input}
                                            editable={false} // Make input non-editable
                                        />
                                    </TouchableOpacity>
                                </View>


                                {/* Year Start DateTimePicker */}
                                {showStartDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="spinner"
                                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'start')}
                                        maximumDate={new Date()} // Prevent future date selection
                                    />
                                )}
                            </View>

                            {/* Label for UPLOAD PDF */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, }}>
                                    <Icon name="insert-drive-file" size={24} color="black" style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 16 }}>Upload the Syllabus : </Text>
                                </View>

                                <Button
                                    title="Upload PDF"
                                    onPress={pickDocument}
                                    disabled={loading}
                                />

                                {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

                                {file && (
                                    <View style={{ marginVertical: 10 }}>
                                        <Text style={{ marginTop: 5 }}>Uploaded File Name: {file.name}</Text>
                                    </View>
                                )}
                            </View>

                            {/*Submint button */}
                            <View style={{ marginTop: 50 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#A0C878", // Orange color
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
                                    disabled={loading}
                                >
                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: '600', }}>Submit Syllabus for This Class</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        marginVertical: 10,
        padding: 8,
        fontSize: 16,
    },
    listItemText: {
        fontSize: 14,
        marginVertical: 2
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        backgroundColor: '#fff',
    },
});

export default SyllabusZone;
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Button, Image, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const ExamTimeTable = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [classValue, setClassValue] = useState(null);
    const [section, setSection] = useState('A');
    const [teacher, setTeacher] = useState('');
    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uploadedTables, setUploadedTables] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [classOptions, setClassOptions] = useState([
        { label: 'Class I', value: 'I' },
        { label: 'Class II', value: 'II' },
        { label: 'Class III', value: 'III' },
        { label: 'Class IV', value: 'IV' },
        { label: 'Class V', value: 'V' },
        { label: 'Class VI', value: 'VI' },
        { label: 'Class VII', value: 'VII' },
        { label: 'Class VIII', value: 'VIII' },
        { label: 'Class IX', value: 'IX' },
        { label: 'Class X', value: 'X' },
        { label: 'Class XI', value: 'XI' },
        { label: 'Class XII', value: 'XII' },
    ]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        const newEntry = { teacher, classValue, section, subject, title, description, image };
        setUploadedTables([...uploadedTables, newEntry]);
        setModalVisible(false);
        setImage(null); // Reset image after submission
    };

    const closeModal = () => {
        setModalVisible(false);
        setImage(null); // Reset image when closing modal
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor:'#FFFECE' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>School Time Tables</Text>

                    {/*Add Time table Button*/}
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
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{
                            color: 'black',
                            textAlign: 'center',
                            fontWeight: '600', 
                            fontSize: 16, 
                        }}>
                            Add Time Table
                        </Text>
                    </TouchableOpacity>



                    {/*RECENT ADDED TIME TABLE SECTION */}
                    <Text style={{ marginTop: 20, fontSize: 18, borderBottomWidth: 1, padding: 4, marginBottom: 5, backgroundColor:"#DBDBDB", borderRadius:100 }}>Recently Uploaded Time Table</Text>
                    <FlatList
                        data={uploadedTables}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ borderWidth: 1, marginTop: 10 , backgroundColor:"#F9E6CF"}} onPress={() => setSelectedImage(item.image)}>
                                {item.image && <Image source={{ uri: item.image }} style={{ height: 100, width: '100%' }} />}
                                <Text>Title: {item.title}</Text>
                                <Text>Teacher Name: {item.teacher}</Text>
                                <Text>Class: {item.classValue}</Text>
                                <Text>Section: {item.section}</Text>
                                <Text>Subject: {item.subject}</Text>
                                <Text>Description: {item.description}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <Modal visible={modalVisible} animationType='slide'>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ padding: 5, backgroundColor: "#f8f8e8" }}>
                                <View style={{ flex: 1, padding: 10 }}>
                                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={closeModal}>
                                        <Text style={{ fontSize: 20 }}>✖</Text>
                                    </TouchableOpacity>

                                    {/*TITLE OF THE MODEL*/}
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                                        Add School Time Table
                                    </Text>


                                    {/* Teacher's Name */}
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 15 }}>
                                        <Icon name="person" size={20} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Teacher's Name"
                                            style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
                                            onChangeText={setTeacher}
                                        />
                                    </View>

                                    {/*Class Selector */}
                                    <View style={{ marginBottom: 10, paddingVertical: 5 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <Icon name="school" size={20} style={{ marginRight: 10 }} />
                                            <Text style={{ fontSize: 16 }}>Select Class</Text>
                                        </View>

                                        <View
                                            style={{
                                                borderWidth: 1,
                                                borderColor: 'black',
                                                borderRadius: 5,
                                            }}
                                        >
                                            <DropDownPicker
                                                open={openDropdown}
                                                value={classValue}
                                                items={classOptions}
                                                setOpen={setOpenDropdown}
                                                setValue={setClassValue}
                                                setItems={setClassOptions}
                                                placeholder="Select Class"
                                                listMode="MODAL" // Add this line to render dropdown in a modal
                                                modalProps={{
                                                    animationType: "slide",
                                                }}
                                                containerStyle={{ height: 50 }}
                                                style={{
                                                    borderWidth: 0,
                                                    paddingLeft: 10,
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                }}
                                                dropDownStyle={{
                                                    borderWidth: 1,
                                                    borderColor: 'black',
                                                    borderRadius: 5,
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* Section Selection Radio Button */}
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name="list" size={20} color="black" style={{ marginRight: 10 }} />
                                            <Text style={{ fontSize: 16 }}>Section</Text>
                                        </View>
                                        <RadioButton.Group onValueChange={(value) => setSection(value)} value={section}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Text>A</Text>
                                                <RadioButton value="A" />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Text>B</Text>
                                                <RadioButton value="B" />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Text>C</Text>
                                                <RadioButton value="C" />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Text>D</Text>
                                                <RadioButton value="D" />
                                            </View>
                                        </RadioButton.Group>
                                    </View>

                                    {/* Subject */}
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                        <Icon name="book" size={20} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Subject"
                                            style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
                                            onChangeText={setSubject}
                                        />
                                    </View>

                                    {/* Title */}
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                        <Icon name="title" size={20} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Title"
                                            style={{ borderBottomWidth: 1, flex: 1, padding: 5 }}
                                            onChangeText={setTitle}
                                        />
                                    </View>

                                    {/* Description */}
                                    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
                                        <Icon name="description" size={20} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Description"
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                                flex: 1,
                                                padding: 10,
                                                height: 100,
                                            }}
                                            onChangeText={setDescription}
                                            multiline
                                            numberOfLines={4}
                                        />
                                    </View>

                                    {/* Upload the image AREA */}
                                    <View style={{ alignItems: "flex-start", marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'left' }}>
                                            <Icon name="upload" size={20} style={{ marginRight: 10 }} />
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>Upload Image</Text>
                                        </View>
                                        <View style={{ marginTop: 10, width: '100%', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: 'blue',
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 25,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                onPress={pickImage}
                                            >
                                                <Text style={{ color: 'white', fontSize: 16 }}>Pick Time Table</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {image && <Image source={{ uri: image }} style={{ height: 100, width: '100%' }} />}
                                    </View>

                                    {/*Data Submit */}
                                    <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }} onPress={handleSubmit}>
                                        <Text style={{ color: 'white', textAlign: 'center' }}>Submit</Text>
                                    </TouchableOpacity>

                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </Modal>

                    <Modal visible={!!selectedImage} animationType='slide'>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 20 }} onPress={() => setSelectedImage(null)}>
                            <Text style={{ fontSize: 20 }}>✖</Text>
                        </TouchableOpacity>
                        {selectedImage && <Image source={{ uri: selectedImage }} style={{ flex: 1, resizeMode: 'contain' }} />}
                    </Modal>
                </View>

            </KeyboardAvoidingView>
        </GestureHandlerRootView>

    );
};

export default ExamTimeTable;

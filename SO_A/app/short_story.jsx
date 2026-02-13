import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Modal, FlatList, ScrollView, KeyboardAvoidingView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ShortStoryScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [stories, setStories] = useState([]);

    const sections = ['A', 'B', 'C', 'D', 'E'];

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    };

    const currentDate = formatDate(new Date());
    const isFormValid = name && className && section && story;

    const handleSubmit = () => {
        if (name && className && section && title && story) {
            setStories([...stories, { name, className, section, title, story, date: currentDate }]);
            setModalVisible(false);
            setName("");
            setClassName("");
            setSection("");
            setTitle("");
            setStory("");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#EDF4C2' }}>
            <View style={{ backgroundColor: "#EFDCAB", borderRadius: 30, marginBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>Short Story By Students</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: '#EB5A3C', padding: 10, marginVertical: 10, borderRadius: 20, borderWidth: 1, }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: 20, fontWeight: 'bold' }}>Add Short Story</Text>
            </TouchableOpacity>

            <View style={{alignItems:"center", borderBottomWidth:1, marginBottom:10, borderRadius:50,}}>
                <Text style={{ fontSize: 18, marginTop:10 }}>Available Short Stories</Text>
            </View>

            <FlatList
                data={stories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor:'#FDDBBB', borderBottomWidth:2,}}>
                        <Text style={{ fontWeight: "bold", textAlign:'center', backgroundColor:'#F0C1E1', padding:5, borderRadius:30, }}>{item.title}</Text>
                        <Text style={{textAlign:'center', backgroundColor: '#F2F6D0', borderRadius:30,marginBottom:3, fontSize:12,}}>{item.story}</Text>
                        <Text style={{ fontSize: 12, color: "black" }}>By {item.name} | {item.className}-{item.section} | {item.date}</Text>
                    </View>
                )}
            />
            <Modal visible={modalVisible} animationType="slide">
                <KeyboardAvoidingView>
                    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#F2F6D0', paddingBottom: 60 }}>
                        {/*Close model button */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)} >
                            <Text style={{ fontSize: 20, color: "red" }}>✖</Text>
                        </TouchableOpacity>

                        {/*title of the Input form  */}
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Add a Short Story</Text>
                        </View>

                        {/* Student Name Box */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                            <Icon name="account" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Student Name"
                                value={name}
                                onChangeText={setName}
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
                                    selectedValue={className}
                                    onValueChange={setClassName}
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


                        {/* Section Selection */}
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
                                            borderColor: section === sec ? "#183B4E" : "#ccc",
                                            backgroundColor: section === sec ? "#FF9B17" : "white",
                                            borderRadius: 100,
                                            paddingHorizontal: 10,
                                            paddingVertical: 5,
                                            marginRight: 25,
                                        }}
                                        onPress={() => setSection(sec)}
                                    >
                                        <Text style={{ color: section === sec ? "white" : "black" }}>{sec}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date Shower */}
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <Icon name="calendar" size={20} style={{ marginRight: 10 }} />
                                <Text style={{ fontSize: 16 }}>Thought Date:</Text>
                            </View>
                            <View style={{ backgroundColor: '#FFDDAB', borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 10, marginLeft: 30 }}>
                                <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, padding: 5 }}>{currentDate}</Text>
                            </View>
                        </View>

                        {/* Title */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                            <Icon name="star" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Short Story Title"
                                value={title}
                                onChangeText={setTitle}
                                style={{ borderBottomWidth: 1, flex: 1, marginRight: 10 }}
                            />
                        </View>

                        {/*Though Box */}
                        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10, paddingVertical: 5 }}>
                            <Icon name="comment" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Enter your Story"
                                value={story}
                                onChangeText={setStory}
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    flex: 1,
                                    padding: 10,
                                    height: 100,
                                    textAlignVertical: 'top',
                                    backgroundColor: '#FFF2DB'
                                }}
                                multiline
                            />
                        </View>

                        {/*SUbmit Button */}
                        <TouchableOpacity onPress={handleSubmit} disabled={!name || !className || !section || !title || !story} style={{
                            backgroundColor: isFormValid ? '#FF9B17' : 'gray',
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
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
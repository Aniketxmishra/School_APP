import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, KeyboardAvoidingView, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export default function ThoughtOfTheDay() {
    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const [thoughts, setThoughts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const sections = ['A', 'B', 'C', 'D', 'E'];
    const [section, setSection] = useState("");
    const [newThought, setNewThought] = useState({ name: '', class: '', section: '', date: new Date(), thought: '' });

    const isFormValid = newThought.name && newThought.class && newThought.section && newThought.thought;

    const addThought = () => {
        if (!isFormValid) return;
        setThoughts([...thoughts, newThought]);
        setModalVisible(false);
        setNewThought({ name: '', class: '', section: '', date: new Date(), thought: '' });
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#FCE7C8' }}>
            <View style={{ backgroundColor: "#9DC08B", borderRadius: 30, marginBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>Thoughts of the Day</Text>
            </View>
            <FlatList
                data={thoughts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 15, backgroundColor: '#FADA7A', marginBottom: 10, borderRadius: 10, borderWidth: 1, }}>
                        <View style={{backgroundColor:"#EDF4C2", borderRadius:15,}}>
                            <Text style={{ fontSize: 30, textAlign: 'center', padding:5 }}>“ {item.thought} ”</Text>
                        </View>
                        <Text style={{ textAlign: 'right', marginTop: 10, fontSize: 10, }}>
                            By <Text style={{fontWeight:'bold'}}>{item.name}</Text>, {item.class}-{item.section}, {formatDate(item.date)}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#EB5A3C', padding: 15, borderRadius: 50, borderWidth:2, }}>
                <AntDesign name="plus" size={30} color="white" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={{ flex: 1, padding: 20, backgroundColor: '#F2F6D0' }}>
                    <KeyboardAvoidingView>
                        <ScrollView>

                            {/*Close model button */}
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
                                <Text style={{ fontSize: 20, color: 'red' }}>✖</Text>
                            </TouchableOpacity>

                            {/*title of the Input form  */}
                            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Add a Thought of the Day</Text>
                            </View>


                            {/* Student Name Box */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
                                <Icon name="account" size={20} style={{ marginRight: 10 }} />
                                <TextInput
                                    placeholder="Student Name"
                                    value={newThought.name}
                                    onChangeText={(text) => setNewThought({ ...newThought, name: text })}
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
                                        selectedValue={newThought.class}
                                        onValueChange={(value) => setNewThought({ ...newThought, class: value })}
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
                                                borderColor: newThought.section === sec ? "#183B4E" : "#ccc",
                                                backgroundColor: newThought.section === sec ? "#FF9B17" : "white",
                                                borderRadius: 100,
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                marginRight: 25,
                                            }}
                                            onPress={() => setNewThought({ ...newThought, section: sec })}
                                        >
                                            <Text style={{ color: newThought.section === sec ? "white" : "black" }}>{sec}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>


                            {/*Though Date */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Icon name="calendar" size={20} style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 16 }}>Thought Date:</Text>
                                </View>
                                <View style={{ backgroundColor: '#FFDDAB', borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 10, marginLeft: 30 }}>
                                    <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, padding: 5 }}>{formatDate(newThought.date)}</Text>
                                </View>
                            </View>


                            {/*Though Box */}
                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10, paddingVertical: 5 }}>
                                <Icon name="comment" size={20} style={{ marginRight: 10 }} />
                                <TextInput
                                    placeholder="Thought"
                                    value={newThought.thought}
                                    onChangeText={(text) => setNewThought({ ...newThought, thought: text })}
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
                            <TouchableOpacity onPress={addThought} disabled={!isFormValid} style={{
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
                </View>
            </Modal>
        </View>
    );
}
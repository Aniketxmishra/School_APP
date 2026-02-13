import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const initialRequests = [
    { id: "1", name: "John Doe", teacherId: "T001", date: "2025-04-02", description: "Sick Leave", expanded: false },
    { id: "2", name: "Jane Smith", teacherId: "T002", date: "2025-04-02", description: "Personal Leave", expanded: false },
    { id: "3", name: "Smith Bro", teacherId: "T005", date: "2025-05-02", description: "Cricket Match", expanded: false },
    { id: "4", name: "Mike Bro", teacherId: "T043", date: "2025-05-06", description: "CAR REPAIR", expanded: false },
];

const ApprovalZone = () => {
    const [requests, setRequests] = useState(initialRequests);

    const toggleExpand = (id) => {
        setRequests((prev) =>
            prev.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item))
        );
    };

    const handleDecision = (id, decision) => {
        const teacher = requests.find((item) => item.id === id);
        Alert.alert(
            "Confirmation",
            `Do you want to ${decision} the leave of ${teacher.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        setRequests((prev) => prev.filter((item) => item.id !== id));
                    },
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#FFFECE" }}>
            <View style={{ padding: 10, backgroundColor: '#fddd', borderRadius: 20, borderWidth: 1, marginBottom: 20 }}>
                <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Approval ZONE</Text>
            </View>

            <View style={{ borderBottomWidth: 1, marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Needed Your Aproval For Leave</Text>
            </View>

            {requests.length > 0 ? (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ padding: 15, borderWidth: 1, borderColor: "#000", marginBottom: 10, borderRadius: 20, backgroundColor: "#EEEEEE" }}>
                            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                                <Text style={{ fontSize: 14, marginBottom: 5 }}><Text style={{ fontWeight: "bold" }}>Teacher Name:</Text> {item.name}</Text>
                                <Text style={{ fontSize: 14, marginBottom: 5 }}><Text style={{ fontWeight: "bold" }}>Teacher ID:</Text> {item.teacherId}</Text>
                                <Text style={{ fontSize: 14, marginBottom: 5 }}><Text style={{ fontWeight: "bold" }}>Date:</Text> {item.date}</Text>
                                {item.expanded && (
                                    <Text style={{ fontSize: 14, marginBottom: 5, }}><Text style={{ fontWeight: "bold" }}>Reason:</Text> {item.description}</Text>
                                )}
                                <Text style={{ textAlign: 'center', fontWeight: '100', fontSize: 12, }}>Click to SEE the Reason </Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <TouchableOpacity style={{ flex: 1, padding: 10, alignItems: "center", backgroundColor: "#D91656", marginHorizontal: 5, borderRadius: 20 }} onPress={() => handleDecision(item.id, "reject")}>
                                    <Text style={{ fontWeight: "bold" }}>REJECT</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, padding: 10, alignItems: "center", backgroundColor: "#AEEA94", marginHorizontal: 5, borderRadius: 20 }} onPress={() => handleDecision(item.id, "approve")}>
                                    <Text style={{ fontWeight: "bold" }}>ACCEPT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <>
                    <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", marginTop: 20 }}>No Approval Needed</Text>
                    <View style={{alignItems:'center', backgroundColor:'#FEEC37', paddingVertical:90, borderRadius:10000}}>
                        <Icon name="check-all" size={150} color="#000" />
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", marginTop: 20 }}>ALL done </Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({

});

export default ApprovalZone;

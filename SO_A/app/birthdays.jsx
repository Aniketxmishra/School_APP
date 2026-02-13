import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const studentBirthdays = [
{ id: '1', name: 'Alice', class: '5A', section: 'A', image: 'https://via.placeholder.com/50' },
{ id: '2', name: 'Bob', class: '6B', section: 'B', image: 'https://via.placeholder.com/50' },
];

const teacherBirthdays = [
{ id: '1', name: 'Mr. Smith', image: 'https://via.placeholder.com/50' },
];

const BirthdayScreen = () => {
return (
<ScrollView style={styles.container}>
<Text style={styles.header}><FontAwesome name="birthday-cake" size={24} color="green" /> Today's Birthdays</Text>

{/* Students Birthdays */}
<Text style={styles.sectionTitle}>Students Birthday</Text>
<FlatList
horizontal
data={studentBirthdays}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.card}>
<Image source={{ uri: item.image }} style={styles.image} />
<Text style={styles.name}>{item.name}</Text>
<Text style={styles.details}>{`Class: ${item.class} | Section: ${item.section}`}</Text>
</View>
)}
showsHorizontalScrollIndicator={false}
/>

{/* Teachers Birthdays */}
<Text style={styles.sectionTitle}>Teachers Birthday</Text>
{teacherBirthdays.map((teacher) => (
<View key={teacher.id} style={styles.card}>
<Image source={{ uri: teacher.image }} style={styles.image} />
<Text style={styles.name}>{teacher.name}</Text>
</View>
))}
</ScrollView>
);
};

const styles = StyleSheet.create({
container: { flex: 1, padding: 10, backgroundColor: '#FED2E2' },
header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, backgroundColor:"#C68EFD", padding:10, borderRadius:10, },
sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, backgroundColor:'#EAD196', padding:10, borderRadius:10,},
card: { backgroundColor: '#FEF9E1', padding: 10, margin: 5, alignItems: 'center', borderRadius: 10 },
image: { width: 50, height: 50, borderRadius: 25 },
name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
details: { fontSize: 14, color: 'gray' },
});

export default BirthdayScreen;
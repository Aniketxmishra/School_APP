import React, { useState } from 'react';
import { View, Text, Button, Modal, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PositiveNewsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 100, height: 100 });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const { width, height } = result.assets[0];
      setImage(result.assets[0].uri);
      setImageDimensions({ width, height });
    }
  };

  const handleSubmit = () => {
    if (title && description && image && date) {
      const newNews = { title, description, image, date: date.toISOString() };
      setNewsList([...newsList, newNews]);
      setTitle('');
      setDescription('');
      setImage(null);
      setDate(null);
      setShowDatePicker(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fdd' }}>
      <View style={{ backgroundColor: "#F4D793", padding: 10, borderRadius: 30, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Positive News</Text>
      </View>

      <View style={{ backgroundColor: '#AEEA94', padding: 10, borderWidth: 1, borderRadius: 30, }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="image" size={30} color="#000" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>ADD Positive News</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20, borderBottomWidth: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight:'bold'}}>Recent Positive News</Text>
      </View>


      <FlatList
        data={newsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setFullScreenImage(item.image)}>
            <View style={{ marginVertical: 10, padding: 10, backgroundColor: 'white', borderRadius: 8, elevation: 3, borderWidth:1,}}>
              <Image source={{ uri: item.image }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom:5}} />
              <Text style={{ fontWeight: 'bold' }}>Title:<Text style={{fontWeight:'400'}}> {item.title}</Text></Text>
              <Text style={{fontWeight:'bold'}}>Date:<Text style={{fontWeight:'400'}}> {new Date(item.date).toDateString()}</Text></Text>
              <Text style={{fontWeight:'bold'}}>Description:<Text style={{fontWeight:'400'}}> {item.description}</Text></Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add News Modal */}
      <Modal visible={modalVisible} animationType="slide" >
        <View style={{ flex: 1, padding: 20, backgroundColor: '#D0DDD0' }}>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ alignSelf: 'flex-end', fontSize: 25, fontWeight: 'bold', color: 'red' }}>X</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>ADD Positive News</Text>
          </View>

          {/* title input Box */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 5 }}>
            <Icon name="label" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={{ borderBottomWidth: 1, flex: 1, marginRight: 10, backgroundColor: '#FFF2DB', borderRadius: 10, }}
            />
          </View>

          {/*Though Box */}
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
                backgroundColor: '#FFF2DB'
              }}
              multiline
            />
          </View>


          {/*Date Selector */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Icon name="calendar-today" size={20} style={{ marginRight: 10 }} />
              <Text style={{ flex: 1, marginRight: 10, borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>
                {date ? `Selected Date: ${date.toDateString()}` : "Select Date"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={{ backgroundColor: '#fddd', borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 20, marginLeft: 30 }}>
                <Text style={{ textAlign: 'center', padding: 10, fontWeight: 'bold', fontSize: 18 }}>Select Date</Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={date || new Date()} mode="date" display="default" onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }} />
            )}
          </View>

          {/*Upload Image */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, }}>
            <Icon name="upload" size={24} color="#000" />
            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>Select the Image</Text>
          </View>

          <View style={{ marginLeft: 30, backgroundColor: '#fddd', borderRadius: 20, borderWidth: 1, marginBottom: 5, }}>
            <TouchableOpacity onPress={pickImage}>
              <Text style={{ textAlign: 'center', padding: 10, fontSize: 18, fontWeight: 'bold' }}>Click To Select Image</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', borderWidth: 1, marginLeft: 30, marginBottom: 10, borderRadius: 50, backgroundColor: '#fff' }}>
            {image && <Image source={{ uri: image }} style={{ width: imageDimensions.width / 10, height: imageDimensions.height / 10, marginVertical: 10 }} />}
          </View>

          {/*SUbmit Button */}
          <TouchableOpacity onPress={handleSubmit}  style={{
            backgroundColor:'#FF9B17', 
            padding: 10,
            alignItems: 'center',
            borderRadius: 5,
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
          }}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600', }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <Modal visible={!!fullScreenImage} transparent>
          <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setFullScreenImage(null)}>
              <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Close</Text>
            </TouchableOpacity>
            <Image source={{ uri: fullScreenImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PositiveNewsScreen;
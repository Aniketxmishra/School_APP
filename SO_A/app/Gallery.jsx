import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, Modal, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const GalleryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullMediaVisible, setFullMediaVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [media, setMedia] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const videoRef = useRef(null);

  const sections = ['A', 'B', 'C', 'D', 'E', 'ALL'];
  const classes = ['ALL', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X',
    'Class XI', 'Class XII'];

  const VIDEO_WIDTH = Dimensions.get('window').width * 0.9; // 90% of screen width
  const VIDEO_HEIGHT = 200; // Fixed height for videos

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      setMedia([...media, ...result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type
      }))]);
    }
  };

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    // Initialize video refs
    videoRefs.current = videoRefs.current.slice(0, selectedMedia.length);
  }, [selectedMedia]);

  const handleMediaPress = (item) => {
    setSelectedMedia(item.media);
    setCurrentMediaIndex(0); // Reset to first media item
    setFullMediaVisible(true);
  };

  const handleSubmit = () => {
    if (media.length === 0) {
      Alert.alert('Error', 'Please upload at least one file before submitting.');
      return;
    }
    setGallery([...gallery, {
      id: Date.now().toString(),
      media,
      title,
      description,
      date: date.toDateString(),
      selectedClass,
      selectedSection
    }]);
    setModalVisible(false);
    setMedia([]);
    setTitle('');
    setDescription('');
    setSelectedClass('ALL');
    setSelectedSection('ALL');
  };

  const renderMediaPreview = (mediaItem) => {
    if (mediaItem.type === 'image') {
      return <Image source={{ uri: mediaItem.uri }} style={styles.thumbnail} />;
    }
    return (
      <View style={[styles.videoContainer, { width: VIDEO_WIDTH, height: VIDEO_HEIGHT }]}>
        <Video
          source={{ uri: mediaItem.uri }}
          style={styles.videoPlayer}
          useNativeControls
          resizeMode="contain"
          shouldPlay={false}
          isLooping={false}
        />
      </View>
    );
  };

  const handleFullScreenMediaChange = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Calculate current index
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    setCurrentMediaIndex(newIndex);

    // Pause all videos when swiping
    videoRefs.current.forEach(ref => {
      if (ref) ref.pauseAsync();
    });
  };

  const renderFullScreenMedia = (mediaItem, index) => {
    if (mediaItem.type === 'image') {
      return (
        <TouchableOpacity
          style={styles.fullMediaContainer}
          activeOpacity={1}
          onPress={() => setFullMediaVisible(false)}
        >
          <Image
            source={{ uri: mediaItem.uri }}
            style={styles.fullMedia}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.fullMediaContainer}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: mediaItem.uri }}
          style={styles.fullMedia}
          useNativeControls
          resizeMode="contain"
          isLooping
          shouldPlay={currentMediaIndex === index}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg_g1.jpg')}
      style={{
        flex: 1,  // Ensures the image takes up all available space
      }}
    >
      <View style={{ flex: 1, padding: 16, }}>

        <View style={{backgroundColor:"#fddd", padding:5, marginBottom:10, borderRadius:30,}}>
          <Text style={styles.header}>School Media Gallery</Text>
        </View>


        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.buttonText}>Add Media</Text>
        </TouchableOpacity>

        <FlatList
          data={gallery}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setSelectedMedia(item.media);
              setFullMediaVisible(true);
            }}>
              <View style={styles.galleryItem}>
                <ScrollView horizontal>
                  {item.media.map((mediaItem, index) => (
                    <View key={`media-${item.id}-${index}`}>
                      {renderMediaPreview(mediaItem)}
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>Title: {item.title}</Text>
                  <Text style={styles.metaText}>Description: {item.description}</Text>
                  <Text style={styles.metaText}>Date: {item.date}</Text>
                  <Text style={styles.metaText}>Class: {item.selectedClass}</Text>
                  <Text style={styles.metaText}>Section: {item.selectedSection}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Add Media Modal */}
        <Modal visible={modalVisible} animationType='slide'>
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="red" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Add New Media</Text>

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
                <Ionicons name="cloud-upload" size={24} color="#4CAF50" />
                <Text style={styles.uploadText}>Select Media Files</Text>
              </TouchableOpacity>

              <ScrollView horizontal>
                {media.map((mediaItem, index) => (
                  <View key={`preview-${mediaItem.uri}-${index}`}>
                    {renderMediaPreview(mediaItem)}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Date Picker Section */}
            <View style={styles.sectionContainer}>
              <Ionicons name="calendar" size={20} color="#4CAF50" />
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text>Select Date: {date.toDateString()}</Text>
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

            {/* Class and Section Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Section</Text>
              <ScrollView horizontal>
                {sections.map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    style={[
                      styles.sectionButton,
                      selectedSection === sec && styles.selectedSectionButton
                    ]}
                    onPress={() => setSelectedSection(sec)}
                  >
                    <Text style={selectedSection === sec && styles.selectedButtonText}>{sec}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Class</Text>
              <Picker
                selectedValue={selectedClass}
                onValueChange={setSelectedClass}
                style={styles.picker}
              >
                {classes.map((cls) => (
                  <Picker.Item key={cls} label={cls} value={cls} />
                ))}
              </Picker>
            </View>

            {/* Title and Description Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />


            <View style={{ marginBottom: 50, }}>
              <Button title="Submit" onPress={handleSubmit} disabled={media.length === 0} />
            </View>

          </ScrollView>
        </Modal>

        {/* Full Screen Media Viewer */}
        <Modal
          visible={fullMediaVisible}
          animationType='fade'
          onRequestClose={() => setFullMediaVisible(false)}
        >
          <View style={styles.fullScreenContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleFullScreenMediaChange}
            >
              {selectedMedia.map((mediaItem, index) => (
                <View key={`fullscreen-${mediaItem.uri}-${index}`} style={styles.fullMediaContainer}>
                  {renderFullScreenMedia(mediaItem, index)}
                </View>
              ))}
            </ScrollView>
            <View style={styles.mediaCounter}>
              <Text style={styles.counterText}>
                {currentMediaIndex + 1} / {selectedMedia.length}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeFullScreenButton}
              onPress={() => setFullMediaVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4F8'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#2D3748'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4299E1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500'
  },
  galleryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8
  },
  videoPreview: {
    backgroundColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center'
  },
  metaContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  metaText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMediaContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMedia: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5E8C7'
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  uploadSection: {
    marginBottom: 16
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16
  },
  sectionContainer: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  dateButton: {
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8
  },
  sectionButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    marginRight: 8
  },
  selectedSectionButton: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1'
  },
  selectedButtonText: {
    color: 'white'
  },
  picker: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white'
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMedia: {
    width: '100%',
    height: '100%',
  },
  mediaCounter: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  videoContainer: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default GalleryScreen;
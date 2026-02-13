import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/ThemeContext";
import { createTheme } from "./theme/theme";

// Student-specific menu items with limited access
const STUDENT_MENU_ITEMS = [
  { id: 'syllabus', name: "Syllabus", icon: "book-open-outline", go_way: '/circular', readOnly: true },
  { id: 'payment', name: "Payment", icon: "credit-card", go_way: '/payment', readOnly: true },
  { id: 'holiday', name: "Holiday", icon: "calendar", go_way: '/calendar', readOnly: true },
  { id: 'notification', name: "Notification", icon: "bell", go_way: '/notification', readOnly: true },
  { id: 'gallery', name: "Gallery", icon: "image", go_way: '/Gallery', readOnly: true },
  { id: 'marks', name: "My Marks", icon: "clipboard-list", go_way: '/marks_details', readOnly: true },
  { id: 'exam', name: "Exam Schedule", icon: "file-document", go_way: '/Exam_table', readOnly: true },
  { id: 'timetable', name: "Timetable", icon: "clock-outline", go_way: '/table_way', readOnly: true },
  { id: 'schoolwork', name: "Assignments", icon: "notebook", go_way: '/school_work', readOnly: true },
  { id: 'e_library', name: "E-library", icon: "library", go_way: '/lib_books', readOnly: true },
  { id: 'live_class', name: "Live Class", icon: "video", go_way: '/live_class', readOnly: true },
  { id: 'bus_tracking', name: "Bus Tracking", icon: "bus", go_way: '/bus_track', readOnly: true },
  { id: 'birthday', name: "Birthday", icon: "cake", go_way: '/birthdays', readOnly: true },
  { id: 'positive_news', name: "Good News", icon: "newspaper", go_way: '/positive_news', readOnly: true },
  { id: 'thoughts', name: "Daily Thoughts", icon: "comment-processing", go_way: '/thought_of_day', readOnly: true },
  { id: 'short_story', name: "Stories", icon: "book-open", go_way: '/short_story', readOnly: true },
  { id: 'student_profile', name: "My Profile", icon: "account-circle", go_way: '/student_details', readOnly: false },
];

const { width } = Dimensions.get('window');

// Constants for consistent spacing
const CONTAINER_PADDING = 20;
const ITEM_MARGIN = 10;
const NUM_COLUMNS = 3;

const StudentMenuScreen = ({ navigation }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = createTheme(isDark);

  // Memoized item width calculation
  const itemWidth = useMemo(() => {
    const totalPadding = CONTAINER_PADDING * 2;
    const totalMargins = ITEM_MARGIN * 2 * NUM_COLUMNS;
    const availableWidth = width - totalPadding - totalMargins;
    return Math.floor(availableWidth / NUM_COLUMNS);
  }, [width]);

  // Memoized render function to prevent recreation
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.item, 
        { 
          width: itemWidth,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.text,
        },
        item.readOnly && styles.readOnlyItem
      ]}
      onPress={() => router.push(item.go_way)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${item.name}${item.readOnly ? ' (Read Only)' : ''}`}
      accessibilityHint={`Opens ${item.name} screen${item.readOnly ? ' in read-only mode' : ''}`}
    >
      <Icon name={item.icon} size={30} color={item.readOnly ? theme.colors.textMuted : theme.colors.primary} />
      <Text style={[
        styles.text, 
        { color: item.readOnly ? theme.colors.textMuted : theme.colors.textLight }
      ]}>
        {item.name}
      </Text>
      {item.readOnly && (
        <View style={styles.readOnlyBadge}>
          <Icon name="eye" size={12} color={theme.colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  ), [router, itemWidth, theme]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Student Welcome Header */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.colors.primary }]}>
          Welcome, Student!
        </Text>
        <Text style={[styles.subtitleText, { color: theme.colors.textLight }]}>
          Access your learning resources
        </Text>
      </View>

      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: theme.colors.surface }]}>
        <Icon name="information" size={16} color={theme.colors.primary} />
        <Text style={[styles.infoText, { color: theme.colors.textLight }]}>
          Most modules are read-only for students. Contact your teacher for assistance.
        </Text>
      </View>

      <FlatList
        data={STUDENT_MENU_ITEMS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        initialNumToRender={12}
        windowSize={7}
        getItemLayout={(data, index) => ({
          length: 100, // Approximate item height
          offset: 100 * Math.floor(index / NUM_COLUMNS),
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTAINER_PADDING,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  listContent: {
    paddingBottom: ITEM_MARGIN,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    margin: ITEM_MARGIN,
    padding: 10,
    borderRadius: 15,
    minHeight: 80,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  readOnlyItem: {
    opacity: 0.7,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  readOnlyBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 2,
  },
  text: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    numberOfLines: 2,
    fontWeight: '500',
  },
});

export default React.memo(StudentMenuScreen);
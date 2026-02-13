import React, { useCallback, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/ThemeContext";
import { useUser } from "./context/UserContext";
import { createTheme } from "./theme/theme";
import permissionService from "./services/permissionService";

// All 19 backend modules mapped to frontend menu items
const ALL_MENU_ITEMS = [
  // STUDENT_MGMT
  { id: 'student_details', name: "Student Management", icon: "account-group", go_way: '/student_details' },
  
  // TEACHER_MGMT
  { id: 'teacher_details', name: "Teacher Management", icon: "account-tie", go_way: '/teacher_details' },
  
  // ATTENDANCE
  { id: 'attendance', name: "Attendance", icon: "account-check", go_way: '/attendance' },
  
  // ACADEMIC
  { id: 'marks', name: "Marks", icon: "clipboard-list", go_way: '/marks_details' },
  
  // FEE_MGMT
  { id: 'payment', name: "Fee Payment", icon: "currency-usd", go_way: '/payment' },
  
  // LIBRARY
  { id: 'e_library', name: "Library", icon: "library", go_way: '/lib_books' },
  
  // COMMUNICATION
  { id: 'notification', name: "Notification", icon: "message-text", go_way: '/notification' },
  
  // REPORTS
  { id: 'report', name: "Reports", icon: "chart-line", go_way: '/report' },
  
  // SYSTEM_SETTINGS
  { id: 'school_details', name: "System Settings", icon: "cog", go_way: '/school_details' },
  
  // GALLERY
  { id: 'gallery', name: "Gallery", icon: "image", go_way: '/Gallery' },
  
  // LIVE_CLASS
  { id: 'live_class', name: "Live Class", icon: "video", go_way: '/live_class' },
  
  // BUS_TRACKING
  { id: 'bus_tracking', name: "Bus Tracking", icon: "bus", go_way: '/bus_track' },
  
  // LEAVE_MGMT
  { id: 'leave_mgmt', name: "Leave Management", icon: 'account-cancel', go_way: '/leave_app' },
  
  // ASSIGNMENTS
  { id: 'schoolwork', name: "Assignments", icon: "notebook", go_way: '/school_work' },
  
  // EXAM_MGMT
  { id: 'exam', name: "Exam Management", icon: "file-document", go_way: '/Exam_table' },
  
  // TIMETABLE
  { id: 'timetable', name: "Timetable", icon: "clock-outline", go_way: '/table_way' },
  
  // CALENDAR
  { id: 'holiday', name: "Calendar", icon: "calendar", go_way: '/calendar' },
  
  // NEWS
  { id: 'positive_news', name: "News & Stories", icon: "newspaper", go_way: '/positive_news' },
  
  // STUDENT_DASHBOARD
  { id: 'student_dashboard', name: "Student Dashboard", icon: "dashboard", go_way: '/student/dashboard' },
];

const { width } = Dimensions.get('window');

// Constants for consistent spacing
const CONTAINER_PADDING = 20;
const ITEM_MARGIN = 10;
const NUM_COLUMNS = 3;

const DynamicMenuScreen = ({ navigation }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, permissionService: userPermissionService } = useUser();
  const theme = createTheme(isDark);
  
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load and filter menu items based on user permissions
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        
        console.log('📊 Loading menu items for user:', user?.username);
        
        if (!user || !permissionService.getUserPermissions()) {
          // If no permissions loaded, try to fetch them
          if (user?.username) {
            console.log('📊 Fetching permissions from backend...');
            const permissions = await permissionService.fetchUserPermissions(user.username);
            if (permissions) {
              permissionService.setUserPermissions(user, permissions);
            }
          }
        }

        // Get all accessible modules from permission service
        const accessibleModules = permissionService.getAccessibleModules();
        console.log('📊 Accessible modules from backend:', accessibleModules.length);
        console.log('📊 Module names:', accessibleModules.map(m => m.moduleName));

        // Filter menu items based on permissions
        const filtered = permissionService.getFilteredMenuItems(ALL_MENU_ITEMS);
        console.log('📊 Filtered menu items to display:', filtered.length);
        console.log('📊 Filtered items:', filtered.map(m => m.name));
        
        setFilteredMenuItems(filtered);
      } catch (error) {
        console.error('❌ Error loading menu items:', error);
        setFilteredMenuItems([]); // Show empty on error
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [user]);

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
        }
      ]}
      onPress={() => router.push(item.go_way)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${item.name}`}
      accessibilityHint={`Opens ${item.name} screen`}
    >
      <Icon 
        name={item.icon} 
        size={30} 
        color={theme.colors.primary} 
      />
      <Text style={[
        styles.text, 
        { color: theme.colors.textLight }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [router, itemWidth, theme]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Get welcome message based on user role
  const getWelcomeMessage = () => {
    if (!user) return "Welcome!";
    
    const role = permissionService.getUserRole();
    const name = user.name || user.username;
    
    switch (role.toLowerCase()) {
      case 'admin':
        return `Welcome, ${name}!`;
      case 'teacher':
        return `Welcome, ${name}!`;
      case 'student':
        return `Welcome, ${name}!`;
      case 'parent':
        return `Welcome, ${name}!`;
      default:
        return `Welcome, ${name}!`;
    }
  };

  const getSubtitleMessage = () => {
    if (!user) return "Access your dashboard";
    
    const role = permissionService.getUserRole();
    
    switch (role.toLowerCase()) {
      case 'admin':
        return "Full system administration";
      case 'teacher':
        return "Manage your classes and students";
      case 'student':
        return "Access your learning resources";
      case 'parent':
        return "Monitor your child's progress";
      default:
        return "Access your dashboard";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Dynamic Welcome Header */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.colors.primary }]}>
          {getWelcomeMessage()}
        </Text>
        <Text style={[styles.subtitleText, { color: theme.colors.textLight }]}>
          {getSubtitleMessage()}
        </Text>
        {user && (
          <Text style={[styles.roleText, { color: theme.colors.textMuted }]}>
            Role: {permissionService.getUserGroup()}
          </Text>
        )}
      </View>

      {/* Permission Info Banner */}
      {permissionService.isStudent() || permissionService.isParent() ? (
        <View style={[styles.infoBanner, { backgroundColor: theme.colors.surface }]}>
          <Icon name="information" size={16} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.textLight }]}>
            {permissionService.isStudent() 
              ? "Showing modules available to you. Contact your teacher for additional access."
              : "Showing information available for your child. Contact school for more details."
            }
          </Text>
        </View>
      ) : null}

      {/* Module Count Debug Info - Remove in production */}
      {__DEV__ && (
        <View style={[styles.debugBanner, { backgroundColor: '#FFF3CD' }]}>
          <Text style={styles.debugText}>
            📊 Debug: Showing {filteredMenuItems.length} of 19 modules
          </Text>
        </View>
      )}

      {/* Dynamic Menu Items */}
      <FlatList
        data={filteredMenuItems}
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
          length: 100,
          offset: 100 * Math.floor(index / NUM_COLUMNS),
          index,
        })}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle" size={48} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              No modules available for your role
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
              Contact your administrator for access
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTAINER_PADDING,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  debugBanner: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
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
  },
  text: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    numberOfLines: 2,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default React.memo(DynamicMenuScreen);

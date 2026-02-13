import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Switch,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Removed MaterialIcons
import { LinearGradient } from 'expo-linear-gradient';
import Button from './components/Button/Button';
import theme from './theme/theme';

const { width, height } = Dimensions.get('window');

// Enhanced mock data with comprehensive information
const ENHANCED_BUS_DATA = [
  {
    id: '1',
    number: 'Bus 101',
    route: {
      name: 'Sector 1 - School - Sector 1',
      stops: ['Sector 1 Gate', 'Community Center', 'Main Market', 'School'],
      totalDistance: '12.5 km',
      estimatedTime: '35 min'
    },
    driver: {
      name: 'Mr. Sharma',
      contact: '+91 98765 43210',
      experience: '8 years',
      rating: 4.8
    },
    status: 'On Time',
    currentLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Near Community Center'
    },
    nextStop: 'Main Market',
    eta: '8 min',
    routeProgress: 65,
    capacity: 45,
    currentOccupancy: 32,
    speed: 25,
    lastUpdated: new Date().toISOString(),
    emergencyContact: '+91 98765 00000',
    isMyBus: true,
    notifications: {
      breakdown: false,
      delay: false,
      arrival: true
    }
  },
  {
    id: '2',
    number: 'Bus 202',
    route: {
      name: 'Sector 5 - School - Sector 5',
      stops: ['Sector 5 Metro', 'Shopping Mall', 'Hospital', 'School'],
      totalDistance: '18.2 km',
      estimatedTime: '45 min'
    },
    driver: {
      name: 'Ms. Kaur',
      contact: '+91 98765 43211',
      experience: '12 years',
      rating: 4.9
    },
    status: 'Delayed',
    currentLocation: {
      latitude: 28.6289,
      longitude: 77.2065,
      address: 'Traffic jam near Shopping Mall'
    },
    nextStop: 'Hospital',
    eta: '15 min',
    routeProgress: 40,
    capacity: 50,
    currentOccupancy: 38,
    speed: 12,
    lastUpdated: new Date().toISOString(),
    emergencyContact: '+91 98765 00001',
    isMyBus: false,
    delayReason: 'Heavy traffic due to road construction',
    notifications: {
      breakdown: false,
      delay: true,
      arrival: false
    }
  },
  {
    id: '3',
    number: 'Bus 303',
    route: {
      name: 'Sector 9 - School - Sector 9',
      stops: ['Sector 9 Park', 'Library', 'Sports Complex', 'School'],
      totalDistance: '15.8 km',
      estimatedTime: '40 min'
    },
    driver: {
      name: 'Mr. Singh',
      contact: '+91 98765 43212',
      experience: '15 years',
      rating: 4.7
    },
    status: 'Arrived',
    currentLocation: {
      latitude: 28.6189,
      longitude: 77.2100,
      address: 'School Main Gate'
    },
    nextStop: 'Completed Route',
    eta: 'Arrived',
    routeProgress: 100,
    capacity: 40,
    currentOccupancy: 35,
    speed: 0,
    lastUpdated: new Date().toISOString(),
    emergencyContact: '+91 98765 00002',
    isMyBus: false,
    notifications: {
      breakdown: false,
      delay: false,
      arrival: false
    }
  },
  {
    id: '4',
    number: 'Bus 404',
    route: {
      name: 'Sector 12 - School - Sector 12',
      stops: ['Sector 12 Hub', 'Tech Park', 'Food Court', 'School'],
      totalDistance: '22.1 km',
      estimatedTime: '50 min'
    },
    driver: {
      name: 'Mrs. Patel',
      contact: '+91 98765 43213',
      experience: '10 years',
      rating: 4.6
    },
    status: 'Breakdown',
    currentLocation: {
      latitude: 28.6089,
      longitude: 77.2150,
      address: 'Stopped near Tech Park'
    },
    nextStop: 'Maintenance Required',
    eta: 'Delayed',
    routeProgress: 25,
    capacity: 48,
    currentOccupancy: 28,
    speed: 0,
    lastUpdated: new Date().toISOString(),
    emergencyContact: '+91 98765 00003',
    isMyBus: false,
    breakdownReason: 'Engine overheating - backup bus dispatched',
    notifications: {
      breakdown: true,
      delay: true,
      arrival: false
    }
  }
];

const EnhancedBusTrackingPage = ({ studentId = 'student123' }) => {
  const [buses, setBuses] = useState(ENHANCED_BUS_DATA);
  const [myBus, setMyBus] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const pulseAnimation = useRef(new Animated.Value(1)).current; // Removed unused animatedValue

  // Initialize data and animations
  useEffect(() => {
    loadInitialData();
    startPulseAnimation();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateRealTimeUpdates();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = () => {
    // Find user's assigned bus
    const userBus = buses.find(bus => bus.isMyBus);
    setMyBus(userBus);
    
    // Initialize notification preferences
    const initialNotifications = {};
    buses.forEach(bus => {
      initialNotifications[bus.id] = bus.isMyBus;
    });
    setNotifications(initialNotifications);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const simulateRealTimeUpdates = () => {
    setBuses(prevBuses => 
      prevBuses.map(bus => ({
        ...bus,
        routeProgress: Math.min(bus.routeProgress + Math.random() * 5, 100),
        speed: bus.status === 'Breakdown' ? 0 : Math.floor(Math.random() * 30) + 15,
        lastUpdated: new Date().toISOString(),
        eta: bus.status === 'Arrived' ? 'Arrived' : `${Math.floor(Math.random() * 20) + 5} min`
      }))
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    simulateRealTimeUpdates();
    setRefreshing(false);
    
    // Show success feedback
    Alert.alert('Updated', 'Bus locations refreshed successfully!');
  };

  const handleTrackBus = (bus) => {
    setSelectedBus(bus);
    setModalVisible(true);
  };

  const handleNotifyToggle = async (busId) => {
    const newState = !notifications[busId];
    setNotifications(prev => ({ ...prev, [busId]: newState }));
    
    const bus = buses.find(b => b.id === busId);
    if (newState) {
      Alert.alert(
        'Notifications Enabled', 
        `You'll receive updates for ${bus.number} including arrival alerts and delay notifications.`,
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled', 
        `You won't receive updates for ${bus.number} anymore.`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleEmergencyCall = (contact) => {
    Alert.alert(
      'Emergency Call',
      `Call ${contact}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${contact}`) }
      ]
    );
  };

  const getFilteredBuses = () => {
    let filtered = buses;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(bus => 
        bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.driver.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(bus => bus.status === filterStatus);
    }
    
    // Sort: My bus first, then by status priority
    return filtered.sort((a, b) => {
      if (a.isMyBus && !b.isMyBus) return -1;
      if (!a.isMyBus && b.isMyBus) return 1;
      
      const statusPriority = { 'Breakdown': 0, 'Delayed': 1, 'On Time': 2, 'Arrived': 3 };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  const renderBusCard = ({ item }) => (
    <Animated.View style={[
      styles.card,
      item.isMyBus && styles.myBusCard,
      item.status === 'Breakdown' && styles.emergencyCard
    ]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.busInfo}>
          <View style={styles.busIconContainer}>
            <Ionicons name="bus" size={24} color={theme.colors.primary} />
            {item.isMyBus && (
              <Animated.View 
                style={[
                  styles.pulseIndicator,
                  { transform: [{ scale: pulseAnimation }] }
                ]}
              />
            )}
          </View>
          <View>
            <Text style={styles.busNumber}>{item.number}</Text>
            {item.isMyBus && (
              <View style={styles.myBusBadge}>
                <Text style={styles.myBusText}>MY BUS</Text>
              </View>
            )}
          </View>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Route Information */}
      <View style={styles.routeSection}>
        <View style={styles.routeHeader}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={styles.routeTitle}>Route Information</Text>
        </View>
        <Text style={styles.route}>{item.route.name}</Text>
        <View style={styles.routeDetails}>
          <Text style={styles.routeDetail}>
            <Ionicons name="resize" size={12} color={theme.colors.textMuted} />
            {' '}{item.route.totalDistance}
          </Text>
          <Text style={styles.routeDetail}>
            <Ionicons name="time" size={12} color={theme.colors.textMuted} />
            {' '}{item.route.estimatedTime}
          </Text>
          <Text style={styles.routeDetail}>
            <Ionicons name="people" size={12} color={theme.colors.textMuted} />
            {' '}{item.currentOccupancy}/{item.capacity}
          </Text>
        </View>
      </View>

      {/* Current Status */}
      <View style={styles.statusSection}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Current Location</Text>
            <Text style={styles.statusValue}>{item.currentLocation.address}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Next Stop</Text>
            <Text style={styles.statusValue}>{item.nextStop}</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>ETA</Text>
            <Text style={[styles.statusValue, styles.etaText]}>{item.eta}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Speed</Text>
            <Text style={styles.statusValue}>{item.speed} km/h</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Journey Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(item.routeProgress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: `${item.routeProgress}%`,
                backgroundColor: getProgressColor(item.status)
              }
            ]} 
          />
        </View>
      </View>

      {/* Driver Information */}
      <View style={styles.driverSection}>
        <View style={styles.driverInfo}>
          <Ionicons name="person-circle" size={20} color={theme.colors.primary} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{item.driver.name}</Text>
            <View style={styles.driverMeta}>
              <Text style={styles.driverExperience}>{item.driver.experience} exp</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.rating}>{item.driver.rating}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleEmergencyCall(item.driver.contact)}
          >
            <Ionicons name="call" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency/Delay Information */}
      {(item.status === 'Delayed' || item.status === 'Breakdown') && (
        <View style={[
          styles.alertSection,
          item.status === 'Breakdown' ? styles.emergencyAlert : styles.delayAlert
        ]}>
          <Ionicons 
            name={item.status === 'Breakdown' ? "warning" : "time"} 
            size={16} 
            color={item.status === 'Breakdown' ? theme.colors.error : theme.colors.warning} 
          />
          <Text style={styles.alertText}>
            {item.status === 'Breakdown' ? item.breakdownReason : item.delayReason}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleTrackBus(item)}
        >
          <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Track Live</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Route Details', `Complete route: ${item.route.stops.join(' → ')}`)}
        >
          <Ionicons name="map-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>View Route</Text>
        </TouchableOpacity>
        
        <View style={styles.notificationToggle}>
          <Text style={styles.notificationLabel}>Notify</Text>
          <Switch
            value={notifications[item.id] || false}
            onValueChange={() => handleNotifyToggle(item.id)}
            trackColor={{ false: theme.colors.lightGrey, true: theme.colors.primary }}
            thumbColor={notifications[item.id] ? theme.colors.primary : theme.colors.textMuted}
          />
        </View>
      </View>

      {/* Last Updated */}
      <Text style={styles.lastUpdated}>
        Last updated: {new Date(item.lastUpdated).toLocaleTimeString()}
      </Text>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Bus Tracking</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons name="filter" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleRefresh}
              >
                <Ionicons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color={theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search buses, routes, or drivers..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filter Chips */}
          {showFilters && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
            >
              {['All', 'On Time', 'Delayed', 'Arrived', 'Breakdown'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    filterStatus === status && styles.activeFilterChip
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterStatus === status && styles.activeFilterChipText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderQuickStats = () => (
    <View style={styles.quickStats}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{buses.filter(b => b.status === 'On Time').length}</Text>
        <Text style={styles.statLabel}>On Time</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{buses.filter(b => b.status === 'Delayed').length}</Text>
        <Text style={styles.statLabel}>Delayed</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{buses.filter(b => b.status === 'Arrived').length}</Text>
        <Text style={styles.statLabel}>Arrived</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{buses.reduce((sum, bus) => sum + bus.currentOccupancy, 0)}</Text>
        <Text style={styles.statLabel}>Students</Text>
      </View>
    </View>
  );

  const filteredBuses = getFilteredBuses();

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {renderQuickStats()}
        
        {/* My Bus Section */}
        {myBus && (
          <View style={styles.myBusSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="star" size={16} color={theme.colors.primary} />
              {' '}My Bus
            </Text>
            {renderBusCard({ item: myBus })}
          </View>
        )}
        
        {/* All Buses Section */}
        <View style={styles.allBusesSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="bus" size={16} color={theme.colors.primary} />
            {' '}All Buses ({filteredBuses.length})
          </Text>
          
          {filteredBuses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyStateText}>No buses found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            <FlatList
              data={filteredBuses}
              renderItem={renderBusCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Bus Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BusDetailModal
          bus={selectedBus}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

// Helper Components
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'On Time':
        return { color: theme.colors.success, icon: 'checkmark-circle' };
      case 'Delayed':
        return { color: theme.colors.warning, icon: 'time' };
      case 'Arrived':
        return { color: theme.colors.info, icon: 'location' };
      case 'Breakdown':
        return { color: theme.colors.error, icon: 'warning' };
      default:
        return { color: theme.colors.textMuted, icon: 'help-circle' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
      <Ionicons name={config.icon} size={12} color="white" />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const BusDetailModal = ({ bus, onClose }) => {
  if (!bus) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{bus.number} - Live Tracking</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalBody}>
          {/* Mock Map View */}
          <View style={styles.mockMap}>
            <Text style={styles.mockMapText}>🗺️ Live Map View</Text>
            <Text style={styles.mockMapSubtext}>
              Current Location: {bus.currentLocation.address}
            </Text>
          </View>
          
          {/* Detailed Information */}
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Route Details</Text>
            <Text style={styles.detailText}>Stops: {bus.route.stops.join(' → ')}</Text>
            <Text style={styles.detailText}>Distance: {bus.route.totalDistance}</Text>
            <Text style={styles.detailText}>Est. Time: {bus.route.estimatedTime}</Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Driver Information</Text>
            <Text style={styles.detailText}>Name: {bus.driver.name}</Text>
            <Text style={styles.detailText}>Experience: {bus.driver.experience}</Text>
            <Text style={styles.detailText}>Rating: {bus.driver.rating}/5.0</Text>
            <Text style={styles.detailText}>Contact: {bus.driver.contact}</Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Current Status</Text>
            <Text style={styles.detailText}>Status: {bus.status}</Text>
            <Text style={styles.detailText}>Speed: {bus.speed} km/h</Text>
            <Text style={styles.detailText}>Occupancy: {bus.currentOccupancy}/{bus.capacity}</Text>
            <Text style={styles.detailText}>Progress: {Math.round(bus.routeProgress)}%</Text>
          </View>
        </ScrollView>
        
        <View style={styles.modalActions}>
          <View style={styles.modalActionButton}>
            <Button
              title="Call Driver"
              onPress={() => Alert.alert('Calling', `Calling ${bus.driver.contact}`)}
              variant="primary"
              size="medium"
              icon="call"
            />
          </View>
          <View style={styles.modalActionButton}>
            <Button
              title="Emergency Contact"
              onPress={() => Alert.alert('Emergency', `Calling ${bus.emergencyContact}`)}
              variant="secondary"
              size="medium"
              icon="warning"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper Functions
const getProgressColor = (status) => {
  switch (status) {
    case 'On Time': return theme.colors.success;
    case 'Delayed': return theme.colors.warning;
    case 'Arrived': return theme.colors.info;
    case 'Breakdown': return theme.colors.error;
    default: return theme.colors.primary;
  }
};

// Fixed Comprehensive Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: theme.spacing.md,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    // Replaced gap with margin-based spacing
  },
  headerButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: theme.spacing.sm, // Added margin instead of gap
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  filterContainer: {
    marginTop: theme.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: theme.spacing.xs,
  },
  activeFilterChip: {
    backgroundColor: 'white',
  },
  filterChipText: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'white',
  },
  activeFilterChipText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  content: {
    flex: 1,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'white',
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  myBusSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  allBusesSection: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  myBusCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: '#f8f9ff',
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIconContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  pulseIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  busNumber: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  myBusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 2,
  },
  myBusText: {
    fontSize: theme.typography.fontSizes.xs,
    color: 'white',
    fontWeight: theme.typography.fontWeights.bold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    // Removed gap, using marginLeft on text instead
  },
  statusText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    marginLeft: theme.spacing.xs, // Added margin instead of gap
  },
  routeSection: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#f8f9fa',
    borderRadius: theme.borderRadius.md,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  routeTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  route: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeDetail: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    flex: 1,
  },
  statusSection: {
    marginBottom: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  etaText: {
    color: theme.colors.primary,
  },
  progressSection: {
    marginBottom: theme.spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textMuted,
  },
  progressPercentage: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  driverSection: {
    marginBottom: theme.spacing.sm,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  driverName: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  driverExperience: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    marginLeft: 2,
  },
  callButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primaryLight,
  },
  alertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  emergencyAlert: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  delayAlert: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  alertText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
  },
  lastUpdated: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  modalBody: {
    flex: 1,
  },
  mockMap: {
    height: 200,
    backgroundColor: theme.colors.lightGrey,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  mockMapText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textMuted,
  },
  mockMapSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  detailSection: {
    marginBottom: theme.spacing.md,
  },
  detailTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    // Removed gap, using margin on child elements instead
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs, // Added margin instead of gap
  },
});

export default EnhancedBusTrackingPage;

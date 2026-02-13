import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, Alert, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeToggle } from '../components/ThemeToggle';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function StackNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // The actual logout logic is handled by UserContext but for now we just route
            // Ideally we should call logout() from context here too
            router.replace('/auth');
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/home-dynamic');
    }
  }, [isAuthenticated, segments]);

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: "Welcome",
          headerRight: () => <ThemeToggle style={{ marginRight: 10 }} />
        }} />
        <Stack.Screen name="home-dynamic" options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: "Dashboard",
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <ThemeToggle style={{ marginRight: 10 }} />
              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ fontSize: 16, color: 'red', fontWeight: '600' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          ),
        }} />
        <Stack.Screen name="teacher_details" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Manage Teachers' }} />
        <Stack.Screen name="student_details" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Student Profile' }} />
        <Stack.Screen name="school_details" options={{ headerShown: true, headerTitleAlign: 'center', title: 'School Information' }} />
        <Stack.Screen name="attendance" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Attendance' }} />
        <Stack.Screen name="calendar" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Calendar' }} />
        <Stack.Screen name="Gallery" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Gallery' }} />
        <Stack.Screen name="notification" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Notifications' }} />
        <Stack.Screen name="marks_details" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Marks & Grades' }} />
        <Stack.Screen name="Exam_table" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Exam Schedule' }} />
        <Stack.Screen name="lib_books" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Library' }} />
        <Stack.Screen name="payment" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Payments' }} />
        <Stack.Screen name="live_class" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Live Classes' }} />
        <Stack.Screen name="bus_track" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Bus Tracking' }} />
        <Stack.Screen name="leave_app" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Leave Application' }} />
        <Stack.Screen name="leave_application" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Apply for Leave' }} />
        <Stack.Screen name="school_work" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Assignments' }} />
        <Stack.Screen name="report" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Reports' }} />
        <Stack.Screen name="circular" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Circulars' }} />
        <Stack.Screen name="positive_news" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Good News' }} />
        <Stack.Screen name="short_story" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Stories' }} />
        <Stack.Screen name="thought_of_day" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Thought of the Day' }} />
        <Stack.Screen name="birthdays" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Birthdays' }} />
        <Stack.Screen name="table_way" options={{ headerShown: true, headerTitleAlign: 'center', title: 'Time Table' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <StackNavigator />
      </UserProvider>
    </ThemeProvider>
  );
}


import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';
import * as Location from 'expo-location';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProcedureDetailScreen } from './src/screens/ProcedureDetailScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { AssistantScreen } from './src/screens/AssistantScreen';
import { OfficesScreen } from './src/screens/OfficesScreen';
import { useTranslation } from './src/i18n/useTranslation';
import { useAppStore } from './src/store/useAppStore';
import { Colors } from './src/theme/colors';
import { Typography } from './src/theme/typography';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProceduresStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProceduresList" component={HomeScreen} />
      <Stack.Screen name="ProcedureDetail" component={ProcedureDetailScreen} />
    </Stack.Navigator>
  );
}

// Tab indicator component — a teal underline replaces the icon entirely.
// Much cleaner than emoji icons and more professional.
function TabIndicator({ focused }: { focused: boolean }) {
  return (
    <View style={{
      position: 'absolute',
      bottom: -8,
      left: '20%',
      right: '20%',
      height: 3,
      borderRadius: 2,
      backgroundColor: focused ? Colors.primary : 'transparent',
    }} />
  );
}

function Tabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 58,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: Colors.white,
        },
        tabBarLabelStyle: {
          fontSize: Typography.size.xs,
          fontFamily: Typography.fontFamily.bold,
          letterSpacing: 0.3,
        },
        // No icon — label only with animated underline
        tabBarIcon: ({ focused }) => <TabIndicator focused={focused} />,
        tabBarIconStyle: {
          height: 3,
          marginTop: 0,
        },
      })}
    >
      <Tab.Screen
        name="Procedures"
        component={ProceduresStack}
        options={{ tabBarLabel: t.tabProcedures }}
      />
      <Tab.Screen
        name="MyProgress"
        component={ProgressScreen}
        options={{ tabBarLabel: t.tabMyProgress }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{ tabBarLabel: t.tabAssistant }}
      />
      <Tab.Screen
        name="Offices"
        component={OfficesScreen}
        options={{ tabBarLabel: t.tabOffices }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  // Check if user has seen onboarding before
  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((value) => {
      setShowOnboarding(value !== 'true');
    });
  }, []);

  // Request location on app start
  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
    getLocation();
  }, []);

  async function finishOnboarding() {
    await AsyncStorage.setItem('onboarding_done', 'true');
    setShowOnboarding(false);
  }

  // Waiting for fonts and AsyncStorage check
  if (!fontsLoaded || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={finishOnboarding} />;
  }

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
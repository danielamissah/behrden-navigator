import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProcedureDetailScreen } from './src/screens/ProcedureDetailScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { AssistantScreen } from './src/screens/AssistantScreen';
import { OfficesScreen } from './src/screens/OfficesScreen';
import { useTranslation } from './src/i18n/useTranslation';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for the Procedures tab — allows drilling into detail view
function ProceduresStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProceduresList" component={HomeScreen} />
      <Stack.Screen name="ProcedureDetail" component={ProcedureDetailScreen} />
    </Stack.Navigator>
  );
}

function Tabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: { borderTopColor: Colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Procedures"
        component={ProceduresStack}
        options={{
          tabBarLabel: t.tabProcedures,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="MyProgress"
        component={ProgressScreen}
        options={{
          tabBarLabel: t.tabMyProgress,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>✅</Text>,
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          tabBarLabel: t.tabAssistant,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Offices"
        component={OfficesScreen}
        options={{
          tabBarLabel: t.tabOffices,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏛️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
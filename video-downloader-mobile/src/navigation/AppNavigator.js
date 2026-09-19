/**
 * App Navigation Setup
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DownloadScreen from '../screens/DownloadScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator
const Stack = createNativeStackNavigator();

// Tab Bar Icon Component
const TabBarIcon = ({ focused, iconName, label, theme }) => (
  <React.Fragment>
    <Icon
      name={iconName}
      size={24}
      color={focused ? theme.colors.primary : theme.colors.textLight}
      style={{ marginBottom: 4 }}
    />
    <Text style={{ 
      color: focused ? theme.colors.primary : theme.colors.textLight,
      fontSize: 12,
      textAlign: 'center'
    }}>
      {label}
    </Text>
  </React.Fragment>
);

// Import Text from react-native
import { Text } from 'react-native';

// Main Tab Navigator
const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Download"
        component={DownloadScreen}
        options={{
          tabBarLabel: 'Download',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="download"
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="history"
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog"
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textLight}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// App Navigator
const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

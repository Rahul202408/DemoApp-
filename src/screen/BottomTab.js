/**
 * બોટમ ટેબ નેવિગેટર (BOTTOM TAB NAVIGATOR)
 * -------------------------------------------------------------------------
 * એપ્લિકેશનનું મુખ્ય નીચેનું નેવિગેશન બાર (Bottom Navigation Bar).
 * મુખ્ય ટેબ્સ:
 * ૧. Home (HomeScreen)       -> ડેશબોર્ડ ડેટા જોવા માટે
 * ૨. Profile (ProfileScreen) -> યુઝર પ્રોફાઇલ અને નોટિફિકેશન લેબ
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Bottom/HomeScreen';
import ProfileScreen from './Bottom/ProfileScreen';
import colors from '../utils/colors';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false, // ટેબ્સનું પોતાનું હેડર બંધ રાખ્યું છે
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: colors.themecolor1,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {/* ૧. હોમ ટેબ */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 22, color }}>{focused ? '🏠' : '🏚️'}</Text>
          ),
        }}
      />

      {/* ૨. પ્રોફાઇલ ટેબ */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 22, color }}>{focused ? '👤' : '👥'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

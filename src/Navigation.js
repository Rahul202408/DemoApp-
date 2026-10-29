/**
 * નેવિગેશન રાઉટર (NAVIGATION ROUTER)
 * -------------------------------------------------------------------------
 * આખી એપ્લિકેશનનો સ્ક્રીન નેવિગેશન ફ્લો અહીં કન્ફિગર કરેલો છે.
 * 
 * સ્ટેક નેવિગેટરનું માળખું:
 * ૧. SplashScreen       -> પહેલી સ્ક્રીન, લૉગિન સેશન ચેક કરે છે
 * ૨. LoginScreen        -> લૉગિન ફોર્મ સ્ક્રીન
 * ૩. SignUpScreen       -> નવું એકાઉન્ટ બનાવવા માટે રજીસ્ટ્રેશન સ્ક્રીન
 * ૪. BottomTab          -> મુખ્ય એપ (હોમ અને પ્રોફાઇલ ટેબ્સ)
 * ૫. DetailsScreen      -> કાર્ડની વિગતો જોવા માટે ડિટેઇલ સ્ક્રીન
 * ૬. NotificationScreen -> Firebase નોટિફિકેશન ટેસ્ટ કરવા માટેની લેબ સ્ક્રીન
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// બધી સ્ક્રીન્સ ઇમ્પોર્ટ કરી
import SplashScreen from './screen/SplashScreen';
import LoginScreen from './screen/LoginScreen';
import SignUpScreen from './screen/SignUpScreen';
import BottomTab from './screen/BottomTab';
import DetailsScreen from './screen/DetailsScreen';
import NotificationScreen from './screen/NotificationScreen';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false, // ડીફોલ્ટ હેડર છુપાવ્યું છે (આપણે કસ્ટમ MainHedar વાપરીશું)
          animation: 'slide_from_right', // સ્મૂથ એનિમેશન ટ્રાન્ઝિશન
        }}
      >
        {/* શરૂઆતની સ્પ્લેશ સ્ક્રીન */}
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />

        {/* લૉગિન અને રજીસ્ટ્રેશન સ્ક્રીન્સ */}
        <RootStack.Screen name="LoginScreen" component={LoginScreen} />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />

        {/* મુખ્ય એપ્લિકેશન સ્ક્રીન્સ */}
        <RootStack.Screen name="BottomTab" component={BottomTab} />
        <RootStack.Screen name="DetailsScreen" component={DetailsScreen} />
        <RootStack.Screen name="NotificationScreen" component={NotificationScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

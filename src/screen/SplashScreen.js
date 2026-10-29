/**
 * સ્પ્લેશ સ્ક્રીન (SPLASH SCREEN)
 * -------------------------------------------------------------------------
 * એપ ખૂલે ત્યારે સૌથી પહેલા આ સ્ક્રીન દેખાય છે.
 * 
 * મુખ્ય કામગીરી:
 * ૧. એપનો લોગો અને એનિમેશન દર્શાવે છે.
 * ૨. 'CheckLogin()' ફંક્શન કૉલ કરે છે:
 *    - ફોનના 'AsyncStorage' માંથી 'islogin' કી તપાસે છે.
 *    - જો યુઝર પહેલેથી લૉગિન હોય, તો સીધો 'BottomTab' (હોમ સ્ક્રીન) પર જાય છે.
 *    - જો યુઝર લૉગિન ન હોય, તો 'LoginScreen' પર મોકલે છે.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../utils/colors';

const { width } = Dimensions.get('window');

const SplashScreen = (props) => {
  // એનિમેશન કિંમતો
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // ૧. લોગો એનિમેશન શરૂ કરવું
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // ૨. લૉગિન સ્ટેટસ ચેક કરવું
    CheckLogin();
  }, [fadeAnim, scaleAnim]);

  const CheckLogin = async () => {
    try {
      const isLogin = await AsyncStorage.getItem('islogin');

      // ૨ સેકન્ડનો વિલંબ જેથી યુઝર સ્પ્લેશ એનિમેશન જોઈ શકે
      setTimeout(() => {
        if (isLogin === 'true') {
          // જો યુઝર પહેલેથી લૉગિન હોય તો હોમ સ્ક્રીન પર મોકલો
          props.navigation.replace('BottomTab');
        } else {
          // જો યુઝર લૉગિન ન હોય તો લૉગિન સ્ક્રીન પર મોકલો
          props.navigation.replace('LoginScreen');
        }
      }, 2000);
    } catch (error) {
      console.log('ઓથેન્ટિકેશન સ્ટેટસ ચેક કરવામાં ભૂલ:', error);
      props.navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>📱</Text>
        </View>

        <Text style={styles.appName}>DEMO APP</Text>
        <Text style={styles.appTagline}>Clean Architecture & Context API</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themecolor1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});

export default SplashScreen;

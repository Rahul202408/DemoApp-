/**
 * સ્ક્રીન સાઈઝ અને મેટ્રિક્સ હેલ્પર્સ (SCREEN DIMENSIONS & METRICS)
 * -------------------------------------------------------------
 * ડિવાઇસના સ્ક્રીન સાઈઝ પ્રમાણે કમ્પોનન્ટ્સને રિસ્પોન્સિવ બનાવવા માટે.
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const metrics = {
  screenWidth: width < height ? width : height, // સ્ક્રીનની પહોળાઈ
  screenHeight: width < height ? height : width, // સ્ક્રીનની ઊંચાઈ
  isIOS: Platform.OS === 'ios',                  // શું Apple iOS છે?
  isAndroid: Platform.OS === 'android',          // શું Google Android છે?
  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  borderRadius: 12,
};

export default metrics;

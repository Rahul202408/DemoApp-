/**
 * લોડર કમ્પોનન્ટ (LOADER COMPONENT - એનિમેટેડ લોડિંગ ઇન્ડિકેટર)
 * -------------------------------------------------------------------------
 * સ્ક્રીન્સ પર જ્યારે સર્વર પરથી API ડેટા આવી રહ્યો હોય ત્યારે આ લોડર દેખાય છે.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const Loader = ({ text = 'LOADING...' }) => {
  const letters = text.split('');

  // દરેક અક્ષર માટે અલગ એનિમેશન વેલ્યુ
  const animations = useRef(
    letters.map(() => ({
      opacity: new Animated.Value(0.3),
      translateY: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    // અક્ષરો ઉપર-નીચે થાય તેવું લૂપ એનિમેશન
    const sequences = animations.map(({ opacity, translateY }) =>
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -12, // અક્ષર ઉપર જશે
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0, // અક્ષર મૂળ જગ્યાએ પાછો આવશે
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ),
    );

    // ક્રમશઃ એનિમેશન શરૂ કરવું (Staggered Effect)
    Animated.stagger(100, sequences).start();
  }, [animations]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {letters.map((char, index) => (
          <Animated.View
            key={index}
            style={{
              transform: [{ translateY: animations[index].translateY }],
              opacity: animations[index].opacity,
            }}
          >
            <Text style={styles.letter}>{char}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  letter: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.themecolor1,
    marginHorizontal: 2,
    letterSpacing: 2,
  },
});

export default Loader;

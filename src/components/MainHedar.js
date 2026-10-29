/**
 * મુખ્ય હેડર કમ્પોનન્ટ (MAIN HEADER COMPONENT)
 * -------------------------------------------------------------------------
 * દરેક સ્ક્રીન પર ઉપર આવતું સ્ટાન્ડર્ડ કસ્ટમ હેડર.
 * ટાઇટલ, પાછા જવા માટે બેક બટન અને જમણી બાજુના ઓપ્શનલ આઇકન સપોર્ટ કરે છે.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import colors from '../utils/colors';

const MainHedar = ({ title, showBack = false, onBackPress, rightComponent }) => {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />
      
      <View style={styles.leftContainer}>
        {/* જો showBack = true હોય તો પાછા જવાનું બેક બટન બતાવો */}
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: colors.themecolor1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MainHedar;

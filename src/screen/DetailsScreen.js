/**
 * ડિટેઇલ્સ સ્ક્રીન (DETAILS SCREEN - આઇટમ વિગતો)
 * -------------------------------------------------------------------------
 * જ્યારે હોમ સ્ક્રીન પર કોઈ કાર્ડ પર ટેપ થાય ત્યારે આ સ્ક્રીન ખૂલે છે.
 * નેવિગેશન રાઉટ પેરામીટર્સમાંથી ડેટા વાંચે છે (`route.params.item`).
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import MainHedar from '../components/MainHedar';

const DetailsScreen = ({ route, navigation }) => {
  // નેવિગેશનમાંથી મોકલેલો આઇટમ ડેટા મેળવ્યો
  const { item } = route.params || {};

  return (
    <View style={styles.container}>
      <MainHedar
        title="Item Details"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item?.category || 'General'}</Text>
            </View>
            <Text style={styles.statusText}>Status: {item?.status || 'Active'}</Text>
          </View>

          <Text style={styles.title}>{item?.title || 'Detail View'}</Text>
          <Text style={styles.date}>Created Date: {item?.date || 'N/A'}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Description & Notes</Text>
          <Text style={styles.description}>
            {item?.description || 'No detailed description provided for this item.'}
          </Text>

          {/* નેવિગેશન પેરામીટર પાસિંગ સમજૂતી કાર્ડ */}
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>ℹ️ નેવિગેશન પેરામીટર પાસ કરવાનો ફ્લો:</Text>
            <Text style={styles.hintBody}>
              ૧. HomeScreen: `props.navigation.navigate('DetailsScreen', &#123; item &#125;)`
              {'\n'}૨. DetailsScreen: `const &#123; item &#125; = route.params;`
            </Text>
          </View>
        </View>

        {/* પાછા જવાનું બટન */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Go Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whitesmoke,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.themecolor1,
    fontSize: 13,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  hintCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.themecolor1,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  hintBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  backButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DetailsScreen;

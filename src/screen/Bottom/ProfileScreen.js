/**
 * પ્રોફાઇલ સ્ક્રીન (PROFILE SCREEN - એકાઉન્ટ અને સેટિંગ્સ)
 * -------------------------------------------------------------------------
 * યુઝર પ્રોફાઇલ વિગતો, નોટિફિકેશન લેબ અને લૉગઆઉટ સ્ક્રીન.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. AsyncStorage માંથી લૉગિન થયેલા યુઝરનો ડેટા મેળવે છે.
 * ૨. યુઝરની વિગતો (નામ, ઈમેઈલ, મોબાઈલ) દર્શાવે છે.
 * ૩. નોટિફિકેશન પ્રેક્ટિસ લેબ (NotifyLab) પર જવાની લિંક આપે છે.
 * ૪. "LOGOUT" બટન દબાવતાં 'setLogout(props)' કૉલ થાય છે:
 *    - ફોનમાંથી ટોકન અને સેશન ડેટા સાફ થાય છે
 *    - યુઝર સીધો 'LoginScreen' પર જાય છે
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../utils/colors';
import { useLoginContext } from '../../Context/Login_context';
import MainHedar from '../../components/MainHedar';

const ProfileScreen = (props) => {
  const [userData, setUserData] = useState(null);
  const { setLogout } = useLoginContext();

  useEffect(() => {
    loadUserData();
  }, []);

  // ફોનના સ્ટોરેજમાંથી પ્રોફાઇલ ડેટા લોડ કરવો
  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userinfo');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (e) {
      console.log('પ્રોફાઇલ ડેટા વાંચવામાં ભૂલ:', e);
    }
  };

  // લૉગઆઉટ કન્ફર્મેશન એલર્ટ
  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from DemoApp?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => setLogout(props) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <MainHedar title="My Profile" showBack={false} />
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* યુઝર પ્રોફાઇલ કાર્ડ */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>

          <Text style={styles.userName}>{userData?.name || 'Demo User'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'demo@applified.com'}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 Mobile:</Text>
            <Text style={styles.infoValue}>{userData?.mobile || '9876543210'}</Text>
          </View>
        </View>

        {/* નોટિફિકેશન પ્રેક્ટિસ અને ટેસ્ટ કાર્ડ */}
        <TouchableOpacity
          style={styles.notifCard}
          onPress={() => props.navigation.navigate('NotificationScreen')}
        >
          <View style={styles.notifIconBox}>
            <Text style={styles.notifIcon}>🔔</Text>
          </View>
          <View style={styles.notifTextBox}>
            <Text style={styles.notifTitle}>NotifyLab (Practice & Test)</Text>
            <Text style={styles.notifDesc}>
              Test instant/scheduled notifications & view FCM Token
            </Text>
          </View>
          <Text style={styles.notifArrow}>›</Text>
        </TouchableOpacity>

        {/* પ્રોજેક્ટ આર્કિટેક્ચર સારાંશ કાર્ડ */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>🏗️ Project Architecture Overview</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>App.js:</Text> Wraps providers (Context, Paper, Alert, Safe Area).
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Context:</Text> Central store managing API calls & actions.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Reducer:</Text> Pure functions updating immutable state.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>baseUrl.js:</Text> Single source of truth for all API links.
            </Text>
          </View>
        </View>

        {/* લૉગઆઉટ બટન */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
          <Text style={styles.logoutText}>🚪 LOGOUT</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.themecolor1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    fontSize: 22,
  },
  notifTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notifDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notifArrow: {
    fontSize: 24,
    color: '#A1A6B8',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    fontSize: 16,
    color: colors.themecolor1,
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default ProfileScreen;

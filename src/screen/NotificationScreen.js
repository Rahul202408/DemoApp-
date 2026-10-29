/**
 * નોટિફિકેશન પ્રેક્ટિસ અને ટેસ્ટ સ્ક્રીન (NOTIFICATION PRACTICE SCREEN)
 * -------------------------------------------------------------------------
 * આ સ્ક્રીન NotificationPractice પ્રોજેક્ટની જેમ બધી ટેસ્ટિંગ સુવિધાઓ પૂરી પાડે છે:
 * ૧. FCM Token જોવો, રિફ્રેશ કરવો અને કોપી કરવો
 * ૨. ઇન્સ્ટન્ટ લોકલ નોટિફિકેશન (Instant Local Notification) ટેસ્ટ કરવું
 * ૩. શિડ્યુઅલ નોટિફિકેશન (૫ સેકન્ડ બાદ નોટિફિકેશન) ટેસ્ટ કરવું
 * ૪. Android 13+ / iOS નોટિફિકેશન પરમિશન સ્ટેટસ ચેક કરવું
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../utils/colors';
import MainHedar from '../components/MainHedar';
import {
  displayInstantNotification,
  scheduleNotification,
  requestNotificationPermission,
  getFcmToken,
} from '../utils/notificationService';
import { Toast } from 'react-native-alert-notification';

const NotificationScreen = ({ navigation }) => {
  const [fcmToken, setFcmToken] = useState('Loading...');

  useEffect(() => {
    fetchToken();
  }, []);

  // સક્રિય FCM ટોકન મેળવવો
  const fetchToken = async () => {
    let token = await AsyncStorage.getItem('fcm_token');
    if (!token) {
      token = await getFcmToken();
    }
    setFcmToken(token || 'No FCM token generated yet.');
  };

  // ઇન્સ્ટન્ટ નોટિફિકેશન ટ્રિગર કરવું
  const handleInstantPress = async () => {
    await displayInstantNotification(
      'Instant Alert 🔔',
      'This is an instant notification triggered via Notifee!'
    );
    Toast.show({
      type: 'SUCCESS',
      title: 'Notification Sent',
      textBody: 'Check your phone notification tray.',
    });
  };

  // ૫ સેકન્ડ પછી આવતું શિડ્યુઅલ નોટિફિકેશન ટ્રિગર કરવું
  const handleSchedulePress = async () => {
    await scheduleNotification(
      5,
      'Scheduled Alert ⏰',
      'This notification was scheduled 5 seconds ago!'
    );
    Toast.show({
      type: 'SUCCESS',
      title: 'Scheduled for 5s',
      textBody: 'Lock phone or wait 5 seconds to see notification.',
    });
  };

  // પરમિશન સ્ટેટસ ચેક કરવું
  const handlePermissionPress = async () => {
    const granted = await requestNotificationPermission();
    Alert.alert(
      'Permission Status',
      granted
        ? 'Notification permission is GRANTED! ✅'
        : 'Notification permission is DENIED! ❌'
    );
  };

  return (
    <View style={styles.container}>
      <MainHedar
        title="NotifyLab (Practice)"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* સ્વાગત કાર્ડ */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>NotifyLab 🔔</Text>
          <Text style={styles.heroSubtitle}>
            Practice and test FCM & Notifee notifications directly.
          </Text>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>Ready for Practice</Text>
          </View>
        </View>

        {/* એક્ટિવ FCM ટોકન દર્શાવતું બોક્સ */}
        <View style={styles.tokenBox}>
          <Text style={styles.tokenTitle}>🔑 Active FCM Token:</Text>
          <Text style={styles.tokenText} numberOfLines={3} selectable>
            {fcmToken}
          </Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchToken}>
            <Text style={styles.refreshBtnText}>🔄 Refresh Token</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Notification Features</Text>

        {/* ફીચર ૧: ઇન્સ્ટન્ટ નોટિફિકેશન બટન */}
        <TouchableOpacity style={styles.featureCard} onPress={handleInstantPress}>
          <View style={[styles.iconBox, { backgroundColor: '#EDE9FE' }]}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Instant Notification</Text>
            <Text style={styles.featureSubtitle}>
              Trigger immediate local notification
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* ફીચર ૨: શિડ્યુઅલ નોટિફિકેશન બટન (૫ સેકન્ડ) */}
        <TouchableOpacity style={styles.featureCard} onPress={handleSchedulePress}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.icon}>⏰</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Scheduled Notification (5s)</Text>
            <Text style={styles.featureSubtitle}>
              Trigger notification after 5 seconds
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* ફીચર ૩: પરમિશન ચેક બટન */}
        <TouchableOpacity style={styles.featureCard} onPress={handlePermissionPress}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.icon}>🛡️</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Notification Permission</Text>
            <Text style={styles.featureSubtitle}>
              Check Android 13+ / iOS permission
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* આર્કિટેક્ચર માર્ગદર્શન બોક્સ */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Universal Architecture Note:</Text>
          <Text style={styles.tipText}>
            All notification logic is encapsulated in `src/utils/notificationService.js`.
            You can copy that single file into any of your other projects to have full
            Firebase + Notifee notification support instantly!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.themecolor1,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    lineHeight: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.themecolor1,
  },
  tokenBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tokenTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  tokenText: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  refreshBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  refreshBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.themecolor1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171B34',
    marginBottom: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EAECF5',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  featureInfo: {
    flex: 1,
    marginLeft: 14,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171B34',
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#858BA0',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#A1A6B8',
    marginLeft: 6,
  },
  tipCard: {
    backgroundColor: '#EDE9FE',
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4338CA',
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5B5680',
    marginTop: 6,
  },
});

export default NotificationScreen;

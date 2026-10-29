/**
 * નોટિફિકેશન સર્વિસ (FIREBASE CLOUD MESSAGING + NOTIFEE)
 * -------------------------------------------------------------------------
 * આ એક યુનિવર્સલ અને ફરીથી વાપરી શકાય તેવી નોટિફિકેશન સર્વિસ છે, જેને તમે
 * કોઈ પણ React Native એપમાં સીધી જ વાપરી શકો છો.
 * 
 * મુખ્ય સુવિધાઓ:
 * ૧. Android નોટિફિકેશન ચેનલ બનાવવી (Notifee)
 * ૨. નોટિફિકેશન પરમિશન લેવી (Android 13+ POST_NOTIFICATIONS અને iOS Authorization)
 * ૩. FCM ટોકન મેળવવો અને નવો ટોકન આવે ત્યારે AsyncStorage માં સેવ કરવો
 * ૪. ફોરગ્રાઉન્ડ મેસેજ હેન્ડલિંગ (એપ ચાલુ હોય ત્યારે Notifee પોપઅપ બતાવવું)
 * ૫. ઇન્સ્ટન્ટ લોકલ નોટિફિકેશન (ટેસ્ટિંગ માટે)
 * ૬. શિડ્યુઅલ નોટિફિકેશન (સમય નક્કી કરીને નોટિફિકેશન મોકલવું)
 */

import { Platform, PermissionsAndroid } from 'react-native';
import {
  getMessaging,
  requestPermission,
  getToken,
  onTokenRefresh,
  onMessage,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, { TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------------------------------------------------------------------------
// ૧. મુખ્ય સેટઅપ ફંક્શન (App.js ના useEffect માં કૉલ કરવું)
// -------------------------------------------------------------------------
export const setupNotifications = async () => {
  let unsubscribeOnMessage;
  let unsubscribeOnTokenRefresh;

  try {
    const messagingInstance = getMessaging();

    // ૧. Android નોટિફિકેશન ચેનલ બનાવવી
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: 4, // ૪ = હાઈ ઈમ્પોર્ટન્સ (સાઉન્ડ અને બેનર પોપઅપ સાથે)
    });

    // ૨. નોટિફિકેશન પરમિશન મેળવવી
    await requestNotificationPermission();

    // ૩. FCM ટોકન મેળવીને AsyncStorage માં સેવ કરવો
    const token = await getFcmToken();
    console.log('[નોટિફિકેશન સર્વિસ] એક્ટિવ FCM ટોકન:', token);

    // ૪. ટોકન રિફ્રેશ થાય ત્યારે નવો ટોકન સેવ કરવા માટે લિસ્ટનર
    unsubscribeOnTokenRefresh = onTokenRefresh(messagingInstance, async (newToken) => {
      console.log('[નોટિફિકેશન સર્વિસ] નવો FCM ટોકન રિફ્રેશ થયો:', newToken);
      await AsyncStorage.setItem('fcm_token', newToken);
    });

    // ૫. ફોરગ્રાઉન્ડ મેસેજ લિસ્ટનર (એપ ખુલ્લી હોય ત્યારે નોટિફિકેશન બતાવવા)
    unsubscribeOnMessage = onMessage(messagingInstance, async (remoteMessage) => {
      console.log('[નોટિફિકેશન સર્વિસ] ફોરગ્રાઉન્ડ મેસેજ મળ્યો:', remoteMessage);

      const title =
        remoteMessage.notification?.title ??
        remoteMessage.data?.title?.toString() ??
        'New Notification';

      const body =
        remoteMessage.notification?.body ??
        remoteMessage.data?.body?.toString() ??
        'You received a new message!';

      // Notifee વડે સ્ક્રીન પર નોટિફિકેશન દર્શાવો
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      });
    });
  } catch (error) {
    console.error('[નોટિફિકેશન સર્વિસ] સેટઅપમાં ભૂલ:', error);
  }

  // લિસ્ટનર્સ બંધ કરવા માટે ક્લીનઅપ ફંક્શન પાછું આપવું
  return () => {
    unsubscribeOnMessage?.();
    unsubscribeOnTokenRefresh?.();
  };
};

// -------------------------------------------------------------------------
// ૨. પરમિશન માંગવાનું ફંક્શન (Android 13+ અને iOS)
// -------------------------------------------------------------------------
export const requestNotificationPermission = async () => {
  try {
    const messagingInstance = getMessaging();

    // Android 13 (API Level 33) કે તેથી નવા વર્ઝનમાં યુઝર પાસેથી પરમિશન લેવી જરૂરી છે
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[નોટિફિકેશન સર્વિસ] Android માં પરમિશન મળી ગઈ');
        return true;
      } else {
        console.log('[નોટિફિકેશન સર્વિસ] Android માં પરમિશન નકારી દેવાઈ');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const authStatus = await requestPermission(messagingInstance);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('[નોટિફિકેશન સર્વિસ] iOS માં પરમિશન મળી ગઈ');
        return true;
      } else {
        console.log('[નોટિફિકેશન સર્વિસ] iOS માં પરમિશન નકારી દેવાઈ');
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('[નોટિફિકેશન સર્વિસ] પરમિશન લેવામાં ભૂલ:', error);
    return false;
  }
};

// -------------------------------------------------------------------------
// ૩. FCM ટોકન મેળવવાનું ફંક્શન
// -------------------------------------------------------------------------
export const getFcmToken = async () => {
  try {
    const messagingInstance = getMessaging();
    const token = await getToken(messagingInstance);

    if (token) {
      // ફોનના લોકલ સ્ટોરેજમાં સેવ કરો જેથી લૉગિન વખતે સર્વર પર મોકલી શકાય
      await AsyncStorage.setItem('fcm_token', token);
      return token;
    } else {
      console.log('[નોટિફિકેશન સર્વિસ] કોઈ FCM ટોકન મળ્યો નથી');
      return null;
    }
  } catch (error) {
    console.error('[નોટિફિકેશન સર્વિસ] FCM ટોકન મેળવવામાં ભૂલ:', error);
    return null;
  }
};

// -------------------------------------------------------------------------
// ૪. તાત્કાલિક નોટિફિકેશન મોકલવું (ઇન્સ્ટન્ટ ટેસ્ટિંગ માટે)
// -------------------------------------------------------------------------
export const displayInstantNotification = async (
  title = 'Test Instant Notification 🔔',
  body = 'This is a test notification from DemoApp!',
) => {
  try {
    // ચેનલ છે કે નહીં તેની ખાતરી કરો
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: 4,
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('[નોટિફિકેશન સર્વિસ] ઇન્સ્ટન્ટ નોટિફિકેશન બતાવવામાં ભૂલ:', error);
  }
};

// -------------------------------------------------------------------------
// ૫. શિડ્યુઅલ નોટિફિકેશન (નક્કી કરેલી સેકન્ડ પછી નોટિફિકેશન મોકલવા માટે)
// -------------------------------------------------------------------------
export const scheduleNotification = async (
  secondsDelay = 5,
  title = 'Scheduled Notification ⏰',
  body = 'This notification was scheduled 5 seconds ago!',
) => {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: 4,
    });

    const triggerTime = Date.now() + secondsDelay * 1000;

    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime,
      },
    );

    console.log(`[નોટિફિકેશન સર્વિસ] ${secondsDelay} સેકન્ડ પછી નોટિફિકેશન શિડ્યુઅલ થયું.`);
  } catch (error) {
    console.error('[નોટિફિકેશન સર્વિસ] નોટિફિકેશન શિડ્યુઅલ કરવામાં ભૂલ:', error);
  }
};

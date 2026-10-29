/**
 * @format
 * એપ્લિકેશનનું એન્ટ્રી પોઈન્ટ (શરૂઆતનું બિંદુ)
 * -------------------------------------------------------------
 * આ ફાઈલથી React Native એપ શરૂ થાય છે.
 * 'AppRegistry' મુખ્ય App કમ્પોનન્ટને રજીસ્ટર કરે છે.
 * 
 * 🔔 બેકગ્રાઉન્ડ નોટિફિકેશન હેન્ડલર:
 * જ્યારે એપ Background માં હોય કે Kill (સંપૂર્ણ બંધ) થઈ ગઈ હોય, ત્યારે
 * આવતા Firebase Push નોટિફિકેશનને અહીં હેન્ડલ કરવામાં આવે છે.
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// -------------------------------------------------------------
// FIREBASE બેકગ્રાઉન્ડ નોટિફિકેશન હેન્ડલર
// -------------------------------------------------------------
try {
  const messagingInstance = getMessaging();
  setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
    console.log('[બેકગ્રાઉન્ડ FCM મેસેજ]:', remoteMessage);

    const title =
      remoteMessage.notification?.title ??
      remoteMessage.data?.title?.toString() ??
      'New Notification';

    const body =
      remoteMessage.notification?.body ??
      remoteMessage.data?.body?.toString() ??
      'You received a notification while away!';

    // Notifee વડે નોટિફિકેશન બતાવો
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
  });
} catch (error) {
  console.log('બેકગ્રાઉન્ડ નોટિફિકેશન હેન્ડલર નોંધ:', error);
}

// મુખ્ય App કમ્પોનન્ટને રજીસ્ટર કર્યો
AppRegistry.registerComponent(appName, () => App);

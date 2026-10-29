/**
 * મુખ્ય કમ્પોનન્ટ: App.js
 * -------------------------------------------------------------------------
 * આ પ્રોજેક્ટનું મુખ્ય હૃદય (HEART OF THE PROJECT):
 * -------------------------------------------------------------------------
 * React Native માં App.js સૌથી મુખ્ય કમ્પોનન્ટ છે. બધા ગ્લોબલ પ્રોવાઇડર્સ,
 * થીમ પ્રોવાઇડર્સ, એલર્ટ સિસ્ટમ અને ઇન્ટરનેટ કનેક્શન લિસ્ટનર અહીં સેટ થાય છે.
 * 
 * ૧. પ્રોવાઇડર હાયરાર્કી (કેટલા Providers છે અને શા માટે?):
 *    <PaperProvider>             -> React Native Paper UI થીમ સપોર્ટ માટે
 *      <AlertNotificationRoot>   -> આખી એપમાં ટોસ્ટ (Toast) કે એલર્ટ પોપઅપ બતાવવા માટે
 *        <SafeAreaView>          -> ફોનના નોચ (Notch) અને સ્ટેટસ બાર સાથે લેઆઉટ એડજસ્ટ કરવા માટે
 *          <LoginProvider>       -> લૉગિન સ્ટેટ, યુઝર ડેટા અને ટોકન આખી એપમાં પહોંચાડવા માટે
 *            <DashboardProvider> -> ડેશબોર્ડ ડેટા અને લિસ્ટ આખી એપમાં પહોંચાડવા માટે
 *              <Navigation />    -> સ્ક્રીન્સ નેવિગેશન (Splash -> Login -> Home -> Details)
 *            </DashboardProvider>
 *          </LoginProvider>
 *        </SafeAreaView>
 *      </AlertNotificationRoot>
 *    </PaperProvider>
 * 
 * ૨. નેટવર્ક ચેક (NETINFO):
 *    જો યુઝરનું ઇન્ટરનેટ બંધ થઈ જાય, તો આપોઆપ 'No Internet' મોડલ સ્ક્રીન પર દેખાય છે.
 * 
 * ૩. એપ અપડેટ મોડલ:
 *    સર્વર પર નવું વર્ઝન આવે ત્યારે યુઝરને એપ અપડેટ કરવાનું પોપઅપ બતાવે છે.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// નેવિગેશન અને કલર્સ
import Navigation from './src/Navigation';
import colors from './src/utils/colors';

// કન્ટેક્સ્ટ પ્રોવાઇડર્સ (ગ્લોબલ સ્ટેટ)
import { LoginProvider } from './src/Context/Login_context';
import { DashboardProvider } from './src/Context/Dashboard_context';
import { ProductProvider } from './src/Context/Product_context';

// બેઝ URL અને API એન્ડપોઇન્ટ્સ
import { ACCEPT_HEADER, get_version_url } from './src/utils/baseUrl';

// નોટિફિકેશન સર્વિસ (Firebase Cloud Messaging + Notifee)
import { setupNotifications } from './src/utils/notificationService';

const { width } = Dimensions.get('window');

function App() {
  // સ્ટેટ: ઇન્ટરનેટ કનેક્શન સ્ટેટસ (True = કનેક્ટેડ, False = ઑફલાઇન)
  const [isConnected, setIsConnected] = useState(true);

  // સ્ટેટ: એપ વર્ઝન અપડેટ મોડલ (True = પોપઅપ બતાવો)
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // -------------------------------------------------------------
  // ૧. શરૂઆતનું સેટઅપ: ઇન્ટરનેટ લિસ્ટનર અને નોટિફિકેશન શરૂ કરવું
  // -------------------------------------------------------------
  useEffect(() => {
    // A. ઇન્ટરનેટ કનેક્શન ચાલુ કે બંધ થાય તે પકડવા માટે NetInfo લિસ્ટનર
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });

    // B. Firebase નોટિફિકેશન સેટઅપ (ચેનલ, પરમિશન, FCM ટોકન અને લિસ્ટનર્સ)
    let cleanupNotifications;
    setupNotifications().then((cleanup) => {
      cleanupNotifications = cleanup;
    });

    // C. એપ લોડ થતાં જ નવું વર્ઝન આવ્યું છે કે નહીં તે ચેક કરવું
    checkForUpdate();

    // કમ્પોનન્ટ અનમાઉન્ટ થાય ત્યારે લિસ્ટનર્સ સાફ (Cleanup) કરવા
    return () => {
      unsubscribeNet();
      cleanupNotifications?.();
    };
  }, []);

  // -------------------------------------------------------------
  // ૨. નવું એપ વર્ઝન ચેક કરવાનું ફંક્શન
  // -------------------------------------------------------------
  const checkForUpdate = () => {
    axios
      .get(get_version_url, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      })
      .then((res) => {
        // એપનું હાલનું વર્ઝન
        const currentVersion = '1.0.0';
        const serverVersion =
          Platform.OS === 'ios'
            ? res?.data?.data?.ios_version
            : res?.data?.data?.android_version;

        // જો સર્વર પર નવું વર્ઝન હોય તો અપડેટ પોપઅપ બતાવો
        if (serverVersion && currentVersion !== serverVersion) {
          setShowUpdateModal(true);
        }
      })
      .catch((err) => {
        // ડેમો મોડ અથવા સર્વર બંધ હોય ત્યારે શાંતિથી આગળ વધો
        console.log('વર્ઝન ચેક નોટિસ: API ડેમો મોડમાં ચાલે છે');
      });
  };

  // અપડેટ બટન દબાવે ત્યારે પ્લે સ્ટોર કે એપ સ્ટોર ખોલવું
  const handleUpdatePress = () => {
    setShowUpdateModal(false);
    const storeUrl =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com'
        : 'https://play.google.com/store';
    Linking.openURL(storeUrl);
  };

  return (
    <PaperProvider>
      <AlertNotificationRoot>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          {/* ગ્લોબલ કન્ટેક્સ્ટ પ્રોવાઇડર્સ જે નેવિગેશનને ઘેરે છે */}
          <LoginProvider>
            <DashboardProvider>
              <ProductProvider>
                <Navigation />
              </ProductProvider>
            </DashboardProvider>
          </LoginProvider>

          {/* -------------------------------------------------------- */}
          {/* ઇન્ટરનેટ બંધ હોય ત્યારે દેખાતું નો-ઇન્ટરનેટ મોડલ પોપઅપ     */}
          {/* -------------------------------------------------------- */}
          <Modal visible={!isConnected} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={require('./src/assets/images/nonetwork.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.title}>No Internet Connection</Text>
                <Text style={styles.message}>
                  You are currently offline. Please check your Wi-Fi or mobile data connection.
                </Text>
              </View>
            </View>
          </Modal>

          {/* -------------------------------------------------------- */}
          {/* નવું વર્ઝન આવ્યું હોય ત્યારે દેખાતું અપડેટ મોડલ પોપઅપ       */}
          {/* -------------------------------------------------------- */}
          <Modal
            visible={showUpdateModal}
            transparent
            animationType="slide"
            statusBarTranslucent
          >
            <View style={styles.modalContainer}>
              <View style={styles.updateModalContent}>
                <Text style={styles.updateIcon}>🚀</Text>
                <Text style={styles.updateTitle}>Update Available!</Text>
                <Text style={styles.updateMessage}>
                  A new and improved version of the application is available.
                  Please update to continue enjoying seamless performance.
                </Text>

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdatePress}
                >
                  <Text style={styles.updateButtonText}>UPDATE NOW</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </AlertNotificationRoot>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    maxWidth: 380,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  updateModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    maxWidth: 380,
  },
  updateIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  updateMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  updateButton: {
    backgroundColor: colors.themecolor1,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
});

export default App;

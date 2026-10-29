/**
 * લૉગિન સ્ક્રીન (LOGIN SCREEN)
 * -------------------------------------------------------------------------
 * આ સ્ક્રીન યુઝર પાસેથી ઈમેઈલ અને પાસવર્ડ ઇનપુટ લેવા માટે છે.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. યુઝર ઈમેઈલ અને પાસવર્ડ દાખલ કરે છે.
 * ૨. 'handleLogin()' કૉલ થાય છે -> ઇનપુટ ખાલી નથી તેની ચકાસણી (Validation) થાય છે.
 * ૩. 'useLoginContext()' માંથી 'LoginUser' ફંક્શન અને 'login_loading' સ્ટેટ મળે છે.
 * ૪. 'LoginUser(payload, props)' કૉલ થાય છે જે Context દ્વારા સર્વર API કૉલ કરે છે.
 * ૫. જ્યાં સુધી સર્વરમાંથી જવાબ ન આવે ત્યાં સુધી બટન પર લોડર (ActivityIndicator) ફરશે.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import colors from '../utils/colors';
import { useLoginContext } from '../Context/Login_context';
import { Toast } from 'react-native-alert-notification';

const LoginScreen = (props) => {
  // ઇનપુટ ફિલ્ડ્સ માટે લોકલ સ્ટેટ
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ગ્લોબલ કન્ટેક્સ્ટમાંથી લૉગિન ફંક્શન અને લોડિંગ સ્ટેટ લીધું
  const { LoginUser, login_loading } = useLoginContext();

  const handleLogin = () => {
    // ૧. ઇનપુટ ખાલી નથી તેની ચકાસણી
    if (!email.trim()) {
      Toast.show({
        type: 'WARNING',
        title: 'Email Required',
        textBody: 'Please enter your email address.',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'WARNING',
        title: 'Password Required',
        textBody: 'Please enter your password.',
      });
      return;
    }

    // ૨. સર્વર પર મોકલવા માટેનું પેલોડ (ડેટા)
    const payload = {
      email: email.trim(),
      password: password.trim(),
    };

    // ૩. કન્ટેક્સ્ટ ફંક્શન કૉલ કર્યું (નેવિગેશન માટે props મોકલ્યા)
    LoginUser(payload, props);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.whitesmoke} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* હેડર સેક્શન */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
          <Text style={styles.subText}>Sign in to continue to your account</Text>
        </View>

        {/* લૉગિન ફોર્મ કાર્ડ */}
        <View style={styles.formCard}>
          {/* ઈમેઈલ ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="example@applified.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* પાસવર્ડ ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* લૉગિન બટન */}
          <TouchableOpacity
            style={[styles.loginBtn, login_loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={login_loading}
          >
            {login_loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          {/* ડેમો ટેસ્ટિંગ માટે સહાયક નોંધ */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>💡 Quick Demo Hint:</Text>
            <Text style={styles.hintDesc}>You can enter any dummy email & password to test the app flow.</Text>
          </View>
        </View>

        {/* ફૂટર: સાઇન અપ લિંક */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignUpScreen')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whitesmoke,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#FAFAFA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: 8,
  },
  eyeText: {
    fontSize: 12,
    color: colors.themecolor1,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: colors.themecolor1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hintBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.themecolor1,
  },
  hintDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.themecolor1,
  },
});

export default LoginScreen;

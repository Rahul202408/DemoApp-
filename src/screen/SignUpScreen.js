/**
 * સાઇન અપ સ્ક્રીન (SIGN UP SCREEN - નવું રજીસ્ટ્રેશન)
 * -------------------------------------------------------------------------
 * નવું એકાઉન્ટ બનાવવા માટેનું રજીસ્ટ્રેશન ફોર્મ.
 * 'useLoginContext()' માંથી 'RegisterUser' ફંક્શન કૉલ કરે છે.
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
import MainHedar from '../components/MainHedar';

const SignUpScreen = (props) => {
  // ફોર્મ ઇનપુટ્સ માટે લોકલ સ્ટેટ
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // કન્ટેક્સ્ટમાંથી રજીસ્ટ્રેશન ફંક્શન અને લોડિંગ સ્ટેટ લીધું
  const { RegisterUser, register_loading } = useLoginContext();

  const handleRegister = () => {
    // વિગતો ખાલી નથી તેની ચકાસણી
    if (!name.trim() || !email.trim() || !password.trim()) {
      Toast.show({
        type: 'WARNING',
        title: 'Fields Required',
        textBody: 'Please fill all required fields.',
      });
      return;
    }

    // સર્વર માટે ડેટા પેલોડ
    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      password: password.trim(),
    };

    // રજીસ્ટ્રેશન ફંક્શન કૉલ કર્યું
    RegisterUser(payload, props);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <MainHedar
        title="Create Account"
        showBack={true}
        onBackPress={() => props.navigation.goBack()}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <Text style={styles.title}>Join Us Today!</Text>
          <Text style={styles.subtitle}>Enter your details to create a new profile</Text>

          {/* નામ ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Rahul Sharma"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* ઈમેઈલ ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="rahul@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* મોબાઈલ નંબર ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          {/* પાસવર્ડ ઇનપુટ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter strong password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* રજીસ્ટર બટન */}
          <TouchableOpacity
            style={[styles.btn, register_loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={register_loading}
          >
            {register_loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>REGISTER</Text>
            )}
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
    padding: 20,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
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
  btn: {
    backgroundColor: colors.themecolor1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default SignUpScreen;

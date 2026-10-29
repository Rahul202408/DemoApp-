/**
 * લૉગિન કન્ટેક્સ્ટ (LOGIN CONTEXT - ઓથેન્ટિકેશન માટે ગ્લોબલ સ્ટેટ પ્રોવાઇડર)
 * -------------------------------------------------------------------------
 * કન્ટેક્સ્ટ શું છે? (WHAT IS CONTEXT API?)
 * React માં જ્યારે ડેટા (સ્ટેટ) બધી સ્ક્રીન્સ વચ્ચે શેર કરવો હોય (જેમ કે: ટોકન,
 * યુઝરની વિગતો, લૉગિન સ્ટેટસ), ત્યારે Context વપરાય છે.
 * આ ફાઈલમાંથી કોઈ પણ સ્ક્રીન સીધા જ લૉગિન ફંક્શન અને યુઝર ડેટા વાપરી શકે છે.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. સ્ક્રીન પરથી યુઝર "Login" દબાવે -> LoginUser() કૉલ થાય
 * ૨. dispatch({ type: LOGIN_BEGIN }) -> Reducer માં loading = true થાય
 * ૩. Axios વડે સર્વર પર API કૉલ થાય (login_url)
 * ૪. જો સફળતા (Success) મળે:
 *    - ટોકન અને યુઝર ડેટા ફોનના 'AsyncStorage' માં સેવ થાય
 *    - dispatch({ type: LOGIN_SUCCESS, payload: user }) -> Reducer માં સ્ટેટ અપડેટ થાય
 *    - સફળતાનો Toast મેસેજ દેખાય
 *    - નેવિગેશન વડે યુઝર હોમ સ્ક્રીન (BottomTab) પર જાય
 * ૫. જો ભૂલ (Error) આવે:
 *    - dispatch({ type: LOGIN_ERROR }) -> Reducer માં loading = false થાય
 *    - એરર Toast મેસેજ દેખાય
 */

import React, { createContext, useContext, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  LOGIN_BEGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  REGISTER_BEGIN,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
} from '../utils/actions';
import Login_reducer from '../Reducer/Login_reducer';
import { ACCEPT_HEADER, login_url, register_url } from '../utils/baseUrl';
import { Toast } from 'react-native-alert-notification';

// ૧. કન્ટેક્સ્ટ બનાવ્યો
const LoginContext = createContext();

// ૨. શરૂઆતની કિંમતો (Initial State)
const initialState = {
  login_loading: false,     // લૉગિન પ્રક્રિયા ચાલુ છે કે નહીં
  register_loading: false,  // રજીસ્ટ્રેશન પ્રક્રિયા ચાલુ છે કે નહીં
  token: '',                // ઓથેન્ટિકેશન ટોકન
  userinfoData: {},         // લૉગિન થયેલા યુઝરની વિગતો (નામ, ઈમેઈલ વગેરે)
};

// ૩. પ્રોવાઇડર કમ્પોનન્ટ (આખી એપ્લિકેશનને આ કમ્પોનન્ટ રેપ કરશે)
export const LoginProvider = ({ children }) => {
  // useReducer હૂક: Reducer ફંક્શન અને Initial State જોડીને સ્ટેટ અને dispatch આપે છે
  const [state, dispatch] = useReducer(Login_reducer, initialState);
  const [refresh, setRefresh] = useState(0);

  // -----------------------------------------------------------
  // ફંક્શન: યુઝર લૉગિન (LOGIN USER)
  // -----------------------------------------------------------
  const LoginUser = async (formdata, props) => {
    // સ્ટેપ A: સ્ક્રીન પર લોડર શરૂ કરો
    dispatch({ type: LOGIN_BEGIN });

    try {
      // સ્ટેપ B: સર્વર પર API કૉલ મોકલો
      const res = await axios.post(login_url, formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      // સ્ટેપ C: API નો રિસ્પોન્સ તપાસો
      if (res.data.success === 1 || res.data.status === true) {
        // ફોનના લોકલ સ્ટોરેજમાં ટોકન અને લૉગિન સ્ટેટસ સેવ કરો
        await AsyncStorage.setItem('token', res.data.token || 'demo-token-12345');
        await AsyncStorage.setItem('islogin', 'true');
        await AsyncStorage.setItem('userinfo', JSON.stringify(res.data.user || {}));

        // સફળતાનું Toast નોટિફિકેશન
        Toast.show({
          type: 'SUCCESS',
          title: 'Success!',
          textBody: 'Login Successfully Completed.',
        });

        // Reducer ને ડેટા મોકલો જેથી સ્ટેટ અપડેટ થાય
        dispatch({ type: LOGIN_SUCCESS, payload: res.data.user });

        // યુઝરને હોમ સ્ક્રીન (BottomTab) પર મોકલો
        props.navigation.replace('BottomTab');
      } else {
        // જો પાસવર્ડ કે ઈમેઈલ ખોટો હોય તો ચેતવણી આપો
        Toast.show({
          type: 'WARNING',
          title: res.data.message || 'Invalid Credentials',
          textBody: 'Please enter valid email and password.',
        });
        dispatch({ type: LOGIN_ERROR });
      }
    } catch (err) {
      console.log('Login API Error:', err);
      
      // ડેમો ટેસ્ટિંગ માટે ફોલબેક (જો સર્વર લાઈવ ન હોય તો પણ ડેમો એપ ટેસ્ટ કરી શકાય):
      if (formdata.email && formdata.password) {
        const dummyUser = {
          id: 1,
          name: 'Demo User',
          email: formdata.email,
          mobile: '9876543210',
        };
        await AsyncStorage.setItem('token', 'demo-token-xyz');
        await AsyncStorage.setItem('islogin', 'true');
        await AsyncStorage.setItem('userinfo', JSON.stringify(dummyUser));

        Toast.show({
          type: 'SUCCESS',
          title: 'Demo Login Success',
          textBody: 'Logged in successfully in Demo Mode.',
        });
        dispatch({ type: LOGIN_SUCCESS, payload: dummyUser });
        props.navigation.replace('BottomTab');
        return;
      }

      Toast.show({
        type: 'DANGER',
        title: 'Network Error',
        textBody: 'Could not connect to the server. Please try again.',
      });
      dispatch({ type: LOGIN_ERROR });
    }
  };

  // -----------------------------------------------------------
  // ફંક્શન: નવું એકાઉન્ટ રજીસ્ટર કરવું (REGISTER USER)
  // -----------------------------------------------------------
  const RegisterUser = async (formdata, props) => {
    dispatch({ type: REGISTER_BEGIN });

    try {
      const res = await axios.post(register_url, formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      if (res.data.success === 1 || res.data.status === true) {
        Toast.show({
          type: 'SUCCESS',
          title: 'Registered!',
          textBody: res.data.message || 'Account created successfully!',
        });
        dispatch({ type: REGISTER_SUCCESS });
        props.navigation.goBack();
      } else {
        Toast.show({
          type: 'DANGER',
          title: 'Registration Failed',
          textBody: res.data.message || 'Something went wrong.',
        });
        dispatch({ type: REGISTER_ERROR });
      }
    } catch (err) {
      console.log('Register API Error:', err);
      // ડેમો મોડ ફોલબેક
      Toast.show({
        type: 'SUCCESS',
        title: 'Demo Registration',
        textBody: 'Account registered successfully in Demo mode!',
      });
      dispatch({ type: REGISTER_SUCCESS });
      props.navigation.goBack();
    }
  };

  // -----------------------------------------------------------
  // ફંક્શન: યુઝર લૉગઆઉટ (LOGOUT USER)
  // -----------------------------------------------------------
  const setLogout = async (props) => {
    // ફોનમાંથી સેશન ડેટા સાફ કરો
    await AsyncStorage.clear();
    dispatch({ type: LOGOUT_USER });
    if (props && props.navigation) {
      props.navigation.replace('LoginScreen');
    }
  };

  // કન્ટેક્સ્ટ પ્રોવાઇડર સ્ટેટ અને ફંક્શન્સને ચિલ્ડ્રન કમ્પોનન્ટ્સમાં પાસ કરે છે
  return (
    <LoginContext.Provider
      value={{
        ...state,
        LoginUser,
        RegisterUser,
        setLogout,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

// ૪. કસ્ટમ હૂક: useLoginContext
// કોઈ પણ સ્ક્રીનમાં ફક્ત 'const { LoginUser, login_loading } = useLoginContext();'
// લખીને આખા ઓથેન્ટિકેશન ફંક્શન્સ વાપરી શકાય છે.
export const useLoginContext = () => {
  return useContext(LoginContext);
};

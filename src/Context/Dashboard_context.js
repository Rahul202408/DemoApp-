/**
 * ડેશબોર્ડ કન્ટેક્સ્ટ (DASHBOARD CONTEXT - ટોકન ઓથેન્ટિકેશન સાથે ડેટા મેનેજમેન્ટ)
 * -------------------------------------------------------------------------
 * આ કન્ટેક્સ્ટ સુરક્ષિત API કૉલ્સ (Bearer Token સાથે) હેન્ડલ કરે છે.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. AsyncStorage માંથી લૉગિન વખતે સેવ થયેલો 'token' મેળવે છે.
 * ૨. Axios ના Headers માં `Authorization: 'Bearer ' + token` મોકલે છે.
 * ૩. જો ટોકન એક્સપાયર થઈ ગયું હોય, તો સીધું `setLogout(props)` કૉલ કરીને લૉગિન સ્ક્રીન પર મોકલે છે.
 * ૪. ડેટા મળે ત્યારે `GET_DASHBOARD_SUCCESS` dispatch કરીને Reducer માં લિસ્ટ સેવ કરે છે.
 */

import React, { createContext, useContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Dashboard_reducer from '../Reducer/Dashboard_reducer';
import {
  GET_DASHBOARD_BEGIN,
  GET_DASHBOARD_ERROR,
  GET_DASHBOARD_SUCCESS,
  TOGGLE_SELECT_BEGIN,
  TOGGLE_SELECT_ERROR,
  TOGGLE_SELECT_SUCCESS,
} from '../utils/actions';
import {
  ACCEPT_HEADER,
  get_dashboard_list_url,
  toggle_select_item_url,
} from '../utils/baseUrl';
import { useLoginContext } from './Login_context';
import { Toast } from 'react-native-alert-notification';

// ૧. કન્ટેક્સ્ટ બનાવ્યો
const DashboardContext = createContext();

// ૨. શરૂઆતની કિંમતો (Initial State)
const initialState = {
  dashboard_loading: false, // ડેટા લોડ થઈ રહ્યો છે કે નહીં
  dashboard_data: [],       // સર્વર પરથી આવેલું લિસ્ટ
  toggle_loading: false,    // આઇટમ સિલેક્ટ થતી હોય ત્યારનું લોડિંગ
};

// ૩. પ્રોવાઇડર કમ્પોનન્ટ
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Dashboard_reducer, initialState);
  const { setLogout } = useLoginContext();

  // -----------------------------------------------------------
  // ફંક્શન: ડેશબોર્ડનું લિસ્ટ મેળવવું (GET DASHBOARD LIST)
  // -----------------------------------------------------------
  const GetDashboardList = async (props) => {
    // પગલું ૧: ફોનમાંથી ટોકન મેળવો
    const token = await AsyncStorage.getItem('token');
    
    // પગલું ૨: લોડર શરૂ કરો
    dispatch({ type: GET_DASHBOARD_BEGIN });

    try {
      // પગલું ૩: ટોકન સાથે સર્વર પર સુરક્ષિત રિક્વેસ્ટ મોકલો
      const res = await axios.get(get_dashboard_list_url, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + token, // સ્ટાન્ડર્ડ Bearer ટોકન
        },
      });

      // જો ટોકન એક્સપાયર થઈ ગયું હોય તો યુઝરને લૉગઆઉટ કરો
      if (res.data.status === 'Token is Expired' || res.data.message === 'Unauthenticated.') {
        Toast.show({
          type: 'WARNING',
          title: 'Session Expired',
          textBody: 'Please login again.',
        });
        setLogout(props);
        return;
      }

      if (res.data.status === 'success' || res.data.status === true) {
        dispatch({ type: GET_DASHBOARD_SUCCESS, payload: res.data.data });
      } else {
        dispatch({ type: GET_DASHBOARD_ERROR });
      }
    } catch (err) {
      console.log('ડેશબોર્ડ લિસ્ટ API ભૂલ:', err);

      // ડેમો સેમ્પલ ડેટા (જેથી સર્વર બંધ હોય તો પણ એપમાં સુંદર UI દેખાય):
      const demoList = [
        {
          id: '1',
          title: 'Project Architecture Demo',
          category: 'Architecture',
          description: 'Learn App.js, Context API, Reducers, and Navigation flow.',
          status: 'Active',
          date: '2026-10-29',
          selected: true,
        },
        {
          id: '2',
          title: 'API Integration with Base URL',
          category: 'Networking',
          description: 'Centralized endpoints in baseUrl.js with Axios and bearer tokens.',
          status: 'Active',
          date: '2026-10-30',
          selected: false,
        },
        {
          id: '3',
          title: 'State Management with Reducers',
          category: 'State Management',
          description: 'Clean dispatching and immutable state transitions.',
          status: 'Completed',
          date: '2026-10-31',
          selected: true,
        },
      ];

      dispatch({ type: GET_DASHBOARD_SUCCESS, payload: demoList });
    }
  };

  // -----------------------------------------------------------
  // ફંક્શન: આઇટમ પસંદ / ફેવરિટ કરવી (TOGGLE SELECT ITEM)
  // -----------------------------------------------------------
  const ToggleSelectItem = async (itemId, props) => {
    const token = await AsyncStorage.getItem('token');
    dispatch({ type: TOGGLE_SELECT_BEGIN });

    try {
      const res = await axios.post(
        toggle_select_item_url,
        { item_id: itemId },
        {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer ' + token,
          },
        },
      );

      if (res.data.status === 'Token is Expired') {
        setLogout(props);
      } else {
        Toast.show({
          type: 'SUCCESS',
          title: 'Updated',
          textBody: 'Item status updated successfully.',
        });
        dispatch({ type: TOGGLE_SELECT_SUCCESS });
        GetDashboardList(props); // લિસ્ટ રિફ્રેશ કરો
      }
    } catch (err) {
      console.log('આઇટમ ટોગલ ભૂલ:', err);
      // ડેમો UI ઇન્સ્ટન્ટ અપડેટ
      dispatch({ type: TOGGLE_SELECT_SUCCESS });
      Toast.show({
        type: 'SUCCESS',
        title: 'Demo Updated',
        textBody: 'Item selection toggled.',
      });
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        GetDashboardList,
        ToggleSelectItem,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// ૪. કસ્ટમ હૂક: useDashboardContext
export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

/**
 * લૉગિન રિડ્યુસર (LOGIN REDUCER - સ્ટેટ મેનેજમેન્ટ લૉજિક)
 * -------------------------------------------------------------------------
 * REDUCER શું છે? (WHAT IS A REDUCER?)
 * Reducer એક પ્યોર ફંક્શન (Pure Function) છે જે:
 * ૧. હાલનો ડેટા (Current State) અને શું કરવું છે તે સંદેશો (Action) મેળવે છે.
 * ૨. એક્શનના 'type' પ્રમાણે સ્ટેટને અપડેટ કરે છે અને નવી સ્ટેટ પાછી આપે છે.
 * 
 * સુવર્ણ નિયમ (GOLDEN RULE):
 * સ્ટેટને ક્યારેય સીધી બદલવી નહીં. હંમેશા '...state' (spread operator) વડે
 * જૂની સ્ટેટની કોપી બનાવીને જ નવો ડેટા ઉમેરવો.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_BEGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  REGISTER_BEGIN,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
} from '../utils/actions';

const Login_reducer = (state, action) => {
  switch (action.type) {
    // ૧. જ્યારે યુઝર Login બટન દબાવે (API કૉલ શરૂ થાય)
    case LOGIN_BEGIN:
      return {
        ...state,
        login_loading: true, // સ્ક્રીન પર લોડર શરૂ થશે
      };

    // ૨. જ્યારે સર્વર પરથી સફળ રિસ્પોન્સ આવી જાય
    case LOGIN_SUCCESS:
      return {
        ...state,
        login_loading: false,          // લોડર બંધ થશે
        userinfoData: action.payload,  // સર્વર પરથી આવેલો યુઝર ડેટા સ્ટેટમાં સેવ થયો
      };

    // ૩. જ્યારે API માં કોઈ ભૂલ આવે (જેમ કે ખોટો પાસવર્ડ)
    case LOGIN_ERROR:
      return {
        ...state,
        login_loading: false, // લોડર બંધ થશે
      };

    // ૪. રજીસ્ટ્રેશન શરૂ થાય ત્યારે
    case REGISTER_BEGIN:
      return {
        ...state,
        register_loading: true,
      };

    // ૫. રજીસ્ટ્રેશન સફળતાપૂર્વક પૂરું થાય ત્યારે
    case REGISTER_SUCCESS:
      return {
        ...state,
        register_loading: false,
      };

    // ૬. રજીસ્ટ્રેશનમાં કોઈ ભૂલ આવે ત્યારે
    case REGISTER_ERROR:
      return {
        ...state,
        register_loading: false,
      };

    // ૭. યુઝર લૉગઆઉટ કરે ત્યારે
    case LOGOUT_USER:
      // ફોનના લોકલ સ્ટોરેજમાંથી લૉગિન સેશન સાફ કરો
      AsyncStorage.clear();
      return {
        ...state,
        token: '',
        userinfo: '',
        userinfoData: {},
      };

    // ડિફોલ્ટ: જો કોઈ એક્શન મેચ ન થાય તો હાલની સ્ટેટ જ પાછી આપો
    default:
      return state;
  }
};

export default Login_reducer;

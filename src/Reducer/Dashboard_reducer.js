/**
 * ડેશબોર્ડ રિડ્યુસર (DASHBOARD REDUCER)
 * -------------------------------------------------------------------------
 * આ રિડ્યુસર ડેશબોર્ડ લિસ્ટ અને આઇટમ સિલેક્શનની સ્ટેટ હેન્ડલ કરે છે.
 */

import {
  GET_DASHBOARD_BEGIN,
  GET_DASHBOARD_ERROR,
  GET_DASHBOARD_SUCCESS,
  TOGGLE_SELECT_BEGIN,
  TOGGLE_SELECT_ERROR,
  TOGGLE_SELECT_SUCCESS,
} from '../utils/actions';

const Dashboard_reducer = (state, action) => {
  switch (action.type) {
    // ડેશબોર્ડ ડેટા સર્વર પરથી લોડ થવાનો શરૂ થાય ત્યારે
    case GET_DASHBOARD_BEGIN:
      return {
        ...state,
        dashboard_loading: true, // લોડર ચાલુ થશે
      };

    // ડેશબોર્ડ ડેટા સર્વર પરથી મળી ગયો (action.payload માં લિસ્ટ છે)
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboard_loading: false,        // લોડર બંધ થશે
        dashboard_data: action.payload,  // નવું લિસ્ટ સ્ટેટમાં સેવ થશે
      };

    // ડેશબોર્ડ API માં કોઈ ભૂલ આવે ત્યારે
    case GET_DASHBOARD_ERROR:
      return {
        ...state,
        dashboard_loading: false, // લોડર બંધ થશે
      };

    // આઇટમ ફેવરિટ કે સિલેક્ટ કરવાનું શરૂ થાય ત્યારે
    case TOGGLE_SELECT_BEGIN:
      return {
        ...state,
        toggle_loading: true,
      };

    // સિલેક્શન સફળતાપૂર્વક અપડેટ થાય ત્યારે
    case TOGGLE_SELECT_SUCCESS:
      return {
        ...state,
        toggle_loading: false,
      };

    // સિલેક્શનમાં કોઈ ભૂલ આવે ત્યારે
    case TOGGLE_SELECT_ERROR:
      return {
        ...state,
        toggle_loading: false,
      };

    // ડિફોલ્ટ: હાલની સ્ટેટ પાછી આપો
    default:
      return state;
  }
};

export default Dashboard_reducer;

/**
 * એક્શન ટાઈપ્સ કોન્સ્ટન્ટ્સ (ACTION TYPES CONSTANTS)
 * -------------------------------------------------------------
 * આ ફાઈલમાં બધા "Action Types" ના નામો વ્યાખ્યાયિત કરેલા છે.
 * 
 * શા માટે એક્શન ટાઇપ્સને કોન્સ્ટન્ટ્સ તરીકે લખવામાં આવે છે?
 * -> સ્પેલિંગની ભૂલ ન થાય તે માટે. જો Context માં એક સ્પેલિંગ હોય અને Reducer માં બીજો,
 *    તો એપ્લિકેશન અટકી જાય છે. અહીં કોન્સ્ટન્ટ્સ રાખવાથી IDE આપમેળે સજેશન આપે છે.
 * 
 * ૩-સ્ટેપ લાઇફસાયકલ પેટર્ન:
 * ૧. _BEGIN   -> API રિક્વેસ્ટ શરૂ થઈ (લોડર શરૂ થશે, loading = true)
 * ૨. _SUCCESS -> API નો રિસ્પોન્સ આવી ગયો (લોડર બંધ થશે, ડેટા સેવ થશે)
 * ૩. _ERROR   -> API માં કોઈ ભૂલ આવી (લોડર બંધ થશે, એરર મેસેજ દેખાશે)
 */

// ----------------- લૉગિન અને ઓથેન્ટિકેશન એક્શન્સ -----------------
export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const REGISTER_BEGIN = 'REGISTER_BEGIN';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';

export const LOGOUT_USER = 'LOGOUT_USER';

// ----------------- ડેશબોર્ડ અને ડેટા એક્શન્સ -----------------
export const GET_DASHBOARD_BEGIN = 'GET_DASHBOARD_BEGIN';
export const GET_DASHBOARD_SUCCESS = 'GET_DASHBOARD_SUCCESS';
export const GET_DASHBOARD_ERROR = 'GET_DASHBOARD_ERROR';

export const TOGGLE_SELECT_BEGIN = 'TOGGLE_SELECT_BEGIN';
export const TOGGLE_SELECT_SUCCESS = 'TOGGLE_SELECT_SUCCESS';
export const TOGGLE_SELECT_ERROR = 'TOGGLE_SELECT_ERROR';

// ----------------- પ્રોફાઇલ એક્શન્સ -----------------
export const GET_PROFILE_BEGIN = 'GET_PROFILE_BEGIN';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_ERROR = 'GET_PROFILE_ERROR';

export const UPDATE_PROFILE_BEGIN = 'UPDATE_PROFILE_BEGIN';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'UPDATE_PROFILE_ERROR';

// ----------------- પ્રોડક્ટ એક્શન્સ (PRODUCT ACTIONS) -----------------
export const PRODUCT_LIST_BEGIN = 'PRODUCT_LIST_BEGIN';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_ERROR = 'PRODUCT_LIST_ERROR';

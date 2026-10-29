/**
 * પ્રોડક્ટ રિડ્યુસર (PRODUCT REDUCER - એકદમ સરળ અને સ્ટાન્ડર્ડ માળખું)
 * -------------------------------------------------------------------------
 * આ રિડ્યુસર પ્રોડક્ટ્સ લિસ્ટ અને લોડિંગ સ્ટેટ મેનેજ કરે છે.
 * 
 * એક્શન ટાઈપ્સ:
 * ૧. PRODUCT_LIST_BEGIN   -> API કૉલ શરૂ થયો (product_list_loading: true)
 * ૨. PRODUCT_LIST_SUCCESS -> ડેટા આવી ગયો (product_list: action.payload, loading: false)
 * ૩. PRODUCT_LIST_ERROR   -> એરર આવી (loading: false)
 */

import {
  PRODUCT_LIST_BEGIN,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_ERROR,
} from '../utils/actions';

const ProductReducer = (state, action) => {
  switch (action.type) {
    // ૧. પ્રોડક્ટ્સ ડેટા લોડ થવાનું શરૂ થાય ત્યારે
    case PRODUCT_LIST_BEGIN:
      return {
        ...state,
        product_list_loading: true, // લોડર શરૂ થશે
      };

    // ૨. પ્રોડક્ટ્સ લિસ્ટ API માંથી સફળતાપૂર્વક મળી જાય ત્યારે
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        product_list: action.payload, // સર્વરમાંથી આવેલો ડેટા લિસ્ટમાં સેવ થયો
        product_list_loading: false,  // લોડર બંધ થશે
      };

    // ૩. API માં કોઈ ભૂલ આવે ત્યારે
    case PRODUCT_LIST_ERROR:
      return {
        ...state,
        product_list_loading: false, // લોડર બંધ થશે
      };

    // ડિફોલ્ટ: હાલની સ્ટેટ પાછી આપો
    default:
      return { ...state };
  }
};

export default ProductReducer;


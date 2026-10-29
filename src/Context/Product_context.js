/**
 * પ્રોડક્ટ કન્ટેક્સ્ટ (PRODUCT CONTEXT - સૌથી સરળ અને મુખ્ય માળખું)
 * -------------------------------------------------------------------------
 * આ કન્ટેક્સ્ટ Context API અને useReducer નો સૌથી સરળ અને સ્ટાન્ડર્ડ ઉપયોગ દર્શાવે છે.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. createContext() વડે નવો કન્ટેક્સ્ટ બનાવ્યો.
 * ૨. initialState માં શરૂઆતનો ખાલી ડેટા રાખ્યો (product_list: [], loading: false).
 * ૩. useReducer(ProductReducer, initialState) વડે રિડ્યુસર જોડ્યું.
 * ૪. getProducts() ફંક્શનમાં Axios વડે API કૉલ કર્યો અને ડેટા dispatch કર્યો.
 * ૫. useEffect માં getProducts() કૉલ કર્યો જેથી કમ્પોનન્ટ ખૂલતાં જ ડેટા ફેચ થાય.
 * ૬. useProductContext() કસ્ટમ હૂક બનાવ્યો જેથી કોઈ પણ સ્ક્રીન પરથી ડેટા સીધો જ મળી જાય.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import {
  PRODUCT_LIST_BEGIN,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_ERROR,
} from '../utils/actions';
import ProductReducer from '../Reducer/Product_reducer';
import { BASE_URL, get_product_url } from '../utils/baseUrl';

// ૧. કન્ટેક્સ્ટ બનાવ્યો
const ProductContext = createContext();

// ૨. શરૂઆતની કિંમતો (Initial State)
const initialState = {
  product_list: [],
  product_list_loading: false,
};

// ૩. પ્રોવાઇડર કમ્પોનન્ટ
export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(ProductReducer, initialState);

  // પ્રોડક્ટ્સ લિસ્ટ મેળવવાનું મુખ્ય ફંક્શન
  const getProducts = async () => {
    // પગલું A: લોડર ચાલુ કરો
    dispatch({ type: PRODUCT_LIST_BEGIN });

    axios
      .get(get_product_url || BASE_URL)
      .then(async (product) => {
        if (product.data && product.data.data && product.data.data.length > 0) {
          // જો ડેટા મળે તો રિડ્યુસરમાં સેવ કરો
          dispatch({ type: PRODUCT_LIST_SUCCESS, payload: product.data.data });
        } else {
          dispatch({ type: PRODUCT_LIST_ERROR });
        }
      })
      .catch((error) => {
        console.log('પ્રોડક્ટ્સ API એરર અથવા ડેમો મોડ:', error?.message);

        // ડેમો સેમ્પલ પ્રોડક્ટ્સ (જેથી સર્વર બંધ હોય તો પણ ટેસ્ટિંગ કરી શકાય):
        const sampleProducts = [
          { id: 1, name: 'React Native Master Course', price: '₹999', category: 'Education' },
          { id: 2, name: 'Context API & Reducer Blueprint', price: '₹499', category: 'Architecture' },
          { id: 3, name: 'Push Notification Kit', price: '₹799', category: 'Tools' },
        ];

        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: sampleProducts });
      });
  };

  // કમ્પોનન્ટ લોડ થતાં જ પ્રોડક્ટ્સ મેળવો
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        ...state,
        getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// ૪. કસ્ટમ હૂક: useProductContext
export const useProductContext = () => {
  return useContext(ProductContext);
};


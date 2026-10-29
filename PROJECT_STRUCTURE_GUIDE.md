# 📱 DemoApp - Project Architecture & Structure Guide
**તમારા Office Project (JainamApp) જેવું જ સેમ-ટુ-સેમ આર્કિટેક્ચર અને સ્ટ્રક્ચર (ગુજરાતીમાં સંપૂર્ણ સમજૂતી)**

---

## 📌 ૧. આ પ્રોજેક્ટનું Structure (Folder & File Tree)

```text
DemoApp/
│
├── App.js                     <-- Root Component (બધા Contexts, Providers, NetInfo & Modals)
├── app.json                   <-- App Name & Display Name Configuration
├── index.js                   <-- Application Entry Point (AppRegistry)
├── package.json               <-- Project Dependencies & NPM Scripts (NO node_modules)
├── babel.config.js            <-- Babel Compiler Config
├── metro.config.js            <-- Metro Bundler Config
├── .gitignore                 <-- Git Ignore rules
│
├── android/                   <-- Android Native Config & Gradle Wrapper
├── ios/                       <-- iOS Native Xcode Project
│
└── src/                       <-- Main Source Code Directory
    │
    ├── Navigation.js          <-- Native Stack Navigation (Screen Routing)
    │
    ├── assets/                <-- Static Files (Images, Icons)
    │   └── images/
    │       └── nonetwork.png  <-- No Internet Dialog Image
    │
    ├── components/            <-- Reusable UI Components
    │   ├── Loader.js          <-- Animated Loading Indicator
    │   └── MainHedar.js       <-- Top Header Bar (Title, Back Button)
    │
    ├── Context/               <-- 🌟 GLOBAL STATE & API CALLS (Context API)
    │   ├── Login_context.js   <-- Login, Register, Logout & Token Management
    │   ├── Dashboard_context.js<-- Dashboard List, Toggle Items, Bearer Token Auth
    │   └── Product_context.js <-- 📦 Product State & getProducts() API Flow
    │
    ├── Reducer/               <-- 🌟 STATE MUTATION FUNCTIONS (Reducers)
    │   ├── Login_reducer.js   <-- Auth State (login_loading, userinfoData, etc.)
    │   ├── Dashboard_reducer.js<-- Dashboard State (dashboard_loading, items list)
    │   └── Product_reducer.js <-- 📦 Product State (BEGIN, SUCCESS, ERROR)
    │
    ├── screen/                <-- Application Screens
    │   ├── SplashScreen.js    <-- First screen, checks AsyncStorage login session
    │   ├── LoginScreen.js     <-- Sign In screen with form validation & Context hook
    │   ├── SignUpScreen.js    <-- Sign Up / Registration screen
    │   ├── BottomTab.js       <-- Bottom Navigation Tabs Container
    │   ├── DetailsScreen.js   <-- Item Details screen (Route params demo)
    │   ├── NotificationScreen.js <-- 🔔 NotifyLab: Practice & Test Notifications
    │   │
    │   └── Bottom/            <-- Tab Screens
    │       ├── HomeScreen.js  <-- Dashboard data list & pull-to-refresh
    │       └── ProfileScreen.js<-- User profile details & Logout button
    │
    └── utils/                 <-- Utilities & Constants
        ├── baseUrl.js         <-- 🌟 All API URLs & Endpoints
        ├── actions.js         <-- 🌟 Action Type Constants (BEGIN, SUCCESS, ERROR)
        ├── notificationService.js <-- 🔔 Universal Firebase + Notifee Notification Service
        ├── colors.js          <-- Theme Color Palette
        └── metrics.js         <-- Screen Dimensions & Spacing
```

---

## 🔄 ૨. Application નો Data Flow (આખો Flow કેવી રીતે કામ કરે છે?)

```text
+---------------+      1. User Taps Login Button     +-----------------------+
|  LoginScreen  | ---------------------------------> |   Login_context.js    |
| (UI Screen)   |                                    | (useLoginContext Hook)|
+---------------+                                    +-----------------------+
        ^                                                        |
        |                                                        | 2. API Call (Axios)
        |                                                        v
        |                                            +-----------------------+
        |                                            |    utils/baseUrl.js   |
        |                                            |     (login_url)       |
        |                                            +-----------------------+
        |                                                        |
        |                                                        | 3. dispatch(LOGIN_BEGIN /
        |                                                        |    LOGIN_SUCCESS / ERROR)
        |                                                        v
        |                                            +-----------------------+
        | 5. New State Re-renders UI                 |   Login_reducer.js    |
        +------------------------------------------- | (Updates State Copy)  |
                                                     +-----------------------+
                                                                 |
                                                                 | 4. Saves Token
                                                                 v
                                                     +-----------------------+
                                                     |     AsyncStorage      |
                                                     | (Device Local Storage)|
                                                     +-----------------------+
```

---

## 🔑 ૩. મુખ્ય ફાઇલોની સરળ સમજૂતી (Main Files Explained)

### 🌟 A. `App.js` (The Parent Component)
- આ આખી એપ્લિકેશનનો પાયો (Root) છે.
- તેમાં બધા જરૂરી Providers એકબીજાની અંદર wrap કરેલા છે:
  1. `<PaperProvider>`: Material UI theme પૂરી પાડે છે.
  2. `<AlertNotificationRoot>`: આખી એપ્લિકેશનમાં ગમે ત્યાંથી Toast કે Alert Notification બતાવવા માટે.
  3. `<SafeAreaView>`: ફોનની નોચ (Notch) અને નેવિગેશન બારથી સ્ક્રીનને બચાવવા માટે.
  4. `<LoginProvider>` & `<DashboardProvider>`: Context Providers જેથી Navigation ની અંદરની કોઈ પણ સ્ક્રીન સીધો ડેટા અને API ફંક્શન્સ વાપરી શકે.
  5. `<Navigation />`: Stack Screens (Splash -> Login -> Home).
- **NetInfo:** જો યુઝરનું ઇન્ટરનેટ બંધ થાય, તો તરત `No Internet` મોડલ સ્ક્રીન પર દેખાય છે.
- **Update Modal:** સર્વર પર નવું વર્ઝન આવ્યું હોય તો યુઝરને અપડેટ કરવાનું પોપઅપ બતાવે છે.

---

### 🌟 B. `src/utils/baseUrl.js` (API Links)
- જો તમારે API સર્વર બદલવો હોય કે લાઈવ કરવો હોય, તો ફક્ત આ એક જ ફાઇલમાં `BASE_URL` બદલવાનો રહે છે.
- **ઉદાહરણ:**
  ```javascript
  export const BASE_URL = 'https://erp.applified.co.in/demo/public/api/v1/';
  export const ACCEPT_HEADER = 'application/json';

  export const login_url = BASE_URL + 'login';
  export const register_url = BASE_URL + 'register';
  export const get_dashboard_list_url = BASE_URL + 'get-dashboard-data';
  ```

---

### 🌟 C. `src/utils/actions.js` (Action Types)
- Reducer અને Context વચ્ચે ડેટા પાસ કરવા માટે `Action Types` વપરાય છે.
- દરેક API કોલ માટે **૩ સ્ટેપ** ની પેટર્ન વપરાય છે:
  1. `_BEGIN`: API કોલ શરૂ થયો -> Loader ચાલુ થશે (`loading: true`).
  2. `_SUCCESS`: સર્વર પરથી રિસ્પોન્સ આવી ગયો -> Loader બંધ થશે અને ડેટા સેવ થશે.
  3. `_ERROR`: API માં કંઈક ભૂલ આવી -> Loader બંધ થશે અને એરર મેસેજ દેખાશે.

---

### 🌟 D. `src/Reducer/` (State Managers - Rudiuses)
- **Reducer શું છે?**
  - Reducer એક ફંક્શન છે જે જૂની State અને આવેલી Action જોઈને નવી State બનાવીને આપે છે.
  - **નિયમ:** State ને સીધી બદલાતી નથી (Immutable). હંમેશા `...state` (spread operator) વડે કોપી બનાવીને જ ફેરફાર થાય છે.
- **ઉદાહરણ (જેમ કે તમારો Product_reducer.js):**
  ```javascript
  const ProductReducer = (state, action) => {
    switch (action.type) {
      case PRODUCT_LIST_BEGIN:
        return { ...state, product_list_loading: true };
      case PRODUCT_LIST_SUCCESS:
        return { ...state, product_list: action.payload, product_list_loading: false };
      case PRODUCT_LIST_ERROR:
        return { ...state, product_list_loading: false };
      default:
        return { ...state };
    }
  };
  ```

---

### 🌟 E. `src/Context/` (Global Stores & API Callers)
- **Context API શું કરે છે?**
  - સામાન્ય રીતે React માં એક સ્ક્રીનમાંથી બીજી સ્ક્રીનમાં props મોકલવા પડે છે. Context API થી તમે આખી એપમાં ગમે ત્યાં ડેટા પહોંચાડી શકો છો.
- **મુખ્ય ભાગો (જેમ કે તમારો Product_context.js):**
  1. `createContext()`: કન્ટેક્ટ્સ બનાવે છે.
  2. `initialState`: શરૂઆતનો ડેટા (`product_list: []`, `product_list_loading: false`).
  3. `useReducer(ProductReducer, initialState)`: Reducer ને જોડે છે.
  4. `getProducts()`: Axios વડે API કોલ કરી `dispatch({ type: PRODUCT_LIST_SUCCESS, payload: ... })` કરે છે.
  5. `useProductContext()`: Custom Hook, જેથી સ્ક્રીન પર ફક્ત આટલું જ લખવું પડે:
     ```javascript
     const { product_list, product_list_loading } = useProductContext();
     ```

---

### 🌟 F. `src/Navigation.js` (Routing & Screens)
- `createNativeStackNavigator` નો ઉપયોગ કરીને સ્ક્રીનનું નેવિગેશન સેટ કર્યું છે:
  - `SplashScreen`: પહેલી સ્ક્રીન, લોગિન ચેક કરે છે.
  - `LoginScreen`: લોગિન પેજ.
  - `SignUpScreen`: રજીસ્ટ્રેશન પેજ.
  - `BottomTab`: હોમ અને પ્રોફાઇલ ટેબ્સ.
  - `DetailsScreen`: આઇટમ ડિટેઇલ્સ પેજ.
  - `NotificationScreen`: Firebase + Notifee ટેસ્ટિંગ લેબ (Instant, Scheduled & FCM Token).

---

### 🔔 G. `src/utils/notificationService.js` (Universal Notification Format)
**કોઈ પણ React Native App માં Notification વાપરવા માટેનો આ Standard Format છે:**

૧. **Channel બનાવવું:**
   ```javascript
   await notifee.createChannel({
     id: 'default',
     name: 'Default Notifications',
     importance: 4,
   });
   ```

૨. **Permissions (Android 13+ અને iOS):**
   - Android 13 (API 33+) માટે `PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS` રિક્વેસ્ટ કરે છે.
   - iOS માટે `requestPermission(messagingInstance)` ચેક કરે છે.

૩. **FCM Token મેળવવું:**
   - `getToken(messagingInstance)` થી ટોકન મેળવીને `AsyncStorage` માં `fcm_token` તરીકે સેવ થાય છે, જેથી Login કે Register વખતે બેકએન્ડમાં મોકલી શકાય.

૪. **Foreground & Background Notifications:**
   - App ચાલુ હોય ત્યારે `onMessage` (Foreground) વડે Notifee પોપઅપ બતાવે છે.
   - App બંધ હોય ત્યારે `index.js` માં `setBackgroundMessageHandler` વડે નોટિફિકેશન હેન્ડલ થાય છે.

૫. **કોઈ પણ નવા પ્રોજેક્ટમાં કેવી રીતે વાપરવું?**
   - ફક્ત `src/utils/notificationService.js` ફાઇલ તમારા નવા પ્રોજેક્ટમાં મૂકો.
   - તમારા નવા પ્રોજેક્ટના `App.js` માં `setupNotifications()` કૉલ કરો.
   - `index.js` માં Background handler રજીસ્ટર કરો. બસ, નોટિફિકેશન તૈયાર!

---

## 🚀 ૪. ભવિષ્યમાં આ પ્રોજેક્ટ Run કરવા માટેના સ્ટેપ્સ

જ્યારે પણ તમારે આ પ્રોજેક્ટ ચલાવવો હોય:

1. **Terminal ખોલો અને પ્રોજેક્ટ ફોલ્ડરમાં જાઓ:**
   ```bash
   cd d:\Applified\DemoApp
   ```

2. **Dependencies Install કરો (જ્યારે જરૂર હોય ત્યારે જ):**
   ```bash
   npm install
   # અથવા
   yarn install
   ```

3. **Android માટે App Run કરો:**
   ```bash
   npx react-native run-android
   ```

4. **Metro Bundler Start કરો:**
   ```bash
   npm start
   ```

---
*નોંધ: તમારી સૂચના મુજબ આ પ્રોજેક્ટમાં `node_modules` ફોલ્ડર રાખેલું નથી, જેથી પ્રોજેક્ટ હળવો રહે અને તમારા ઓફિસ પ્રોજેક્ટ જેવો જ ક્લીન રહે.*


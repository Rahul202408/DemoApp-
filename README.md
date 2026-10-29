# 📱 DemoApp - React Native Enterprise Architecture Template

[![React Native](https://img.shields.io/badge/React_Native-0.83.1-blue.svg)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://react.dev/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-7.x-green.svg)](https://reactnavigation.org/)
[![Firebase Messaging](https://img.shields.io/badge/Firebase-Messaging-orange.svg)](https://rnfirebase.io/)
[![Notifee](https://img.shields.io/badge/Notifee-Notifications-purple.svg)](https://notifee.app/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey.svg)](#)

A clean, production-ready React Native application structured according to industry best practices. It implements the **Context API + useReducer** pattern, centralized API networking with Axios, Firebase Cloud Messaging (FCM) & Notifee notifications, offline network monitoring, and clean UI components with Material Design.

> 📖 **ગુજરાતી ગાઈડ (Gujarati Documentation):**  
> જો તમારે આ પ્રોજેક્ટનું આર્કિટેક્ચર અને કોડિંગ સ્ટ્રક્ચર સરળ ગુજરાતીમાં સમજવું હોય, તો [PROJECT_STRUCTURE_GUIDE.md](./PROJECT_STRUCTURE_GUIDE.md) જુઓ.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ Architectural Overview](#️-architectural-overview)
- [📁 Folder Structure](#-folder-structure)
- [🔄 State Management Flow](#-state-management-flow)
- [🔔 Push & Local Notifications](#-push--local-notifications)
- [🌐 Network & Offline Handling](#-network--offline-handling)
- [📱 Screens & Navigation](#-screens--navigation)
- [🚀 Getting Started](#-getting-started)
- [📦 Key Dependencies](#-key-dependencies)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

- **Context API + Reducer State Management:** Clean, Redux-like predictability without bloated boilerplate. Custom hooks (`useLoginContext`, `useDashboardContext`, `useProductContext`) for seamless consumption.
- **3-Phase Action Lifecycle:** Standardized `_BEGIN`, `_SUCCESS`, and `_ERROR` actions across all asynchronous flows.
- **Centralized API Architecture:** Single configuration in `src/utils/baseUrl.js` with Axios interceptors and bearer token authorization.
- **Universal Notification Engine:** Fully configured Firebase Cloud Messaging (FCM) + Notifee supporting Foreground, Background, and Killed-state notifications, plus scheduled alerts.
- **Persistent Storage:** Secure session, user profile, and FCM token management via `@react-native-async-storage/async-storage`.
- **Offline Network Awareness:** Real-time `@react-native-community/netinfo` listener in `App.js` with automated "No Internet" UI fallback.
- **Modern UI & Design System:** Powered by `react-native-paper` (Material Design 3), `react-native-vector-icons`, and responsive `metrics.js` & `colors.js`.
- **In-App Toast & Dialog Alerts:** Clean popup alerts via `react-native-alert-notification`.

---

## 🏗️ Architectural Overview

```
┌─────────────────────────────────────────────────────────────┐
│                           App.js                            │
│  (PaperProvider, AlertNotificationRoot, NetInfo, Contexts)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
     ┌──────────────────────┐      ┌──────────────────────┐
     │  Login_context.js    │      │ Dashboard_context.js │
     │  Product_context.js  │      │                      │
     └──────────┬───────────┘      └──────────┬───────────┘
                │                             │
                ▼                             ▼
     ┌──────────────────────┐      ┌──────────────────────┐
     │   Reducers (State)   │      │   API (baseUrl.js)   │
     └──────────┬───────────┘      └──────────┬───────────┘
                │                             │
                └──────────────┬──────────────┘
                               ▼
               ┌──────────────────────────────┐
               │    Screens (UI Components)   │
               │   Splash -> Login -> Home    │
               └──────────────────────────────┘
```

---

## 📁 Folder Structure

```text
DemoApp/
├── App.js                     # Root component wrapping all Providers, Modals & NetInfo
├── app.json                   # App identity and naming configuration
├── index.js                   # Entry point; registers background notification handler
├── package.json               # Dependencies and build scripts
├── babel.config.js            # Babel preset configuration
├── metro.config.js            # Metro bundler configuration
├── .gitignore                 # Standard React Native git ignore rules
│
├── android/                   # Native Android configuration, Gradle files & AndroidManifest
├── ios/                       # Native iOS Xcode workspace & Podfiles
│
└── src/                       # Main application source code
    ├── Navigation.js          # Stack & Tab Navigation definitions
    │
    ├── assets/                # Static assets (images, logos, icons)
    │   └── images/
    │       └── nonetwork.png  # Offline indicator asset
    │
    ├── components/            # Reusable UI components
    │   ├── Loader.js          # Reusable activity indicator modal
    │   └── MainHedar.js       # Reusable top app bar with navigation back button
    │
    ├── Context/               # Context API State Providers & Business Logic
    │   ├── Login_context.js   # Authentication, Registration & Session restore
    │   ├── Dashboard_context.js # Dashboard list fetching & Item toggle
    │   └── Product_context.js # Product catalog state & API methods
    │
    ├── Reducer/               # Reducer functions mutating state immutably
    │   ├── Login_reducer.js   # Auth loading, user data, error states
    │   ├── Dashboard_reducer.js # Dashboard lists, loaders, selections
    │   └── Product_reducer.js # Product lists and fetch lifecycle
    │
    ├── screen/                # Application views and flows
    │   ├── SplashScreen.js    # Initial screen checking cached credentials
    │   ├── LoginScreen.js     # User login screen with validation
    │   ├── SignUpScreen.js    # User registration screen
    │   ├── BottomTab.js       # Bottom tab container
    │   ├── DetailsScreen.js   # Detail view receiving route parameters
    │   ├── NotificationScreen.js # NotifyLab testing screen (Instant, Scheduled, FCM)
    │   └── Bottom/
    │       ├── HomeScreen.js  # Main dashboard feed with Pull-to-Refresh
    │       └── ProfileScreen.js # User profile details and Logout trigger
    │
    └── utils/                 # Helpers, configurations, constants
        ├── baseUrl.js         # API endpoints & centralized URLs
        ├── actions.js         # Standard action type constants
        ├── notificationService.js # Firebase + Notifee helper methods
        ├── colors.js          # Universal color constants
        └── metrics.js         # Screen dimensions and scaling factors
```

---

## 🔄 State Management Flow

The application utilizes React's native `useReducer` and `createContext` to provide clean, isolated state management:

1. **Trigger:** User interacts with a screen (e.g., clicks "Login").
2. **Context Method:** The screen calls the context method (e.g., `loginUser(payload)`).
3. **Dispatch Begin:** Context dispatches `LOGIN_BEGIN` -> Reducer sets `login_loading = true` -> UI renders `Loader`.
4. **Axios Call:** API request is made using endpoints defined in `src/utils/baseUrl.js`.
5. **Dispatch Success/Error:**
   - On success: Context saves token/user info in `AsyncStorage`, dispatches `LOGIN_SUCCESS` with payload.
   - On failure: Context triggers alert dialog via `react-native-alert-notification`, dispatches `LOGIN_ERROR`.
6. **UI Re-render:** Screens consuming the context automatically receive the updated state.

---

## 🔔 Push & Local Notifications

The project comes with a production-grade notification setup in `src/utils/notificationService.js`:

- **Android Notification Channels:** Automatic creation of high-importance channels (`default`).
- **Permission Handlers:** Full compliance with Android 13+ runtime permissions (`POST_NOTIFICATIONS`) and iOS APNS authorization.
- **FCM Token Handling:** Auto-retrieves device FCM token and persists it to `AsyncStorage` (`fcm_token`) for backend sync.
- **Foreground Display:** Receives messages via `messaging().onMessage` and displays high-priority heads-up notifications using Notifee.
- **Background & Headless Execution:** Handled at root level in `index.js` via `setBackgroundMessageHandler`.
- **Interactive Test Lab:** Test local instant notifications, time-based scheduled triggers, and copy FCM tokens directly from `NotificationScreen.js`.

---

## 🌐 Network & Offline Handling

In `App.js`, `@react-native-community/netinfo` continuously monitors network connectivity:
- If network connection drops (`isConnected === false`), an interactive full-screen "No Internet" modal appears automatically.
- Once connectivity is restored, the modal auto-dismisses and app operations resume gracefully.

---

## 📱 Screens & Navigation

Navigation is configured in `src/Navigation.js` with **React Navigation 7.x**:

| Screen | Route Name | Description |
|---|---|---|
| **Splash** | `SplashScreen` | Checks local authentication session in AsyncStorage |
| **Login** | `LoginScreen` | Credential entry, validation, and session creation |
| **Sign Up** | `SignUpScreen` | Account creation flow |
| **Dashboard** | `BottomTab` | Main navigation hub hosting Bottom Tabs |
| **Home Tab** | `HomeScreen` | Feed list, pull-to-refresh, navigation to Details |
| **Profile Tab** | `ProfileScreen` | User profile overview and logout confirmation |
| **Details** | `DetailsScreen` | Detailed view for selected items with route params |
| **Notify Lab** | `NotificationScreen` | Playground for testing Firebase & Notifee alerts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 20.x`
- Java Development Kit (JDK 17 recommended)
- Android Studio & Android SDK (API 34/35)
- Xcode (for macOS / iOS development)
- CocoaPods (`sudo gem install cocoapods` for iOS)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rahul202408/DemoApp-.git
   cd DemoApp-
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS Pods (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro Bundler:**
   ```bash
   npm start
   ```

5. **Run on Android:**
   ```bash
   npm run android
   # or
   npx react-native run-android
   ```

6. **Run on iOS:**
   ```bash
   npm run ios
   # or
   npx react-native run-ios
   ```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react-native` (0.83.1) | Core mobile framework |
| `@react-navigation/*` (v7) | Native stack and bottom tabs navigation |
| `@react-native-firebase/app` & `messaging` | Cloud messaging and push notifications |
| `@notifee/react-native` | Advanced local and scheduled notifications |
| `@react-native-async-storage/async-storage` | Key-value persistent local storage |
| `axios` | HTTP client for RESTful API requests |
| `react-native-paper` | Material Design UI component library |
| `react-native-alert-notification` | Customizable dialogs and toast notifications |
| `@react-native-community/netinfo` | Live network connectivity detection |
| `react-native-vector-icons` | Vector icons (Material, FontAwesome, Ionicons) |
| `moment` & `datetimepicker` | Date formatting and picker modals |

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request or issue on [GitHub](https://github.com/Rahul202408/DemoApp-).

**Developer:** Rahul Tejura ([@Rahul202408](https://github.com/Rahul202408))

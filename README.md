# F5 Expenses Tracker
CPRG-303-C Mobile Application Development  (Spring 2024)
Phase 4: Building the App


## Requirements

- Node 18
- Yarn
- eas-cli
- Expo Account

## Infrastructure

- React Native 
- Expo
- Firebase(Authentication, Firestore, Cloud Storage)

## Libraries

- expo
- firebase
- axios
- react-navigation
- expo-constants
- expo-image-manipulator
- expo-image-picker
- expo-notifications
- react-native-elements
- react-native-paper
- react-native-svg
- react-native-vector-icons
- [jotai](https://jotai.org)
- moment

## Features

- Registration with E-mail & Password
- Login with E-mail and Password
- Handling persisted login credentials
- Saving expenses transactions and categories to Firestore Database
- Reading expenses transactions and categories from Firestore Database
- Monthly Expense analysis: Percentage by categories
- State management by Jotai

![image](https://github.com/user-attachments/assets/2da3812f-617e-41e7-a63f-6f63d236e3d0)
![image](https://github.com/user-attachments/assets/6b880ca6-3211-4ede-a757-15ae6a0f1d49)
![image](https://github.com/user-attachments/assets/18d79c2f-fa20-4338-9775-0b8117a7b28b)
![image](https://github.com/user-attachments/assets/7ea71048-e991-45e8-829b-c0000e7fbf30)
![image](https://github.com/user-attachments/assets/4a82ffd4-4519-4482-9bdd-98c9805a0cad)
![image](https://github.com/user-attachments/assets/9089493b-74f6-4240-872f-d3a506f5c619)


## How to run in expo emulator


### 1. Install


```
git clone https://github.com/sunggeorge/CPRG-303-Project [project folder name]
cd [project folder name]
yarn install
```

### 2. Install Copy the API Key

copy `config.js` submitted into **src** folder


### 3. Run Your App

```
yarn start
```

### 4. Launch emulator 

press **a** for Android Emulator
press **r** for reloading app

### 5. Log in testing account 

**account name**: test@test.com
**password**: testtest

![image](https://github.com/user-attachments/assets/94cfa2b3-1a3c-4d77-8f0b-f02becb66efb)


## Licence

This project is available under the MIT license. And it's built based on the expo-firebase template: [https://github.com/kiyohken2000/ReactNative-Expo-Firebase-Boilerplate-v2](https://github.com/kiyohken2000/ReactNative-Expo-Firebase-Boilerplate-v2)

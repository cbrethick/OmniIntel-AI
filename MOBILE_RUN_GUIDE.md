# 📱 How to Run OmniBot AI on Expo Go

This guide explains how to run the mobile application using the **Expo Go** app for development and testing.

## 📋 Prerequisites
1. **Node.js 20+**: This project requires Node 20 (LTS). If you have `nvm` installed, run:
   ```bash
   nvm use 20
   ```
2. **Expo Go App**: Download the "Expo Go" app from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779).

---

## 🚀 Running the App

### 1. Set the API URL
Open `mobile/.env` and set the `EXPO_PUBLIC_API_URL` to point to your backend.
- **For Emulator**: Use `http://10.0.2.2:8000`
- **For Physical Device**: Use your computer's local IP address (e.g., `http://192.168.1.XX:8000`).

### 2. Install Dependencies
If you haven't already, install the packages:
```bash
cd mobile
npm install --legacy-peer-deps
```

### 3. Start the Expo Server
Run the following command to start the development server with a clean cache:
```bash
npx expo start -c
```

### 4. Open on your Phone
1. Ensure your phone and computer are on the **same Wi-Fi network**.
2. Scan the **QR Code** that appears in your terminal using:
   - **Android**: The QR scanner inside the Expo Go app.
   - **iOS**: Your phone's default Camera app.

---

## 🛠️ Troubleshooting

- **Node Version Error**: If you see `configs.toReversed is not a function`, it means you are using an old Node version. Ensure you run `nvm use 20`.
- **Connection Timeout**: Ensure your computer's firewall allows port `8081` and that both devices are on the same Wi-Fi.
- **SDK Mismatch**: This project is aligned with **Expo SDK 54**. Ensure your Expo Go app is up to date.

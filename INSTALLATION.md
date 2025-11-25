# Complete Installation Guide
# Gas Piping Inspection Report App

## Quick Start Guide

This guide will walk you through installing and running your Gas Piping Inspection app on both Android and iOS devices.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running on Your Phone](#running-on-your-phone)
4. [Building Standalone Apps](#building-standalone-apps)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need:

1. **A Computer** (Windows, Mac, or Linux)
2. **Node.js** installed
3. **A Smartphone** (Android or iOS)
4. **Internet Connection** (for initial setup)

### Step 1: Install Node.js

#### For Windows:
1. Go to https://nodejs.org/
2. Download the "LTS" version (recommended)
3. Run the installer
4. Follow the setup wizard (use default settings)
5. Open Command Prompt and verify: `node --version`

#### For Mac:
1. Go to https://nodejs.org/
2. Download the "LTS" version
3. Open the .pkg file and follow instructions
4. Open Terminal and verify: `node --version`

#### For Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
node --version
```

---

## Installation Steps

### Step 1: Open Terminal/Command Prompt

**Windows:** Press `Win + R`, type `cmd`, press Enter

**Mac:** Press `Cmd + Space`, type "Terminal", press Enter

**Linux:** Press `Ctrl + Alt + T`

### Step 2: Navigate to the App Folder

```bash
# Change to your app directory
cd GasInspectionApp

# Verify you're in the right place - you should see App.js, package.json, etc.
# Windows: dir
# Mac/Linux: ls
```

### Step 3: Install Expo CLI Globally

```bash
npm install -g expo-cli
```

This might take a few minutes. Wait for it to complete.

### Step 4: Install App Dependencies

```bash
npm install
```

This will install all required packages. It may take 3-5 minutes.

### Step 5: Start the Development Server

```bash
npm start
```

Or:

```bash
expo start
```

**You should see:**
- A QR code in your terminal
- A message saying "Metro waiting on..."
- A browser window might open automatically

**Keep this terminal window open!** Don't close it while testing the app.

---

## Running on Your Phone

### For Android:

1. **Install Expo Go:**
   - Open Google Play Store on your Android phone
   - Search for "Expo Go"
   - Install the app
   - Open Expo Go

2. **Scan the QR Code:**
   - In Expo Go, tap "Scan QR Code"
   - Point your camera at the QR code in your terminal
   - Wait for the app to load (first time takes 30-60 seconds)

3. **Troubleshooting Android:**
   - Make sure your phone and computer are on the **same WiFi network**
   - If it doesn't work, try typing your computer's IP address manually in Expo Go

### For iOS (iPhone/iPad):

1. **Install Expo Go:**
   - Open App Store on your iOS device
   - Search for "Expo Go"
   - Install the app

2. **Scan the QR Code:**
   - Open the native **Camera app** (not Expo Go)
   - Point it at the QR code in your terminal
   - A notification will pop up - tap it
   - This will open Expo Go and load your app

3. **Troubleshooting iOS:**
   - Make sure both devices are on the **same WiFi network**
   - If Camera doesn't recognize the QR code, open Expo Go and enter the URL manually

---

## Building Standalone Apps

Once you've tested and confirmed the app works, you can build standalone versions that don't require Expo Go.

### Option 1: Build APK for Android (No Account Needed)

This creates an .apk file you can install on any Android phone.

```bash
# Install EAS CLI
npm install -g eas-cli

# Navigate to your app folder
cd GasInspectionApp

# Build for Android
eas build --platform android --profile preview
```

**First time setup:**
- You'll be asked to create a free Expo account
- Follow the prompts to set up your project
- The build happens in the cloud (takes 10-20 minutes)
- You'll get a download link for the APK file

**Installing the APK:**
1. Download the APK to your phone
2. Open it
3. Enable "Install from Unknown Sources" if prompted
4. Install and run!

### Option 2: Build for iOS (Requires Apple Developer Account)

**Requirements:**
- Apple Developer Account ($99/year)
- Mac computer (for development certificates)

```bash
eas build --platform ios
```

This process is more complex and requires additional setup with Apple's developer portal.

---

## Advanced Configuration

### Change Default Email

Edit `App.js` and find:

```javascript
plumberEmail: 'markhenryplumbing@gmail.com',
```

Change to your email address.

### Change Default Inspector Information

In `App.js`, find the `formData` initialization and update:

```javascript
plumberFirstName: 'Your First Name',
plumberLastName: 'Your Last Name',
plumberCompany: 'Your Company Name',
// etc...
```

### Enable PDF Generation

To enable full PDF generation and email functionality:

1. Install additional packages:
```bash
npm install expo-print expo-sharing expo-mail-composer
```

2. The PDF generation code is already prepared in `pdfGenerator.js`

3. Uncomment the import in `App.js` and integrate as needed

---

## Troubleshooting

### Issue: "Cannot connect to Metro"

**Solution:**
- Ensure both computer and phone are on the same WiFi
- Disable VPN if you're using one
- Try restarting: Close terminal, run `expo start` again
- Check your firewall settings

### Issue: "Something went wrong" when scanning QR

**Solution:**
- Clear Expo Go cache: Settings → Clear Cache
- Restart the Metro bundler: `expo start -c` (clears cache)
- Try tunnel mode: `expo start --tunnel`

### Issue: "Error: ENOSPC"

**Solution (Linux only):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue: App crashes immediately

**Solution:**
- Clear cache: `expo start -c`
- Delete node_modules:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Check for JavaScript errors in the Metro bundler terminal

### Issue: "Unable to resolve module"

**Solution:**
```bash
npm install
expo start -c
```

### Issue: QR code won't scan on iPhone

**Solution:**
- Make sure you're using the native Camera app (not Expo Go)
- Try increasing brightness on your computer screen
- Manually enter the URL shown in terminal into Expo Go

---

## Testing Checklist

Before building the production app, test:

- ✅ All screens navigate correctly
- ✅ All form fields accept input
- ✅ Data persists when moving between screens
- ✅ Radio buttons and checkboxes work
- ✅ Save button shows confirmation
- ✅ App works on both WiFi and mobile data (after building standalone)

---

## Getting Help

1. **Expo Documentation:** https://docs.expo.dev/
2. **React Native Docs:** https://reactnative.dev/
3. **Stack Overflow:** Search for your error message
4. **Expo Forums:** https://forums.expo.dev/

---

## Next Steps

1. ✅ Test the app thoroughly on your device
2. ✅ Customize the default plumber information
3. ✅ Test all inspection scenarios
4. ✅ Build the standalone app when ready
5. ✅ Install on all devices you need

---

## Important Notes

- **Development Mode:** When running with `expo start`, the app requires an internet connection and the Metro bundler running
- **Production Mode:** After building a standalone app (APK or IPA), the app works offline
- **Updates:** Any changes to the code require rebuilding the standalone app
- **Data Storage:** Currently, data is stored in memory. For production, consider adding local storage

---

## App Features Summary

✅ Complete inspection workflow
✅ 7 different screens matching your UI exactly
✅ All form fields and inputs
✅ Professional styling
✅ Data validation
✅ Report generation ready
✅ Works on both Android and iOS

---

## Support

If you encounter any issues not covered in this guide:

1. Check the error message carefully
2. Search for the error online
3. Check the Expo documentation
4. Try clearing cache and reinstalling dependencies

Good luck with your inspection app! 🚀

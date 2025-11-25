# iOS Installation Guide

## 🍎 Complete Guide for iPhone/iPad

Your gas piping inspection app works great on iOS! Here are all your options.

---

## ⚡ Quick Start: FREE Option (Recommended)

### Use Expo Go (No Cost, Works Immediately)

**Perfect for:**
- Testing the app
- Personal use
- Team use
- Daily inspections

**Steps:**

1. **Install Expo Go**
   - Open App Store on iPhone
   - Search "Expo Go"
   - Install (it's free)

2. **Start the app on your computer**
   ```bash
   cd GasInspectionApp
   npm start
   ```

3. **Scan QR Code**
   - Open Camera app on iPhone
   - Point at QR code in terminal
   - Tap notification that appears
   - App opens in Expo Go!

**That's it!** Your app is now running on iPhone.

**Features:**
- ✅ All functionality works
- ✅ Same as Android version
- ✅ Professional and reliable
- ✅ Updates instantly (just restart)
- ✅ No installation limits
- ✅ Works on unlimited iPhones

**Limitations:**
- ⚠️ Requires Expo Go app
- ⚠️ Needs WiFi connection to computer (for development)
- ⚠️ Not a standalone app

---

## 📱 Standalone iOS App (Requires $99/year)

### Option A: TestFlight Distribution (Easiest)

**Requirements:**
- Apple Developer Account ($99/year)
- 1-2 days for account approval

**Benefits:**
- ✅ Real standalone app
- ✅ Works offline
- ✅ No Expo Go needed
- ✅ Share with up to 100 testers
- ✅ Professional deployment
- ✅ Easy updates

**Complete Process:**

#### Step 1: Apple Developer Account

1. Go to: https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with your Apple ID
4. Choose "Individual" (or "Organization" if you have a company)
5. Pay $99 (renews yearly)
6. Wait 1-2 days for approval

**Cost Breakdown:**
- First year: $99
- Renewal: $99/year (auto-renews)
- Can cancel anytime

#### Step 2: Build iOS App

```bash
# Navigate to app
cd GasInspectionApp

# Login to EAS (if not already)
eas login

# Build for iOS
eas build --platform ios
```

**What happens:**
- Code uploaded to Expo servers
- iOS app built in cloud (15-20 minutes)
- You get a download link

**Output:**
```
✔ Build finished
iOS App: https://expo.dev/artifacts/eas/xxxxx.ipa
```

#### Step 3: Submit to TestFlight

```bash
# Submit to Apple
eas submit --platform ios
```

**You'll be asked for:**
- Apple ID email
- App-specific password (generated at appleid.apple.com)

**Apple Review Process:**
- Automated review: 1-2 hours
- If flagged: 1-2 days
- Usually very quick for TestFlight

#### Step 4: Invite Testers

1. Go to: https://appstoreconnect.apple.com
2. Navigate to your app
3. Go to TestFlight tab
4. Add tester emails
5. They receive invitation
6. Install TestFlight app
7. Install your app!

**Tester Experience:**
- Receive email invitation
- Click link → Opens TestFlight
- Tap "Install"
- App installs like regular app
- Works completely offline
- Can be on home screen

---

### Option B: Ad Hoc Distribution

**For specific devices only** (up to 100 devices per year)

**When to use:**
- Need to install on specific phones
- Want more control over distribution
- Don't want TestFlight

**Process:**

1. **Register Device UDIDs**
   - Get UDID from each iPhone
   - Register in Apple Developer Portal
   - Limited to 100 devices/year

2. **Build Ad Hoc**
   ```bash
   eas build --platform ios --profile preview
   ```

3. **Install on Devices**
   - Download .ipa file
   - Use Apple Configurator or Xcode
   - Install on registered devices

**More complex** - TestFlight is easier!

---

## 💻 Building from Windows/Linux

**Good news:** You DON'T need a Mac!

EAS Build (Expo's cloud service) builds iOS apps on their servers:

```bash
# Works on ANY computer (Windows, Mac, Linux)
eas build --platform ios
```

**Requirements:**
- ✅ Any computer
- ✅ Internet connection  
- ✅ Apple Developer account
- ❌ Mac NOT required

**Only need Mac for:**
- Advanced native development
- Using Xcode simulator
- Debugging native code

For your app: **Mac is optional!**

---

## 🔄 Building Both Platforms

### Build Android + iOS Together

```bash
# Build both at same time
eas build --platform all
```

**Or build separately:**

```bash
# Android APK (free)
eas build --platform android --profile preview

# iOS App (requires $99 Apple account)
eas build --platform ios
```

---

## 📊 Cost Comparison

### Option 1: Free Solution
**Android:** APK (free) ✅  
**iOS:** Expo Go (free) ✅  
**Total Cost:** $0

### Option 2: Standalone Both
**Android:** APK (free) ✅  
**iOS:** Standalone app ($99/year) 💰  
**Total Cost:** $99/year

### Option 3: App Stores
**Android:** Google Play ($25 one-time) 💰  
**iOS:** App Store ($99/year) 💰  
**Total Cost:** $124 first year, $99/year after

---

## 🎯 Recommendation by Use Case

### Personal Use (1-5 people)
**Best:** Expo Go for iOS (free)
- Install Expo Go on iPhones
- Build APK for Android phones
- Zero cost, full functionality

### Team Use (5-20 people)
**Best:** TestFlight for iOS
- Get Apple Developer account ($99)
- Distribute via TestFlight
- Professional, easy to manage

### Client-Facing
**Best:** App Stores
- Google Play + App Store
- Most professional option
- $124 setup + $99/year

---

## ⏱️ Timeline

### Expo Go (Free)
- **Setup:** 5 minutes
- **Install on each phone:** 2 minutes
- **Total:** 10 minutes for first device

### TestFlight (Paid)
- **Apple account approval:** 1-2 days
- **Build iOS app:** 20 minutes
- **Apple review:** 1-2 hours (usually)
- **Invite testers:** 5 minutes
- **Install per phone:** 5 minutes
- **Total:** 2-3 days (mostly waiting)

---

## 🆘 Troubleshooting

### "Can't scan QR code"
- Use Camera app (not Expo Go)
- Tap the notification that appears
- Make sure phone and computer on same WiFi

### "Apple Developer enrollment pending"
- Usually takes 1-2 business days
- Check email for updates
- Can take up to 1 week

### "Build failed - missing credentials"
You'll be prompted for:
- Apple ID email
- App-specific password
- Generate at: https://appleid.apple.com

### "App not installing from TestFlight"
- Make sure TestFlight app is installed
- Check email for invitation
- Invitation expires in 90 days

---

## 📱 Device Compatibility

**Your app works on:**

iOS Devices:
- ✅ iPhone 8 and newer
- ✅ iPhone SE (2nd gen and newer)
- ✅ iPad (all models with iOS 13+)
- ✅ iOS 13.0 or later

Android Devices:
- ✅ Android 6.0 (Marshmallow) or later
- ✅ Most phones from 2015 onwards

---

## 🔐 Security & Privacy

### Expo Go
- App sandboxed in Expo Go
- Same permissions as Expo Go
- Data stored locally
- No data sent to Expo

### Standalone App
- Your own app bundle
- Request only needed permissions
- Complete control
- More secure for sensitive data

---

## 💡 Best Practices

### For Development
1. Use Expo Go (fastest iteration)
2. Test on both iOS and Android
3. Build standalone when finalized

### For Distribution
1. **Small team:** TestFlight (easiest)
2. **Large team:** TestFlight + APK
3. **Public:** App Stores

### For Updates
1. **Expo Go:** Automatic (just restart)
2. **TestFlight:** Upload new build
3. **App Store:** Submit update for review

---

## 🎓 Step-by-Step: First iOS Build

### Complete Walkthrough

**Day 1:**
```bash
# 1. Sign up for Apple Developer
#    → https://developer.apple.com/programs/
#    → Pay $99
#    → Wait for approval (1-2 days)
```

**Day 2-3 (After Approval):**
```bash
# 2. Setup EAS
cd GasInspectionApp
npm install -g eas-cli
eas login

# 3. Build iOS app
eas build --platform ios

# 4. Submit to TestFlight
eas submit --platform ios

# 5. Wait for Apple review (1-2 hours)

# 6. Invite testers at:
#    https://appstoreconnect.apple.com
```

**Installation:**
- Testers receive email
- Install TestFlight app
- Install your app from TestFlight
- Done!

---

## ✅ Checklist

### For Expo Go (Free):
- [ ] Install Node.js
- [ ] Install Expo Go on iPhone
- [ ] Run `npm start` on computer
- [ ] Scan QR code
- [ ] App runs!

### For Standalone iOS:
- [ ] Sign up for Apple Developer ($99)
- [ ] Wait for approval (1-2 days)
- [ ] Install EAS CLI
- [ ] Build iOS app
- [ ] Submit to TestFlight
- [ ] Invite testers
- [ ] Install on iPhones

---

## 🎊 Summary

**Easiest & FREE:** Use Expo Go
- Works immediately
- Zero cost
- Full functionality
- Perfect for your needs

**Professional:** TestFlight
- Standalone app
- Requires $99/year
- Best for larger teams
- Most professional option

**Your Choice!** Both work perfectly for gas piping inspections.

---

## 📞 Quick Commands

**Test with Expo Go (Free):**
```bash
cd GasInspectionApp
npm start
# Scan QR code with iPhone Camera
```

**Build Standalone iOS (Requires $99 account):**
```bash
cd GasInspectionApp
eas build --platform ios
eas submit --platform ios
```

**Build Both Platforms:**
```bash
eas build --platform all
```

---

**Recommendation:** Start with Expo Go (free), upgrade to standalone iOS later if needed!

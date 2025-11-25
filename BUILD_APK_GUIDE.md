# Building Your APK - Mark Henry LL152 Gas Inspections

## 🎯 Quick Build Guide

Your "Mark Henry LL152 Gas Inspections" app is ready to build!

---

## ⚡ Fast Track to APK (30 minutes)

### Step 1: Install Node.js (5 minutes)
1. Go to: https://nodejs.org/
2. Download the **LTS** version (green button)
3. Run the installer
4. Keep clicking "Next" with default settings
5. Verify installation:
   - Windows: Open Command Prompt, type: `node --version`
   - Mac: Open Terminal, type: `node --version`
   - Should show: v18.x.x or v20.x.x

### Step 2: Install Tools (5 minutes)
Open terminal/command prompt and run:

```bash
npm install -g expo-cli eas-cli
```

Wait for installation to complete (may take 3-5 minutes).

### Step 3: Setup Project (5 minutes)

```bash
cd GasInspectionApp
npm install
```

This installs all app dependencies.

### Step 4: Create Expo Account (3 minutes)

Go to: https://expo.dev/signup

Create a free account (you'll need this for builds)

### Step 5: Login & Configure (2 minutes)

```bash
eas login
```

Enter your Expo credentials when prompted.

Then configure the build:

```bash
eas build:configure
```

Press Enter to accept defaults.

### Step 6: Build APK (15 minutes - mostly waiting)

```bash
eas build --platform android --profile preview
```

**What happens:**
1. Your code is uploaded to Expo servers
2. APK is built in the cloud (10-15 minutes)
3. You'll get a download link

**Output will look like:**
```
✔ Build finished
APK: https://expo.dev/artifacts/eas/xxxxx.apk
```

### Step 7: Download & Install APK

1. Click the download link (or copy to your phone)
2. Download the APK file
3. Transfer to your phone if needed
4. Open the APK file on your Android phone
5. Tap "Install" (may need to allow "Install from Unknown Sources")
6. Done! Your app is installed

---

## 📱 Installing on Multiple Phones

Once you have the APK:
1. Copy the .apk file to each phone
2. Install on each device
3. All phones will have the same app with your fixed plumber info

OR

Share the download link and each person can download directly.

---

## 🔄 Making Changes Later

If you need to update the plumber info in an emergency:

### Option 1: Through App Settings (Coming Soon)
We can add a settings screen with password protection where you can edit plumber info.

### Option 2: Rebuild the App

1. Open `App.js`
2. Find lines 20-35 (plumber information)
3. Update the information
4. Save the file
5. Rebuild: `eas build --platform android --profile preview`
6. Download new APK
7. Install new version (will replace old one)

---

## 💾 Keeping Your APK Safe

After building:
1. Save the APK file to your computer
2. Keep the download link (valid for 30 days)
3. Upload to Google Drive or cloud storage
4. Can reinstall anytime without rebuilding

---

## ⚙️ Build Profiles Explained

```bash
# PREVIEW BUILD (Recommended for personal use)
eas build --platform android --profile preview
# Creates: APK file (easy to install, no store needed)
# Size: ~50MB
# Distribution: Direct install on any Android phone

# PRODUCTION BUILD (For Google Play Store)
eas build --platform android --profile production
# Creates: AAB file (for Play Store only)
# Requires: Play Store developer account ($25 one-time)
```

For your use case, **PREVIEW** is perfect!

---

## 🆘 Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Expo account required"
Go to https://expo.dev/signup and create free account, then:
```bash
eas login
```

### Build fails
Make sure you're in the correct folder:
```bash
cd GasInspectionApp
pwd  # Should show: /path/to/GasInspectionApp
```

### "Install from Unknown Sources" blocked
On Android:
1. Settings → Security
2. Enable "Unknown Sources" or "Install from Unknown Sources"
3. Try installing APK again

### APK link expired
Build links last 30 days. If expired, rebuild:
```bash
eas build --platform android --profile preview
```

---

## 📊 Build Time Expectations

- Node.js installation: 5 minutes
- Tool installation: 5 minutes
- Project setup: 5 minutes
- Account creation: 3 minutes
- Build configuration: 2 minutes
- **Cloud build: 10-15 minutes** (this is the waiting part)
- Download & install: 5 minutes

**Total: ~30 minutes** (mostly automated)

---

## ✅ Verification Checklist

After installation, verify:
- [ ] App opens without errors
- [ ] Home screen shows correctly
- [ ] Can create new report
- [ ] Location fields are editable
- [ ] Plumber info shows correctly (fixed)
- [ ] Can navigate all screens
- [ ] Can complete inspection
- [ ] Save button works
- [ ] Can create multiple reports

---

## 🎯 Summary Commands

**Complete build process in 5 commands:**

```bash
# 1. Install tools
npm install -g expo-cli eas-cli

# 2. Go to app folder
cd GasInspectionApp

# 3. Install dependencies
npm install

# 4. Login to Expo
eas login

# 5. Build APK
eas build --platform android --profile preview
```

Then wait for the download link!

---

## 📞 Quick Reference

**Start building:**
```bash
cd GasInspectionApp
eas build --platform android --profile preview
```

**Check build status:**
```bash
eas build:list
```

**View your builds online:**
https://expo.dev/accounts/[your-username]/projects/

---

## 💡 Pro Tips

1. **First build takes longest** (15 min) - subsequent builds are faster (10 min)
2. **Keep the APK file** - no need to rebuild unless you make changes
3. **Share via link** - easier than transferring APK files
4. **Test first with Expo Go** before building APK (faster iteration)
5. **Build expires in 30 days** - download and save the APK!

---

## 🎊 You're Ready to Build!

Your app has all your plumber information already configured. Just run the build commands and you'll have your APK in 30 minutes!

**Start with:** `npm install -g expo-cli eas-cli`

Good luck! 🚀

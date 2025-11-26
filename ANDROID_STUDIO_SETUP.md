# Android Studio Setup - Complete Step-by-Step Guide

## 🎯 Goal: Build APK Locally in 15-20 Minutes

---

## 📦 STEP 1: Install Android Studio

### 1.1 Run the Installer
1. **Find** the Android Studio installer you downloaded
2. **Double-click** to run it
3. **Click "Next"** through the setup wizard
4. **Choose installation location** (default is fine)
5. **Click "Install"**
6. **Wait for installation** (5-10 minutes)

### 1.2 First Launch Setup
1. **Launch Android Studio** (from Start menu)
2. **Choose "Standard" installation** when prompted
3. **Click "Next"**
4. **Accept license agreements**
5. **Click "Finish"**
6. **Wait for SDK components to download** (5-10 minutes)

**This will download:**
- Android SDK
- Android SDK Platform-Tools
- Build tools
- Other required components

---

## 🔧 STEP 2: Configure Android SDK

### 2.1 Open SDK Manager
1. **In Android Studio**, go to: **File → Settings** (or **Android Studio → Preferences** on Mac)
2. **Click**: **Appearance & Behavior → System Settings → Android SDK**
3. **OR** click the **SDK Manager icon** in the toolbar (looks like a phone with a wrench)

### 2.2 Install Required Components
**In the SDK Manager window:**

1. **Check these boxes** (if not already checked):
   - ✅ **Android SDK Platform-Tools**
   - ✅ **Android SDK Build-Tools**
   - ✅ **Android SDK Command-line Tools**
   - ✅ **Android SDK Platform 33** (or latest)
   - ✅ **Android SDK Platform 34** (if available)

2. **Click "Apply"**
3. **Click "OK"**
4. **Wait for installation** (2-5 minutes)

---

## 🌍 STEP 3: Set Environment Variables (IMPORTANT!)

### 3.1 Find Your SDK Path

**In Android Studio:**
1. Go to: **File → Settings → Android SDK**
2. **Look at "Android SDK Location"** at the top
3. **Copy the path** (usually: `C:\Users\YourName\AppData\Local\Android\Sdk`)

**OR manually find it:**
- Usually at: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`

### 3.2 Add to System PATH (Windows)

**Method 1: Using System Properties**

1. **Press** `Windows + R`
2. **Type**: `sysdm.cpl`
3. **Press Enter**
4. **Click** "Environment Variables" button
5. **Under "System variables"**, find **"Path"**
6. **Click "Edit"**
7. **Click "New"**
8. **Add these paths** (replace with YOUR actual SDK path):
   ```
   C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools
   C:\Users\YourName\AppData\Local\Android\Sdk\tools
   C:\Users\YourName\AppData\Local\Android\Sdk\tools\bin
   ```
9. **Click "OK"** on all windows

**Method 2: Using PowerShell (Easier)**

1. **Open PowerShell as Administrator**:
   - Right-click Start menu
   - Click "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Run these commands** (replace `YourName` with your username):
   ```powershell
   $env:Path += ";C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools"
   $env:Path += ";C:\Users\YourName\AppData\Local\Android\Sdk\tools"
   $env:Path += ";C:\Users\YourName\AppData\Local\Android\Sdk\tools\bin"
   
   [Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
   ```

3. **Close and reopen PowerShell**

---

## ✅ STEP 4: Verify Installation

### 4.1 Check if ADB is Available

**Open NEW PowerShell window** (not the one you used before):

```powershell
where adb
```

**Expected output:**
```
C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe
```

**If you see this**: ✅ You're ready!

**If you see error**: Go back to Step 3 and check PATH again

### 4.2 Check ADB Version

```powershell
adb version
```

**Should show**: Android Debug Bridge version 1.0.xx

---

## 🚀 STEP 5: Build Your APK Locally

### 5.1 Navigate to Project

**Open PowerShell** in your project folder:

```powershell
cd C:\Users\biruk\Downloads\MarkHenryLL152-GasInspectionApp\GasInspectionApp
```

### 5.2 Run Local Build

```powershell
eas build --platform android --profile preview --local
```

### 5.3 What Happens

1. **EAS checks** for Android SDK ✅
2. **Downloads build tools** if needed (first time only)
3. **Builds APK** on your computer
4. **Takes 10-15 minutes** (first build might take longer)
5. **APK saved** in your project folder

### 5.4 First Build Notes

**First time building locally:**
- Might download additional tools (5-10 min)
- Build process takes 10-15 minutes
- Subsequent builds are faster (5-10 min)

**You'll see progress like:**
```
✔ Checking Android SDK...
✔ Downloading build tools...
✔ Building APK...
✔ Build complete!
```

---

## 📱 STEP 6: Find Your APK

### After Build Completes:

**APK Location:**
- Usually in: `C:\Users\biruk\Downloads\MarkHenryLL152-GasInspectionApp\GasInspectionApp\builds\`
- **OR** EAS will show you the path at the end

**Look for file like:**
- `app-preview.apk`
- `build-xxxxx.apk`

---

## 🔧 TROUBLESHOOTING

### Problem: "adb: command not found"

**Solution:**
1. Check PATH is set correctly (Step 3)
2. Close and reopen PowerShell
3. Try `where adb` again

### Problem: "Android SDK not found"

**Solution:**
1. Make sure Android Studio is fully installed
2. Open Android Studio → SDK Manager
3. Verify SDK location
4. Check PATH includes SDK paths

### Problem: Build fails with Java error

**Solution:**
1. Android Studio includes Java
2. Make sure Android Studio is fully installed
3. Restart PowerShell and try again

### Problem: Build takes too long

**Solution:**
- First build always takes longer (15-20 min)
- Subsequent builds are faster (5-10 min)
- This is normal!

### Problem: "EAS CLI not found"

**Solution:**
```powershell
npm install -g eas-cli
```

---

## ✅ QUICK CHECKLIST

Before building, make sure:

- [ ] Android Studio installed
- [ ] SDK components downloaded
- [ ] PATH environment variable set
- [ ] `where adb` shows a path
- [ ] You're in project directory
- [ ] EAS CLI installed (`eas --version`)

---

## 🎯 COMPLETE WORKFLOW

### Summary of All Steps:

1. **Install Android Studio** (10 min)
2. **Open SDK Manager** → Install components (5 min)
3. **Set PATH environment variable** (5 min)
4. **Verify with `where adb`** (1 min)
5. **Build APK locally** (15 min)

**Total Time: ~35-40 minutes** (one-time setup)
**Then builds take 10-15 minutes each time**

---

## 🚀 READY TO START?

### Step-by-Step Right Now:

**1. Install Android Studio:**
- Run the installer you downloaded
- Follow installation wizard
- Wait for SDK download

**2. Set PATH:**
- Find SDK location in Android Studio
- Add to system PATH (Step 3 above)

**3. Verify:**
```powershell
where adb
```

**4. Build:**
```powershell
cd C:\Users\biruk\Downloads\MarkHenryLL152-GasInspectionApp\GasInspectionApp
eas build --platform android --profile preview --local
```

---

## 💡 PRO TIPS

### Tip 1: Keep Android Studio Open
- Keep it running during first build
- Helps with any SDK issues

### Tip 2: First Build is Slowest
- First build downloads tools
- Subsequent builds are faster

### Tip 3: Check Internet Connection
- First build needs internet
- Downloads additional tools

### Tip 4: Don't Close PowerShell
- Keep terminal open during build
- You'll see progress and final path

---

## 📞 Need Help?

### Common Issues:

**"SDK location not found"**
→ Open Android Studio → Settings → Android SDK → Copy path

**"adb not recognized"**
→ Check PATH is set correctly → Restart PowerShell

**"Build failed"**
→ Make sure all SDK components installed
→ Check internet connection
→ Try again

---

## ✅ SUCCESS INDICATORS

**You'll know it's working when:**
- ✅ `where adb` shows a path
- ✅ Build command starts without errors
- ✅ You see "Building APK..." message
- ✅ Build completes with "✔ Build complete!"

---

## 🎉 After Build Completes

1. **Find APK file** in project folder
2. **Test on your phone** (install and test)
3. **Share with client** (upload to Drive, email, etc.)
4. **Done!** 🚀

---

## 🚀 START NOW!

**Follow these steps in order:**
1. Complete Android Studio installation
2. Set up SDK
3. Configure PATH
4. Verify with `where adb`
5. Build your APK!

**You're almost there! Follow the steps above and you'll have your APK in no time!** 🎉





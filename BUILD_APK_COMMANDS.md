# Build APK - Run These Commands

## ✅ Email Changed Back
- Email is now: **markhenryplumbing@gmail.com**
- Ready to build APK for client testing!

---

## 🚀 Build Commands (Run in PowerShell)

### You're already logged in as: **biruk123** ✓

### Step 1: Make sure you're in the project directory
```powershell
cd C:\Users\biruk\Downloads\MarkHenryLL152-GasInspectionApp\GasInspectionApp
```

### Step 2: Update EAS CLI (Optional but recommended)
```powershell
npm install -g eas-cli
```

### Step 3: Build Preview APK
```powershell
eas build --platform android --profile preview
```

---

## ⏱️ What Happens Next

1. **Code Upload**: Project files upload to Expo (1-2 minutes)
2. **Build Queue**: Build enters queue
3. **Building**: APK builds in cloud (5-10 minutes)
4. **Complete**: You get download link!

**Total Time: ~10-15 minutes**

---

## 📥 After Build Completes

You'll see output like this:

```
✔ Build finished
Build artifact: https://expo.dev/artifacts/eas/xxxxx.apk

View build details: https://expo.dev/accounts/biruk123/projects/...
```

**Copy the artifact link** - this is your APK download URL!

---

## 📤 Share with Client

### Option 1: Direct Link (Easiest)
1. Copy the build artifact link
2. Send to client
3. Client downloads APK directly
4. Client installs on Android phone

### Option 2: Download and Send
1. Download APK from link
2. Upload to Google Drive / Dropbox
3. Share drive link with client
4. Client downloads and installs

---

## 📱 Client Installation Instructions

Send these to your client:

**For Client:**
```
1. Download the APK file from the link
2. Open downloaded file on your Android phone
3. If blocked, go to: Settings → Security → Enable "Install from unknown sources"
4. Tap "Install"
5. Open the app
6. Test all features!
```

---

## ✅ What Client Can Test

After installation, client can test:
- ✅ Create reports (all 7 pages)
- ✅ Save reports
- ✅ Edit reports
- ✅ Delete reports
- ✅ **Generate PDF**
- ✅ **Email PDF** (to markhenryplumbing@gmail.com)
- ✅ Share PDF via other apps
- ✅ All features work offline (except email send)

---

## 🎯 Quick Reference

### Build Preview APK:
```powershell
eas build --platform android --profile preview
```

### Check Build Status:
```powershell
eas build:list
```

### View Your Builds:
Go to: https://expo.dev/accounts/biruk123/projects

---

## 🔧 If You Need Prebuild

If EAS asks for prebuild or native code, run:

```powershell
npx expo prebuild
```

Then build again:
```powershell
eas build --platform android --profile preview
```

**Note:** Usually not needed for this project!

---

## ⚠️ Troubleshooting

### Problem: Build fails immediately

**Solution:**
```powershell
# Clear cache and try again
eas build --platform android --profile preview --clear-cache
```

### Problem: "No eas.json found"

**Solution:**
```powershell
eas build:configure
```
Then build again.

### Problem: Build stuck in queue

**Solution:**
- Just wait, sometimes takes a few minutes
- Check status: `eas build:list`
- View online: https://expo.dev/accounts/biruk123/builds

---

## 💡 Pro Tips

### Tip 1: Keep Terminal Open
Don't close PowerShell during build - you need the download link!

### Tip 2: Multiple Builds
You can build multiple times if needed - it's free!

### Tip 3: Save the Link
The APK download link works for 30 days

### Tip 4: Build Info
All your builds are saved at: https://expo.dev/accounts/biruk123/projects

---

## 📧 Email Confirmation

**Default Email**: markhenryplumbing@gmail.com

**What Happens:**
- Client creates report
- Client taps "Email PDF"
- Email composer opens
- **TO:** markhenryplumbing@gmail.com
- PDF automatically attached
- Client sends
- **You receive email with PDF!** ✓

---

## ✅ Build Checklist

Before building:
- [x] Email changed to markhenryplumbing@gmail.com ✓
- [x] eas.json configured ✓
- [x] EAS CLI installed ✓
- [x] Logged in as biruk123 ✓
- [x] All features working ✓
- [x] Ready to build! ✓

---

## 🚀 START BUILDING NOW!

Copy and paste into PowerShell:

```powershell
cd C:\Users\biruk\Downloads\MarkHenryLL152-GasInspectionApp\GasInspectionApp

eas build --platform android --profile preview
```

**Then wait 10 minutes and get your APK link!** 🎉

---

## 📞 Quick Help

**Stuck?** Run this to see all your builds:
```powershell
eas build:list
```

**Want to cancel?** Press `Ctrl+C` in terminal

**Need help?** Check: https://expo.dev/accounts/biruk123

---

## ✅ After Build

1. ✅ Copy APK download link
2. ✅ Test APK yourself (optional)
3. ✅ Send link to client
4. ✅ Client downloads and installs
5. ✅ Client tests and confirms email works!
6. ✅ Done! 🎉

**Ready to build? Run the commands above!** 🚀





# Next Steps: Complete Firebase Setup

## ✅ What's Done

- ✅ Client config files added (`GoogleService-Info.plist` & `google-services.json`)
- ✅ Client code updated to use `rideshare-bd747`
- ✅ Server code updated to use `rideshare-bd747`
- ✅ All references changed from `kwendash-dbf13` to `rideshare-bd747`

## 🔧 Next Step: Get Server Credentials

You need Firebase Admin SDK credentials for the **server** to enable Firebase authentication on the backend.

### Step 1: Get Service Account Key

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **rideshare-bd747**

2. **Navigate to Service Accounts**
   - Click the gear icon ⚙️ (Project Settings)
   - Click "Service Accounts" tab
   - You'll see "Firebase Admin SDK"

3. **Generate Private Key**
   - Click "Generate New Private Key" button
   - A warning dialog will appear - click "Generate Key"
   - A JSON file will download (e.g., `rideshare-bd747-firebase-adminsdk-xxxxx.json`)

### Step 2: Extract Values from JSON

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "rideshare-bd747",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@rideshare-bd747.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

You need these 3 values:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

### Step 3: Add to server/.env

Open `server/.env` and add (or update) these lines:

```bash
FIREBASE_PROJECT_ID=rideshare-bd747
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rideshare-bd747.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----\n
```

**Important Notes:**
- Keep the `\n` escape sequences in `FIREBASE_PRIVATE_KEY` (don't replace with actual newlines)
- The private key should be on one line with `\n` where newlines should be
- Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Step 4: Verify Setup

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```

2. **Look for this message:**
   ```
   ✅ Firebase Admin initialized successfully
   ```

   If you see:
   ```
   ⚠️  Firebase credentials not found, Firebase auth disabled
   ```
   Then check your `.env` file - the variables might not be set correctly.

## 🧪 Testing

After adding credentials:

1. **Test Server:**
   ```bash
   cd server
   npm start
   # Should see: "Firebase Admin initialized successfully"
   ```

2. **Test Client:**
   ```bash
   cd client
   npx expo prebuild  # Regenerate native projects
   npm run ios        # or npm run android
   ```

3. **Test Firebase Auth:**
   - Try phone authentication in the app
   - Should work with Firebase now!

## 📋 Quick Checklist

- [ ] Downloaded service account JSON from Firebase Console
- [ ] Extracted `project_id`, `client_email`, and `private_key`
- [ ] Added to `server/.env` file
- [ ] Verified `FIREBASE_PRIVATE_KEY` has `\n` escape sequences
- [ ] Started server and saw "Firebase Admin initialized successfully"
- [ ] Tested phone authentication in app

## 🆘 Troubleshooting

### "Firebase credentials not found"
- Check `.env` file exists in `server/` directory
- Verify all 3 Firebase variables are set
- Check for typos in variable names

### "Error initializing Firebase"
- Verify `FIREBASE_PRIVATE_KEY` format (must have `\n` escape sequences)
- Check `FIREBASE_CLIENT_EMAIL` is correct
- Ensure `FIREBASE_PROJECT_ID` matches `rideshare-bd747`

### "Invalid Firebase token"
- Make sure client and server use the same Firebase project
- Verify config files match the project

## 🎯 Summary

**Current Status:**
- ✅ Client: Ready (config files in place)
- ✅ Server Code: Ready (updated to rideshare-bd747)
- ⏳ Server Credentials: **Need to add to .env**

**Action Required:**
1. Get service account key from Firebase Console
2. Add 3 variables to `server/.env`
3. Restart server
4. Test!

Once you add the credentials, Firebase authentication will be fully enabled! 🚀


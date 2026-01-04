# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Fill in required values** (see sections below)

3. **Start the server:**
   ```bash
   npm start
   ```

## Required Variables (Must Fill)

### 1. MongoDB Connection (`MONGO_URI`)

#### Option A: Local MongoDB
```bash
# Install MongoDB locally, then use:
MONGO_URI=mongodb://127.0.0.1:27017/rideshare
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `rideshare` (or your preferred name)

Example:
```bash
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
```

### 2. JWT Secrets

Generate secure random secrets:

```bash
# Generate ACCESS_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate REFRESH_TOKEN_SECRET (different from access token!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to your `.env` file:
```bash
ACCESS_TOKEN_SECRET=<paste_first_output_here>
REFRESH_TOKEN_SECRET=<paste_second_output_here>
```

**Important**: Use different values for access and refresh tokens!

## Optional Variables

### Firebase Admin SDK (For Phone Authentication)

If you want to use Firebase phone authentication:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create/Select Project**
3. **Get Project ID**:
   - Project Settings → General → Project ID
   - Copy to `FIREBASE_PROJECT_ID`

4. **Get Service Account Credentials**:
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download JSON file
   - Open JSON file and extract:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY`

5. **Format FIREBASE_PRIVATE_KEY**:
   - The private key in JSON has actual newlines
   - In `.env`, replace newlines with `\n` escape sequences
   - Example:
     ```
     FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
     ```
   - The code automatically converts `\n` to actual newlines

6. **Add to `.env`**:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n
   ```

**Note**: Server will run without Firebase, but phone authentication features will be disabled.

### OpenAI API Key (For AI Agent)

If you want to use the AI Agent features in the admin dashboard:

1. **Sign up**: https://platform.openai.com
2. **Go to API Keys**: https://platform.openai.com/api-keys
3. **Create new secret key**
4. **Copy key** (starts with `sk-`)
5. **Add to `.env`**:
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Note**: 
- Server will run without this, but AI Agent endpoints will return errors
- See `AI_AGENT_GUIDE.md` for pricing information
- The `@openai/agents` SDK automatically reads from `process.env.OPENAI_API_KEY`

## Verification

After setting up your `.env` file, verify it works:

```bash
cd server
npm start
```

Expected output:
```
Connected to MongoDB
Firebase Admin initialized successfully  # (if Firebase vars are set)
HTTP server is running on port http://localhost:3000
```

If you see errors:
- **MongoDB connection error**: Check `MONGO_URI` is correct
- **JWT errors**: Ensure both token secrets are set and different
- **Firebase errors**: Check private key format (must have `\n` escape sequences)

## Security Notes

1. **Never commit `.env`** - It's in `.gitignore`
2. **Use different secrets for dev/prod**
3. **Rotate secrets periodically** (especially if compromised)
4. **Keep Firebase private key secure** - It has admin access
5. **Monitor OpenAI API usage** - Set spending limits

## Troubleshooting

### "Authentication invalid" errors
- Check `ACCESS_TOKEN_SECRET` is set
- Verify token hasn't expired (check `ACCESS_TOKEN_EXPIRY`)

### Firebase not working
- Verify all three Firebase vars are set
- Check `FIREBASE_PRIVATE_KEY` has `\n` escape sequences, not actual newlines
- Ensure service account has proper permissions

### AI Agent not responding
- Verify `OPENAI_API_KEY` is set and valid
- Check you have credits in OpenAI account
- Review server logs for API errors

### Database connection failed
- Verify MongoDB is running (if local)
- Check `MONGO_URI` format is correct
- For Atlas: Check IP whitelist and credentials



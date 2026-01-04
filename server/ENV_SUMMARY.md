# Environment Variables Summary

## Complete List of Environment Variables

### Required Variables (Server won't start without these)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | None | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | None | JWT access token signing secret (64 hex chars) |
| `ACCESS_TOKEN_EXPIRY` | `4d` | Access token expiration (e.g., "4d", "1h") |
| `REFRESH_TOKEN_SECRET` | None | JWT refresh token signing secret (64 hex chars) |
| `REFRESH_TOKEN_EXPIRY` | `30d` | Refresh token expiration (e.g., "30d") |

### Optional Variables (Server runs without these)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server listening port |
| `FIREBASE_PROJECT_ID` | `rideshare-bd747`* | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | None | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | None | Firebase service account private key |
| `OPENAI_API_KEY` | None | OpenAI API key for AI Agent |

\* Currently has hardcoded fallback; should be set explicitly

## Quick Reference

### Generate JWT Secrets
```bash
# Access token secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Refresh token secret (run again for different value)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Connection Strings
```bash
# Local
MONGO_URI=mongodb://127.0.0.1:27017/rideshare

# Atlas
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rideshare?retryWrites=true&w=majority
```

### Firebase Private Key Format
```bash
# In .env file, use \n escape sequences:
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nKEY_CONTENT\n-----END PRIVATE KEY-----\n

# NOT actual newlines (code converts \n automatically)
```

## Files Created

1. **`.env.example`** - Template with placeholders (commit to git)
2. **`.env`** - Your actual values (gitignored, create manually)
3. **`ENV_VARIABLES.md`** - Detailed reference documentation
4. **`SETUP_ENV.md`** - Step-by-step setup guide

## Where Variables Are Used

### Database
- `MONGO_URI`: `server/app.js:71`, `server/seedData.js:247`

### Authentication
- `ACCESS_TOKEN_SECRET`: 
  - `server/models/User.js:138`
  - `server/models/Admin.js:44`
  - `server/middleware/authentication.js:13`
  - `server/middleware/adminAuth.js:15`
  - `server/controllers/sockets.js:14`
- `ACCESS_TOKEN_EXPIRY`: `server/models/User.js:139`, `server/models/Admin.js:45`
- `REFRESH_TOKEN_SECRET`: `server/models/User.js:146`, `server/controllers/auth.js:128`
- `REFRESH_TOKEN_EXPIRY`: `server/models/User.js:148`

### Server Config
- `PORT`: `server/app.js:73,75`

### Firebase
- `FIREBASE_PROJECT_ID`: `server/config/firebase.js:8`
- `FIREBASE_CLIENT_EMAIL`: `server/config/firebase.js:5,9`
- `FIREBASE_PRIVATE_KEY`: `server/config/firebase.js:5,10`

### AI Agent
- `OPENAI_API_KEY`: Used by `@openai/agents` SDK in `server/services/aiAgent.js`

## Static Analysis Results

✅ **All environment variables are properly used**
- No unused variables in template
- No missing variables in code
- All critical paths have required variables

⚠️ **Runtime Considerations**
- Missing `MONGO_URI`: Server crashes on startup
- Missing JWT secrets: Server crashes when creating/verifying tokens
- Missing Firebase vars: Server runs but Firebase auth disabled
- Missing OpenAI key: Server runs but AI Agent features fail

## Next Steps

1. **Copy `.env.example` to `.env`**:
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Fill in required values** (see `SETUP_ENV.md` for detailed instructions)

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Verify it works**:
   - Check console for "Connected to MongoDB"
   - Server should listen on port 3000 (or your PORT value)
   - Test health endpoint: `curl http://localhost:3000/health`

## Provider-Specific Setup

### MongoDB
- **Local**: Install MongoDB, use `mongodb://127.0.0.1:27017/rideshare`
- **Atlas**: Create account, get connection string from cluster

### Firebase
- **Console**: https://console.firebase.google.com/
- **Service Account**: Project Settings → Service Accounts → Generate Key
- **Format**: Keep `\n` escape sequences in private key

### OpenAI
- **Platform**: https://platform.openai.com
- **API Keys**: https://platform.openai.com/api-keys
- **Format**: Key starts with `sk-`

## Security Checklist

- [ ] `.env` is in `.gitignore` ✅
- [ ] `.env.example` is NOT in `.gitignore` ✅
- [ ] JWT secrets are different for dev/prod
- [ ] Firebase private key is kept secure
- [ ] OpenAI API key has spending limits set
- [ ] MongoDB connection string doesn't expose credentials in logs



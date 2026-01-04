# Environment Variables Reference

## Complete Environment Variables Table

| VAR_NAME | WHERE_USED | REQUIRED? | SAFE_DEFAULT_FOR_LOCAL | HOW_TO_GET_VALUE | NOTES |
|----------|------------|-----------|------------------------|------------------|-------|
| `MONGO_URI` | `server/app.js:71`, `server/seedData.js:247` | **Yes** | `mongodb://127.0.0.1:27017/rideshare` | MongoDB connection string | Local MongoDB or MongoDB Atlas URI |
| `ACCESS_TOKEN_SECRET` | `server/models/User.js:138`, `server/models/Admin.js:44`, `server/middleware/authentication.js:13`, `server/middleware/adminAuth.js:15`, `server/controllers/sockets.js:14` | **Yes** | Auto-generated (64 hex chars) | Generate random 64-character hex string | Used for JWT access token signing |
| `ACCESS_TOKEN_EXPIRY` | `server/models/User.js:139`, `server/models/Admin.js:45` | **Yes** | `4d` | Time string (e.g., "4d", "1h", "30m") | JWT access token expiration time |
| `REFRESH_TOKEN_SECRET` | `server/models/User.js:146`, `server/controllers/auth.js:128` | **Yes** | Auto-generated (64 hex chars) | Generate random 64-character hex string | Used for JWT refresh token signing |
| `REFRESH_TOKEN_EXPIRY` | `server/models/User.js:148` | **Yes** | `30d` | Time string (e.g., "30d", "7d") | JWT refresh token expiration time |
| `PORT` | `server/app.js:73,75` | No | `3000` | Port number | Server listening port (defaults to 3000) |
| `FIREBASE_PROJECT_ID` | `server/config/firebase.js:8` | No* | `your-firebase-project-id` | Firebase Console → Project Settings | Currently hardcoded; should use env var |
| `FIREBASE_CLIENT_EMAIL` | `server/config/firebase.js:5,9` | No* | `your-service-account@project.iam.gserviceaccount.com` | Firebase Console → Service Accounts | Required if using Firebase Admin SDK |
| `FIREBASE_PRIVATE_KEY` | `server/config/firebase.js:5,10` | No* | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Firebase Console → Service Accounts | Multiline key; newlines are auto-replaced (`\\n` → `\n`) |
| `OPENAI_API_KEY` | `server/services/aiAgent.js` (via @openai/agents SDK) | No | `sk-...` | OpenAI Platform → API Keys | Required for AI Agent features; SDK reads from env automatically |

\* Firebase variables are optional - server will run without them but Firebase authentication features will be disabled.

## Environment Variable Details

### Required Variables

#### `MONGO_URI`
- **Purpose**: MongoDB database connection string
- **Format**: 
  - Local: `mongodb://127.0.0.1:27017/rideshare`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/rideshare?retryWrites=true&w=majority`
- **Where to get**: 
  - Local: Install MongoDB locally
  - Atlas: Create account at https://www.mongodb.com/cloud/atlas

#### `ACCESS_TOKEN_SECRET`
- **Purpose**: Secret key for signing JWT access tokens
- **Format**: 64-character hexadecimal string
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security**: Must be kept secret; use different values for dev/prod

#### `ACCESS_TOKEN_EXPIRY`
- **Purpose**: Expiration time for access tokens
- **Format**: Time string (e.g., "4d", "1h", "30m", "3600s")
- **Recommended**: `4d` (4 days)

#### `REFRESH_TOKEN_SECRET`
- **Purpose**: Secret key for signing JWT refresh tokens
- **Format**: 64-character hexadecimal string
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security**: Must be different from `ACCESS_TOKEN_SECRET`

#### `REFRESH_TOKEN_EXPIRY`
- **Purpose**: Expiration time for refresh tokens
- **Format**: Time string (e.g., "30d", "7d")
- **Recommended**: `30d` (30 days)

### Optional Variables

#### `PORT`
- **Purpose**: Server listening port
- **Default**: `3000`
- **Format**: Integer (e.g., `3000`, `8080`)

#### `FIREBASE_PROJECT_ID`
- **Purpose**: Firebase project identifier
- **Where to get**: Firebase Console → Project Settings → General → Project ID
- **Note**: Defaults to `"rideshare-bd747"` if not set in environment variables.

#### `FIREBASE_CLIENT_EMAIL`
- **Purpose**: Firebase service account email
- **Format**: `your-service-account@project-id.iam.gserviceaccount.com`
- **Where to get**: 
  1. Firebase Console → Project Settings → Service Accounts
  2. Click "Generate New Private Key"
  3. Download JSON file
  4. Extract `client_email` field

#### `FIREBASE_PRIVATE_KEY`
- **Purpose**: Firebase service account private key
- **Format**: Multiline string with `\n` escape sequences
- **Where to get**: 
  1. From Firebase service account JSON file
  2. Extract `private_key` field
  3. Keep the `\n` escape sequences - they will be converted to actual newlines automatically
- **Example**: 
  ```
  -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
  ```
- **Important**: The code automatically replaces `\\n` with actual newlines, so keep the escape sequences in the env file.

#### `OPENAI_API_KEY`
- **Purpose**: OpenAI API key for AI Agent features
- **Format**: `sk-...` (starts with "sk-")
- **Where to get**: 
  1. Sign up at https://platform.openai.com
  2. Go to API Keys section
  3. Create new secret key
- **Note**: The `@openai/agents` SDK automatically reads this from `process.env.OPENAI_API_KEY`
- **Cost**: Pay-per-use (see AI_AGENT_GUIDE.md for pricing)

## Runtime Behavior

### Server Startup
1. `dotenv.config()` is called in `server/app.js:3` before any env vars are used
2. MongoDB connection requires `MONGO_URI` - server will crash if missing
3. JWT secrets are required - server will crash if missing when tokens are created/verified
4. Firebase is optional - server will log "Firebase credentials not found, Firebase auth disabled" if missing
5. OpenAI API key is optional - AI Agent features will fail if missing but server will run

### Critical Paths
- **Authentication**: Requires `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`
- **Token Refresh**: Requires `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY`
- **Database**: Requires `MONGO_URI`
- **Firebase Auth**: Requires all three Firebase vars (optional)
- **AI Agent**: Requires `OPENAI_API_KEY` (optional)

## Static Analysis Results

### Variables Used But Not in Template
- None (all discovered variables are included)

### Variables in Template But Not Used
- None (all variables are actively used)

### Potential Runtime Pitfalls
1. **Missing MONGO_URI**: Server will crash on startup with connection error
2. **Missing JWT secrets**: Server will crash when trying to create/verify tokens
3. **Firebase vars partial**: If only some Firebase vars are set, initialization may fail silently
4. **FIREBASE_PRIVATE_KEY format**: Must include `\n` escape sequences, not actual newlines
5. **OPENAI_API_KEY missing**: AI Agent endpoints will return errors, but server runs fine

## File Locations

- **Environment file**: `/server/.env` (gitignored)
- **Example file**: `/server/.env.example` (committed to git)
- **Dotenv config**: `server/app.js:1-3`
- **Seed script**: `server/seedData.js:2,6` (also uses dotenv)



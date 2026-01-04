#!/bin/bash
# Script to create .env.example and .env files

cd "$(dirname "$0")"

echo "Creating .env.example..."
cat > .env.example << 'EOF'
# ============================================
# RIDE Server Environment Variables
# ============================================
# Copy this file to .env and fill in your values
# DO NOT commit .env to version control
# ============================================

# ============================================
# REQUIRED: Database Configuration
# ============================================
# MongoDB connection string
# Local: mongodb://127.0.0.1:27017/rideshare
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/rideshare?retryWrites=true&w=majority
MONGO_URI=mongodb://127.0.0.1:27017/rideshare

# ============================================
# REQUIRED: JWT Authentication
# ============================================
# Generate secrets using:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ACCESS_TOKEN_SECRET=your_access_token_secret_here_64_hex_chars
ACCESS_TOKEN_EXPIRY=4d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_64_hex_chars
REFRESH_TOKEN_EXPIRY=30d

# ============================================
# OPTIONAL: Server Configuration
# ============================================
# Server port (defaults to 3000 if not set)
PORT=3000

# ============================================
# OPTIONAL: Firebase Admin SDK
# ============================================
# Required for Firebase phone authentication
# Get these from Firebase Console → Project Settings → Service Accounts
# Download service account JSON and extract values
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
# Keep the \n escape sequences - they will be converted to actual newlines
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n

# ============================================
# OPTIONAL: OpenAI API (for AI Agent)
# ============================================
# Required for AI Agent features in admin dashboard
# Get from https://platform.openai.com/api-keys
# Format: sk-...
OPENAI_API_KEY=sk-your-openai-api-key-here
EOF

echo "Creating .env with auto-generated secrets..."
ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

cat > .env << EOF
# ============================================
# RIDE Server Environment Variables
# ============================================
# LOCAL DEVELOPMENT ONLY - DO NOT COMMIT
# ============================================

# ============================================
# REQUIRED: Database Configuration
# ============================================
MONGO_URI=mongodb://127.0.0.1:27017/rideshare

# ============================================
# REQUIRED: JWT Authentication
# ============================================
# Auto-generated secrets (64 hex characters each)
ACCESS_TOKEN_SECRET=${ACCESS_SECRET}
ACCESS_TOKEN_EXPIRY=4d
REFRESH_TOKEN_SECRET=${REFRESH_SECRET}
REFRESH_TOKEN_EXPIRY=30d

# ============================================
# OPTIONAL: Server Configuration
# ============================================
PORT=3000

# ============================================
# OPTIONAL: Firebase Admin SDK
# ============================================
# Uncomment and fill in if using Firebase authentication
# FIREBASE_PROJECT_ID=your-firebase-project-id
# FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n

# ============================================
# OPTIONAL: OpenAI API (for AI Agent)
# ============================================
# Uncomment and fill in if using AI Agent features
# OPENAI_API_KEY=sk-your-openai-api-key-here
EOF

echo "✅ Created .env.example and .env files"
echo ""
echo "Next steps:"
echo "1. Review .env and update MONGO_URI if needed"
echo "2. Add Firebase credentials if using Firebase auth"
echo "3. Add OpenAI API key if using AI Agent"
echo "4. Start server: npm start"



# Fix MongoDB Authentication

## Issue
MongoDB Atlas authentication failed with error code 8000.

## Possible Causes
1. Database user doesn't exist in MongoDB Atlas
2. Password is incorrect
3. User doesn't have permissions for the database
4. IP address not whitelisted

---

## Solution Options

### Option 1: Create/Verify Database User in MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Navigate to Database Access:**
   - Click on "Database Access" in left sidebar
   - Check if user `marvingoreedu_db_user` exists

3. **If user doesn't exist, create it:**
   - Click "Add New Database User"
   - Username: `marvingoreedu_db_user`
   - Password: `Zi4eOIpwMipRQdFe` (or create a new one)
   - Database User Privileges: Select "Read and write to any database"
   - Click "Add User"

4. **Verify Network Access:**
   - Click "Network Access" in left sidebar
   - Add your IP address or use `0.0.0.0/0` for testing (allows all IPs)
   - Click "Add IP Address" → "Allow Access from Anywhere" (for testing)

5. **Get New Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

---

### Option 2: Use Local MongoDB (Quick Testing)

If you have MongoDB installed locally:

```bash
# Start local MongoDB
brew services start mongodb-community

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

Update `.env`:
```bash
MONGO_URI=mongodb://localhost:27017/ride_app
```

---

### Option 3: Create New MongoDB Atlas User

1. Go to https://cloud.mongodb.com/
2. Navigate to your cluster
3. Click "Database Access"
4. Click "Add New Database User"
5. Create user with simple credentials:
   - Username: `rideapp_user`
   - Password: `rideapp123` (or your choice)
   - Privileges: "Atlas admin" or "Read and write to any database"
6. Update `.env` with new credentials

---

## Update Connection String

### Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Your Cluster Details:
- Cluster: `cluster0.gywqacy.mongodb.net`
- Database: `ride_app`
- Current User: `marvingoreedu_db_user`
- Current Password: `Zi4eOIpwMipRQdFe`

---

## Quick Fix Steps

1. **Go to MongoDB Atlas Database Access**
2. **Verify/Create User:** `marvingoreedu_db_user`
3. **Set Password:** (note it down)
4. **Whitelist IP:** Add `0.0.0.0/0` for testing
5. **Update `.env` file** with correct password
6. **Restart server:** `npm start`

---

## Test Connection

After fixing authentication:

```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

You should see:
```
HTTP server is running on port http://localhost:3000
```

Instead of authentication errors.

---

## Alternative: Simple Local Setup

For quick testing without MongoDB Atlas:

1. Install MongoDB locally:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

2. Update `.env`:
```
MONGO_URI=mongodb://localhost:27017/ride_app
```

3. Restart server - it will work immediately!

---

## Next Steps

Choose one option above:
- **Option 1:** Fix MongoDB Atlas credentials (best for production)
- **Option 2:** Use local MongoDB (fastest for development)
- **Option 3:** Create new Atlas user with simple credentials

After fixing, the server will start successfully and you can launch the app!


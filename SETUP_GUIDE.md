# 🚀 Platformatory Labs - Complete Setup Guide

## 📋 Quick Start (Windows)

1. **Run the setup script:**
   ```cmd
   setup.bat
   ```

2. **Get your credentials:**
   - [Google OAuth2 Setup](#google-oauth2-setup)
   - [crudcrud.com API Setup](#crudcrudcom-api-setup)

3. **Update .env file** with your credentials

4. **Start the application:**
   ```cmd
   npm start
   ```

5. **Access the app:** Open `http://localhost:3000`

---

## 🔧 Detailed Setup Instructions

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Set **Authorized redirect URIs** to: `http://localhost:3001/api/auth/google/callback`
   - Copy the **Client ID** and **Client Secret**

### 2. crudcrud.com API Setup

1. Visit [crudcrud.com](https://crudcrud.com/)
2. Click "Get your endpoint"
3. Copy the **API URL** and **API Key**

### 3. Environment Configuration

Update the `.env` file in the root directory:

```env
# Google OAuth2
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# CRUD CRUD API
CRUDCRUD_API_URL=https://crudcrud.com/api
CRUDCRUD_API_KEY=your-actual-crudcrud-api-key
```

### 4. Start the Application

#### Option A: Docker (Recommended)
```cmd
npm start
```

#### Option B: Development Mode
```cmd
npm run dev
```

### 5. Verify Installation

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/health
- **Temporal UI**: http://localhost:8233

---

## 🎯 How to Use

1. **Login**: Click "Sign in with Google"
2. **Edit Profile**: Click "Edit Profile" button
3. **Update Information**: Modify any field (First Name, Last Name, Phone, City, Pincode)
4. **Save**: Click "Save Changes"
5. **Monitor**: Watch the workflow progress

### What Happens Behind the Scenes

1. **Immediate**: Data saved to SQLite database
2. **10 seconds later**: Data sent to crudcrud.com API
3. **Real-time**: Frontend updates automatically

---

## 🐛 Troubleshooting

### Common Issues

#### OAuth Error
- ✅ Check Google OAuth credentials in `.env`
- ✅ Verify redirect URI: `http://localhost:3001/api/auth/google/callback`
- ✅ Ensure Google+ API is enabled

#### Temporal Connection Error
- ✅ Check if Temporal is running: `docker ps | grep temporal`
- ✅ Restart Temporal: `docker-compose restart temporal`

#### Database Error
- ✅ Check file permissions for `backend/data/`
- ✅ Ensure SQLite file is writable

#### CORS Error
- ✅ Verify frontend URL in backend CORS config
- ✅ Check if both frontend and backend are running

### Useful Commands

```cmd
# View logs
npm run docker:logs

# Restart services
npm run docker:restart

# Stop all services
npm run docker:down

# Rebuild containers
npm run docker:build

# Clean installation
npm run clean
npm run install:all
```

---

## 📊 Monitoring & Debugging

### Application Logs
```cmd
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f temporal
```

### Database Inspection
```cmd
# Access SQLite database
sqlite3 backend/data/app.db

# View tables
.tables

# View users
SELECT * FROM users;

# View profile updates
SELECT * FROM profile_updates;
```

### Temporal Workflows
- **Web UI**: http://localhost:8233
- **Workflow List**: View running and completed workflows
- **Activity Logs**: Monitor activity execution

---

## 🔒 Security Notes

- JWT tokens are used for API authentication
- Session secrets are configured for production
- CORS is properly configured
- Input validation is implemented
- SQL injection protection is in place

---

## 📈 Performance Tips

- **Development**: Use `npm run dev` for hot reloading
- **Production**: Use `npm start` for optimized Docker deployment
- **Database**: SQLite is used for simplicity, consider PostgreSQL for production
- **Caching**: Static assets are cached by Nginx

---

## 🎉 Success!

Once everything is running:

1. ✅ **Login works** - Google OAuth2 authentication
2. ✅ **Profile editing** - Real-time form updates
3. ✅ **Temporal workflows** - Background processing with 10s delay
4. ✅ **External API** - Data sent to crudcrud.com
5. ✅ **Modern UI** - Beautiful, responsive interface

**You're ready for the interview!** 🚀

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs: `npm run docker:logs`
3. Verify all prerequisites are installed
4. Ensure credentials are correctly configured

**Good luck with your interview!** 💪 
# Platformatory Labs Interview Task

A full-stack application demonstrating OIDC authentication, profile management, and Temporal workflows with external API integration.

## 🚀 Features

- **OIDC Authentication**: Google OAuth2 integration for secure user login
- **Profile Management**: Editable user profile with real-time updates
- **Temporal Workflows**: Orchestrated data processing with 10-second delays
- **External API Integration**: Automatic updates to crudcrud.com API
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Docker Support**: Complete containerized deployment
- **TypeScript**: Full type safety across frontend and backend

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Temporal      │
│   (React)       │◄──►│   (Express)     │◄──►│   (Workflows)   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 7233    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │   (Local)       │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**
- **Google OAuth2** credentials
- **crudcrud.com** API key

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd platformatory-labs
```

### 2. Get OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID and Client Secret

### 3. Get crudcrud.com API Key

1. Visit [crudcrud.com](https://crudcrud.com/)
2. Click "Get your endpoint"
3. Copy the API URL and key

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CRUD CRUD API
CRUDCRUD_API_URL=https://crudcrud.com/api
CRUDCRUD_API_KEY=your-crudcrud-api-key
```

### 5. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 6. Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Temporal Setup
```bash
# Option A: Docker
docker run --rm -p 7233:7233 temporalio/auto-setup:1.22.3

# Option B: Local installation
# Follow: https://learn.temporal.io/getting_started/typescript/dev_environment/
```

## 🎯 Usage

1. **Access the Application**: Open `http://localhost:3000`
2. **Login**: Click "Sign in with Google" and authenticate
3. **Edit Profile**: Click "Edit Profile" to modify your information
4. **Save Changes**: Click "Save Changes" to trigger the workflow
5. **Monitor Progress**: The app will show workflow status and automatically refresh

## 🔄 Workflow Process

1. **User Edits Profile**: Frontend sends update request
2. **Backend Receives**: Validates and starts Temporal workflow
3. **Database Update**: Profile saved to SQLite immediately
4. **10-Second Delay**: Temporal waits as specified
5. **External API**: Data sent to crudcrud.com
6. **Status Update**: Frontend polls for completion

## 📁 Project Structure

```
platformatory-labs/
├── backend/
│   ├── src/
│   │   ├── config/          # Passport OAuth configuration
│   │   ├── database/        # SQLite database setup
│   │   ├── middleware/      # Authentication middleware
│   │   ├── routes/          # API routes
│   │   ├── temporal/        # Temporal workflows & activities
│   │   └── index.ts         # Main server file
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Authentication context
│   │   ├── pages/           # Page components
│   │   └── main.tsx         # App entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🧪 Testing

### API Endpoints

- `GET /health` - Health check
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/update-status/:workflowId` - Get workflow status

### Frontend Routes

- `/` - Redirects to login or profile
- `/login` - Login page
- `/auth/callback` - OAuth callback handler
- `/profile` - Profile management page

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run build        # Build TypeScript
npm test            # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Temporal Development
```bash
# View Temporal UI
open http://localhost:8233

# Monitor workflows
temporal workflow list
```

## 🐛 Troubleshooting

### Common Issues

1. **OAuth Error**: Check Google OAuth credentials and redirect URI
2. **Temporal Connection**: Ensure Temporal server is running on port 7233
3. **Database Error**: Check SQLite file permissions in `backend/data/`
4. **CORS Error**: Verify frontend URL in backend CORS configuration

### Logs

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Temporal logs
docker-compose logs temporal
```

## 📊 Monitoring

- **Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001/health`
- **Temporal UI**: `http://localhost:8233`
- **Database**: SQLite file at `backend/data/app.db`

## 🔒 Security

- JWT tokens for API authentication
- Secure session management
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection headers

## 📈 Performance

- React with Vite for fast development
- Nginx for optimized production serving
- Database indexing for queries
- Temporal for scalable workflows
- Docker for consistent environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Platformatory Labs Interview Task

---

**Ready for Interview**: This application demonstrates advanced full-stack development skills including OIDC authentication, workflow orchestration, and modern UI/UX practices. 
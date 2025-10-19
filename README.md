# Event Management System

A full-stack web application for managing events across multiple timezones with comprehensive profile management and event logging capabilities.

## 🚀 Features

### Core Functionality
- **Event Management**: Create, edit, and delete events with start/end date-time
- **Profile Management**: Create and manage user profiles with delete functionality
- **Timezone Support**: 60+ timezones with regional grouping and search
- **Event Logs**: Comprehensive change tracking for all event modifications
- **Real-time Updates**: Live data synchronization between frontend and backend

### User Interface
- **Modern React UI**: Built with React 18, Vite, and Radix UI components
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Interactive Components**: Custom dropdowns, modals, and form controls
- **Search & Filter**: Advanced timezone and profile search capabilities
- **Visual Feedback**: Loading states, error handling, and success notifications

## 🏗️ Architecture

### Backend (Node.js/Express)
- **RESTful API**: Express.js server with MongoDB integration
- **Database**: MongoDB with Mongoose ODM
- **Models**: Event, Profile, and EventLog with proper relationships
- **Validation**: Server-side data validation and error handling
- **CORS**: Configured for cross-origin requests

### Frontend (React)
- **Framework**: React 18 with Vite build tool
- **State Management**: React hooks and TanStack Query
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router for navigation
- **Icons**: Lucide React icon library

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EventManagementSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventmanagement
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 🗄️ Database Schema

### Profile Model
```javascript
{
  name: String (required, 1-100 characters)
  timestamps: true
}
```

### Event Model
```javascript
{
  profiles: [ObjectId] (required, references Profile)
  timezone: String (required)
  startDateTime: String (required)
  endDateTime: String (required)
  timestamps: true
}
```

### EventLog Model
```javascript
{
  eventId: ObjectId (required, references Event)
  changes: [{
    field: String (required)
    oldValue: Mixed
    newValue: Mixed
  }]
  timestamp: Date (default: Date.now)
  timestamps: true
}
```

## 🔌 API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Event Logs
- `GET /api/events/:id/logs` - Get event logs
- `GET /api/logs` - Get all logs

### Health Check
- `GET /api/health` - API health status

## 🎨 Frontend Components

### Core Components
- **EventManagement**: Main application page
- **EventForm**: Create new events with profile and timezone selection
- **EventsList**: Display events with filtering and timezone conversion
- **EventCard**: Individual event display with edit/delete actions
- **EditEventModal**: Modal for editing existing events
- **EventLogsModal**: Display event change history

### UI Components
- **ProfileSelector**: Profile selection with search and delete functionality
- **TimezoneSelector**: Timezone selection with 60+ options and regional grouping
- **MultiSelect**: Multi-profile selection component
- **DateTimePicker**: Date and time input components

## 🌍 Timezone Support

The application supports 60+ timezones organized by region:

- **North America**: US, Canada, Mexico timezones
- **Europe**: Major European cities and timezones
- **Asia**: Asian countries and major cities
- **Australia & Oceania**: Australian and Pacific timezones
- **Africa**: Major African cities
- **South America**: South American timezones

Features:
- Regional grouping for easy navigation
- Search functionality across timezone names and cities
- Consistent timezone display format
- Automatic timezone conversion for event display

## 📱 Usage

### Creating Events
1. Select or create a profile
2. Choose a timezone
3. Set start and end date/time
4. Click "Create Event"

### Managing Profiles
1. Use the profile selector dropdown
2. Add new profiles with "Add Profile"
3. Delete profiles by hovering and clicking the delete icon
4. Search profiles by name

### Viewing Event Logs
1. Click "View Logs" on any event
2. See complete change history
3. Track field modifications with old/new values

## 🚀 Development

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Project Structure
```
EventManagementSystem/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── models/         # Mongoose data models
│   │   ├── routes/         # Express route definitions
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Database configuration
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Frontend
- API base URL: `http://localhost:3000/api`
- Development server: `http://localhost:5173`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify connection string in `.env`
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user permissions

2. **CORS Errors**
   - Verify `CORS_ORIGIN` matches frontend URL
   - Check backend is running on correct port

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

### Debug Mode
- Backend logs all API requests
- Frontend shows detailed error messages
- Browser console displays API communication


# Event Management System - Backend API

A Node.js/Express backend API for the Event Management System with MongoDB integration.

## Features

- **Profiles Management**: Create, read, update, and delete user profiles
- **Events Management**: Full CRUD operations for events with timezone support
- **Event Logs**: Automatic change tracking and history for all event updates
- **MongoDB Integration**: Cloud database with Mongoose ODM
- **RESTful API**: Clean, consistent API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Configured for frontend development

## Tech Stack

- **Node.js** with Express.js
- **MongoDB Atlas** (cloud database)
- **Mongoose** (ODM for MongoDB)
- **CORS** for cross-origin requests
- **dotenv** for environment variables

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventmanagement
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGODB_URI` in `.env`

### 4. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### Profiles
- **GET** `/api/profiles` - Get all profiles
- **POST** `/api/profiles` - Create a new profile
- **GET** `/api/profiles/:id` - Get a single profile
- **PUT** `/api/profiles/:id` - Update a profile
- **DELETE** `/api/profiles/:id` - Delete a profile

### Events
- **GET** `/api/events` - Get all events (optional: `?profileId=<id>`)
- **POST** `/api/events` - Create a new event
- **GET** `/api/events/:id` - Get a single event
- **PUT** `/api/events/:id` - Update an event (creates log entry)
- **DELETE** `/api/events/:id` - Delete an event

### Event Logs
- **GET** `/api/events/:id/logs` - Get change history for an event
- **GET** `/api/logs` - Get all event logs

## Database Schema

### Profile
```javascript
{
  _id: ObjectId,
  name: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Event
```javascript
{
  _id: ObjectId,
  profiles: [ObjectId] (ref: Profile),
  timezone: String,
  startDateTime: String,
  endDateTime: String,
  createdAt: Date,
  updatedAt: Date
}
```

### EventLog
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Event),
  changes: [{
    field: String,
    oldValue: Mixed,
    newValue: Mixed
  }],
  timestamp: Date
}
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── index.js              # Server entry point
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── Profile.js        # Profile schema
│   │   ├── Event.js          # Event schema
│   │   └── EventLog.js       # EventLog schema
│   ├── routes/
│   │   ├── profiles.js       # Profile routes
│   │   ├── events.js         # Event routes
│   │   └── logs.js           # Event logs routes
│   ├── controllers/
│   │   ├── profileController.js
│   │   ├── eventController.js
│   │   └── logController.js
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   └── utils/
│       └── validation.js     # Validation helpers
├── .env                      # Environment variables
├── .env.example             # Environment template
└── package.json
```

## Testing the API

You can test the API using tools like Postman, curl, or the frontend application.

### Example: Create a Profile
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

### Example: Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "profiles": ["<profile_id>"],
    "timezone": "America/New_York",
    "startDateTime": "2024-01-15T09:00",
    "endDateTime": "2024-01-15T11:00"
  }'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted
   - Ensure the database user has proper permissions

2. **CORS Errors**
   - Verify the `CORS_ORIGIN` in `.env` matches your frontend URL
   - Default is `http://localhost:5173` for Vite development server

3. **Port Already in Use**
   - Change the `PORT` in `.env` to a different port
   - Or kill the process using the port: `lsof -ti:3000 | xargs kill -9`

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB Atlas cluster
3. Configure proper CORS origins for your domain
4. Use a process manager like PM2 for production
5. Set up proper logging and monitoring

## License

ISC

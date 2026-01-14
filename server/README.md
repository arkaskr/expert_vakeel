# Legal Backend API

A comprehensive backend API for a legal services platform built with Express.js, Firestore, and JWT authentication.

## Overview

This project provides a full-featured backend for legal services including:
- **Client Management**: Registration, authentication, and profile management
- **User Management**: Admin user operations
- **News Management**: Legal news and updates
- **Query Management**: Client inquiries and legal questions
- **Support System**: Customer support tickets
- **Authentication**: JWT-based authentication with cookie support
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack

- **Express.js** - Web framework g
- **Firebase Firestore** - NoSQL database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - HTTP cookie handling
- **swagger-ui-express** - API documentation UI
- **swagger-jsdoc** - OpenAPI specification

## API Documentation

The API includes comprehensive interactive documentation powered by Swagger/OpenAPI.

### Access Documentation
- **Local Development**: Visit `http://localhost:4000/api-docs`
- **Production**: Visit `https://your-app.vercel.app/api-docs`

### Features
- ✅ **Interactive API Testing**: Test endpoints directly from the documentation
- ✅ **Authentication Support**: Try authenticated endpoints with JWT tokens
- ✅ **Request/Response Examples**: Complete JSON schemas and examples
- ✅ **Error Documentation**: All error responses documented
- ✅ **Complete API Coverage**: Client, User, News, and Query endpoints fully documented

## Setup

1. **Clone or create the project folder and copy the provided files.**

2. **Firebase Setup:**
   - Create a Firebase project
   - Generate a Service Account JSON (Firebase Console → Project Settings → Service accounts → Generate new private key)
   - Save it as `firebase-service-account.json` in project root (or set `FIREBASE_SERVICE_ACCOUNT_PATH`)

3. **Environment Configuration:**
   - Create `.env` from `.env.example`
   - Configure the following variables:
     ```
     PORT=4000
     JWT_SECRET=your_jwt_secret_here
     JWT_EXPIRES_IN=7d
     NODE_ENV=development
     FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
     ```

4. **Install Dependencies:**
   ```bash
   npm install
   ```

5. **Start Development Server:**
   ```bash
   npm run dev  # Starts with nodemon for auto-reload
   # or
   npm start    # Production start
   ```

## API Documentation

The API runs on `http://localhost:4000` by default. All endpoints return JSON responses.

---

## 🔐 Authentication Routes (`/api/auth`)

### POST `/api/auth/register`
Register a new client account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "string (min 6 chars)"
}
```

**Response (201):**
```json
{
  "client": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "client"
  },
  "token": "jwt_token_string"
}
```

**Error Responses:**
- `400`: Missing required fields or invalid data
- `400`: Client already exists

---

### POST `/api/auth/login`
Authenticate a client and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "client": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "client"
  },
  "token": "jwt_token_string"
}
```

**Error Responses:**
- `400`: Missing email or password
- `400`: Invalid credentials

---

### GET `/api/auth/me`
Get current authenticated client's profile information.

**Authentication:** Required (JWT token in Authorization header or cookie)

**Response (200):**
```json
{
  "client": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "fullName": "string",
    "phone": "string",
    "role": "client"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing token)

---

## 👥 Client Routes (`/api/clients`)

### POST `/api/clients`
Register a new client (alternative to `/api/auth/register`).

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string (optional)",
  "password": "string (min 6 chars)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `400`: Missing required fields or invalid password
- `409`: Email already in use

---

### POST `/api/clients/login`
Authenticate a client (alternative to `/api/auth/login`).

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials

---

### POST `/api/clients/logout`
Logout current client by clearing JWT cookie.

**Authentication:** Required (valid JWT token)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/clients/me`
Get current authenticated client's profile information.

**Authentication:** Required (JWT token in Authorization header or cookie)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "fullName": "string",
    "phone": "string",
    "role": "client"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing token)

---

### GET `/api/clients`
Get all clients (admin operation).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/clients/:id`
Get a specific client by ID.

**Parameters:**
- `id`: Client ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: Client not found

---

### PUT `/api/clients/:id`
Update client information.

**Parameters:**
- `id`: Client ID (string)

**Request Body (all fields optional):**
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "password": "string (min 6 chars, will be re-hashed)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: Client not found
- `409`: Email already in use

---

### DELETE `/api/clients/:id`
Delete a specific client.

**Parameters:**
- `id`: Client ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "deleted_client_id"
  }
}
```

**Error Responses:**
- `404`: Client not found

---

### DELETE `/api/clients`
Delete all clients (dangerous operation).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 42
  }
}
```

---

## 👤 User Routes (`/api/users`)

### POST `/api/users`
Create a new user (admin operation).

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string (optional, default: 'user')"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "timestamp"
  }
}
```

---

### GET `/api/users`
Get all users.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "createdAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/users/:id`
Get a specific user by ID.

**Parameters:**
- `id`: User ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: User not found

---

### PUT `/api/users/:id`
Update user information.

**Parameters:**
- `id`: User ID (string)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "updatedAt": "timestamp"
  }
}
```

---

### DELETE `/api/users/:id`
Delete a specific user.

**Parameters:**
- `id`: User ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "deleted_user_id"
  }
}
```

---

### DELETE `/api/users`
Delete all users (dangerous operation).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 10
  }
}
```

---

## 📰 News Routes (`/api/news`)

### POST `/api/news`
Create a new news article.

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "author": "string",
  "category": "string (optional)",
  "tags": ["array", "of", "strings"],
  "published": "boolean (optional, default: false)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "author": "string",
    "category": "string",
    "tags": ["array"],
    "published": false,
    "views": 0,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### GET `/api/news`
Get all news articles.

**Query Parameters:**
- `published`: `true` or `false` to filter by publication status
- `category`: Filter by category
- `limit`: Number of results to return
- `offset`: Number of results to skip

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "author": "string",
      "category": "string",
      "tags": ["array"],
      "published": false,
      "views": 0,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/news/:id`
Get a specific news article by ID.

**Parameters:**
- `id`: News article ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "author": "string",
    "category": "string",
    "tags": ["array"],
    "published": false,
    "views": 0,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: News article not found

---

### PUT `/api/news/:id`
Update a news article.

**Parameters:**
- `id`: News article ID (string)

**Request Body (all fields optional):**
```json
{
  "title": "string",
  "content": "string",
  "author": "string",
  "category": "string",
  "tags": ["array"],
  "published": "boolean"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "author": "string",
    "category": "string",
    "tags": ["array"],
    "published": false,
    "views": 0,
    "updatedAt": "timestamp"
  }
}
```

---

### DELETE `/api/news/:id`
Delete a news article.

**Parameters:**
- `id`: News article ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "deleted_news_id"
  }
}
```

---

### DELETE `/api/news`
Delete all news articles (dangerous operation).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 25
  }
}
```

---

### POST `/api/news/:id/views/increment`
Increment view count for a news article.

**Parameters:**
- `id`: News article ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "views": 42
  }
}
```

---

## ❓ Query Routes (`/api/queries`)

### POST `/api/queries`
Submit a new legal query.

**Request Body:**
```json
{
  "userId": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "string (optional: 'low', 'medium', 'high')",
  "status": "string (optional: 'open', 'in_progress', 'resolved', 'closed')"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "low",
    "status": "open",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### GET `/api/queries`
Get all queries.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "priority": "string",
      "status": "string",
      "responses": ["array of responses"],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/queries/user/:userId`
Get all queries for a specific user.

**Parameters:**
- `userId`: User ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "priority": "string",
      "status": "string",
      "responses": ["array"],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/queries/:id`
Get a specific query by ID.

**Parameters:**
- `id`: Query ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "string",
    "status": "string",
    "responses": ["array"],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: Query not found

---

### PUT `/api/queries/:id`
Update a query.

**Parameters:**
- `id`: Query ID (string)

**Request Body (all fields optional):**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "string",
  "status": "string",
  "responses": ["array"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "string",
    "status": "string",
    "responses": ["array"],
    "updatedAt": "timestamp"
  }
}
```

---

### DELETE `/api/queries/:id`
Delete a specific query.

**Parameters:**
- `id`: Query ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "deleted_query_id"
  }
}
```

---

### DELETE `/api/queries`
Delete all queries (dangerous operation).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deleted": 15
  }
}
```

---

## 🆘 Support Routes (`/api/support`)

### POST `/api/support`
Submit a new support request.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "priority": "string (optional: 'low', 'medium', 'high')",
  "category": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "priority": "low",
    "category": "string",
    "status": "open",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### GET `/api/support`
Get all support requests.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "subject": "string",
      "message": "string",
      "priority": "string",
      "category": "string",
      "status": "string",
      "responses": ["array"],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### GET `/api/support/:id`
Get a specific support request by ID.

**Parameters:**
- `id`: Support request ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "priority": "string",
    "category": "string",
    "status": "string",
    "responses": ["array"],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `404`: Support request not found

---

### PUT `/api/support/:id`
Update a support request.

**Parameters:**
- `id`: Support request ID (string)

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "priority": "string",
  "category": "string",
  "status": "string",
  "responses": ["array"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "priority": "string",
    "category": "string",
    "status": "string",
    "responses": ["array"],
    "updatedAt": "timestamp"
  }
}
```

---

### DELETE `/api/support/:id`
Delete a support request.

**Parameters:**
- `id`: Support request ID (string)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "deleted_support_id"
  }
}
```

---

## 🔧 General Routes

### GET `/`
Get API information and available endpoints.

**Response (200):**
```json
{
  "message": "Legal Backend API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "support": "/api/support",
    "queries": "/api/queries",
    "news": "/api/news",
    "protected": "/api/protected"
  }
}
```

---

### GET `/api/protected`
Test protected route (requires authentication).

**Authentication:** Required (JWT token)

**Response (200):**
```json
{
  "message": "Unprotected endpoint — use /api/auth/me for protected info."
}
```

---

## 🔒 Authentication

The API supports two authentication methods:

### 1. JWT in Authorization Header
```
Authorization: Bearer <jwt_token>
```

### 2. JWT in HttpOnly Cookie
The API automatically sets an `httpOnly` cookie named `token` upon successful login/registration.

**Cookie Options:**
- `httpOnly`: `true` (prevents client-side JavaScript access)
- `secure`: `true` in production
- `sameSite`: `strict`
- `maxAge`: 7 days

## 📝 Error Handling

All endpoints follow a consistent error response format:

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## 🧪 Testing the API

You can test the API using tools like Postman, curl, or any HTTP client:

### Example: Register a Client
```bash
curl -X POST http://localhost:4000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:4000/api/clients/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
Legal_backend/
├── src/
│   ├── app.js                 # Main application file
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── clientcontroller.js
│   │   ├── userController.js
│   │   ├── newsPostcontroller.js
│   │   ├── queryController.js
│   │   └── supportController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/                # Data models
│   │   ├── clientModel.js
│   │   ├── userModel.js
│   │   ├── newsPost.model.js
│   │   ├── query.js
│   │   ├── supportModel.js
│   └── routes/                # Route definitions
│       ├── authRoutes.js
│       ├── clientRoutes.js
│       ├── userRoutes.js
│       ├── newsRoutes.js
│       ├── queryRoutes.js
│       └── supportRoutes.js
├── package.json
├── firebase-service-account.json
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Deployment to Vercel

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Firebase Project**: Set up your Firebase project and service account

### Deployment Steps

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy to Vercel
```bash
cd Legal_backend
vercel --prod
```

#### 4. Configure Environment Variables
In your Vercel dashboard or using CLI, set these environment variables:

```bash
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Firebase Configuration (Required for Vercel)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Optional
NODE_ENV=production
PORT=4000
```

**Important**: The `FIREBASE_SERVICE_ACCOUNT_KEY` should contain the entire JSON content of your Firebase service account key file as a string.

#### 5. Alternative: Deploy via GitHub
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Vercel Configuration

The `vercel.json` file is configured with:
- **Node.js Runtime**: Express app runs on Vercel's Node.js runtime
- **Routes**: All requests routed to Express app
- **Environment**: Production environment settings

### Testing Deployment

After deployment, test your API endpoints:
```bash
# Get API info
curl https://your-app.vercel.app/

# View API documentation
# Visit: https://your-app.vercel.app/api-docs

# Test client registration
curl -X POST https://your-app.vercel.app/api/clients \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

### Troubleshooting

**Common Issues:**
- **Firebase Connection**: Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- **Cold Starts**: Initial requests may be slower due to serverless nature
- **Timeout Limits**: Requests must complete within Vercel's timeout limits
- **CORS Issues**: CORS is configured for all origins in development

**Logs**: Check Vercel function logs in the dashboard for debugging.

---

## 📄 License

This project is licensed under the ISC License. 

 

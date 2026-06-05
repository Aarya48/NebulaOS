# NebulaOS Backend Documentation

## Project Overview

**NebulaOS Backend** is a Node.js/Express-based REST API server designed to manage user authentication, file storage, and folder management. It provides a cloud-like file system where users can create, organize, and manage their files and folders with JWT-based authentication.

### Main Features

- **User Authentication**: Secure registration and login with JWT tokens
- **File Management**: Create and manage files with content storage
- **Folder Management**: Organize files in hierarchical folder structures
- **User Personalization**: Store user preferences (wallpaper, theme)
- **Secure Access**: JWT-based authorization middleware for protected routes
- **MongoDB Integration**: Persistent data storage with Mongoose ORM

### Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| **Express.js** | REST API framework |
| **Node.js** | JavaScript runtime |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM (Object Data Modeling) |
| **JWT (jsonwebtoken)** | Authentication token generation and verification |
| **bcryptjs** | Password hashing and encryption |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |

---

## Project Structure

### Directory Layout

```
BE/
├── config/              # Configuration files
│   └── db.js           # MongoDB connection setup
├── controllers/         # Business logic for routes
│   ├── authController.js      # User registration & login logic
│   ├── fileController.js      # File & folder operations
│   └── windowController.js    # Reserved for window management (empty)
├── middleware/          # Express middleware
│   └── authMiddleware.js      # JWT authentication verification
├── models/              # Mongoose database schemas
│   ├── User.js         # User data model
│   ├── File.js         # File/Folder data model
│   └── Window.js       # Reserved for window management (empty)
├── routes/              # API route definitions
│   ├── authRoutes.js   # Authentication endpoints
│   ├── fileRoutes.js   # File & folder management endpoints
│   └── windowRoutes.js # Reserved for window management (empty)
├── utils/               # Utility functions (empty)
├── .env                 # Environment variables (not in version control)
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and metadata
└── server.js           # Main application entry point
```

### Folder Descriptions

| Folder | Purpose |
| ------ | ------- |
| **config/** | Database connection and configuration setup |
| **controllers/** | Contains business logic for each feature; processes requests from routes |
| **middleware/** | Custom middleware functions like authentication verification |
| **models/** | Mongoose schemas defining database document structure |
| **routes/** | API route definitions mapping HTTP requests to controllers |
| **utils/** | Reusable utility functions (currently empty, available for helpers) |

---

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas cloud account)
- **Git**

### Step 1: Clone or Navigate to Project

```bash
cd BE
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Step 3: Configure Environment Variables

Create a `.env` file in the `BE` folder with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this
```

**Important**: Never commit `.env` to version control. Use `.env.example` for template sharing.

### Step 4: Running Locally

#### Development Mode

```bash
node server.js
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

Expected output:
```
MongoDB connected
Server running on port 5000
```

#### Verify Server

Open your browser and navigate to:
```
http://localhost:5000/
```

Expected response:
```
Backend Running
```

### Production Deployment Steps

1. **Environment Setup**
   - Set `NODE_ENV=production` in environment
   - Use a production-grade MongoDB instance (MongoDB Atlas recommended)
   - Use a strong JWT_SECRET (minimum 32 characters)

2. **Process Manager** (recommended: PM2)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "nebulaos-backend"
   pm2 save
   ```

3. **Reverse Proxy** (nginx recommended)
   - Configure nginx to proxy requests to Node.js
   - Enable HTTPS/SSL certificates
   - Set up rate limiting and security headers

4. **Monitoring**
   ```bash
   pm2 monit
   ```

5. **Logging**
   - Consider using Winston or Morgan for structured logging
   - Set up centralized log collection

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. User Registration

**Method:** `POST`

**Route:**
```http
POST /api/auth/register
```

**Description:**
Creates a new user account with username, email, and password. Password is hashed using bcryptjs before storage. Validates that username and email are unique in the database.

**Authentication Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Parameters:** None

**Query Parameters:** None

**Request Body Schema:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `username` | String | Yes | Non-empty, unique | Unique identifier for user login |
| `email` | String | Yes | Valid email format, unique | Primary contact and login method |
| `password` | String | Yes | Non-empty, minimum 6 characters recommended | Hashed for security storage |

**Success Response:**

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful operation (true) |
| `message` | String | Confirmation message |

**Status Code:** `201 Created`

**Error Responses:**

### Error 1: Missing Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "All fields are required"
}
```

**When it occurs:** If any of `username`, `email`, or `password` are missing or empty.

### Error 2: User Already Exists

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "User already exists"
}
```

**When it occurs:** If email or username already exists in database.

### Error 3: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database connection issues, validation errors, or other server-side failures.

---

### 2. User Login

**Method:** `POST`

**Route:**
```http
POST /api/auth/login
```

**Description:**
Authenticates a user by verifying email and password. Returns a JWT token valid for 7 days if credentials are correct. Token must be used for accessing protected routes.

**Authentication Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Parameters:** None

**Query Parameters:** None

**Request Body Schema:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `email` | String | Yes | Valid email format | Registered user email |
| `password` | String | Yes | Non-empty | User's password |

**Success Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful authentication |
| `message` | String | Login confirmation message |
| `token` | String | JWT token valid for 7 days; use in Authorization header |

**Status Code:** `200 OK`

**Token Usage:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Error Responses:**

### Error 1: Missing Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "All fields are required"
}
```

**When it occurs:** If `email` or `password` are missing or empty.

### Error 2: Invalid Credentials

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**When it occurs:** 
- Email not found in database
- Password does not match stored hash

### Error 3: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database issues or bcrypt comparison errors.

---

## File Management Endpoints

### 3. Create Folder

**Method:** `POST`

**Route:**
```http
POST /api/files/folder/create
```

**Description:**
Creates a new folder for the authenticated user. Can be a top-level folder or nested within another folder using `parentFolder` ID. Folders are used to organize files hierarchically.

**Authentication Required:** Yes

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:** None

**Query Parameters:** None

**Request Body Schema:**

```json
{
  "name": "My Documents",
  "parentFolder": null
}
```

Or for nested folders:

```json
{
  "name": "Q1 Reports",
  "parentFolder": "507f1f77bcf86cd799439011"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `name` | String | Yes | Non-empty string | Folder name displayed to user |
| `parentFolder` | ObjectId or null | No | Valid MongoDB ObjectId | Parent folder ID for nesting; null creates root-level folder |

**Success Response:**

```json
{
  "success": true,
  "message": "Folder created successfully",
  "folder": {
    "_id": "507f1f77bcf86cd799439011",
    "owner": "507f1f77bcf86cd799439012",
    "name": "My Documents",
    "type": "folder",
    "parentFolder": null,
    "createdAt": "2024-06-05T10:30:00.000Z",
    "updatedAt": "2024-06-05T10:30:00.000Z",
    "__v": 0
  }
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful folder creation |
| `message` | String | Confirmation message |
| `folder` | Object | Complete folder document |
| `folder._id` | ObjectId | Unique identifier for the folder |
| `folder.owner` | ObjectId | User ID who owns this folder |
| `folder.name` | String | Folder name |
| `folder.type` | String | Always "folder" |
| `folder.parentFolder` | ObjectId or null | Parent folder ID or null for root |
| `folder.createdAt` | DateTime | Timestamp of creation |
| `folder.updatedAt` | DateTime | Timestamp of last update |

**Status Code:** `201 Created`

**Error Responses:**

### Error 1: Missing Folder Name

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Folder name is required"
}
```

**When it occurs:** If `name` field is missing or empty.

### Error 2: No Authentication Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "No token provided"
}
```

**When it occurs:** If Authorization header is missing or invalid.

### Error 3: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If JWT token is expired, malformed, or signed with wrong secret.

### Error 4: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database connection issues or validation errors.

---

### 4. Create File

**Method:** `POST`

**Route:**
```http
POST /api/files/file/create
```

**Description:**
Creates a new file for the authenticated user. Files can contain text content and can be organized within folders. Supports hierarchical file organization through `parentFolder`.

**Authentication Required:** Yes

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:** None

**Query Parameters:** None

**Request Body Schema:**

```json
{
  "name": "document.txt",
  "content": "This is file content",
  "parentFolder": null
}
```

Or without content:

```json
{
  "name": "notes.md",
  "parentFolder": "507f1f77bcf86cd799439011"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `name` | String | Yes | Non-empty string | File name including extension |
| `content` | String | No | Any text | File content/body; defaults to empty string |
| `parentFolder` | ObjectId or null | No | Valid MongoDB ObjectId | Parent folder ID; null creates in root |

**Success Response:**

```json
{
  "success": true,
  "message": "File created successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439013",
    "owner": "507f1f77bcf86cd799439012",
    "name": "document.txt",
    "type": "file",
    "content": "This is file content",
    "parentFolder": null,
    "createdAt": "2024-06-05T10:35:00.000Z",
    "updatedAt": "2024-06-05T10:35:00.000Z",
    "__v": 0
  }
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful file creation |
| `message` | String | Confirmation message |
| `file` | Object | Complete file document |
| `file._id` | ObjectId | Unique identifier for the file |
| `file.owner` | ObjectId | User ID who owns this file |
| `file.name` | String | File name with extension |
| `file.type` | String | Always "file" |
| `file.content` | String | File content/body |
| `file.parentFolder` | ObjectId or null | Parent folder ID or null for root |
| `file.createdAt` | DateTime | Timestamp of creation |
| `file.updatedAt` | DateTime | Timestamp of last update |

**Status Code:** `201 Created`

**Error Responses:**

### Error 1: Missing File Name

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "File name is required"
}
```

**When it occurs:** If `name` field is missing or empty.

### Error 2: No Authentication Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "No token provided"
}
```

**When it occurs:** If Authorization header is missing.

### Error 3: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If JWT token is expired or invalid.

### Error 4: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database issues or validation errors.

---

### 5. Rename File or Folder

**Method:** `PUT`

**Route:**
```http
PUT /api/files/:id
```

**Description:**
Renames an existing file or folder owned by the authenticated user. The endpoint verifies ownership and updates the item name.

**Authentication Required:** Yes

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `id` (path parameter): The ID of the file or folder to rename.

**Query Parameters:** None

**Request Body Schema:**

```json
{
  "name": "new-name.txt"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `name` | String | Yes | Non-empty string | New name for the file or folder |

**Success Response:**

```json
{
  "success": true,
  "message": "File renamed successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439013",
    "owner": "507f1f77bcf86cd799439012",
    "name": "new-name.txt",
    "type": "file",
    "content": "This is file content",
    "parentFolder": null,
    "createdAt": "2024-06-05T10:35:00.000Z",
    "updatedAt": "2024-06-05T10:40:00.000Z",
    "__v": 0
  }
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful rename |
| `message` | String | Confirmation message |
| `file` | Object | Updated file or folder document |

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Item Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "file not found"
}
```

**When it occurs:** If the provided `id` does not match any file or folder.

### Error 2: Missing Name

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Name is required"
}
```

**When it occurs:** If the request body does not include `name`.

### Error 3: Unauthorized

**Status Code:** `403 Forbidden`

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**When it occurs:** If the authenticated user does not own the target file or folder.

### Error 4: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If the JWT token is invalid or expired.

### Error 5: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database issues or validation errors.

---

### 6. Delete File or Folder

**Method:** `DELETE`

**Route:**
```http
DELETE /api/files/:id
```

**Description:**
Deletes a file or folder owned by the authenticated user. If the target item is a folder, all nested files and subfolders are deleted recursively.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `id` (path parameter): The ID of the file or folder to delete.

**Query Parameters:** None

**Request Body:** None

**Success Response:**

```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful deletion |
| `message` | String | Confirmation message |

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Item Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "File not found"
}
```

**When it occurs:** If the provided `id` does not match any file or folder.

### Error 2: Unauthorized

**Status Code:** `403 Forbidden`

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**When it occurs:** If the authenticated user does not own the target file or folder.

### Error 3: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If the JWT token is invalid or expired.

### Error 4: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database issues or validation errors.

---

### 7. Get All Files and Folders

**Method:** `GET`

**Route:**
```http
GET /api/files/
```

**Description:**
Retrieves all files and folders belonging to the authenticated user. Returns both files and folders in a single response with metadata. This endpoint uses pagination implicitly through returned count.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:** None

**Query Parameters:** None

**Request Body:** None

**Success Response:**

```json
{
  "success": true,
  "count": 5,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "owner": "507f1f77bcf86cd799439012",
      "name": "My Documents",
      "type": "folder",
      "content": "",
      "parentFolder": null,
      "createdAt": "2024-06-05T10:30:00.000Z",
      "updatedAt": "2024-06-05T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "owner": "507f1f77bcf86cd799439012",
      "name": "document.txt",
      "type": "file",
      "content": "This is file content",
      "parentFolder": null,
      "createdAt": "2024-06-05T10:35:00.000Z",
      "updatedAt": "2024-06-05T10:35:00.000Z",
      "__v": 0
    }
  ]
}
```

**Response Field Descriptions:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | Boolean | Indicates successful retrieval |
| `count` | Number | Total number of files and folders |
| `files` | Array | Array of file and folder objects |
| `files[].type` | String | "file" or "folder" |
| `files[].parentFolder` | ObjectId or null | Indicates hierarchy |

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: No Authentication Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "No token provided"
}
```

**When it occurs:** If Authorization header is missing.

### Error 2: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If JWT token is expired or invalid.

### Error 3: Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<error details>"
}
```

**When it occurs:** Database connection issues.

---

### 8. Get Folder Content

**Method:** `GET`

**Route:**
```http
GET /api/files/folder/:folderId
```

**Description:**
Retrieves all files and folders inside a specific folder for the authenticated user.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `folderId` (path parameter): The ID of the parent folder.

**Query Parameters:** None

**Request Body:** None

**Success Response:**

```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "owner": "507f1f77bcf86cd799439012",
      "name": "Q1 Reports",
      "type": "folder",
      "content": "",
      "parentFolder": "507f1f77bcf86cd799439011",
      "createdAt": "2024-06-05T10:31:00.000Z",
      "updatedAt": "2024-06-05T10:31:00.000Z"
    }
  ]
}
```

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Invalid Folder ID

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "File not found"
}
```

**When it occurs:** Folder with the provided `folderId` does not exist.

### Error 2: Invalid Token

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**When it occurs:** If the JWT token is invalid or expired.

---

### 9. Move File or Folder

**Method:** `PUT`

**Route:**
```http
PUT /api/files/move/:id
```

**Description:**
Moves a file or folder into a different parent folder, or to the root if `parentFolder` is null.

**Authentication Required:** Yes

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `id` (path parameter): The ID of the file or folder to move.

**Request Body Schema:**

```json
{
  "parentFolder": "507f1f77bcf86cd799439011"
}
```

**Field Descriptions:**

| Field | Type | Required | Validation | Purpose |
| ----- | ---- | -------- | ---------- | ------- |
| `parentFolder` | ObjectId or null | No | Valid MongoDB ObjectId | Destination folder ID; null moves item to root |

**Success Response:**

```json
{
  "success": true,
  "message": "File moved successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439013",
    "owner": "507f1f77bcf86cd799439012",
    "name": "document.txt",
    "type": "file",
    "content": "This is file content",
    "parentFolder": "507f1f77bcf86cd799439011",
    "createdAt": "2024-06-05T10:35:00.000Z",
    "updatedAt": "2024-06-05T10:40:00.000Z"
  }
}
```

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Destination Folder Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Destination folder not found"
}
```

### Error 2: Destination Must Be Folder

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Destination must be a folder"
}
```

---

### 10. Search Files and Folders

**Method:** `GET`

**Route:**
```http
GET /api/files/search?q=<search-term>
```

**Description:**
Searches the authenticated user's files and folders by name.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `q`: Search string to match against file and folder names.

**Success Response:**

```json
{
  "success": true,
  "count": 1,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "document.txt",
      "type": "file",
      "parentFolder": null
    }
  ]
}
```

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Search Query Required

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Search query is required"
}
```

---

### 11. Toggle Favorite

**Method:** `PUT`

**Route:**
```http
PUT /api/files/favorite/:id
```

**Description:**
Marks a file or folder as favorite, or removes it from favorites if already favorited.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `id` (path parameter): The ID of the file or folder to toggle favorite status.

**Success Response:**

```json
{
  "success": true,
  "message": "File marked as favorite",
  "file": { ... }
}
```

**Status Code:** `200 OK`

**Error Responses:**

### Error 1: Item Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "file not found"
}
```

---

### 12. Get Favorites

**Method:** `GET`

**Route:**
```http
GET /api/files/favorite
```

**Description:**
Retrieves all favorite files and folders for the authenticated user.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**

```json
{
  "success": true,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "document.txt",
      "type": "file",
      "isFavorite": true
    }
  ]
}
```

**Status Code:** `200 OK`

---

### 13. Open File

**Method:** `PUT`

**Route:**
```http
PUT /api/files/open/:id
```

**Description:**
Marks a file as opened and updates its `lastOpened` timestamp.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Parameters:**
- `id` (path parameter): The ID of the file to open.

**Success Response:**

```json
{
  "success": true,
  "message": "File opened successfully",
  "file": { ... }
}
```

**Status Code:** `200 OK`

---

### 14. Get Recent Files

**Method:** `GET`

**Route:**
```http
GET /api/files/recent
```

**Description:**
Retrieves the most recently opened files for the authenticated user.

**Authentication Required:** Yes

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response:**

```json
{
  "success": true,
  "count": 3,
  "files": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "document.txt",
      "type": "file",
      "lastOpened": "2024-06-05T10:40:00.000Z"
    }
  ]
}
```

**Status Code:** `200 OK`

---

## Database Models

### User Model

**Purpose:** Stores user account information, authentication credentials, and user preferences.

**Collection:** `users`

**Schema:**

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  wallpaper: String (default: "/wallpapers/default.jpg"),
  theme: String (default: "light"),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

**Field Details:**

| Field | Type | Required | Unique | Validation | Constraints | Purpose |
| ----- | ---- | -------- | ------ | ---------- | ----------- | ------- |
| `_id` | ObjectId | Yes | - | Auto-generated | Primary key | Unique user identifier |
| `username` | String | Yes | Yes | Non-empty | Max 255 chars | Display name, login identifier |
| `email` | String | Yes | Yes | Valid email format | Max 255 chars | Primary email for contact |
| `password` | String | Yes | - | Hashed with bcrypt | Min 60 chars (hash) | Secure password storage |
| `wallpaper` | String | No | - | File path | Default provided | Desktop background image path |
| `theme` | String | No | - | "light" or "dark" | Default "light" | UI theme preference |
| `createdAt` | DateTime | Yes | - | Auto-generated | UTC timezone | Account creation timestamp |
| `updatedAt` | DateTime | Yes | - | Auto-generated | UTC timezone | Last account modification |

**Relationships:**
- Has many: File (via File.owner)

**Indexes:**
- `username` (unique)
- `email` (unique)

**Example Document:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
  "wallpaper": "/wallpapers/default.jpg",
  "theme": "light",
  "createdAt": ISODate("2024-06-05T10:00:00.000Z"),
  "updatedAt": ISODate("2024-06-05T10:00:00.000Z")
}
```

---

### File Model

**Purpose:** Represents both files and folders in the hierarchical file system. Stores file metadata, content, and ownership.

**Collection:** `files`

**Schema:**

```javascript
{
  owner: ObjectId (ref: User, required),
  name: String (required),
  type: String (enum: ["file", "folder"], required),
  content: String (default: ""),
  parentFolder: ObjectId (ref: File, nullable),
  isFavorite: Boolean (default: false),
  isDeleted: Boolean (default: false),
  lastOpened: Date (nullable),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

**Field Details:**

| Field | Type | Required | Reference | Validation | Constraints | Purpose |
| ----- | ---- | -------- | ---------- | ---------- | ----------- | ------- |
| `_id` | ObjectId | Yes | - | Auto-generated | Primary key | Unique file/folder identifier |
| `owner` | ObjectId | Yes | User._id | Valid user ID | Not null | Who owns this file/folder |
| `name` | String | Yes | - | Non-empty | Max 255 chars | File/folder display name |
| `type` | String | Yes | - | "file" or "folder" | Enum validation | Distinguishes file from folder |
| `content` | String | No | - | Any text | Max 10MB | File content/body; empty for folders |
| `parentFolder` | ObjectId | No | File._id | Valid file ID or null | Nullable | Parent folder for nesting; null for root |
| `isFavorite` | Boolean | No | - | - | Default false | Marks item as favorite |
| `isDeleted` | Boolean | No | - | - | Default false | Soft-delete flag (reserved) |
| `lastOpened` | Date | No | - | - | Nullable | Timestamp of last file open action |
| `createdAt` | DateTime | Yes | - | Auto-generated | UTC timezone | Creation timestamp |
| `updatedAt` | DateTime | Yes | - | Auto-generated | UTC timezone | Last modification timestamp |

**Relationships:**
- Belongs to: User (via owner)
- Parent-Child: File (via parentFolder self-reference)

**Indexes:**
- `owner` (for user queries)
- `parentFolder` (for folder hierarchy queries)

**Constraints:**
- `owner` is immutable after creation
- `type` must be either "file" or "folder"
- `parentFolder` cannot create circular references (application-level validation needed)

**Example Documents:**

Root Folder:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "owner": ObjectId("507f1f77bcf86cd799439012"),
  "name": "My Documents",
  "type": "folder",
  "content": "",
  "parentFolder": null,
  "createdAt": ISODate("2024-06-05T10:30:00.000Z"),
  "updatedAt": ISODate("2024-06-05T10:30:00.000Z")
}
```

Nested Folder:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "owner": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Q1 Reports",
  "type": "folder",
  "content": "",
  "parentFolder": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-06-05T10:31:00.000Z"),
  "updatedAt": ISODate("2024-06-05T10:31:00.000Z")
}
```

File with Content:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "owner": ObjectId("507f1f77bcf86cd799439012"),
  "name": "document.txt",
  "type": "file",
  "content": "This is the file content stored in the database.",
  "parentFolder": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2024-06-05T10:35:00.000Z"),
  "updatedAt": ISODate("2024-06-05T10:35:00.000Z")
}
```

---

## Authentication Flow

### Registration Flow

```
1. User submits registration form
   ↓
2. Backend receives POST /api/auth/register with username, email, password
   ↓
3. Validate all fields are present
   ↓
4. Check if username or email already exists
   ├─ If exists: Return 400 error
   └─ If not exists: Continue
   ↓
5. Hash password using bcryptjs (salt rounds: 10)
   ↓
6. Create new User document in MongoDB
   ↓
7. Return 201 Created with success message
   ↓
8. User can now proceed to login
```

### Login Flow

```
1. User submits login form with email and password
   ↓
2. Backend receives POST /api/auth/login
   ↓
3. Validate email and password are provided
   ├─ If missing: Return 400 error
   └─ If provided: Continue
   ↓
4. Query User collection for matching email
   ├─ If not found: Return 400 Invalid credentials
   └─ If found: Continue
   ↓
5. Compare provided password with stored hash using bcryptjs
   ├─ If not match: Return 400 Invalid credentials
   └─ If match: Continue
   ↓
6. Generate JWT token with payload: {id: user._id}
   - Token valid for: 7 days
   - Secret key: process.env.JWT_SECRET
   - Algorithm: HS256 (default)
   ↓
7. Return 200 OK with token in response body
   ↓
8. Client stores token and includes in Authorization header for future requests
```

### JWT Token Generation

```javascript
// Token creation in loginUser controller
const token = jwt.sign(
  { id: user._id },                    // Payload
  process.env.JWT_SECRET,              // Secret
  { expiresIn: "7d" }                  // Options
);
```

**Token Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMiIsImlhdCI6MTcxNzU0NDIwMCwiZXhwIjoxNzE4MTQ5MDAwfQ.
aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789
```

### Authorization Middleware Behavior

**File:** [middleware/authMiddleware.js](middleware/authMiddleware.js)

```
1. Client makes request to protected endpoint
   (e.g., POST /api/files/folder/create)
   ↓
2. authMiddleware executes
   ↓
3. Extract "Authorization" header
   ↓
4. Check for "Bearer " prefix and extract token
   ├─ If missing: Return 401 "No token provided"
   └─ If present: Continue
   ↓
5. Verify token using JWT_SECRET
   ├─ If invalid/expired: Return 401 "Invalid token"
   ├─ If tampered: Return 401 "Invalid token"
   └─ If valid: Continue
   ↓
6. Decode token and extract user ID
   ↓
7. Store decoded payload in req.user
   (req.user = { id: user._id, iat: timestamp, exp: timestamp })
   ↓
8. Call next() to proceed to route handler
   ↓
9. Route handler can access req.user.id for user-specific operations
```

**Usage in Protected Routes:**

```javascript
// In fileRoutes.js
router.post("/folder/create", authMiddleware, createFolder);

// In controller, access user ID via req.user
const createFolder = async (req, res) => {
  const folder = await File.create({
    owner: req.user.id,  // User ID from token
    name: req.body.name,
    type: "folder"
  });
};
```

---

## Business Logic

### File Hierarchy Management

The backend supports a hierarchical file system structure:

```
User's File System
├── Root Level Files/Folders (parentFolder = null)
│   ├── My Documents (folder)
│   │   ├── Q1 Reports (subfolder)
│   │   │   ├── report1.pdf (file)
│   │   │   └── report2.pdf (file)
│   │   └── Expenses (subfolder)
│   ├── work.txt (file)
│   └── notes.md (file)
```

**Implementation:**
- Each file/folder references its parent via `parentFolder` field
- Set `parentFolder = null` for root-level items
- Traverse hierarchy by querying by `parentFolder` ObjectId

### User Isolation

- Every file/folder must have an `owner` field pointing to User._id
- authMiddleware ensures only authenticated users can create files
- Controllers use `req.user.id` to automatically assign ownership

### Password Security

- **Hashing Algorithm:** bcryptjs with 10 salt rounds
- **Storage:** Only hashed password stored in database
- **Comparison:** bcryptjs.compare() used for login verification
- **Original Password:** Never stored or logged

### JWT Token Expiration

- **Validity:** 7 days from creation
- **Refresh Strategy:** User must login again after expiration
- **Note:** Refresh token functionality not yet implemented

---

## Environment Variables

| Variable | Required | Type | Description | Example |
| -------- | -------- | ---- | ----------- | ------- |
| `PORT` | No | Number | Server port number | `5000` |
| `MONGO_URI` | Yes | String | MongoDB connection string with credentials | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | Yes | String | Secret key for JWT signing and verification | `your_super_secret_key_min_32_chars` |

### Environment Variable Details

**PORT**
- Default: 5000
- Recommended for production: 3000 or 8000
- Must be available and not in use

**MONGO_URI**
- Format: `mongodb+srv://<username>:<password>@<host>/<database>?<options>`
- Get from MongoDB Atlas dashboard
- Include authentication credentials in URI
- Use URL encoding for special characters in password

**JWT_SECRET**
- Minimum 32 characters recommended
- Use strong random string for security
- Never share or commit to version control
- Changing this invalidates all existing tokens
- Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Creating .env File

```bash
# Create .env file in BE directory
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0" >> .env
echo "JWT_SECRET=your_generated_secret_key_here" >> .env
```

### Security Best Practices

1. Never commit `.env` to Git
2. Add `.env` to `.gitignore`
3. Use `.env.example` as template for sharing
4. Rotate JWT_SECRET periodically
5. Use strong, unique passwords for MongoDB Atlas

---

## Examples

### Complete End-to-End Flow

#### 1. User Registration

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "MySecurePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

#### 2. User Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MySecurePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTk5MzJmZjE2MzZlMjAwOGRmMGQyNiIsImlhdCI6MTcxNzU0NDIwMCwiZXhwIjoxNzE4MTQ5MDAwfQ.abc123xyz789"
}
```

**Save the token for subsequent requests.**

---

#### 3. Create Root Folder

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/folder/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "My Documents",
    "parentFolder": null
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "folder": {
    "_id": "665993a0f16367e208df0d3e",
    "owner": "6659932ff16367e208df0d26",
    "name": "My Documents",
    "type": "folder",
    "content": "",
    "parentFolder": null,
    "createdAt": "2024-06-05T10:30:00.000Z",
    "updatedAt": "2024-06-05T10:30:00.000Z",
    "__v": 0
  }
}
```

---

#### 4. Create Nested Folder

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/folder/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Q1 Reports",
    "parentFolder": "665993a0f16367e208df0d3e"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "folder": {
    "_id": "665993c1f16367e208df0d42",
    "owner": "6659932ff16367e208df0d26",
    "name": "Q1 Reports",
    "type": "folder",
    "content": "",
    "parentFolder": "665993a0f16367e208df0d3e",
    "createdAt": "2024-06-05T10:31:00.000Z",
    "updatedAt": "2024-06-05T10:31:00.000Z",
    "__v": 0
  }
}
```

---

#### 5. Create File with Content

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/file/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Q1_Summary.txt",
    "content": "First quarter summary report. Revenue: $500k. Growth: 25%.",
    "parentFolder": "665993c1f16367e208df0d42"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "File created successfully",
  "file": {
    "_id": "665993d5f16367e208df0d46",
    "owner": "6659932ff16367e208df0d26",
    "name": "Q1_Summary.txt",
    "type": "file",
    "content": "First quarter summary report. Revenue: $500k. Growth: 25%.",
    "parentFolder": "665993c1f16367e208df0d42",
    "createdAt": "2024-06-05T10:35:00.000Z",
    "updatedAt": "2024-06-05T10:35:00.000Z",
    "__v": 0
  }
}
```

---

#### 6. Create File in Root

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/file/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "README.md",
    "content": "# Project Documentation\n\nThis is my project.",
    "parentFolder": null
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "File created successfully",
  "file": {
    "_id": "665993eaf16367e208df0d4a",
    "owner": "6659932ff16367e208df0d26",
    "name": "README.md",
    "type": "file",
    "content": "# Project Documentation\n\nThis is my project.",
    "parentFolder": null,
    "createdAt": "2024-06-05T10:40:00.000Z",
    "updatedAt": "2024-06-05T10:40:00.000Z",
    "__v": 0
  }
}
```

---

#### 7. Retrieve All Files and Folders

**Request:**
```bash
curl -X GET http://localhost:5000/api/files/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "files": [
    {
      "_id": "665993a0f16367e208df0d3e",
      "owner": "6659932ff16367e208df0d26",
      "name": "My Documents",
      "type": "folder",
      "content": "",
      "parentFolder": null,
      "createdAt": "2024-06-05T10:30:00.000Z",
      "updatedAt": "2024-06-05T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "665993c1f16367e208df0d42",
      "owner": "6659932ff16367e208df0d26",
      "name": "Q1 Reports",
      "type": "folder",
      "content": "",
      "parentFolder": "665993a0f16367e208df0d3e",
      "createdAt": "2024-06-05T10:31:00.000Z",
      "updatedAt": "2024-06-05T10:31:00.000Z",
      "__v": 0
    },
    {
      "_id": "665993d5f16367e208df0d46",
      "owner": "6659932ff16367e208df0d26",
      "name": "Q1_Summary.txt",
      "type": "file",
      "content": "First quarter summary report. Revenue: $500k. Growth: 25%.",
      "parentFolder": "665993c1f16367e208df0d42",
      "createdAt": "2024-06-05T10:35:00.000Z",
      "updatedAt": "2024-06-05T10:35:00.000Z",
      "__v": 0
    },
    {
      "_id": "665993eaf16367e208df0d4a",
      "owner": "6659932ff16367e208df0d26",
      "name": "README.md",
      "type": "file",
      "content": "# Project Documentation\n\nThis is my project.",
      "parentFolder": null,
      "createdAt": "2024-06-05T10:40:00.000Z",
      "updatedAt": "2024-06-05T10:40:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### Common Error Scenarios

#### Scenario 1: Missing JWT Token

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/folder/create \
  -H "Content-Type: application/json" \
  -d '{"name": "My Folder"}'
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Fix:** Include Authorization header with valid token.

---

#### Scenario 2: Expired Token

**Request:**
```bash
curl -X GET http://localhost:5000/api/files/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTk5MzJmZjE2MzZlMjAwOGRmMGQyNiIsImlhdCI6MTcwODU0NDIwMCwiZXhwIjoxNzA4NTQ4MDAwfQ.abc123xyz"
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Fix:** Login again to obtain a fresh token.

---

#### Scenario 3: Duplicate Email Registration

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "email": "john@example.com",
    "password": "AnotherPassword123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Fix:** Use a different email address or login if account already exists.

---

#### Scenario 4: Wrong Password on Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "WrongPassword"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Fix:** Verify password and try again.

---

## Notes

### Important Implementation Details

1. **Password Hashing:** All passwords are hashed using bcryptjs before storage. Plain passwords are never stored or logged.

2. **Token Expiration:** JWT tokens expire after 7 days. There is currently no refresh token mechanism; users must login again for a new token.

3. **Circular Reference Prevention:** The application currently does not prevent circular folder references (e.g., Folder A → Folder B → Folder A). This should be addressed in production.

4. **File Hierarchy Querying:** To get files within a specific folder, query with `parentFolder: <folder_id>`. No built-in endpoint exists yet for this (consider adding GET /api/files/folder/:id).

5. **Content Storage:** File content is stored directly in MongoDB. For large files (> 10MB), consider implementing GridFS.

6. **User Deletion:** No delete user endpoint exists. Deleting a user currently leaves orphaned files in database.

7. **File Updates:** No PUT/PATCH endpoints exist for updating file content or folder names. Consider adding these endpoints.

8. **Real-time Sync:** No WebSocket integration. File changes require client to poll GET /api/files/.

9. **CORS:** CORS middleware is imported but may not be properly configured. Check if CORS headers are set correctly.

10. **Validation:** Input validation is minimal. Consider adding comprehensive schema validation (e.g., Joi or express-validator).

### Unclear or Missing Features

- **Window Management:** WindowController and windowRoutes are empty. Purpose unclear.
- **File Deletion:** No delete endpoint for files/folders.
- **File Updates:** No update endpoint for file content.
- **Folder Contents:** No endpoint to retrieve only contents of a specific folder.
- **Search:** No search functionality for files.
- **Sharing:** No file sharing or permission system.
- **Soft Delete:** No trash/recycle bin functionality.

### TODO Items for Production Ready

- [ ] Implement GET /api/files/folder/:id endpoint for folder-specific contents
- [ ] Add PUT /api/files/:id endpoint for updating files
- [ ] Add DELETE /api/files/:id endpoint for deletion
- [ ] Implement refresh token mechanism
- [ ] Add input validation using Joi or express-validator
- [ ] Add circular reference prevention for folders
- [ ] Implement file size limits and GridFS for large files
- [ ] Add user account deletion endpoint
- [ ] Add CORS configuration
- [ ] Add error logging with Winston or Morgan
- [ ] Add API rate limiting
- [ ] Implement file search functionality
- [ ] Add file sharing/permission system
- [ ] Add comprehensive unit and integration tests
- [ ] Document Window management feature purpose or remove if unused

---

## Support & Contact

For issues or questions, please refer to the project documentation or contact the development team.

**Last Updated:** June 5, 2024
**Backend Version:** 1.0.0

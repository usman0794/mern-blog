# MERN Blog

A full-stack blog application built with the **MERN stack**, featuring authentication, Google sign-in, user profiles, blog publishing, search, category filtering, image uploads, and an admin dashboard.

## Features

- 🔐 Email/password authentication with JWT
- 🔵 Google sign-in with Firebase
- 👤 User profile management
- 🖼️ Profile and post image uploads
- ✍️ Admin-only post creation and editing
- 🗑️ Post and user management
- 🔎 Search by title and content
- 🏷️ Category filtering
- 📄 SEO-friendly post slugs
- 📊 Admin dashboard
- 🌙 Light and dark theme
- 📱 Responsive UI
- ☁️ AWS S3 image storage
- 🗄️ MongoDB database

## Tech Stack

**Frontend:** React, Vite, React Router, Redux Toolkit, Redux Persist, Tailwind CSS, Flowbite React, React Quill, Firebase, React Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, AWS SDK for S3, Cookie Parser

## Architecture

```text
React + Vite
     │
     │ REST API
     ▼
Node.js + Express
     │
 ┌───┴────┐
 ▼        ▼
MongoDB   AWS S3
          │
          └── Images

Firebase ── Google Authentication
```

## Project Structure

```text
mern-blog/
├── api/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   └── firebase.js
│   └── package.json
│
└── docker-compose.yml
```

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Home and blog posts |
| `/about` | About page |
| `/projects` | Projects page |
| `/signIn` | Sign in |
| `/signUp` | Sign up |
| `/post/:postSlug` | Blog post |
| `/dashboard` | User/admin dashboard |
| `/create-post` | Create post — admin |
| `/update-post/:postId` | Update post — admin |

## Authentication

Users can register and sign in with email/password. Passwords are hashed using `bcryptjs`.

Authentication uses JWT stored in an HTTP-only `access_token` cookie.

Google authentication is implemented with Firebase and connected to the backend through:

```text
POST /api/auth/google
```

## Blog Management

Administrators can create, update, and delete blog posts.

Posts contain:

- Title
- Content
- Category
- Image
- Slug
- Author ID
- Timestamps

Images are stored using AWS S3.

## Search & Filtering

The post API supports:

- Title and content search
- Category filtering
- Author filtering
- Post ID and slug lookup
- Pagination
- Sorting

Example:

```text
/api/post/getposts?searchTerm=javascript
```

## Admin Dashboard

Administrators can manage users and posts from the dashboard.

### Users

- View users
- Delete users
- View administrator status

### Posts

- View posts
- Create posts
- Edit posts
- Delete posts

## API

The backend is organized under `/api`.

### Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/auth/signup` |
| POST | `/api/auth/signin` |
| POST | `/api/auth/google` |

### Posts

| Method | Endpoint |
|---|---|
| POST | `/api/post/create` |
| GET | `/api/post/getposts` |
| PUT | `/api/post/updatepost/:postId/:userId` |
| DELETE | `/api/post/deletepost/:postId/:userId` |

### Users

| Method | Endpoint |
|---|---|
| PUT | `/api/user/update/:userId` |
| DELETE | `/api/user/delete/:userId` |
| POST | `/api/user/signout` |
| GET | `/api/user/getusers` |

## Environment Variables

### Backend

Create `api/.env`:

```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_REGION=<aws-region>
AWS_S3_BUCKET_NAME=<s3-bucket-name>

NODE_ENV=development
```

### Frontend

Create `client/.env`:

```env
VITE_FIREBASE_API_KEY=<firebase-api-key>

VITE_AWS_REGION=<aws-region>
VITE_AWS_ACCESS_KEY_ID=<aws-access-key>
VITE_AWS_SECRET_ACCESS_KEY=<aws-secret-key>
VITE_S3_BUCKET_NAME=<s3-bucket-name>
```

Never commit `.env` files or cloud credentials.

## Installation

### Prerequisites

- Node.js 18+
- npm
- MongoDB / MongoDB Atlas
- Firebase project
- AWS S3 bucket

### Clone

```bash
git clone <your-repository-url>
cd mern-blog
```

### Backend

```bash
cd api
npm install
npm run dev
```

Configure `api/.env` before starting the server.

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will display the local development URL.

## Production

Build the frontend:

```bash
cd client
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Docker

Start the application with Docker Compose:

```bash
docker compose up --build
```

Stop the containers:

```bash
docker compose down
```

## Security

The application uses:

- Password hashing with `bcryptjs`
- JWT authentication
- HTTP-only cookies
- Protected routes
- Admin authorization
- Environment variables for secrets

Use secure production credentials and keep secrets outside the repository.

## License

This project is licensed under the MIT License.

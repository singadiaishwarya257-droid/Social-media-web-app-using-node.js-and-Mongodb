# Secure Social Media Architecture (Node.js + Express + MongoDB)

This project demonstrates a production-grade social media backend built with a clean layered architecture and strict security defaults.

## Core design principles

- MVC / layered architecture: routers -> controllers -> services -> models
- Async/await everywhere with structured try/catch blocks
- JWT-based authentication stored in secure, HTTP-only cookies
- Helmet, CORS, Mongo sanitization, rate limiting, and compression enabled by default
- MongoDB indexing for commonly queried fields such as user email and post timestamps
- Response format is consistent: `{ success, data, error }`
- HTTPS support via Node.js native HTTPS module, with HTTP fallback

## Directory structure

```bash
social-media-architecture/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── events/
│   │   ├── appEvents.js
│   │   └── eventBus.js
│   ├── middleware/
│   │   ├── asyncHandler.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── rbac.js
│   │   └── security.js
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── commentRoutes.js
│   │   ├── index.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── commentService.js
│   │   ├── postService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   └── generateToken.js
│   └── validations/
│       └── userValidation.js
└── tests/
    └── sample.test.js
```

## Start locally

```bash
npm install
cp .env.example .env
npm run dev
```

## API base URL

By default the server runs on:

- HTTP: `http://localhost:5000`
- API prefix: `/api/v1`

Example full route:

- `http://localhost:5000/api/v1/users/register`

Protected routes require the `auth_token` cookie issued after registration or login.

## API endpoints

### Health check

- `GET /health`
- Response:

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "uptime": 123.456
  },
  "error": null
}
```

### User routes

#### Register user

- `POST /api/v1/users/register`
- Request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPass123",
  "fullName": "John Doe",
  "bio": "Software developer"
}
```

- Success response:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f3...",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "bio": "Software developer"
    }
  },
  "error": null
}
```

#### Login user

- `POST /api/v1/users/login`
- Request body:

```json
{
  "email": "john@example.com",
  "password": "StrongPass123"
}
```

#### Get current user profile

- `GET /api/v1/users/me`
- Requires authentication cookie.

#### Logout user

- `POST /api/v1/users/logout`
- Clears the `auth_token` cookie.

### Post routes

#### Get all posts

- `GET /api/v1/posts`

#### Create post

- `POST /api/v1/posts`
- Requires authentication cookie.
- Request body:

```json
{
  "content": "This is my first post",
  "imageUrl": "https://example.com/post-image.jpg"
}
```

- `content` is required and must be non-empty.

#### Get single post

- `GET /api/v1/posts/:id`

#### Update post

- `PATCH /api/v1/posts/:id`
- Requires authentication cookie.
- Only the owner can update a post.
- Request body (at least one field required):

```json
{
  "content": "Updated post content",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

#### Delete post

- `DELETE /api/v1/posts/:id`
- Requires authentication cookie.
- Only the owner can delete a post.

### Comment routes

#### Get comments for a post

- `GET /api/v1/comments/post/:postId`

#### Create comment

- `POST /api/v1/comments/post/:postId`
- Requires authentication cookie.
- Request body:

```json
{
  "content": "Nice post!"
}
```

#### Delete comment

- `DELETE /api/v1/comments/:id`
- Requires authentication cookie.
- Only the comment owner can remove it.

## Response format

All API responses follow this standard structure:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

When a request fails, the response looks similar to:

```json
{
  "success": false,
  "data": null,
  "error": "Email and password are required"
}
```

## Notes

- MongoDB must be running locally or via Atlas.
- The environment variables in `.env` must be populated for JWT and DB access.
- HTTPS requires certificate files in `certs/server.crt` and `certs/server.key`.

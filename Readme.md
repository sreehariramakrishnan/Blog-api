# Blog API

REST API built with Node.js, Express, MongoDB, Cloudinary

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (file uploads)
- bcryptjs
- express-validator

## Routes

| Method | Route      | Description            | Auth |
| ------ | ---------- | ---------------------- | ---- |
| POST   | /register  | Create account         | No   |
| POST   | /login     | Login + get token      | No   |
| GET    | /profile   | Get my profile         | Yes  |
| POST   | /imagepost | Upload profile picture | Yes  |
| POST   | /post      | Create post            | Yes  |
| GET    | /posts     | Get all posts          | No   |
| GET    | /myposts   | Get my posts           | Yes  |

## Setup

1. Clone repo
   git clone https://github.com/yourusername/blog-api.git

2. Install dependencies
   npm install

3. Create .env file
   MONGO_URL=your_mongodb_url
   JWTTOKEN=your_secret_key
   CLOUDNAME=your_cloudinary_name
   APIKEY=your_cloudinary_key
   APISECRET=your_cloudinary_secret

4. Run server
   nod

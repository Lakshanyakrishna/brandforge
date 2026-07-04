
# Social Media Caption Generator

## Overview

The **Social Media Caption Generator** is a full-stack MERN application designed to generate AI-based captions for social media images. The project integrates cloud-based image handling with generative AI services to deliver meaningful and context-aware captions.

The backend architecture and core integrations are implemented, and the **frontend is currently under active development**.

---

## Project Status

**Current Phase:**

* Backend APIs implemented and functional
* Image upload and optimization via ImageKit completed
* Caption generation logic integrated
* **Frontend development in progress**

This repository is actively maintained, and features are being incrementally added to the user interface.

---

## Key Features

* Secure image upload and optimization using ImageKit
* AI-based caption generation from uploaded images
* RESTful backend APIs built with Node.js and Express
* Scalable MongoDB database integration
* Modular and maintainable codebase

---

## Tech Stack

### Frontend (In Progress)

* React.js
* JavaScript (ES6+)
* HTML5
* Tailwindcss

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Cloud & Third-Party Services

* ImageKit (image storage and optimization)
* Generative API (caption generation)

### Development Tools

* Git & GitHub
* Visual Studio Code
* Postman

---

## Project Architecture

```
Social-media/
│
├── client/                 # React frontend (under development)
│   ├── src/
│   └── public/
│
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── index.js
│
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## Installation & Setup

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB (local or cloud)
* ImageKit account
* API key for caption generation service

---

### 1. Clone the Repository

```bash
git clone https://github.com/thakare18/Social-media.git
cd Social-media
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GEMINI_API_KEY=your_ai_api_key
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup (Work in Progress)

```bash
cd client
npm install
npm start
```

Note: The frontend is currently being developed. Some features or UI components may be incomplete or subject to change.

---

## API Workflow

1. Image is uploaded from the client application
2. Image is stored and optimized using ImageKit
3. Image URL is sent to the backend
4. AI service processes the image and generates a caption
5. Caption is returned via API response

---

## Future Enhancements

* Complete frontend UI and user experience
* User authentication and authorization
* Multiple caption styles and tones
* Caption history and export options
* Social media platform integrations

---

**Prathamesh Thakare**
GitHub: [https://github.com/thakare18](https://github.com/thakare18)
mail : prathamthackeray18@gmail.com

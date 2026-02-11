demo: https://thumblifyy.vercel.app/




Thumbnail Generator
AI-powered thumbnail generator using Google Gemini API for creating stunning, professional thumbnails for your content.
🌟 Features

AI-Powered Generation: Utilizes Google Gemini 3 Pro Image model
Multiple Styles: Bold & Graphic, Tech/Futuristic, Minimalist, Photorealistic, Illustrated
Color Schemes: 8 pre-defined color palettes (Vibrant, Sunset, Forest, Neon, Purple, Monochrome, Ocean, Pastel)
Flexible Aspect Ratios: 16:9, 1:1, 9:16
Real-time Preview: See your thumbnail as it's generated
Cloud Storage: Direct upload to Cloudinary
User Authentication: Secure session-based authentication
Thumbnail Management: View, download, and delete your generated thumbnails

🛠️ Tech Stack
Frontend

React with TypeScript
React Router for navigation
Tailwind CSS for styling
Lucide React for icons
React Hot Toast for notifications
Axios for API calls

Backend

Node.js with Express
TypeScript
MongoDB with Mongoose
Express Session with MongoDB store
Google Generative AI (Gemini)
Cloudinary for image hosting

📋 Prerequisites

Node.js (v18 or higher)
MongoDB database
Cloudinary account
Google AI API key (for Gemini)

🚀 Installation
1. Clone the repository
bashgit clone <repository-url>
cd thumbnail-generator
2. Install dependencies
Backend
bashcd backend
npm install
Frontend
bashcd frontend
npm install
3. Environment Variables
Backend .env
env# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URL=mongodb://localhost:27017/thumbnail-generator
# Or use MongoDB Atlas
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Session
SESSION_SECRET=your-super-secret-session-key-change-this

# Cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
# Get from: https://cloudinary.com/console

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-google-ai-api-key
# Get from: https://ai.google.dev/
Frontend .env (if needed)
envVITE_API_URL=http://localhost:3000
🏃‍♂️ Running Locally
1. Start MongoDB
bash# If using local MongoDB
mongod
2. Start Backend
bashcd backend
npm run dev
Backend will run on http://localhost:3000
3. Start Frontend
bashcd frontend
npm run dev
Frontend will run on http://localhost:5173
📦 Building for Production
Backend
bashcd backend
npm run build
npm start
Frontend
bashcd frontend
npm run build
🌐 Deployment
Vercel (Recommended for Backend)

Install Vercel CLI

bashnpm i -g vercel

Deploy Backend

bashcd backend
vercel

Set Environment Variables on Vercel


Go to your project settings on Vercel
Add all environment variables from .env
Redeploy


Important for Vercel:

The code is already optimized for serverless deployment
No file system writes (direct Cloudinary upload)
Session store uses MongoDB



Frontend Deployment Options
Vercel
bashcd frontend
vercel
Netlify
bashcd frontend
npm run build
# Upload dist folder to Netlify
Update API URL
After deploying backend, update frontend API configuration:
typescript// frontend/src/configs/api.ts
const api = axios.create({
  baseURL: 'https://your-backend-url.vercel.app',
  withCredentials: true
})
```

## 📁 Project Structure
```
thumbnail-generator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── ai.ts              # Google AI configuration
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── ThumbnailController.ts
│   │   │   └── UserController.ts
│   │   ├── middlewares/
│   │   │   └── auth.ts            # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Thumbnail.ts
│   │   ├── routes/
│   │   │   ├── AuthRoutes.ts
│   │   │   ├── ThumbnailRoutes.ts
│   │   │   └── UserRoutes.ts
│   │   └── index.ts               # Express app entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── assets.ts          # Types and constants
│   │   ├── components/
│   │   │   ├── AspectRatioSelector.tsx
│   │   │   ├── ColorSchemeSelector.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   ├── SoftBackDrop.tsx
│   │   │   └── StyleSelector.tsx
│   │   ├── configs/
│   │   │   └── api.ts             # Axios configuration
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Generate.tsx       # Main generation page
│   │   │   ├── MyGenerations.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
│
└── README.md
🔑 API Endpoints
Authentication

POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
GET /api/auth/check - Check auth status

Thumbnails

POST /api/thumbnail/generate - Generate new thumbnail (protected)
DELETE /api/thumbnail/delete/:id - Delete thumbnail (protected)

User

GET /api/user/thumbnails - Get user's thumbnails (protected)
GET /api/user/thumbnail/:id - Get specific thumbnail (protected)

🎨 Available Styles

Bold & Graphic

Eye-catching with bold typography
Vibrant colors and high contrast
Professional click-worthy design


Tech/Futuristic

Sleek modern design
Digital UI elements with glowing accents
High-tech atmosphere


Minimalist

Clean layout with simple shapes
Limited color palette
Modern flat design


Photorealistic

Ultra-realistic lighting
Natural candid moments
DSLR-style photography


Illustrated

Custom digital illustration
Stylized characters
Bold outlines and vibrant colors



🎨 Color Schemes

Vibrant: High saturation, bold contrasts
Sunset: Warm orange, pink, purple tones
Forest: Natural green, earthy colors
Neon: Electric blues and pinks, cyberpunk style
Purple: Magenta and violet tones
Monochrome: Black and white, high contrast
Ocean: Cool blue and teal tones
Pastel: Soft colors, low saturation

📱 Usage

Register/Login to your account
Fill in the form:

Enter title or topic
Select aspect ratio (16:9, 1:1, 9:16)
Choose a style
Pick a color scheme
Add optional additional prompts


Click "Generate Thumbnail"
Wait 10-20 seconds for AI to create your thumbnail
Download your thumbnail or create a new one

⚙️ Configuration
Timeout Settings (for Vercel)
If thumbnail generation takes longer than 10 seconds:
Option 1: Upgrade to Vercel Pro

60 second timeout for serverless functions

Option 2: Implement Background Jobs
typescript// Use a queue system like Bull or BullMQ
// Return immediately and process in background
// Poll for completion
Memory Optimization
If you encounter memory issues:
typescript// Reduce image size in generation config
imageConfig: {
    aspectRatio: aspect_ratio || '16:9',
    imageSize: '512' // Instead of '1K'
}
🐛 Troubleshooting
Issue: Thumbnail not showing after generation
Solution: Check that Cloudinary upload is successful and secure_url is being saved
Issue: Session not persisting
Solution: Ensure CORS credentials are enabled and session secret is set
Issue: Vercel timeout
Solution: Upgrade to Pro plan or implement background processing
Issue: MongoDB connection failed
Solution: Check MongoDB URL and ensure IP whitelist is configured (for Atlas)
🔒 Security Considerations

Store sensitive keys in environment variables
Use HTTPS in production
Enable CORS only for trusted domains
Implement rate limiting for API endpoints
Validate user inputs
Use secure session configuration

📄 License
MIT License - feel free to use this project for personal or commercial purposes.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📧 Support
For issues and questions, please open an issue on GitHub.
🙏 Acknowledgments

Google Gemini AI for image generation
Cloudinary for image hosting
MongoDB for database
Vercel for deployment platform


Made with ❤️ using React, Node.js, and AI
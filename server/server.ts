import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoutes';
import ThumbnailRouter from './routes/ThumbnailRoutes';
import UserRouter from './routes/UserRoutes';

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string
    }
}

const app = express();

app.disable('etag');

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thumblifyy.vercel.app'],
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}, // 7 days
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL as string,
        collectionName: 'sessions'
    })
}))

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', AuthRouter)

app.use('/api/thumbnail', ThumbnailRouter)

app.use('/api/user', UserRouter)

const port = process.env.PORT || 3000;

// Gọi connectDB và listen server trong async function
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();
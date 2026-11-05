// Must be the first import: ES module imports run before the rest of this file,
// so .env has to be loaded here for passport.js and the Gemini client to see their keys.
import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import authenticationRouter from './src/routers/authentication.router.js';
import expenseRouter from './src/routers/expense.router.js';
import userRouter from './src/routers/user.router.js'
import activityRouter from './src/routers/activity.router.js'
import groupRouter from './src/routers/group.router.js'
import billRouter from './src/routers/bills.router.js'
import oauthRouter from './src/routers/oauth.router.js';
import chatbotRouter from './src/routers/chatbot.router.js';
import ocrScanRouter from './src/routers/ocr.router.js';
import goalRouter from './src/routers/goal.router.js';
import notificationRouter from './src/routers/notification.router.js';
import { connectDB } from "./src/db/index.js";
import { seedAdmin } from "./src/db/seed.js";
import session from 'express-session';
import os from 'os';
import mongoose from 'mongoose';
import passport from "passport";
import "./src/config/passport.js"; // Ensure this is imported to initialize passport strategies
const app = express();

// Behind Traefik/Nginx the app receives plain HTTP; trust the proxy so secure cookies still work.
app.set('trust proxy', 1);
const isHttps = (process.env.BACKEND_URL || '').startsWith('https://');

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        // Secure cookies only over HTTPS (production); plain HTTP on localhost would drop them.
        secure: isHttps,
        httpOnly: true,
        sameSite: isHttps ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT;
app.get("/", (req, res) => res.send("API is running..."));
app.use('/api', authenticationRouter);
app.use('/api', expenseRouter);
app.use('/api', userRouter)
app.use('/api', activityRouter)
app.use('/api',groupRouter)
app.use('/api',billRouter)
app.use('/api', oauthRouter);
app.use('/api', chatbotRouter);
app.use('/api', ocrScanRouter);
app.use('/api', goalRouter);
app.use('/api', notificationRouter);


app.get('/health', async(req, res) => {
    let dbResponseTime;
    try {
        const startDb = Date.now();
        await mongoose.connection.db.admin().ping();
        dbResponseTime = Date.now() - startDb;
    } catch (error) {
        return res.status(503).json({ status: "DB_UNAVAILABLE", message: error.message });
    }

    res.json({
        status: "OK",
        uptime: os.uptime(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        cpuUsage: os.loadavg()[0],
        dbQueryTime: dbResponseTime,
    });
});

connectDB()
    .then(async () => {
        await seedAdmin();
        app.listen(port, () => {
            console.log(`listening on ${port}`);
        })
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    })
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./models/db');
const MongoStore = require('connect-mongo');
const MONGODB_URI = require('./models/db-creds');
const { info, highlight } = require('./Helpers/textColors');
require('./passport-setup');

const app = express();
let jsonLimit = 5 * 1024 * 1024;
app.use(bodyParser.json({ limit: jsonLimit }));
app.use(cookieParser());


// Trust the first proxy in the chain
if (process.env.PRODUCTION_ENV === 'true') {
    app.set('trust proxy', 1);
}


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:17293", "https://cxtools.uptycs.dev"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


app.use(
    (req, res, next) => {
        let message = info(req?.method, " request to route");
        let route = highlight(req?.path);
        console.log(message, route, '');

        const origin = req?.headers?.origin;
        let cookieInfo = {
            maxAge: 1000 * 60 * 60 * 24,
        }

        if (process.env.PRODUCTION_ENV === 'true') {
            // set response headers for Cross Domain Requests
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            // set sameSite to none for cross domain requests
            cookieInfo.sameSite = 'none';
            cookieInfo.secure = true;
        }

        return session({
            name: 'CX-Tools',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: MONGODB_URI,
                autoRemove: 'native',
                collectionName: 'sessions',
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
            },
        })(req, res, next);
    })


// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
const authRoutes = require('./routes/auth-routes');
app.use('/auth', authRoutes);

// Server Routes
let routes = require('./routes/routes');
app.use('/', routes);



const PORT = 17291;

// Connect to MongoDB and then start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server listening at port ${PORT}`);
        });
    } catch (err) {
        console.error('⛔ Failed to connect to MongoDB:', err);
    }
};
startServer();
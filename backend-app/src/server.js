require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var cookieParser = require('cookie-parser');
let { getmongoURI } = require('./models');
let routes = require('./routes');
const app = express();
let jsonLimit = 9 * 1024 * 1024; // Max payload is 9MB
app.use(bodyParser.json({ limit: jsonLimit }));
app.use(cookieParser());

// Trust the first proxy in the chain
if (process.env.PRODUCTION_ENV === 'true')
    app.set('trust proxy', 1);

const mongoDBStore = new MongoDBStore({
    uri: getmongoURI(),
    collection: 'sessions'
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:17293", "https://cxtools.uptycs.dev"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));




app.use(
    (req, res, next) => {
        if (req.path === '/validateLoginUser' || (req?.cookies && req.cookies['CX-Tools'])) {
            const origin = req?.headers?.origin;
            let cookieInfo = {
                maxAge: 1000 * 60 * 60 * 24,
            }

            if (process.env.PRODUCTION_ENV === 'true'){
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
                saveUninitialized: true,
                store: mongoDBStore,
                cookie: cookieInfo,
            })(req, res, next);
        } else {
            return next();
        }
    }
);

app.use('/', routes);

const PORT = 17291;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
});
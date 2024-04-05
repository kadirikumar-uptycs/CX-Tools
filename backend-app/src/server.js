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
let jsonLimit = 5 * 1024 * 1024; // Max payload is 5MB
app.use(bodyParser.json({ limit: jsonLimit }));
app.use(cookieParser());

// Trust the first proxy in the chain
app.set('trust proxy', 1);

const mongoDBStore = new MongoDBStore({
    uri: getmongoURI(),
    collection: 'sessions'
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:17293", "https://cxtools.uptycs.dev", "http://34.239.162.244:17293", process.env.UI_BASE_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));




app.use(
    (req, res, next) => {
        if (req.path === '/validateLoginUser' || (req?.cookies && req.cookies['CX-Tools'])) {
            const origin = req?.headers?.origin;

            // set response headers
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

            return session({
                name: 'CX-Tools',
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: true,
                store: mongoDBStore,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24,
                    sameSite: 'none',
                    secure: true,
                }
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
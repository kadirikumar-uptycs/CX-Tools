require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var cookieParser = require('cookie-parser');
let { getmongoURI } = require('./models');
let routes = require('./routes')
const app = express();
let jsonLimit = 5 * 1024 * 1024; // Max payload is 5MB
app.use(bodyParser.json({ limit: jsonLimit }));


const mongoDBStore = new MongoDBStore({
    uri: getmongoURI(),
    collection: 'sessions'
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:17293", "https://cxtools.uptycs.dev"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(
    session({
        name: 'CX-Tools',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: mongoDBStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);
app.use(cookieParser());
app.use('/', routes);

const PORT = 17291;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
});
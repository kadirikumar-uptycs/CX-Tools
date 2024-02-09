require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
let routes = require('./routes')
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin : "http://localhost:3000",
    methods : ["GET", "POST"],
    credentials : true,
}));
app.use(
    session({
        name : 'CX-Tools',
        secret : process.env.SESSION_SECRET,
        resave : false,
        saveUninitialized : true,
    })
);
app.use(cookieParser());
app.use('/', routes);

const PORT = 17291;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
});
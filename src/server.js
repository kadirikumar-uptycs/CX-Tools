require('dotenv').config();
const express = require('express');
const app = express();
const clientRoutes = require('./routes/clientRoute');
const serverRoutes = require('./routes/serverRoute')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');


var cookieParser = require('cookie-parser');
app.use(session({
    name : 'MohanKumar-App',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(cookieParser())
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/', clientRoutes);
app.use('/api', serverRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
});





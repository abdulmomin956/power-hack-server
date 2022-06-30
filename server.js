const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const port = process.env.PORT || 5000;
const app = express();
const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const path = require('path');

// custom middleware logger
app.use(logger);

//middleware
app.use(express.json());
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'))
app.use('/api/register', require('./routes/register'))
app.use('/api/login', require('./routes/login'))
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log('Server is running with port:' + port);
})
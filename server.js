const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const port = process.env.PORT || 5000;
const app = express();
const credentials = require('./middleware/credentials');

//middleware
app.use(express.json());
app.use(cors(corsOptions));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//routes
app.use('/', require('./routes/root'))
app.use('/api/register', require('./routes/register'))

app.listen(port, () => {
    console.log('Server is running with port:' + port);
})
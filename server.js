const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))

app.listen(port, () => {
    console.log('Server is running with port:' + port);
})
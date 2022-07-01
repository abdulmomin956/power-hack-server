const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.sn77ciu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogin = async (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass) return res.status(400).json({ 'message': 'Username and password are required.' });
    try {
        await client.connect();
        const userCollection = client.db("insertDB").collection("users");
        const usersDB = await userCollection.find({}).toArray();


        const foundUser = usersDB.find(person => person.username === user);

        if (!foundUser) return res.sendStatus(401); //Unauthorized
        // evaluate password 
        const match = await bcrypt.compare(pass, foundUser.password);
        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                { "username": foundUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            userCollection.updateOne({ "username": user }, { $set: { refreshToken: refreshToken } })
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(401);
    }







}

module.exports = { handleLogin };
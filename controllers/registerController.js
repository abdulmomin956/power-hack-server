const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.sn77ciu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    // console.log(req);
    const { user, pass } = req.body;
    if (!user || !pass) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db
    // const duplicate = usersDB.users.find(person => person.username === user);
    // if (duplicate) return res.sendStatus(409); //Conflict

    try {
        await client.connect();
        const userCollection = client.db("insertDB").collection("users");
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pass, 10);
        //store the new user
        const newUser = { "username": user, "password": hashedPwd };
        const result = await userCollection.updateOne({ username: user }, { $setOnInsert: newUser }, { upsert: true })
        // console.log(result);
        if (result.matchedCount === 1) {
            return res.sendStatus(409);
        }
        else {
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

}

module.exports = { handleNewUser };
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.sn77ciu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const loadBills = async (req, res) => {
    try {
        await client.connect();
        const billCollection = client.db("insertDB").collection("haiku");

        const result = await billCollection.find({}).toArray();
        res.send(result)
    } catch (err) {
        res.send(err)
    }
    finally {
        await client.close();
    }

}

module.exports = { loadBills };
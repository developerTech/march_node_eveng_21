let express = require('express');
let app = express();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let dotenv = require('dotenv');
dotenv.config()
const mongoUrl = process.env.mongoUrl;
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8700;
var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())




MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log('Error While Connecting');
    db = client.db('augintern');
    app.listen(port,() => {
        console.log(`Listing to port ${port}`)
    });
})
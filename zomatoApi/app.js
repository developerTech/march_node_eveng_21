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

//get Heart beat
app.get('/',(req,res) => {
    res.send('Welcome To Heart Beat')
})

//location
app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// List Api
app.get('/list/:items',(req,res) => {
    let colName = req.params.items
    db.collection(colName).find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// restaurants on basis of meal and state 
app.get('/restaurants',(req,res) => {
    let stateId = Number(req.query.state_id)
    let mealId = Number(req.query.meal_id)
    let query = {};
    if(stateId && mealId){
        query = {'mealTypes.mealtype_id':mealId,state_id:stateId}
    }else if(stateId){
        query = {state_id:stateId}
    }else if(mealId){
        query = {'mealTypes.mealtype_id':mealId}
    }
    db.collection('restaurants').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

/// filters
app.get(`/filter/:mealId`,(req,res) => {
    let sort = {cost:1}
    let skip = 0;
    let limit = 1000000000;
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.query.cuisineId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    let query = {}
    if(req.query.sort){
        sort={cost:req.query.sort}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit);
    }

    if(cuisineId && lcost && hcost){
        query={
            "cuisines.cuisine_id":cuisineId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
            "mealTypes.mealtype_id":mealId
        }
    }

    if(cuisineId){
        query={
            "cuisines.cuisine_id":cuisineId,
            "mealTypes.mealtype_id":mealId
        }
    }else if(lcost&hcost){
        query={
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
            "mealTypes.mealtype_id":mealId
        }
    }

    db.collection('restaurants').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})



MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log('Error While Connecting');
    db = client.db('augintern');
    app.listen(port,() => {
        console.log(`Listing to port ${port}`)
    });
})
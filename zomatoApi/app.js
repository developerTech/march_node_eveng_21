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
const axios = require('axios')
var db;

let authKey = "757ddd9a97d365906e7ad80e9dee2fee"

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())

//get Heart beat
app.get('/',(req,res) => {
    res.send('Welcome To Heart Beat')
})

//location
app.get('/location',(req,res) => {
    let key = req.header('x-access-token')
    if(key == authKey){
        db.collection('location').find().toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Unauthencticated User')
    }
    
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

    if(cuisineId&& lcost && hcost){
        query={
            "cuisines.cuisine_id":cuisineId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}],
            "mealTypes.mealtype_id":mealId
        }
    }
    else if(cuisineId){
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

// rest details

/*
app.get('/details/:collection/:id',(req,res) => {
    let id = Number(req.params.id);
    let col = req.params.collection
    db.collection(col).find({restaurant_id:id}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})*/


app.get('/details/:id',(req,res) => {
    let restId = mongo.ObjectId(req.params.id)
    db.collection('restaurants').find({_id:restId}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/menu/:id',(req,res) => {
    let restId = Number(req.params.id)
    db.collection('menu').find({restaurant_id:restId}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

/// menu on the basis for ids
app.post('/menuItem', (req,res) => {
    console.log(req.body)
    if(Array.isArray(req.body)){
        db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result);
        })
    }else{
        res.send('Please Pass The Array Only');
    } 
})

app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('order Placed')
    })
})

app.get('/getOrder',(req,res) => {
    let menuData = req.query.details
    let menuDetails;
    var order;
    db.collection('orders').find().toArray((err,result) => {
        if(err) throw err;
        order = result
        if(menuData){ 
            order.map((data) => {
                let payload = data.menuItem
                console.log(payload)
                
                /*axios.post('/menuItem',payload)
                        .then(response => {
                            menuDetails = response.data
                        })
    
                order.menuItem = menuDetails*/
            })
            res.send(order)
        }
        res.send(result)
    })
})

app.put('/updateOrder',(req,res) => {
    db.collection('orders').updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                "status":req.body.status
            }
        },(err,result) => {
            if(err) throw err;
            res.status(200).send('Status Updated')
        }
    )
})



MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log('Error While Connecting');
    db = client.db('augintern');
    app.listen(port,() => {
        console.log(`Listing to port ${port}`)
    });
})
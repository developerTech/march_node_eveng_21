
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const db = admin.firestore();

exports.addCiti = functions.https.onRequest(async (req,res) => {
    const citisRef = db.collection('marchnode');
    await citisRef.doc('Delhi').set({
        "name":"Delhi","Country":"India","Population":232363474
    })
    res.send('Data Added')
})



exports.getCiti = functions.https.onRequest(async (req,res) => {
    const citisRef = db.collection('marchnode');
    const snapshot =  await citisRef.get();
    const out = []
    snapshot.forEach(doc  => {
        out.push(doc.data())
    })
    
    res.send(out)
})

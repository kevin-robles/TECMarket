const express= require('express');
const axios = require('axios');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));
const session3= driver.session();

//MODELOS
const supermarket = require("../models/supermarket");
const client = require("../models/client");
const product = require("../models/product");
const employee = require("../models/employee");

router.post('/consults/consult1',async(req,res)=>{
    var idClient=req.body.idClient;
    var success=[];
    var errors=[];

    if(!idClient){
        errors.push({text:"You must enter the id of the client"});
    }else{
    }
})
router.post('/consults/consult4',async(req,res)=>{
    var idClient=req.body.idClient;
    var success=[];
    var errors=[];

    if(!idClient){
        errors.push({text:"You must enter the id of the client"});
    }else{
       
    }
})
router.post('/consults/consult5',async(req,res)=>{
    var idClient=req.body.idClient;
    var success=[];
    var errors=[];

    if(!idClient){
        errors.push({text:"You must enter the id of the client"});
    }else{
        session3
        .run("MATCH ((c:Client) WHERE c.idClient='"+idClient+"') RETURN c ")
        .then(function(result){ 
            console.log(result.records[0]._fields[0].properties)
        })
    }
})
router.get('/consults', (req,res)=>{
    res.render("consults/menuConsults");
})
router.get('/consults/consult1', (req,res)=>{
    res.render("consults/consult1");
})
router.get('/consults/consult2', (req,res)=>{
    res.render("consults/consult2");
})
router.get('/consults/consult3', (req,res)=>{
    res.render("consults/consult3");
})
router.get('/consults/consult4', (req,res)=>{
    res.render("consults/consult4");
})
router.get('/consults/consult5', (req,res)=>{
    res.render("consults/consult5");
})


module.exports = router;

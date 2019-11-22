const express= require('express');
const axios = require('axios');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("progra", "123"));
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
        session3
        .run('MATCH (c:Client) where c.idClient="'+idClient+'" return c')
        .then(function(result){
            console.log(result.records[0]._fields[0].properties)
        })
        .catch(function(err){
        })
    }
})
router.post('/consults/consult5',async(req,res)=>{
    var idClient=req.body.idClient;
    var success=[];
    var errors=[];
    var arrayFinaLProductos=[];

    if(!idClient){
        errors.push({text:"You must enter the id of the client"});
    }else{
        session3
        .run('MATCH (c:Client) where not c.idClient="'+idClient+'" return c')
        .then(function(result){ 

            session3
            .run('MATCH (p:Purchases) where p.client="'+result.records[0]._fields[0].properties.idClient+'" return p')
            .then(function(result){ 
                var ids= String(result.records[0]._fields[0].properties.products).split(",")
                
                var contadorPorductos=1;
                while(ids.length>contadorPorductos){
                    

                    session3
                    .run('MATCH (p:Product) where p.idProduct="'+ids[contadorPorductos]+'" return p')
                    .then(function(result){
                        var x =result.records[0]._fields[0].properties.name
                        console.log(x)
                        res.render("consults/showConsult",{
                            x
                        });
                        
                    })
                    .catch(function(err){
                    })
                    contadorPorductos+=1
                }
                console.log(arrayFinaLProductos)
            })

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

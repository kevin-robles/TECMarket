const express= require('express');
const axios = require('axios');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("daniel", "123"));
const session2= driver.session();
//MODELOS
const supermarket = require("../models/supermarket");


router.get('/migration', async (req,res)=>{
    //PASAR DE MONGO A NEO4J

    const supermarkets = await supermarket.find();

    var contador=0;
    while(supermarkets.length>contador){ 

        var lat=supermarkets[contador].latitude;
        var lng=supermarkets[contador].longitude;
        var address=supermarkets[contador].address;
        var description=supermarkets[contador].description;
        var photo=supermarkets[contador].photo;
        var rating=supermarkets[contador].rating;
        var website=supermarkets[contador].website;
        var name=supermarkets[contador].name;


        //meter datos, pero ya sirve ak7
        session2
        .run("CREATE (n:SuperMarket {name:}) RETURN n")
        .then(function(result){
            console.log(result.records[0]._fields[0].properties)
        })
        contador=10000;
    }

})

module.exports = router;
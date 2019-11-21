const express= require('express');
const axios = require('axios');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));
const session2= driver.session();

//MODELOS
const supermarket = require("../models/supermarket");
const client = require("../models/client");
const product = require("../models/product");
const employee = require("../models/employee");


router.get('/migration', async (req,res)=>{
    //PASAR DE MONGO A NEO4J

    const supermarkets = await supermarket.find();
    const clients = await client.find();
    const products = await product.find();
    const employees = await employee.find();

    //Productos y supermercado
    var arraySuperMProduct=[];

    var contadorSupermarket=0;
    while(supermarkets.length>contadorSupermarket){ 

        arraySuperMProduct.push(supermarkets[contadorSupermarket]);

        var contadorProducto=0;
        while(products.length>contadorProducto){

            if(products[contadorProducto].nameSupermarket==supermarkets[contadorSupermarket].name){

                arraySuperMProduct.push(products[contadorProducto])

            }

            contadorProducto+=1;

        }
        
        console.log(arraySuperMProduct)
        //añadir a la base y su relacion en neo4j

        //atributos supermarket
        var lat=arraySuperMProduct[0].latitude;
        var lng=arraySuperMProduct[0].longitude;
        var address=arraySuperMProduct[0].address;
        var descriptionS=arraySuperMProduct[0].description;
        var photoS=arraySuperMProduct[0].photo;
        var rating=arraySuperMProduct[0].rating;
        var website=arraySuperMProduct[0].website;
        var nameS=arraySuperMProduct[0].name;

        //agrega el supermercado primero
        session2
        .run("CREATE (n:SuperMarket {name:'"+nameS+"',latitude:'"+lat+"',longitude:'"+lng+"',address:'"+address+"'"+
            ",description:'"+descriptionS+"',photo:'"+photoS+"',rating:'"+rating+"',website:'"+website+"'})"+
            "RETURN n")
        .then(function(result){
            //console.log(result.records[0]._fields[0].properties)
        })

        var contadorProductosFinales=1;
        while(arraySuperMProduct.length>contadorProductosFinales){

            var idProduct=arraySuperMProduct[contadorProductosFinales].idProduct;
            var descriptionP=arraySuperMProduct[contadorProductosFinales].description;
            var price=arraySuperMProduct[contadorProductosFinales].price;
            var photoP=String(arraySuperMProduct[contadorProductosFinales].photo.data.contentType);
            var nameSupermarket=arraySuperMProduct[contadorProductosFinales].nameSupermarket;
            var quantity=arraySuperMProduct[contadorProductosFinales].quantity;
            var nameP=arraySuperMProduct[contadorProductosFinales].name;

            session2
            .run("CREATE (n:Product {idProduct:'"+idProduct+"',description:'"+descriptionP+"',price:"+price+",photo:'"+photoP+"'"+
                ",nameSupermarket:'"+nameSupermarket+"',quantity:'"+quantity+"',name:'"+nameP+"'})"+
                "RETURN n")
            .then(function(result){
                console.log(result.records[0]._fields[0].properties)
            })

            //conectar productos con supermercados
            
            session2
            .run("MATCH (a:SuperMarket),(b:Product) WHERE a.name = '"+arraySuperMProduct[0].name+"' AND b.nameSupermarket = '"+arraySuperMProduct[contadorProductosFinales].nameSupermarket+"' CREATE (a)-[r:posee]->(b) RETURN r")
            .then(function(result){ 
                console.log(result.records[0]._fields[0].properties)
            })

            contadorProductosFinales+=1
        }
        
        console.log("-----------------------Fin-----------------------------")
        arraySuperMProduct=[];
        contadorSupermarket+=100;
    }
    //fin productos por supermercado
    //

})

module.exports = router;

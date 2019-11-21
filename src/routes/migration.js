const express= require('express');
const axios = require('axios');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("daniel", "123"));
const session2= driver.session();
//MODELOS
const supermarket = require("../models/supermarket");
const client = require("../models/client");
const product = require("../models/product");
const employee = require("../models/employee");
const purchase = require("../models/purchase");


router.get('/migration', async (req,res)=>{
    //PASAR DE MONGO A NEO4J

    const supermarkets = await supermarket.find();
    const clients = await client.find();
    const products = await product.find();
    const employees = await employee.find();
    const purchases = await purchase.find();

    //este array contiene los productos por pedido es IMPORTANTE
    var productsFinal=[];

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
        .catch(function(err){
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
                //console.log(result.records[0]._fields[0].properties)
            })
            .catch(function(err){
            })

            contadorProductosFinales+=1
        }

        //conectar productos con supermercados
            
        session2
        .run('MATCH (a:SuperMarket),(b:Product) WHERE a.name=b.nameSupermarket and a.name="'+arraySuperMProduct[0].name+'" CREATE (a)-[r:hasProduct]->(b) RETURN r')
        .then(function(result){ 
            //console.log(result.records[0]._fields[0].properties)
        })
        .catch(function(err){
        })
        
        console.log("-----------------------Fin-----------------------------")
        arraySuperMProduct=[];
        contadorSupermarket+=1;
    }
    //fin productos por supermercado





    //-----------------------------------------------------------------------------------------------------------------




    //cliente con su pedido 
    var arrayClientePedido=[];

    var contadorCliente=0;
    while(clients.length>contadorCliente){ 

        arrayClientePedido.push(clients[contadorCliente]);

        var contadorPedido=0;
        while(purchases.length>contadorPedido){

            if(purchases[contadorPedido].client==String(clients[contadorCliente].idClient)){

                arrayClientePedido.push(purchases[contadorPedido])

            }

            contadorPedido+=1;

        }

        var idClient=arrayClientePedido[0].idClient;
        var nameC=arrayClientePedido[0].name;
        var phone=arrayClientePedido[0].phone;
        var email=arrayClientePedido[0].email;
        var birthdate=arrayClientePedido[0].birthdate;
        var username=arrayClientePedido[0].username;
        var password=arrayClientePedido[0].password;
    
        //agrega el cliente primero
        session2
        .run("CREATE (n:Client {idClient:'"+idClient+"',name:'"+nameC+"',phone:"+phone+",email:'"+email+"'"+
            ",birthdate:'"+birthdate+"',username:'"+username+"',password:'"+password+"'})"+
            "RETURN n")
        .then(function(result){
            //console.log(result.records[0]._fields[0].properties)
        })
        .catch(function(err){
        })

        var contadorPedidosFinales=1;
        while(arrayClientePedido.length>contadorPedidosFinales){

            var supermarketName=arrayClientePedido[contadorPedidosFinales].supermarketName;
            var date=arrayClientePedido[contadorPedidosFinales].date;
            var status=arrayClientePedido[contadorPedidosFinales].status;
            var extraInformation=arrayClientePedido[contadorPedidosFinales].extraInformation;
            var clientP=arrayClientePedido[contadorPedidosFinales].client;
            var finalPrice=arrayClientePedido[contadorPedidosFinales].finalPrice;
            
            var productsP=[];
            var contadorIdsPurchases=0;
            productsP.push(extraInformation)

            while(arrayClientePedido[contadorPedidosFinales].products.length>contadorIdsPurchases){ 
                //DEFINIDO AL INCIO ESTE ARRAY
                console.log(arrayClientePedido[contadorPedidosFinales].products[contadorIdsPurchases].idProduct)
                productsP.push(arrayClientePedido[contadorPedidosFinales].products[contadorIdsPurchases].idProduct)
                contadorIdsPurchases+=1;
            }

            productsFinal.push(productsP)

            //agregar purchases
            session2
            .run("CREATE (n:Purchases {client:'"+clientP+"',supermarketName:'"+supermarketName+"',date:'"+date+"',status:'"+status+"',extraInformation:'"+extraInformation+"'"+
                ",finalPrice:"+finalPrice+",products:'"+productsP+"'})"+
                " RETURN n")
            .then(function(result){
                console.log(result.records[0]._fields[0].properties)
            })
            .catch(function(err){
            })

            // RELACIONES CON supermercado
            session2
            .run('MATCH (a:SuperMarket),(b:Purchases) WHERE a.name=b.supermarketName and a.name="'+arrayClientePedido[contadorPedidosFinales].supermarketName+'" and b.supermarketName="'+arrayClientePedido[contadorPedidosFinales].supermarketName+'" CREATE (a)-[r:hasPurchaseAbout]->(b) RETURN r')
            .then(function(result){ 
                console.log(result.records[0]._fields[0].properties)
            })
            .catch(function(err){
            })

            contadorPedidosFinales+=1
        }

        //se hace la relacion de cliente con compras
        session2
        .run('MATCH (a:Client),(b:Purchases) WHERE a.idClient=b.client and a.idClient="'+arrayClientePedido[0].idClient+'" CREATE (a)-[r:didPurchase]->(b) RETURN r')
        .then(function(result){ 
            console.log(result.records[0]._fields[0].properties)
        })
        .catch(function(err){
        })

        arrayClientePedido=[];
        contadorCliente+=1;

    }

    //se agregan relaciones entre pedido y producto
    console.log(productsFinal)
    var contadorPrincipal=0;
    while(productsFinal.length>contadorPrincipal){

        console.log(1)
        var contadorInterno=1;

        while(productsFinal[contadorPrincipal].length>contadorInterno){
            console.log(2)
            session2
            .run('MATCH (a:Product),(b:Purchases) WHERE a.idProduct="'+productsFinal[contadorPrincipal][contadorInterno]+'"and b.extraInformation="'+productsFinal[contadorPrincipal][0]+'" CREATE (a)-[r:addedTo]->(b) RETURN r')
            .then(function(result){ 
                console.log(result.records[0]._fields[0].properties)
            })
            .catch(function(err){
            })

            contadorInterno+=1
        }

        contadorPrincipal+=1
    }

})

module.exports = router;

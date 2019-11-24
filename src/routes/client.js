const express= require('express');
const router = express.Router();
const supermarket = require("../models/supermarket");
const client = require("../models/client");
const product = require("../models/product");
const purchase = require("../models/purchase");
const fs = require('fs');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',
    Promise: Promise
});
const axios = require('axios');


router.post('/client/createClient',async(req,res)=>{
    var idClient= req.body.idClient;
    var name= req.body.name;
    var birthdate=req.body.birthdate;
    var username= req.body.username;
    var phone= req.body.phone;
    var email= req.body.email;
    var password= req.body.password;

    var success=[];
    var errors=[];

    if(!idClient){
        errors.push({text:"You must enter the id of the client"});
    }
    if(!name){
        errors.push({text:"You must enter the name of the client"});
    }
    if(!birthdate){
        errors.push({text:"You must enter the date of bith of the client"});
    }
    if(!username){
        errors.push({text:"You must enter the username"});
    }
    if(!phone){
        errors.push({text:"You must enter the phone number"});
    }
    if(!email){
        errors.push({text:"You must enter the email"});
    }
    if(!password){
        errors.push({text:"You must enter the password"});
    }
    if(errors.length>0){
        res.render("./client/createClient",{errors});
    } else{
        await client.findOne({idClient:idClient},async(err,founded)=>{
            if(founded){
                errors.push("The client already exists");
                res.render("./indexapp",{errors});
            }else{
                const newClient= new client ({idClient,name,phone,email,birthdate,username,password});
                newClient.save();
                success.push({text:"The client was created successfully"});
                res.render("./indexapp",{
                    success
                });
            }
        })
    }
});

router.post('/client/registerPurchase',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var status = req.body.status;
    var extraInformation = req.body.extraInformation;

    var errors=[];
    console.log(require('../index').currentPurchase);
    require('../index').currentPurchase = new purchase;
    console.log(require('../index').currentPurchase);
    
    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
    }
    if(!status){
        errors.push({text:"You must enter the status of the purchase"});
    }
    if(errors.length>0){
        res.render("./client/registerPurchase",{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./client/registerPurchase",{
                    errors
                });
            }else{
                
                require('../index').currentPurchase.supermarketName = supermarketName;
                require('../index').currentPurchase.status = status;
                require('../index').currentPurchase.extraInformation = extraInformation;
                require('../index').currentPurchase.client = require('../index').currentClient;
                res.render("./client/addProducts");    
            }
        })
    }
})

router.post('/client/addProducts',async(req,res)=>{
    var idProduct = req.body.idProduct;
    var quantity = req.body.quantity;

    var errors=[];
    var success=[];

    if(!idProduct){
        errors.push({text:"You must enter the product code"});
    }
    if(!quantity){
        errors.push({text:"You must enter the quantity"});
    }
    if(errors.length>0){
        res.render("./client/addProducts",{errors});
    }else{

        var supermarketName = require('../index').currentPurchase.supermarketName;

        await product.findOne({nameSupermarket:supermarketName,idProduct:idProduct},async(err,found)=>{
            if(!found){
                errors.push({text:"The product is not found"});
                res.render("./client/addProducts",{
                    errors
                });
            }else{
                if(parseInt(found.quantity)<parseInt(quantity)){
                    errors.push({text:"Not enough quantity in inventory"});
                    res.render("./client/addProducts",{errors});
                }else{
                    
                    
                    var current = require('../index').currentPurchase.finalPrice;
                    var price = (parseInt(found.price) * parseInt(quantity)); 

                    require('../index').currentPurchase.products.push({idProduct:idProduct,quantity:quantity,unitPrice:found.price});
                    require('../index').currentPurchase.finalPrice = (parseInt(current)+parseInt(price));

                    success.push({text:"Product added successfully"})
                    res.render("./client/addProducts",{success});
                }
                
            }
        })
    }
})

router.post('/client/finishPurchase',async(req,res)=>{
    var success = [];
    require('../index').currentPurchase.save();

    var i = 0;
    var len = require('../index').currentPurchase.products.length;
    while (i<len){
        var idProduct = require('../index').currentPurchase.products[i].idProduct;
        var quantity = require('../index').currentPurchase.products[i].quantity;

        await product.findOne({idProduct:idProduct},function(err,resp){
            if(err){
                console.log(err);
            }else{
                var oldQuantity = resp.quantity;
                var newQ = (parseInt(oldQuantity)-parseInt(quantity));
                resp.quantity = newQ;
                resp.save();
            }
        });
    i++;
    }
    success.push({text:"Successful registered purchase"});
    res.render("./indexClient",{success});
})

router.get('/client/create', (req,res)=>{
    res.render("client/createClient");
})

router.get('/client/registerPurchase', (req,res)=>{
    res.render("client/registerPurchase");
})

router.get('/client/purchasesHistory', async(req,res)=>{
    var idClient = require('../index').currentClient;
    const purchases = await purchase.find({client:idClient});

    res.render("client/purchasesHistory",{purchases});
})

router.get('/client/viewProductSupermarket', async(req,res)=>{
    res.render("client/selectSupermarket");
})

router.get('/client/viewSucursal', async(req,res)=>{
    res.render("client/viewSucursal");
})

router.post('/client/selectSupermarket',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var errors = [];

    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
        res.render('./client/selectSupermarket',{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./client/selectSupermarket",{
                    errors
                });
            }else{
                const products = await product.find({nameSupermarket:supermarketName});
                var paths = [];
                var i =0;
                while (i < products.length){
                    var path = 'C:/saved/'+i+'.jpg';
                    var thumb = new Buffer.from(products[i].photo.data,'base64');
                    fs.writeFile(path,thumb,function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                    });
                    products[i].photo.contentType = path;
                    paths.push({path:path});
                    i++;
                };
                res.render("client/supermarketProducts",{products,paths});
            }
        })
    }

})

router.post('/client/viewSucursal',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var radiusStr = req.body.radius;
    var radius = parseInt(radiusStr);
    var type = req.body.type;

    var errors = [];

    if(!supermarketName){
        errors.push({text:'Must enter the sucursal name'})
    }
    if(!radiusStr){
        errors.push({text:'Must enter the radius'})
    }
    if(isNaN(radius)){
        errors.push({text:'Radius must be a number'})
    }
    if(!type){
        errors.push({text:'Must enter the sucursal name'})
    }
    if(errors.length>0){
        res.render("./client/viewSucursal",{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./client/viewSucursal",{
                    errors
                });
            }else{
                var location = market.latitude+','+market.longitude;


                axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?&key=AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',{
                params:{
                    location:location,
                    radius:radius,
                    type:type
                }
                }).then((result) => {
                    if(result.data.results.length == 0){
                        errors.push({text:"No nearby places found"});
                        res.render("./client/viewSucursal",{
                            errors
                        });
                    }else{
                        var i = 0;
                        var places = [];
                        //console.log(result.data.results);
                        while(i< result.data.results.length){
                            var place = [{}];
                            if(!result.data.results[i].name){
                                place[0].name = 'Not available'
                            }else{
                                place[0].name = result.data.results[i].name
                            }

                            if(!result.data.results[i].place_id ){
                                place[0].place_id  = 'Not available'
                            }else{
                                place[0].place_id  = result.data.results[i].place_id 
                            }

                            if(!result.data.results[i].rating){
                                place[0].rating = 'Not available'
                            }else{
                                place[0].rating = result.data.results[i].rating
                            }

                            if(!result.data.results[i].schedule){
                                place[0].schedule = 'Not available'
                            }else{
                                place[0].schedule = result.data.results[i].opening_hours
                            }

                            if(!result.data.results[i].photo){
                                place[0].photo = '/'
                            }else{
                                var path = 'C:/saved/place'+i+'.jpg';
                                var thumb = new Buffer.from(result.data.results[i].photos[0].photo_reference,'base64');
                                fs.writeFile(path,thumb,function(err) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        place[0].photo = path;
                                        console.log("The file was saved!");
                                    }
                                });
                            }

                            places.push(place[0]);
                            i++;
                        }
                        require('../index').currentSupermarketName = supermarketName;
                        require('../index').currentLocation = location;
                        require('../index').currentNearbyPlaces = places;
                        res.render("client/nearbyPlaces",{places});
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    }
    
})

router.get('/client/addInterestPlace',async(req,res)=>{
    res.render('./client/selectInterestPlace');
})
router.post('/client/selectInterestPlace',async(req,res)=>{
    var name = req.body.name;
    var errors = [];
    var place_id = "";

    if(!name){
        errors.push({text:'Must enter the name'})
        res.render('./client/selectInterestPlace',{errors});
    }else{
        var i =0;
        while(i< require('../index').currentNearbyPlaces.length){
            if(require('../index').currentNearbyPlaces[i].name == name){
                place_id = require('../index').currentNearbyPlaces[i].place_id;
                console.log(1);
            }
            i++;
        }
        if(place_id == ""){
            errors.push({text:'The name is incorrect'})
            res.render('./client/selectInterestPlace',{errors});
        }else{
            axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?&key=AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',{
            params:{
                origins:require('../index').currentLocation,
                destinations:'place_id:'+place_id
            }
            }).then((result) => {
                client.findOne({idClient:require('../index').currentClient},function(err,resp){
                    if(err){
                        console.log(err);
                    }else{
                        resp.interestPlaces.push({supermarket:require('../index').currentSupermarketName,nearbyPlace:name,distance:result.data.rows[0].elements[0].distance.text});
                        resp.save();
                        var places =require('../index').currentNearbyPlaces;
                        var success = [{text:'Interest place added correctly'}]
                        res.render("./client/nearbyPlaces",{places,success});
                    }
                        
                });
            }).catch((err) => {
                    console.log(err);
                });
        }
    }
})


router.get('/client/goBack',async(req,res)=>{
    res.render("./indexClient");
})

router.get('/client/readSupermarket',async(req,res)=>{
    res.render("client/chooseSupermarket");
})

router.post('/client/chooseSupermarket',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var errors = [];

    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
        res.render('./client/chooseSupermarket',{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./client/chooseSupermarket",{
                    errors
                });
            }else{
                var path = 'C:/saved/supermarket.jpg';
                var thumb = new Buffer.from(market.photo,'base64');
                fs.writeFile(path,thumb,function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(market);
                        market.schedule = market.schedule[0].open_now;
                        market.photo = path;
                        res.render("client/supermarket",{market});
                        console.log("The file was saved!");
                    }
                });
                
            }
        })
    }

})

module.exports = router;
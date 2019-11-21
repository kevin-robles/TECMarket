const express= require('express');
const router = express.Router();
const supermarket = require("../models/supermarket");
const client = require("../models/client");
const product = require("../models/product");
const purchase = require("../models/purchase");
const fs = require('fs');


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
                errors.push("The passanger already exists");
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
                    var path = './images/'+i+'.jpg';
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

module.exports = router;
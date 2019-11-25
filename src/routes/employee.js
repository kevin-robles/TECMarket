const express= require('express');
const router = express.Router();
const employee = require("../models/employee");
const product = require("../models/product");
const supermarket = require("../models/supermarket");
const fs = require('fs');

router.post('/employee/registerEmployee',async(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var typeEmployee = req.body.type;

    var success = [];
    var errors = [];
    
    if(!username){
        errors.push({text:"Must enter the username"});
    }
    if(!password){
        errors.push({text:"Must enter the password"});
    }
    if(!typeEmployee){
        errors.push({text:"Must enter the type of employee"});
    }
    if(errors.length>0){
        res.render("./employee/registerEmployee",{
            errors
        });
    }else{
        const NewEmployee = new employee({username,password,typeEmployee});
        NewEmployee.save();
        success.push({text:"Successful registered employee"});
            res.render("./indexEmployee",{success});
    }
})


//Falta meter la foto
router.post('/employee/registerProduct',async(req,res)=>{
    
    var idProduct = req.body.code;
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var photo = req.body.photo;
    var nameSupermarket = req.body.nameSupermarket;
    var quantity = req.body.quantity;
    console.log(photo);
    var success = [];
    var errors = [];

    if(!idProduct){
        errors.push({text:"Must enter the code"});
    }
    if(!name){
        errors.push({text:"Must enter the name"});
    }
    if(!description){
        errors.push({text:"Must enter the description"});
    }
    if(!price){
        errors.push({text:"Must enter the price"});
    }
    if(!photo){
        errors.push({text:"Must enter the photo"});
    }
    if(!nameSupermarket){
        errors.push({text:"Must enter the supermarket name"});
    }
    if(!quantity){
        errors.push({text:"Must enter the quantity"});
    }
    if(errors.length>0){
        res.render("./employee/registerProduct",{
            errors
        });
    }else{
        await supermarket.findOne({name:nameSupermarket},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./employee/registerProduct",{
                    errors
                });
            }else{
                await product.findOne({idProduct:idProduct},async(err,pro)=>{
                    if(pro){
                        errors.push({text:"The product code already exist"});
                        res.render("./employee/registerProduct",{errors});
                    }else{
                        var path = 'C:/products/'+photo;
                        console.log(path);
                        var NewProduct = new product;
                        NewProduct.idProduct = idProduct;
                        NewProduct.name = name;
                        NewProduct.description = description;
                        NewProduct.price = price;
                        NewProduct.nameSupermarket = nameSupermarket;
                        NewProduct.photo.data = fs.readFileSync(path);
                        NewProduct.photo.contentType = 'image/png';
                        NewProduct.quantity = quantity;
                        
                        NewProduct.save();
                        success.push({text:"Successful registered product"});
                            res.render("./indexEmployee",{success});
                    }
                })
                
            }
        })
    }
})

router.get('/employee/registerEmployee', (req,res)=>{
    res.render("employee/registerEmployee");
})

router.get('/employee/registerProduct', (req,res)=>{
    res.render("employee/registerProduct");
})
router.get('/employee/registerSupermarket', (req,res)=>{
    res.render("manageSucursal/manageAddSucursal");
})
router.get('/employee/readSupermarket',async(req,res)=>{
    res.render("employee/chooseSupermarket");
})
router.post('/employee/chooseSupermarket',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var errors = [];

    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
        res.render('./employee/chooseSupermarket',{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./employee/chooseSupermarket",{
                    errors
                });
            }else{
                market.schedule = market.schedule[0].open_now;
                res.render("employee/supermarket",{market});    
            }
        })
    }

})

router.get('/employee/editSupermarket', (req,res)=>{
    res.render("employee/selectEditSupermarket");
})
router.get('/employee/deleteSupermarket', (req,res)=>{
    res.render("./employee/selectDeleteSupermarket");
})

router.post('/employee/selectEditSupermarket',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var errors = [];

    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
        res.render('./employee/selectDeleteSupermarket',{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./employee/selectDeleteSupermarket",{
                    errors
                });
            }else{
                require('../index').currentSupermarketName = supermarketName;
                var name = [{name:supermarketName}];
                res.render('employee/editSupermarket',{name})
            }
        })
    }
})
router.post('/employee/editSupermarket',async(req,res)=>{
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var address = req.body.address;
    var description = req.body.description;
    var internationalPhone = req.body.internationalPhone;
    var rating = req.body.rating;
    var schedule = req.body.schedule;
    var photo = req.body.photo;

    var errors= [];
    var success = [];

    await supermarket.findOne({name:require('../index').currentSupermarketName},async(err,market)=>{
        var contador = 0;
        if(latitude){
            market.latitude = latitude;
            contador++;
        }
        if(longitude){
            market.longitude = longitude;
            contador++;
        }
        if(address){
            market.address = address;
            contador++;
        }
        if(description){
            market.description = description;
            contador++;
        }
        if(internationalPhone){
            market.internationalPhone = internationalPhone;
            contador++;
        }
        if(rating){
            market.rating = rating;
            contador++;
        }
        if(schedule){
            market.schedule = schedule;
            contador++;
        }
        if(photo){
            var path = 'C:/supermarkets/'+photo;
            market.photo = fs.readFileSync(path);
        }
        if(contador ==0){
            errors.push({text:"Must edit at least one field"});
            res.render("./employee/editSupermarket",{
                errors
            });
        }else{
            market.save();
            success.push({text: "Supermarket edited correctly"});
            res.render("./indexEmployee",{success});
        }

    })
})

router.post('/employee/selectDeleteSupermarket',async(req,res)=>{
    var supermarketName = req.body.supermarketName;
    var errors = [];
    var success = []

    if(!supermarketName){
        errors.push({text:"You must enter the supermarket name"});
        res.render('./employee/selectDeleteSupermarket',{errors});
    }else{
        await supermarket.findOne({name:supermarketName},async(err,market)=>{
            if(!market){
                errors.push({text:"The supermarket is not found"});
                res.render("./employee/selectDeleteSupermarket",{
                    errors
                });
            }else{
                await supermarket.deleteOne({name:supermarketName},(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        success.push({text: "Supermarket deleted correctly"});
                        res.render("./indexEmployee",{success});
                    }
                })
            }
        })
    }
})
module.exports = router;
const express= require('express');
const router = express.Router();
const employee = require("../models/employee");
const product = require("../models/product");
const supermarket = require("../models/supermarket");

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
    var description = req.body.description;
    var price = req.body.price;
    var photo = req.body.photo;
    var nameSupermarket = req.body.nameSupermarket;

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
                const NewProduct = new product({idProduct,name,description,price,photo,nameSupermarket});
                NewProduct.save();
                success.push({text:"Successful registered product"});
                    res.render("./indexEmployee",{success});
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

module.exports = router;
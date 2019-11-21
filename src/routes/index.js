const express= require('express');
const router = express.Router();
const employee = require("../models/employee");
const client = require("../models/client");
const bcrypt = require('bcrypt');

router.post('/Indexapp',async(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var errors = [];
    var finalPassword = "";
    var type;
    var idClient;

    await employee.findOne({username:username}, async(err,emplo)=>{
        if(err){
            console.log(err);
        }
        if(emplo){
            type = emplo.typeEmployee;
            finalPassword = emplo.password;
        }
    })

    await client.findOne({username:username}, async(err,client)=>{
        if(err){
            console.log(err);
        }
        if(client){
            idClient = client.idClient;
            type = "client";
            finalPassword = client.password;  
        }
    })

    await bcrypt.compare(password, finalPassword, async(err, resp)=>{
        if(err){
            console.log(err);
        }
        if(finalPassword==""){
            errors.push({text:"User not found"});
            res.render("./indexapp",{
            errors
            })
            return;
        }

        if(resp){
            console.log(type);
            if(type=="Administrator"){
                res.render("./indexEmployee");

            }else if(type=="Worker"){
                res.render("./indexEmployee");
                
            }else if(type=="client"){
                require('../index').currentClient = idClient;
                res.render("./indexClient");
            }
        }else{
            errors.push({text:"Incorrect Password"});
            res.render("./indexapp",{
            errors
            })
        } 
    });

})

router.get('/', (req,res)=>{
    res.render('Indexapp');
})

router.get('/manage', (req,res)=>{
    res.render('indexManageSucursal');
})

module.exports = router;
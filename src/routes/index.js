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
            
            if(type=="Administrator"){
                res.render("./indexEmployee");

            }else if(type=="Worker"){
                res.render("./indexEmployee");
                
            }else if(type=="client"){
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

module.exports = router;
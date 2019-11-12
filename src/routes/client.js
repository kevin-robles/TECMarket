const express= require('express');
const router = express.Router();
const employee = require("../models/employee");
const client = require("../models/client");
const bcrypt = require('bcrypt');

router.post('/client/createClient',async(req,res)=>{
    var idClient= req.body.idClient;
    var name= req.body.name;
    var birthdate=req.body.birthdate;
    var username= req.body.username;
    var phone= req.body.phone;
    var email= req.body.email;
    var password= req.body.password;

    var sucess=[];
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
        res.render("./cliente/usuarioCrear",{
            errors,
            idClient,
            name,
            birthdate,
            username,
            phone,
            email,
            password
        });
    } else{
        await client.findOne({idClient:idClient},async(err,founded)=>{
            if(founded){
                errors.push("The passanger already exists");
                res.render("./indexapp",{
                    errors
                });
                return;
            }
            
        })
        const newClient= new client ({idClient,name,phone,email,birthdate,username,password});
        newClient.save();
        sucess.push({text:"The client was created successfully"});
        res.render("./indexapp",{
            sucess
        });
    }

});

router.get('/client/create', (req,res)=>{
    res.render("client/createClient");
})

module.exports = router;
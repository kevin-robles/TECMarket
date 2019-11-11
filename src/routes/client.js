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
    var telephone= req.body.phone;
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
    if(!telephone){
        errors.push({text:"You must enter the telephone"});
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
            telephone,
            email,
            password
        });
    } else{
        await client.findOne({idClient:idClient},async(err,founded)=>{
            if(founded){
                errors.push("El pasajero ingresada ya existe");
                res.render("./administrador/usuarioCrear",{
                    errors
                });
                return;
            }
        })
        const newClient= new client ({idClient,name,birthdate,username,telephone,email,password});
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
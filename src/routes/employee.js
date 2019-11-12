const express= require('express');
const router = express.Router();
const employee = require("../models/employee");

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

router.get('/employee/registerEmployee', (req,res)=>{
    res.render("employee/registerEmployee");
})

module.exports = router;
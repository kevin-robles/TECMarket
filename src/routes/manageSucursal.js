const express= require('express');
const axios = require('axios');
const router = express.Router();
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',
    Promise: Promise
});
const fs = require('fs');
const supermarket = require("../models/supermarket");

//add new sucursal
router.get('/manage/add', (req,res)=>{
    res.render("manageSucursal/manageAddSucursal");
})
router.get('/manage/byName', (req,res)=>{
    res.render("manageSucursal/manageAddSucursalName");
})
router.get('/manage/byLatLng', (req,res)=>{
    res.render("manageSucursal/manageAddSucursalLatLng");
})


//posts
router.post('/search', (req,res)=>{

    var location = String(req.body.entrada);
    var success=[];
    
    axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',{
    
    params:{
        input:location
    }

    })
    .then(function(response) {
        
        var latitude = response.data.candidates[0].geometry.location.lat;
        var longitude = response.data.candidates[0].geometry.location.lng;
        var name = response.data.candidates[0].name;
        var rating = response.data.candidates[0].rating;
        var address = response.data.candidates[0].formatted_address;
        var photo = response.data.candidates[0].photos[0].photo_reference;
        var schedule = response.data.candidates[0].opening_hours;
        var website = String(response.data.candidates[0].photos[0].html_attributions);
        var description = "Supermarket";
        var internationalPhone = "506";

        const newSupermarket= new supermarket({name,latitude,longitude,address,description,photo,internationalPhone,rating,schedule,website});
        newSupermarket.save();
        //console.log(newSupermarket)
        success.push({text:"The sucursal was created successfully"});
        res.render("./indexEmployee",{
            success,
        });

    }).catch(function(err) {
        console.log(err)
    });
})

router.post('/add/searchByLatLng', (req,res)=>{
  
    var latitude = String(req.body.latitude)+",";
    var longitude = String(req.body.longitude);

    var latlng= latitude+longitude;
    
    axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',{
    
    params:{
        input:'point:'+latlng,
        }
    })
    .then(function(response){
        console.log(response)

    })
    .catch(function(err){
        console.log(err)
    })
})

module.exports = router;
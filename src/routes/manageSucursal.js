const express= require('express');
const router = express.Router();
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBLFLwYDHIrtArs-xG5TY5u8Verwhcq_do',
    Promise: Promise
});

//add new sucursal
router.get('/manage/add', (req,res)=>{
    res.render("manageSucursal/manageAddSucursal");
})
router.get('/manage/byName', (req,res)=>{
    res.render("manageSucursal/manageAddSucursalName");
})
router.get('/manage/byLatLng', (req,res)=>{
    
})

//manage product
router.get('/gestionar/producto', (req,res)=>{
    
})
//consult
router.get('/gestionar/consultar', (req,res)=>{
    
})

//posts
router.post('/search', (req,res)=>{

    console.log("correcto")

})


module.exports = router;
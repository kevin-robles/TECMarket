const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const supermarketSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    latitude:{
        type: String,
        required: true
    },
    longitude:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    photo:{
        type: String
    },
    internationalPhone:{
        type: Number
    },
    rating :{
        type: Number
    },
    schedule:{
        type: Array
    },
    website:{
        type: String
    }
})

module.exports = mongoose.model("supermarket",supermarketSchema)
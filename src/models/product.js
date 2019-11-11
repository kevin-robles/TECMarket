const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const productSchema = new Schema({
    idProduct :{
        type: Number,
        required: true,
        unique : true,
        trim : true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required : true
    },
    photo:{
        type: String,
        required : true
    }
})

module.exports = mongoose.model("product",productSchema)
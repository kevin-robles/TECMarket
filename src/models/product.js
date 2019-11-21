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
        data: Buffer,
        contentType: String
    },
    nameSupermarket:{
        type: String,
        required : true
    },
    quantity:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("product",productSchema)
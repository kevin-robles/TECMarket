const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const purchaseSchema = new Schema({
    supermarketName:{
        type: String
    },
    date:{
        type: Date,
        default : new Date
    },
    status:{
        type: String
    },
    extraInformation:{
        type: String,
        unique:true
    },
    client:{
        type: String,
    },
    products:{
        type: Array,
        default: []
    },
    finalPrice:{
        type: Number,
        default:0
    }
})

module.exports = mongoose.model("purchase",purchaseSchema)
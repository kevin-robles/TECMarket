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
    },
    client:{
        type: String,
    },
    products:{
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("purchase",purchaseSchema)
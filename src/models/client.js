const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const clientSchema = new Schema({
    idClient:{
        type: Number,
        unique : true,
        required : true
    },
    name:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required : true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique : true
    },
    birthdate:{
        type: Date,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique : true
    },
    password:{
        type: String,
        required: true
    }
});

clientSchema.pre('save',function(next){
    const user = this;
    if (!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, async(err, salt)=>{
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash; 
        next();
       });
    });
})

module.exports = mongoose.model("client",clientSchema)
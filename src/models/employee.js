const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const employeeSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique : true
    },
    password:{
        type: String,
        required: true
    },
    typeEmployee:{
        type:String,
        required: true
    }
})

employeeSchema.pre('save',function(next){
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

module.exports = mongoose.model("employee",employeeSchema)
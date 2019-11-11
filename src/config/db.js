const mongoose = require('mongoose');
const dbURL = require('./props').DB;

module.exports = ()=>{
    mongoose.connect(dbURL, {useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> console.log(`Mongo connected on ${dbURL}`))
    .catch(err => console.log(`Error at  ${err}`))

    process.on('SINGIT', ()=>{
        mongoose.connection.close(()=>{
            console.log('Mongo is disconnected');
            process.exit(0);
        });
    });
}
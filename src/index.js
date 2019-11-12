const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require("method-override");
const session = require('express-session');

//starting
const DB = require('./config/db');
DB();


//configuration
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname :'.hbs'
}));
app.set('view engine', '.hbs');

//midlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

//global vars

//routes
app.use(require('./routes/index'));
app.use(require('./routes/client'));


//static files
app.use(express.static(path.join(__dirname,'public')));

//server is listening
app.listen(app.get('port'),()=> {
    console.log("Server at ",app.get("port"))
});
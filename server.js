const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./config/passport')(passport);

const db = require('./config/key').MONGO_URI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology:true})
        .then(console.log('Mongo Connected'))
        .catch(e => console.log(e.message)); 

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.set(express.static('public'));

app.use(express.urlencoded({extended: false}));

app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
})

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Listening..'));
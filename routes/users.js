const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/User')
const passport = require('passport');


router.get('/login', (req, res) => {
  res.render('login');
})


router.get('/register', (req, res) => {
  Users.find({}).then(res => console.log(res));  
  res.render('register');
})

router.post('/register', (req, res) => {
  const {name, email, password, password2} = req.body;
  let errors = [];

  if(!name || !email || !password || !password2){
    errors.push({msg: "Please fill all the fields"});
  }

  if(password !== password2){
    errors.push({msg: "Password not matching"});
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  }else{

    Users.findOne({email: email})
         .then(user => {
            if(user){
              errors.push({msg: "User already exist"});
              res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              })       
           }else{
              const newUser = new Users({
                name,
                email,
                password
              })
              
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  newUser.password = hash;

                  newUser.save()
                         .then(_ => {
                            req.flash('success_msg', "User created you can now login");
                            res.redirect('/users/login')
                          })
                         .catch(err => console.log(err.message));
                })
              })       
           }
         });
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', "You are logged out")
  res.redirect('/users/login');
})

module.exports = router;
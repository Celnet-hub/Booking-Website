//dependencies
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user Model

const user = require('../models/User.js')

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email,password,done) => {
            // match user
            user.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null,false, { message : 'That email is not registered'});
                    }

                    //match password
                    bcrypt.compare(password, user.password, (err, isMatched) => {
                        if(err) throw err;

                        if (isMatched) {
                            return done(null, user);
                        }else{
                            return done(null, false, {message: 'Password is incorrect'});
                        }
                    })


                }).catch((err) => {
                    console.log(err);
                });
        })
    );

      passport.serializeUser((user, done) => {
				done(null, user.id);
			});

			passport.deserializeUser( (id, done) => {
				user.findById(id, (err, user) =>  {
					done(err, user);
				});
			});
};
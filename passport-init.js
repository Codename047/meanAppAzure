var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        User.findById(id,function(err,user){
            if(err){
                return done(err,false);
            }
            if(!user){
                return done('user not foud',false);
            }
            return done(null,user);
        })
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 

           User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err,false);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done('User Not Found with username '+username, false);                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done('Invalid Password', false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log("ASsdasadasda"+User)
            User.findOne({'username': username},function(err,user){
               console.log("INSIDE FIND");
                if(err){
                    return done("Error Found"+err,false);
                }
                if(user){
                    console.log("taken user");
                    return done("already taken",false);
                }
            else{
               var user = new User();
               user.username = username;
               user.password  = createHash(password);
               user.save(function(err){
                    console.log("On save")
                    if(err){
                        return done(err,false);
                    }
                    console.log('successfull signed ON'+ user);
                    return done(null,user);
                })
           }
        })
    })
    )   ;

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
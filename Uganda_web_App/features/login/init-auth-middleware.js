const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { getUserForLoginData, getUserById } = require('./repository');

module.exports = function initAuthMiddleware(app) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
       getUserForLoginData({username:username, password:password},(err,result)=>{
        if (err) {
          return done(null, false);
        }else{
          return done(null, result);
        }
       });      
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.USER_INFO_ID)
  });

  passport.deserializeUser(async (USER_INFO_ID, done) => {
  getUserById(USER_INFO_ID,(err,result)=>{
    if (err) {
      return done(`Could not deserialize user with id ${USER_INFO_ID}`);
    }else{
      return done(null, result);
    }
  });    
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

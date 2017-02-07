var express = require('express');
var mongoose = require('mongoose');
var morgan = require("morgan");
var passport = require("passport");
var jwt = require("jwt-simple");
var bodyParser = require('body-parser');
var bcrypt = require("bcryptjs");
var JwtStrategy = require('passport-jwt').Strategy;
mongoose.connect('mongodb://mukuljain:mukuljain@ds145669.mlab.com:45669/doctoron');
var app = express();

///app use 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());

var port = process.env.PORT || 8080;

///listen to the port
var server  = app.listen(port);

var router = express.Router();

var Schema = mongoose.Schema;

///this is the appointment schema
var appointmentSchema = new Schema({
  patient_name:String,
  age:Number
});

///doctor schema

var DoctorSchema = new Schema({
  name:String,
  appointment:[appointmentSchema]
});

///this is the user schema
var UserSchema = new Schema({
  name:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  appointments:{
    doctor_name:String,
    place:String
  }
});

///this will be for our authentication

UserSchema.pre('save',function(next){
  var user = this;
  if(this.isModified('password')||(this.isNew)){
    bcrypt.genSalt(10,function(err,salt){
      if(err){
        return next(err);
      }
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err){
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }else{
    return next();
  }
});

///this will be for comparing the passowrds

UserSchema.methods.comparePassword = function(passw,cb){
  bcrypt.compare(passw,this.password,function(err,isMatch){
    if(err){
      return cb(err);
    }
    else{
      cb(null,isMatch);
    }
  });
};

///here will be our jwt strategy for our function 

var JwtStrategy = require('passport-jwt').Strategy;
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};

///this will be the user
var User = mongoose.model('User',UserSchema);
////this is the doctor model
var Doctor = mongoose.model('Doctor',DoctorSchema);
var Appointment = mongoose.model('Appointment',appointmentSchema);

router.get("/cool",function(req,res){
  res.json({message:"this is cool django api is working"});
});

////this will be our signup route

router.route('/signup')
.post(function(req,res){
  if(!req.body.name || !req.body.password){
    res.json({sucess:false,msg:'Please pass both name and password'});
  }else{
    var newUser = new User({
    name:req.body.name,
    password:req.body.password
  });
    newUser.save(function(err){
      if(err){
        res.json({success:false,msg:'User is not saved'});
      }else{
        res.json({success:true,msg:'User is saved congrats'})
      }
    });
}
});

////authenticate the User and the password

router.route('/authenticate')
.post(function(req,res){
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


///save a doctor

router.route('/doctors')
.post(function(req,res){
  var doctor = new Doctor();
  doctor.name = req.body.name;
  doctor.save(function(err){
    if(err){
      res.send(err);
    }
    res.json({message:"Doctor Created"});
  });
});

///an api endpoint to get all the users
router.route('/users/all')
.get(function(req,res){
  User.find(function(err,users){
    if(err){
      res.json({message:"This is the error Damn"});
    }
    else{
      res.json(users);
    }
  });
});

router.route

///add an appointment
router.route('/doctors/:doctor_id/add')
.post(function(req,res){
  Doctor.findById(req.params.doctor_id,function(err,doc){
    if(err){
      res.send(err);
    }
    else{
      doc.appointment.push({
        patient_name:req.body.patient_name,
        age:req.body.age
      });
      doc.save(function(err){
        if(err){
          res.send(err);
        }
      });
      res.json({message:"appointment created"});
    }
  });

});

///get all the doctors
router.route('/doctors')
.get(function(req,res){
  Doctor.find(function(err,doctors){
    if(err){
      res.send(err);
    }
    res.json(doctors);
  });
});

///get a particluar doctor
router.route('/doctors/:doctor_id')
.get(function(req,res){
  Doctor.findById(req.params.doctor_id,function(err,doctr){
    if(err){
      res.send(err);
    }
    res.json(doctr);

  });
});

///get appointments for a particular doctor
///get a particluar doctor
router.route('/doctors/:doctor_id/appointment')
.get(function(req,res){
  Doctor.findById(req.params.doctor_id,function(err,doctr){
    if(err){
      res.send(err);
    }
    res.json(doctr.appointment);

  });
});

app.use("/",router);

console.log("magic is happening on port "+port);


///connection to the database ends
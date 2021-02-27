const Mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BCRYPT_SALT;
const Schema = Mongoose.Schema;

// Model
const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Please include a user 'firstname':"
    },
    middlename: {
      type: String,
      trim: true,
      lowercase: true
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Please include a user 'lastname':"
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Please include a user 'email':",
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,4})+$/, "Please include a valid user 'email':"],
      index: {unique: true}
    },
    password:{
      type: String,
      trim: true,
      required: "Please include a user 'password':"
    },
    active:{
      type: Boolean,
      required: "Please say if user is 'active':",
      default: true
    },
    roles:[
      {
        type: Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  }
);

// Hook Helper Functions
// Use hooks to hash password 
const hashPassword = function(callbackFunction){
  // Only hash password if new or changed
  if(!this.isModified("password")) return callbackFunction();

  // Prepare Salt
  bcrypt.genSalt(bcryptSalt, 
    function(error, salt){
      if(error) return callbackFunction(error);
      // Generate the hash
      bcrypt.hash(this.password, salt, 
        function(err, hash){
          if(err) return callbackFunction(err);
          this.password = hash;
          return callbackFunction();
        }
      );
    }
  );
};

UserSchema.methods.checkPassword = function(passedPassword, callbackFunction){
  bcrypt.compare(passedPassword, this.password, 
    function(error, isMatch) {
      if(error) return callbackFunction(error);
      return callbackFunction(null, isMatch); // No error so return match
    }
  );
};

// When to check password hash
UserSchema.pre("save", hashPassword); // create
UserSchema.pre("findOneAndUpdate", hashPassword); // update
// UserSchema.pre("insertMany", hashPassword); // bulkCreate  Hash needs to be done on each element before doing the bulk create

const User = Mongoose.model("User", UserSchema);

module.exports = {
  User,
  UserSchema
};
const Mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bcryptSalt = parseInt(process.env.BCRYPT_SALT);
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
const hashPassword = async function(password){
  // Prepare Salt
  await bcrypt.genSalt(bcryptSalt)
    .then(async (salt) =>{
      // Generate the hash
      console.log("password:",password);
      console.log("salt:",salt);
      await bcrypt.hash(password, salt)
        .then((hash)=>{
          return hash;
        })
        .catch((error)=>{
          console.log(`Error generating hash:${error}`);
        });
    })
    .catch((err)=>{
      console.log(`Error generating salt:${err}`);
    });
};

// Need to hash password before creating user
const createUser = async function(){
  this.password = await hashPassword(this.password);
  console.log("Creating User:",this);
}
// Need to check if password changed differently on update than on a create
const updateUser = async function(){
  const userToUpdate = await this.model.findOne(this.getQuery());
  
  console.log("old:", userToUpdate);
  console.log("Update:",this._update);

  if(userToUpdate.password !== this._update.password){
    console.log("Password Changed");
    this._update.password = await hashPassword(this._update.password);
    console.log("New password hashed");
  }
};

UserSchema.methods.checkPassword = function(passedPassword, callbackFunction){
  console.log("Checking Password");
  bcrypt.compare(passedPassword, this.password, 
    function(error, isMatch) {
      if(error) return callbackFunction(error);
      return callbackFunction(null, isMatch); // No error so return match
    }
  );
};

// When to check password hash
UserSchema.pre("save", createUser); // create
UserSchema.pre("findOneAndUpdate", updateUser); // update
// UserSchema.pre("insertMany", hashPassword); // bulkCreate  Hash needs to be done on each element before doing the bulk create

const User = Mongoose.model("User", UserSchema);

module.exports = {
  User,
  UserSchema
};
const Mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bcryptSalt = parseInt(process.env.BCRYPT_SALT || 10);
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
/**
 * Takes a password and returns the hash for the password.
 * @param {String} password 
 */
const hashPassword = async function(password){
  // Prepare Salt
  return await bcrypt.genSalt(bcryptSalt)
    .then(async (salt) =>{
      // Generate the hash
      return await bcrypt.hash(password, salt)
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

// Pre-work when creating user
// Need to hash password before creating.
const createUser = async function(){
  this.password = await hashPassword(this.password);
}
// pre-work when updating the user
// Need to check if password changed on update and hash if yes.
const updateUser = async function(){
  // Find current user values.
  const userToUpdate = await this.model.findOne(this.getQuery());
  // If they passed in a password, check if it is changed.
  if(this._update.password && (userToUpdate.password !== this._update.password)){
    this._update.password = await hashPassword(this._update.password);
  }
};

// Used to check entered password against stored hash.
UserSchema.methods.checkPassword = function(passedPassword, callbackFunction){
  bcrypt.compare(passedPassword, this.password, 
    function(error, isMatch) {
      if(error){
        console.log("Error checking password:",error);
        return callbackFunction(error);
      }
      return callbackFunction(null, isMatch); // No error so return match status
    }
  );
};

// Register hooks
UserSchema.pre("save", createUser); // create
UserSchema.pre("findOneAndUpdate", updateUser); // update

const User = Mongoose.model("User", UserSchema);

module.exports = {
  User,
  UserSchema
};
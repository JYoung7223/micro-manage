const mongoose = require("mongoose");
const { User, hashPassword, Role } = require("../models");
require("dotenv").config();
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT;
const bcrypt = require("bcrypt");
const bcryptSalt = parseInt(process.env.BCRYPT_SALT);
const roleSeedData = require("./roleSeedData.json");
const userSeedData = require("./userSeedData.json");

const seedDatabase = async () => {
  // This file empties the collection and inserts the seeds below
  mongoose.connect(
    process.env.MONGODB_URI || `${dbDialect}://${dbHost}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  );

  // Seed Roles
  let roleDBData = "";
  await Role.deleteMany({})
    .then(() => Role.insertMany(roleSeedData))
    .then((data) => {
      roleDBData = data;
      console.log(data.length + " roles inserted!");
      // process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

  // Seed Users
  await User.deleteMany({})
    .then(async() => {
      // Hash Password and Add Roles before inserting
      for(let h=0; h<userSeedData.length; h++){
        const user=userSeedData[h];
        // Hash Passwords
        // Prepare Salt
        console.log(`Hashing password ${h} for user:${JSON.stringify(user)}`);
        await bcrypt.genSalt(bcryptSalt)
          .then(async (salt) =>{
            // Generate the hash
            console.log("Salt", salt);
            await bcrypt.hash(user.password, salt)
              .then((hash)=>{
                console.log("Hash",hash);
                user.password = hash;
              })
              .catch((error)=>{console.log("Error generating hash:",error);});
          })
          .catch((err)=>{console.log("Error generating salt:",err);});

        // Add Roles
        console.log(`Adding roles ${h} for user:${JSON.stringify(user)}`);
        user.roles = [];
        // Add All roles to the first half of users
        if (h < userSeedData.length / 2) {
          for (let i = 0; i < roleDBData.length; i++) {
            user.roles.push({ _id: roleDBData[i]._id });
          }
          // Make last half of users part of 1 random role only
        } else {
          user.roles.push({
            _id: roleDBData[Math.floor(Math.random() * roleDBData.length)]._id,
          });
        }
        console.log(`Prepared user: ${JSON.stringify(user)}`);
      }

      // Insert prepared Users
      User.insertMany(userSeedData)
        .then((data) => {
          console.log(data.length + " users inserted!");
          process.exit(0);
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

seedDatabase();

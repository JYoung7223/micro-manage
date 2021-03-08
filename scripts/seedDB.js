const mongoose = require("mongoose");
const { User, checklist, Role } = require("../models");
require("dotenv").config();
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT;
const bcrypt = require("bcrypt");
const bcryptSalt = parseInt(process.env.BCRYPT_SALT || 10);
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
  console.log("Seeding Roles");
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
  console.log("Seeding Users");
  await User.deleteMany({})
    .then(async() => {
      console.log("Deleted Users");      
      // Hash Password and Add Roles before inserting
      for(let h=0; h<userSeedData.length; h++){        
        const user=userSeedData[h];
        // Hash Passwords
        // Prepare Salt
        user.password = await bcrypt.genSalt(bcryptSalt)
          .then(async (salt) =>{
            // Generate the hash
            return await bcrypt.hash(user.password, salt)
              .then((hash)=>{
                return hash;
              })
              .catch((error)=>{console.log("Error generating hash:",error);});
          })
          .catch((err)=>{console.log("Error generating salt:",err);});

        // Add Roles
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
      }

      console.log("Inserting Users:",userSeedData);
      // Insert prepared Users
      await User.insertMany(userSeedData)
        .then((data) => {
          console.log(data.length + " users inserted!");
          // process.exit(0);
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
  console.log("Seeding Roles & Users Completed");
  process.exit(0);
};

seedDatabase();
const taskObject = {
  instruction: '',
  explanation: '',
  template: '',
  lineNumber: '',
  preparedBy: '',
  preparedDate: null,
  reviewedBy: '',
  reviewedDate: null,
  finalReviewedBy: '',
  finalReviewedDate: null,
}

const checklistSeed = [
  {
    title: "3D Printing",
    owner: "Nate B",
    reference: '01',
    created_date: new Date(Date.now()),
    phases: [
      {
        title: "Phase 1: Decide the type of printer",
        tasks: [
          {
            ...taskObject,
            instruction: 'Choose the type: FDM, SLA, Infiinite (Belt Printer)'
          },
          {
            ...taskObject,
            instruction: 'What do you plan on printing? (Miniatures, Cosplay, Prototypes, Random Crap off the Internet)'
          },
        ]
      },
      {
        title: "Phase 2: Buy the printer",
        tasks: [
          {
            ...taskObject,
            instruction: 'Compare the prices and reviews of the printer you want'
          },
          {
            ...taskObject,
            instruction: 'Choose the best one that fits your budget'
          },
          {
            ...taskObject,
            instruction: 'Enter the credit card info'
          },
          {
            ...taskObject,
            instruction: 'Wait till it arrives'
          },
        ]
      },
      {
        title: "Phase 3: Setup the printer",
        tasks: [
          {
            ...taskObject,
            instruction: 'Open the printer box and read the instructions'
          },
          {
            ...taskObject,
            instruction: 'Follow the instructions to setup your printer'
          },
          {
            ...taskObject,
            instruction: 'Follow the instructions to level your print bed'
          },
          {
            ...taskObject,
            instruction: 'Plug in the USB that comes with the printer that contains the printer\'s slicer.'
          },
          {
            ...taskObject,
            instruction: 'Install the slicer'
          },
        ]
      },
      {
        title: "Phase 4: Locate a model",
        tasks: [
          {
            ...taskObject,
            instruction: 'Locate the model you want to print, either go online to thingiverse or a similar site and download the model, or just print one of the test prints that come on the usb'
          },
          {
            ...taskObject,
            instruction: 'If you are printing the test print, skip to Phase 5'
          },
          {
            ...taskObject,
            instruction: 'Open the model in your slicer'
          },
          {
            ...taskObject,
            instruction: 'Slice the model and save it to your USB that came with the printer'
          },
        ]
      },
      {
        title: "Phase 5: Print",
        tasks: [
          {
            ...taskObject,
            instruction: 'Plug your USB into the printer'
          },
          {
            ...taskObject,
            instruction: 'Make sure your printer is level, sometimes this needs done every print, sometimes it needs done every few prints, If you are having issues with bed adherence, make sure the print bed is level'
          },
          {
            ...taskObject,
            instruction: 'Make sure you have filament (FDM) or Resin (SLA) for the printer to use'
          },
          {
            ...taskObject,
            instruction: 'Tell the printer to print and wait till it\s done printing'
          },
        ]
      },
      {
        title: "Phase 6: Post Processing",
        tasks: [
          {
            ...taskObject,
            instruction: 'Remove the print from the bed'
          },
          {
            ...taskObject,
            instruction: 'The next steps are for a filament (FDM) printer. (For now if you are using something else, I don\'t got anything for you)'
          },
          {
            ...taskObject,
            instruction: 'Remove the supports and clean up the little imperfections'
          },
          {
            ...taskObject,
            instruction: 'If you want to do more advanced clean up, you can google it'
          },
        ]
      }
    ]
  }
];

checklist
  .remove({})
  .then(() => db.Checklist.collection.insertMany(checklistSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    // process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

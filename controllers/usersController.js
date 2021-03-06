const db = require("../models");

// Defining methods for the checklistsController
module.exports = {
  findAll: function(req, res) {
    db.User
      .find(req.query)
      .sort({ email: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.User
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  login: function(req, res) {
    db.User
      .find({"email": req.body.email})
      .populate("roles")
      .then((user)=>{
        const returnedUser = new db.User(user[0]);
        returnedUser.checkPassword(req.body.password, (err, result)=>{
          if(err){
            res.status(422).json(err);
          }else if(result){
            res.status(200).json(returnedUser);
          }else{
            res.status(401).json({"error": "Invalid Username or Password"});
          }
        });
      })
      .catch((err)=>{
        console.log("Error Logging In:",err);
        res.status(401).json(err);
      });
  },
  create: function(req, res) {
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.User
      .findOneAndUpdate({ _id: req.params.id }, req.body, {new: true})
      .then(dbModel => res.json(dbModel))
      .catch(err => {
        console.log("Error updating:",err);
        res.status(422).json(err);
      });
  },
  remove: function(req, res) {
    db.User
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  bulkCreate: function(req, res) {
    db.User
      .insertMany(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

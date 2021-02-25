const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Please include a role 'name':"
    }
  }
);

const Role = Mongoose.model("Role", RoleSchema);

module.exports = {
  Role,
  RoleSchema
};
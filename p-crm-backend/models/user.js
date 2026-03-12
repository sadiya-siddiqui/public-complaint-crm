// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   role: {
//     type: String,
//     enum: ["citizen", "admin", "officer"],
//     default: "citizen"
//   }
// });

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "citizen"
  }
});

module.exports = mongoose.model("User", userSchema);
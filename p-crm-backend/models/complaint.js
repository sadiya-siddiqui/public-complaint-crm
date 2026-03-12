

// const mongoose = require("mongoose");

// const complaintSchema = new mongoose.Schema({
//   name: String,
//   area: String,
//   description: String,
//   status: {
//     type: String,
//     default: "Pending"
//   }
// });

// module.exports = mongoose.model("Complaint", complaintSchema);


const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  trackingId: {
    type: String
  },
  name: String,
  mobile: String,
  area: String,
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  priority: String,
  category: String
});

module.exports = mongoose.model("Complaint", complaintSchema);


const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint");

// Create complaint
// router.post("/", async(req,res)=>{

//   const complaint = new Complaint(req.body);

//   await complaint.save();

//   res.json({message:"Complaint submitted"});
// });

router.post("/", async (req, res) => {

  const { name, mobile, area, description } = req.body;

  const trackingId = "PCRM" + Date.now();

  const complaint = new Complaint({
    trackingId,
    name,
    mobile,
    area,
    description,
    status: "Pending"
  });

  await complaint.save();

  res.json({
    message: "Complaint submitted",
    trackingId: trackingId
  });

});

// Get all complaints
router.get("/", async(req,res)=>{

  const complaints = await Complaint.find();

  res.json(complaints);
});

// Update status
router.put("/:id", async(req,res)=>{

  await Complaint.findByIdAndUpdate(
    req.params.id,
    {status:req.body.status}
  );

  res.json({message:"Status updated"});
});

module.exports = router;





// Update Complaint Status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Status updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
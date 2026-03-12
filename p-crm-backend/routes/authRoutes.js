// const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Register
// router.post("/register", async (req, res) => {
//   const hashedPassword = await bcrypt.hash(req.body.password, 10);

//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: hashedPassword
//   });

//   await user.save();
//   res.json({ message: "User Registered" });
// });

// // Login
// router.post("/login", async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) return res.status(400).json({ message: "User not found" });

//   const validPass = await bcrypt.compare(req.body.password, user.password);
//   if (!validPass) return res.status(400).json({ message: "Invalid password" });

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

//   res.json({ token });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async(req,res)=>{

  const hashed = await bcrypt.hash(req.body.password,10);

  const user = new User({
    name:req.body.name,
    email:req.body.email,
    password:hashed
  });

  await user.save();

  res.json({message:"User registered"});
});

// Login
router.post("/login", async(req,res)=>{

  const user = await User.findOne({email:req.body.email});

  if(!user){
    return res.json({message:"User not found"});
  }

  const match = await bcrypt.compare(req.body.password,user.password);

  if(!match){
    return res.json({message:"Wrong password"});
  }

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

  res.json({token});

});

module.exports = router;
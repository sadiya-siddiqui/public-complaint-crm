// // Load existing complaints from localStorage
// let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

// // Submit Complaint
// document.getElementById("complaintForm").addEventListener("submit", function(e) {
//   e.preventDefault();

//   const name = document.getElementById("name").value;
//   const mobile = document.getElementById("mobile").value;
//   const area = document.getElementById("area").value;
//   const description = document.getElementById("description").value;

//   const trackingId = "PCRM" + Date.now() + Math.floor(Math.random() * 100000);

//   const newComplaint = {
//     trackingId,
//     name,
//     mobile,
//     area,
//     description,
//     status: "Pending"
//   };

//   complaints.push(newComplaint);
//   localStorage.setItem("complaints", JSON.stringify(complaints));

//   document.getElementById("trackingId").innerText =
//     "Your Tracking ID: " + trackingId;

//   this.reset();
// });

// // Track Complaint
// function trackComplaint() {

//   let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

//   const inputId = document.getElementById("trackInput").value.trim();

//   const found = complaints.find(c => c.trackingId === inputId);

//   if (found) {
//     document.getElementById("statusResult").innerText =
//       "Status: " + found.status;
//   } else {
//     document.getElementById("statusResult").innerText =
//       "Complaint Not Found!";
//   }
// }



// // Toggle Mobile Menu
// function toggleMenu() {
//   document.getElementById("navLinks").classList.toggle("show");
// }

// // Login Modal
// function toggleLogin() {
//   document.getElementById("loginModal").style.display = "flex";
// }

// function closeModal() {
//   document.getElementById("loginModal").style.display = "none";
// }

// // Simple Admin Login (Demo)
// function login() {
//   const user = document.getElementById("username").value;
//   const pass = document.getElementById("password").value;

//   if (user === "admin" && pass === "1234") {
//     alert("Login Successful!");
//     window.location.href = "admin.html";
//   } else {
//     alert("Invalid Credentials");
//   }
// }
// // Dark Mode Toggle
// function toggleTheme() {
//   document.body.classList.toggle("dark");
// }






const API = "http://localhost:5000/api/complaints";

// Submit Complaint
document.getElementById("complaintForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    area: document.getElementById("area").value,
    description: document.getElementById("description").value
  };

  const res = await fetch(API,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  document.getElementById("trackingId").innerText =
    "Your Tracking ID: " + result.trackingId;

  this.reset();
});

// Track Complaint
async function trackComplaint(){

  const id = document.getElementById("trackInput").value;

  const res = await fetch(API);
  const complaints = await res.json();

  const found = complaints.find(c => c.trackingId === id);

  if(found){
    document.getElementById("statusResult").innerText =
      "Status: " + found.status;
  } else {
    document.getElementById("statusResult").innerText =
      "Complaint Not Found";
  }

}
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email config
transporter.verify((error) => {
  if (error) {
    console.error("Email config error:", error.message);
  } else {
    console.log("Email ready");
  }
});

// Hero enquiry route
app.post("/api/hero-enquiry", async (req, res) => {
  try {
    console.log("Hero enquiry:", req.body);
    const { name, email, phone, city } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Enquiry",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city || "N/A"}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    
    res.json({
      success: true,
      message: "Thank you! We will contact you soon."
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      success: false,
      message: "Received. We will contact you."
    });
  }
});

// Franchise route
app.post("/api/franchise-application", async (req, res) => {
  try {
    console.log("Franchise application:", req.body);
    const { name, email, phone, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Franchise Application",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || "N/A"}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    
    res.json({
      success: true,
      message: "Application received! We will contact you."
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      success: false,
      message: "Application received. We will contact you."
    });
  }
});

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

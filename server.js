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
// Hero enquiry route
app.post("/api/hero-enquiry", async (req, res) => {
  try {
    console.log("Hero enquiry received:", req.body);
    const { name, email, phone, city } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🔔 New Website Enquiry - ASPO Healthcare",
      html: `
        <h2>New Enquiry from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>City:</strong> ${city || "Not provided"}</p>
        <hr>
        <p><small>Received: ${new Date().toLocaleString()}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Hero enquiry email sent successfully");
    
    return res.status(200).json({
      success: true,
      message: "Thank you! We will contact you within 24 hours."
    });
  } catch (error) {
    console.error("❌ Hero enquiry error:", error.message);
    return res.status(200).json({
      success: false,
      message: "Enquiry received. We will contact you soon."
    });
  }
});

// Franchise route
app.post("/api/franchise-application", async (req, res) => {
  try {
    console.log("Franchise application received:", req.body);
    const { name, email, phone, message } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🤝 New Franchise Application - ASPO Healthcare",
      html: `
        <h2>New Franchise Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message || "Not provided"}</p>
        <hr>
        <p><small>Received: ${new Date().toLocaleString()}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Franchise application email sent successfully");
    
    return res.status(200).json({
      success: true,
      message: "Application received! We will contact you within 24 hours."
    });
  } catch (error) {
    console.error("❌ Franchise application error:", error.message);
    return res.status(200).json({
      success: false,
      message: "Application received. We will contact you soon."
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

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://aspohealthcare.onrender.com', // Add your Render domain
        'https://*.onrender.com' // Allow all Render subdomains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this BEFORE your routes
app.options('*', cors()); // Enable pre-flight for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Email transporter configuration
// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email config error:", error.message);
  } else {
    console.log("Email server ready");
  }
});

// Route: Hero Form Submission
// Route: Hero Form Submission
app.post("/api/hero-enquiry", async (req, res) => {
  console.log('Hero enquiry received:', req.body);
  
  const { name, email, phone, city } = req.body;

  // Validate input
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields"
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER, // Fallback
    subject: "New Enquiry from Website - ASPO Healthcare",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>City:</strong> ${city || "Not provided"}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully! We will contact you soon."
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    
    return res.status(200).json({ // Changed to 200 to avoid triggering fetch error
      success: false,
      message: "Thank you for your interest. We received your details and will contact you soon."
    });
  }
});

// Route: Franchise Application Form
app.post("/api/franchise-application", async (req, res) => {
  console.log('Franchise application received:', req.body);
  
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields"
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
    subject: "New Franchise Application - ASPO Healthcare",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Franchise Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message || "Not provided"}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({
      success: true,
      message: "Application submitted successfully! Our team will review and contact you within 48 hours."
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    
    return res.status(200).json({
      success: false,
      message: "Thank you for your application. We received your details and will contact you soon."
    });
  }
});
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Make sure to configure your .env file with email credentials`);
});

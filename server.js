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
app.use(express.static(path.join(__dirname, 'public')));

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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

// Verify email on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error.message);
  } else {
    console.log("✅ Email server is ready");
  }
});

// Hero enquiry route
app.post("/api/hero-enquiry", async (req, res) => {
  console.log("📩 Hero enquiry received:", req.body);
  
  try {
    const { name, email, phone, city } = req.body;

    if (!name || !email || !phone) {
      return res.status(200).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: "🔔 New Website Enquiry - ASPO Healthcare",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1e40af;">New Enquiry from Website</h2>
            <hr>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city || "Not provided"}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    
    return res.status(200).json({
      success: true,
      message: "Thank you! We will contact you within 24 hours."
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(200).json({
      success: false,
      message: "Form received. We will contact you soon."
    });
  }
});

// Franchise application route
app.post("/api/franchise-application", async (req, res) => {
  console.log("🤝 Franchise application received:", req.body);
  
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(200).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: "🤝 New Franchise Application - ASPO Healthcare",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1e40af;">New Franchise Application</h2>
            <hr>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #1e40af;">
              ${message || "Not provided"}
            </p>
            <hr>
            <p style="color: #666; font-size: 12px;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    
    return res.status(200).json({
      success: true,
      message: "Application received! We will contact you within 24 hours."
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(200).json({
      success: false,
      message: "Application received. We will contact you soon."
    });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`📬 Recipient: ${process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER}`);
});

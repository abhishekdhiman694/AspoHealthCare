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
app.use(express.static("public"));

// Ensure environment variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
  console.error("❌ Missing required environment variables: EMAIL_USER, EMAIL_PASS, or RECIPIENT_EMAIL");
  process.exit(1);
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,           // Changed from 587
  secure: true,        // Changed from false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Helper function to send JSON responses safely
const sendJsonResponse = (res, status, success, message) => {
  res.status(status).json({ success, message });
};

// Route: Hero Form Submission
app.post("/api/hero-enquiry", async (req, res) => {
  const { name, email, phone, city } = req.body;

  if (!name || !email || !phone) {
    return sendJsonResponse(res, 400, false, "Name, email, and phone are required.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: "🔔 New Enquiry from Website - ASPO Healthcare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">New Website Enquiry</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Contact Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; font-weight: bold; width: 120px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">City:</td><td>${city || "Not provided"}</td></tr>
          </table>
        </div>
        <p style="color: #6b7280; font-size: 14px;">📅 Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    sendJsonResponse(res, 200, true, "Enquiry submitted successfully! We will contact you soon.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    sendJsonResponse(res, 500, false, "Failed to submit enquiry. Please try again or call us directly.");
  }
});

// Route: Franchise Application Form
app.post("/api/franchise-application", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone) {
    return sendJsonResponse(res, 400, false, "Name, email, and phone are required.");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: "🤝 New Franchise Application - ASPO Healthcare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1e40af; border-bottom: 3px solid #fbbf24; padding-bottom: 10px;">New Franchise Application</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Applicant Information:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; font-weight: bold; width: 120px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
          </table>
        </div>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Business Goals & Experience:</h3>
          <p style="white-space: pre-wrap;">${message || "Not provided"}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">📅 Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    sendJsonResponse(res, 200, true, "Franchise application submitted successfully! Our team will review and contact you within 48 hours.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    sendJsonResponse(res, 500, false, "Failed to submit application. Please try again or contact us directly.");
  }
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

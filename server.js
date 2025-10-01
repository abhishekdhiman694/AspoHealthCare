const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Route: Hero Form Submission
app.post('/api/hero-enquiry', async (req, res) => {
    const { name, email, phone, city } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: '🔔 New Enquiry from Website - ASPO Healthcare',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">New Website Enquiry</h2>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;">Contact Details:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold; width: 120px;">Name:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Email:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">City:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${city || 'Not provided'}</td>
                        </tr>
                    </table>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    📅 Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                    <p style="margin: 0; color: #1e40af; font-size: 13px;">
                        <strong>Action Required:</strong> Please respond to this enquiry within 24 hours.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Enquiry submitted successfully! We will contact you soon.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit enquiry. Please try again or call us directly.' 
        });
    }
});

// Route: Franchise Application Form
app.post('/api/franchise-application', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: '🤝 New Franchise Application - ASPO Healthcare',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #1e40af; border-bottom: 3px solid #fbbf24; padding-bottom: 10px;">New Franchise Application</h2>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;">Applicant Information:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold; width: 120px;">Name:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Email:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px 0; color: #1f2937;">${phone}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin-top: 0;">Business Goals & Experience:</h3>
                    <p style="color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${message || 'Not provided'}</p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    📅 Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 13px;">
                        <strong>⚠️ Important:</strong> Verify Drug License before proceeding with franchise partnership.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Franchise application submitted successfully! Our team will review and contact you within 48 hours.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit application. Please try again or contact us directly.' 
        });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Make sure to configure your .env file with email credentials`);
});
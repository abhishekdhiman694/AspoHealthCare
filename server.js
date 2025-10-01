const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now (restrict later for security)
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000
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
// Route: Hero Form Submission
app.post('/api/hero-enquiry', async (req, res) => {
    try {
        const { name, email, phone, city } = req.body;

        // Validate input
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields.' 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: '🔔 New Enquiry from Website - ASPO Healthcare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>New Website Enquiry</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>City:</strong> ${city || 'Not provided'}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Enquiry submitted successfully! We will contact you soon.' 
        });
        
    } catch (error) {
        console.error('Error in hero-enquiry:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to submit enquiry. Please call us directly.' 
        });
    }
});

// Route: Franchise Application Form
app.post('/api/franchise-application', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate input
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields.' 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: '🤝 New Franchise Application - ASPO Healthcare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>New Franchise Application</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong> ${message || 'Not provided'}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Application submitted successfully! We will contact you within 48 hours.' 
        });
        
    } catch (error) {
        console.error('Error in franchise-application:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to submit application. Please call us directly.' 
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

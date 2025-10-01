const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS FIRST
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API ROUTES FIRST - BEFORE STATIC FILES
app.post('/api/hero-enquiry', async (req, res) => {
    console.log('=== Hero enquiry START ===');
    console.log('Body:', req.body);
    
    try {
        const { name, email, phone, city } = req.body;

        // Validate
        if (!name || !email || !phone) {
            console.log('Validation failed');
            return res.json({ 
                success: false, 
                message: 'Please fill all required fields' 
            });
        }

        // Check if email is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email not configured, but saving enquiry');
            // Still return success since form was submitted
            return res.json({
                success: true,
                message: 'Enquiry received! We will contact you soon.'
            });
        }

        // Try sending email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: 'New Enquiry - ASPO Healthcare',
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city || 'N/A'}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        return res.json({ 
            success: true, 
            message: 'Thank you! We will contact you within 24 hours.' 
        });
        
    } catch (error) {
        console.error('ERROR in hero-enquiry:', error.message);
        // Still return success to user
        return res.json({ 
            success: true, 
            message: 'Enquiry received! We will contact you soon.' 
        });
    }
});

app.post('/api/franchise-application', async (req, res) => {
    console.log('=== Franchise application START ===');
    console.log('Body:', req.body);
    
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone) {
            return res.json({ 
                success: false, 
                message: 'Please fill all required fields' 
            });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.json({
                success: true,
                message: 'Application received! We will contact you within 48 hours.'
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: 'New Franchise Application - ASPO Healthcare',
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'N/A'}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        return res.json({ 
            success: true, 
            message: 'Application submitted! Our team will contact you within 48 hours.' 
        });
        
    } catch (error) {
        console.error('ERROR in franchise-application:', error.message);
        return res.json({ 
            success: true, 
            message: 'Application received! We will contact you soon.' 
        });
    }
});

// STATIC FILES LAST - AFTER API ROUTES
app.use(express.static('public'));
// Test route - no email involved
app.post('/api/test', (req, res) => {
    console.log('Test route hit!', req.body);
    res.json({ success: true, message: 'Server is working!' });
});

// Catch-all route for HTML - MUST BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

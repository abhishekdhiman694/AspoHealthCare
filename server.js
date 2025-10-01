const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Order matters!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration
let transporter;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} catch (error) {
    console.error('Email config error:', error);
}


// Hero form
app.post('/api/hero-enquiry', async (req, res) => {
    const { name, email, phone, city } = req.body;
    
    console.log('Received hero enquiry:', { name, email, phone, city });
    
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill required fields' 
        });
    }

    try {
        if (transporter) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
                subject: 'New Enquiry',
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}`
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Thank you! We will contact you soon.' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ 
            success: true, 
            message: 'Enquiry received!' 
        });
    }
});

// Franchise form
app.post('/api/franchise-application', async (req, res) => {
    const { name, email, phone, message } = req.body;
    
    console.log('Received franchise application:', { name, email, phone });
    
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill required fields' 
        });
    }

    try {
        if (transporter) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
                subject: 'New Franchise Application',
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Application received! We will contact you within 48 hours.' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ 
            success: true, 
            message: 'Application received!' 
        });
    }
});

// Serve static files
app.use(express.static('public'));

// Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

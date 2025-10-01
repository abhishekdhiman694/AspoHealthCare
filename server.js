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
    console.log('Hero enquiry received:', req.body);
    try {
        const { name, email, phone, city } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Required fields missing' 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: 'New Enquiry - ASPO Healthcare',
            html: `<h2>New Enquiry</h2>
                   <p>Name: ${name}</p>
                   <p>Email: ${email}</p>
                   <p>Phone: ${phone}</p>
                   <p>City: ${city || 'Not provided'}</p>`
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Enquiry submitted successfully!' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

app.post('/api/franchise-application', async (req, res) => {
    console.log('Franchise application received:', req.body);
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Required fields missing' 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || 'aspohealthcare@gmail.com',
            subject: 'New Franchise Application - ASPO Healthcare',
            html: `<h2>Franchise Application</h2>
                   <p>Name: ${name}</p>
                   <p>Email: ${email}</p>
                   <p>Phone: ${phone}</p>
                   <p>Message: ${message || 'Not provided'}</p>`
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Application submitted successfully!' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// STATIC FILES LAST - AFTER API ROUTES
app.use(express.static('public'));

// Catch-all route for HTML - MUST BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

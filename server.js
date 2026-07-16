const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// A simple GET test endpoint to confirm things work in the browser
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the backend! Your server is working perfectly." });
});

// Endpoint 1: Newsletter
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Newsletter Subscriber!',
        text: `New subscriber email: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.json({ success: true, message: 'Subscribed successfully!' });
    });
});

// Endpoint 2: Contact Form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Complaint/Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.json({ success: true, message: 'Message sent successfully!' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

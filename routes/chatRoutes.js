const express = require('express');
const path = require('path');

const router = express.Router();

// Serve the chat page
router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'chat.html'));
});

// Serve the signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'signup.html'));
});

// Serve the login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Root route redirects to login
router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;

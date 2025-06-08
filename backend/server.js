// Discord OAuth2 Backend Implementation for MayaaLokam Roleplay
// This file should be placed in a Node.js environment with Express

const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace these with your actual Discord application credentials
// You'll get these from the Discord Developer Portal: https://discord.com/developers/applications
const CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_DISCORD_CLIENT_SECRET';
const REDIRECT_URI = 'http://your-website.com/auth/discord/callback';

// Session configuration
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'), // Replace with a fixed secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 86400000 // 24 hours
    }
}));

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Discord OAuth2 login route
app.get('/auth/discord', (req, res) => {
    // Store the page to redirect back to after login
    req.session.returnTo = req.query.returnTo || '/duty-tracker.html';
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    req.session.state = state;
    
    // Redirect to Discord OAuth2 authorization URL
    const authURL = new URL('https://discord.com/api/oauth2/authorize');
    authURL.searchParams.append('client_id', CLIENT_ID);
    authURL.searchParams.append('redirect_uri', REDIRECT_URI);
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('state', state);
    authURL.searchParams.append('scope', 'identify');
    authURL.searchParams.append('prompt', 'none');
    
    res.redirect(authURL.toString());
});

// Discord OAuth2 callback route
app.get('/auth/discord/callback', async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.session.state;
    const returnTo = req.session.returnTo || '/duty-tracker.html';
    
    // Verify state parameter (CSRF protection)
    if (!state || state !== storedState) {
        return res.status(403).send('Invalid state parameter. Possible CSRF attack.');
    }
    
    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const { access_token, token_type } = tokenResponse.data;
        
        // Use access token to get user information
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        
        // Store user information in session
        req.session.user = userResponse.data;
        req.session.accessToken = access_token;
        req.session.tokenType = token_type;
        
        // Clear state parameter
        delete req.session.state;
        
        // Redirect back to the duty tracker page
        res.redirect(returnTo);
        
    } catch (error) {
        console.error('Discord OAuth2 Error:', error);
        res.status(500).send('Authentication failed. Please try again.');
    }
});

// Check if user is logged in
app.get('/api/auth/status', (req, res) => {
    if (req.session.user) {
        // Return user info without sensitive data
        const { id, username, discriminator, avatar } = req.session.user;
        res.json({
            loggedIn: true,
            user: { id, username, discriminator, avatar }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout route
app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/duty-tracker.html');
});

// API route to get duty logs (placeholder - would connect to your database)
app.get('/api/duty-logs', (req, res) => {
    // Check if user is authenticated
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // In a real implementation, you would fetch duty logs from your database
    // For now, we'll return placeholder data
    res.json({
        logs: []
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
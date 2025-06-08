# Discord OAuth2 Integration for MayaaLokam Roleplay

This backend implementation enables Discord authentication for the MayaaLokam Roleplay website, specifically for the duty tracking system.

## Setup Instructions

1. **Create a Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and fill in the details
   - Go to the "OAuth2" section in the sidebar
   - Add your redirect URL (e.g., `http://your-website.com/auth/discord/callback`)
   - Copy your Client ID and Client Secret

2. **Configure Backend**
   - Open `server.js` and replace the following placeholders:
     ```javascript
     const CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
     const CLIENT_SECRET = 'YOUR_DISCORD_CLIENT_SECRET';
     const REDIRECT_URI = 'http://your-website.com/auth/discord/callback';
     ```

3. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## How It Works

### Frontend
- The duty-tracker.html page contains a login interface that redirects users to Discord's authorization page
- After successful authentication, the user's profile is displayed along with their duty tracking information
- The page is designed to work with or without authentication (required only for viewing duty logs)

### Backend
- Express.js server handles OAuth2 flow with Discord
- Server provides API endpoints for:
  - Initiating Discord authentication
  - Processing authentication callbacks
  - Fetching user information
  - Managing user sessions
  - Retrieving duty logs

### Security Considerations
- Uses express-session for secure session management
- Implements CSRF protection with state parameter
- Properly handles authentication errors
- Securely stores tokens

## Integration with Discord Bot

In the future, this system can be integrated with a Discord bot that handles duty tracking commands:

1. Users can use commands like `/clockin` and `/clockout` in your Discord server
2. The bot records these events in a database
3. The website displays this data through the API endpoints
4. Users can view their duty history and statistics

## Next Steps

1. Set up a database to store duty logs
2. Create the Discord bot for duty tracking commands
3. Implement API endpoints to fetch real duty logs
4. Add additional features like duty statistics and leaderboards
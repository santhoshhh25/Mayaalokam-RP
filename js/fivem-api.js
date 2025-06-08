/**
 * FiveM Server API Utility
 * A utility for interacting with the FiveM server API
 */

class FiveMAPI {
    constructor(serverID) {
        this.serverID = serverID;
        this.apiBaseUrl = 'https://servers-frontend.fivem.net/api/servers/single/';
    }

    /**
     * Get the full API URL for the server
     */
    getApiUrl() {
        return `${this.apiBaseUrl}${this.serverID}`;
    }

    /**
     * Get server status and player information
     * @returns {Promise<Object>} Server status data
     */
    async getServerStatus() {
        try {
            const response = await fetch(this.getApiUrl());
            
            if (!response.ok) {
                throw new Error(`Failed to fetch server status: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract relevant server data
            const serverData = data.Data;
            
            if (!serverData) {
                throw new Error('No server data returned from API');
            }
            
            return {
                online: serverData.clients !== undefined,
                name: serverData.hostname || 'MayaaLokam RP',
                players: {
                    current: serverData.clients || 0,
                    max: serverData.svMaxclients || 230
                },
                variables: serverData.vars || {},
                raw: serverData
            };
        } catch (error) {
            console.error('Error in FiveM API:', error);
            
            // Return offline status on error
            return {
                online: false,
                name: 'MayaaLokam RP',
                players: {
                    current: 0,
                    max: 230
                },
                variables: {},
                error: error.message
            };
        }
    }

    /**
     * Get detailed player information if available
     * @returns {Promise<Array>} List of players
     */
    async getPlayerList() {
        try {
            const serverStatus = await this.getServerStatus();
            
            // If server is offline or player list not available
            if (!serverStatus.online || !serverStatus.raw.players) {
                return [];
            }
            
            return serverStatus.raw.players;
        } catch (error) {
            console.error('Error getting player list:', error);
            return [];
        }
    }
}

// Export as global or module
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = FiveMAPI;
} else {
    window.FiveMAPI = FiveMAPI;
}
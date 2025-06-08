/**
 * Server Status Checker
 * Handles fetching and displaying server status and player count from FiveM server
 */

class ServerStatusChecker {
    constructor(options = {}) {
        this.serverID = options.serverID || 'qg8454'; // FiveM server ID
        this.checkInterval = options.checkInterval || 30000; // 30 seconds by default
        this.statusIndicator = document.querySelector(options.statusIndicatorSelector || '.status-indicator');
        this.statusText = document.getElementById(options.statusTextId || 'server-status-text');
        this.playerCountElement = document.getElementById(options.playerCountId || 'player-count-max');
        
        this.onlineClass = options.onlineClass || 'online';
        this.offlineClass = options.offlineClass || 'offline';
        
        // Create FiveM API instance
        this.fivemAPI = new FiveMAPI(this.serverID);
        
        this.checkServerStatus = this.checkServerStatus.bind(this);
        this.updateUI = this.updateUI.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Initial check
        this.checkServerStatus();
        
        // Set up interval for checking
        this.intervalId = setInterval(this.checkServerStatus, this.checkInterval);
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        });
    }
    
    async checkServerStatus() {
        try {
            // Use FiveM API to get server status
            const serverStatus = await this.fivemAPI.getServerStatus();
            
            // Update UI with server data
            this.updateUI(
                serverStatus.online,
                serverStatus.players.current,
                serverStatus.players.max
            );
            
            return serverStatus;
        } catch (error) {
            // If there's an error, mark server as offline
            this.updateUI(false, 0, 230);
            console.error('Error fetching server status from FiveM API:', error);
            return null;
        }
    }
    
    updateUI(isOnline, currentPlayers, maxPlayers) {
        // Update status indicator and text
        if (this.statusIndicator) {
            if (isOnline) {
                this.statusIndicator.classList.remove(this.offlineClass);
                this.statusIndicator.classList.add(this.onlineClass);
            } else {
                this.statusIndicator.classList.remove(this.onlineClass);
                this.statusIndicator.classList.add(this.offlineClass);
            }
        }
        
        // Update status text
        if (this.statusText) {
            this.statusText.textContent = isOnline ? 'Server Online' : 'Server Offline';
            this.statusText.style.color = isOnline ? '#4CAF50' : '#F44336';
        }
        
        // Update player count
        if (this.playerCountElement) {
            this.playerCountElement.textContent = `${currentPlayers}/${maxPlayers}`;
        }
    }
    
    // Force an immediate status check
    forceCheck() {
        return this.checkServerStatus();
    }
    
    // Clean up resources
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Initialize the server status checker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create an instance with FiveM server ID
    window.serverStatusChecker = new ServerStatusChecker({
        serverID: 'qg8454', // FiveM server ID from cfx.re/join/qg8454
        checkInterval: 30000  // Check every 30 seconds
    });
});
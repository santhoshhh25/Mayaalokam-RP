// Duty Tracker JavaScript - Frontend Implementation
// This file contains the client-side code for the Duty Tracker feature
// Modified for GitHub Pages deployment

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginSection = document.getElementById('loginSection');
    const dutyContent = document.getElementById('dutyContent');
    const discordLoginBtn = document.getElementById('discordLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userTag = document.getElementById('userTag');
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active class to current button and tab
            this.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // Discord login button - Modified for GitHub Pages static hosting
    discordLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // For GitHub Pages static hosting (no backend available)
        simulateSuccessfulLogin();
        
        // Display informational toast if function exists
        if (typeof showToast === 'function') {
            showToast('This is a demo mode for GitHub Pages. In a production environment, this would authenticate with Discord.', 5000);
        } else {
            // Fallback for toast functionality
            alert('Demo Mode: In a production environment, this would authenticate with Discord.');
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        // For GitHub Pages demo - just clear local storage and update UI
        localStorage.removeItem('discordUser');
        updateAuthUI(false);
        
        // Show toast if function exists
        if (typeof showToast === 'function') {
            showToast('Logged out successfully.', 3000);
        }
    });
    
    // Function to check auth status
    function checkAuthStatus() {
        // For GitHub Pages demo - check local storage
        const storedUser = localStorage.getItem('discordUser');
        if (storedUser) {
            updateAuthUI(true, JSON.parse(storedUser));
        } else {
            updateAuthUI(false);
        }
    }
    
    // Function to update UI based on auth status
    function updateAuthUI(isLoggedIn, userData = null) {
        if (isLoggedIn && userData) {
            // Show user data
            loginSection.style.display = 'none';
            dutyContent.style.display = 'block';
            
            // Update user info
            userName.textContent = userData.username;
            userTag.textContent = userData.username + '#' + userData.discriminator;
            
            // Set avatar
            if (userData.avatar) {
                userAvatar.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
            } else {
                // Default avatar if user doesn't have one
                userAvatar.src = 'https://via.placeholder.com/60';
            }
            
            // Load demo data for GitHub Pages
            loadDemoData();
        } else {
            // Show login section
            loginSection.style.display = 'block';
            dutyContent.style.display = 'none';
        }
    }
    
    // Simulate a successful login (for GitHub Pages demo)
    function simulateSuccessfulLogin() {
        const mockUser = {
            id: '123456789012345678',
            username: 'DemoUser',
            discriminator: '1234',
            avatar: null
        };
        
        localStorage.setItem('discordUser', JSON.stringify(mockUser));
        updateAuthUI(true, mockUser);
    }
    
    // Load demo data for GitHub Pages
    function loadDemoData() {
        // Create some demo duty logs
        const demoLogs = [
            {
                jobTitle: "Police Patrol",
                date: "2025-06-05T08:00:00",
                clockIn: "2025-06-05T08:00:00",
                clockOut: "2025-06-05T16:00:00",
                totalMinutes: 480,
                department: "LSPD"
            },
            {
                jobTitle: "EMS Shift",
                date: "2025-06-07T10:00:00",
                clockIn: "2025-06-07T10:00:00",
                clockOut: "2025-06-07T18:30:00",
                totalMinutes: 510,
                department: "Los Santos Medical"
            }
        ];
        
        // Render the demo logs
        renderDutyLogs(demoLogs);
    }
    
    // Function to render duty logs
    function renderDutyLogs(logs) {
        const recentTab = document.getElementById('recentTab');
        
        if (!logs || logs.length === 0) {
            // Show placeholder
            recentTab.innerHTML = `
                <div class="placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3>No Recent Activity</h3>
                    <p>Your recent duty activity will appear here once you start logging hours via the Discord bot.</p>
                </div>
            `;
            return;
        }
        
        // Render logs
        let logsHTML = '';
        logs.forEach(log => {
            logsHTML += `
                <div class="duty-log">
                    <div class="log-header">
                        <h4>${log.jobTitle}</h4>
                        <p>${formatDate(log.date)}</p>
                    </div>
                    <div class="log-details">
                        <div class="stat-row">
                            <span class="stat-label">Clock In</span>
                            <span class="stat-value">${formatTime(log.clockIn)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Clock Out</span>
                            <span class="stat-value">${formatTime(log.clockOut)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Total Hours</span>
                            <span class="stat-value">${formatDuration(log.totalMinutes)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Department</span>
                            <span class="stat-value">${log.department}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        recentTab.innerHTML = logsHTML;
        
        // Add event listeners to log headers
        const logHeaders = document.querySelectorAll('.log-header');
        logHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const details = this.nextElementSibling;
                details.classList.toggle('open');
            });
        });
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Helper function to format time
    function formatTime(timeString) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    
    // Helper function to format duration
    function formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
    
    // Toast notification function
    function showToast(message, duration = 3000) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .toast {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    margin-top: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    animation: fadeIn 0.3s, fadeOut 0.3s var(--duration) forwards;
                    max-width: 300px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.setProperty('--duration', `${duration/1000}s`);
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
    
    // Make toast function globally available
    window.showToast = showToast;
    
    // Check auth status on page load
    checkAuthStatus();
});
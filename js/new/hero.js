document.addEventListener('DOMContentLoaded', function() {
  // Create snowflakes
  createSnowflakes();
  
  // Initialize slideshow
  initSlideshow();
  
  // Initialize player count and server status
  fetchPlayerCount();
  checkServerStatus();
  setInterval(fetchPlayerCount, 30000); // Refresh player count every 30 seconds
  setInterval(checkServerStatus, 60000); // Check server status every minute
});

// Create snowflakes
function createSnowflakes() {
  const snowflakeContainer = document.querySelector('.snowflake-container');
  const snowflakeCount = 50;
  
  if (!snowflakeContainer) return;
  
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Random position
    snowflake.style.left = `${Math.random() * 100}%`;
    
    // Random delay
    const delay = Math.random() * 10;
    snowflake.style.animationDelay = `${delay}s`;
    
    // Random duration
    const duration = 15 + Math.random() * 10;
    snowflake.style.animationDuration = `${duration}s`;
    
    snowflakeContainer.appendChild(snowflake);
  }
}

// Initialize slideshow
function initSlideshow() {
  const slideshowItems = document.querySelectorAll('.slideshow-item');
  if (slideshowItems.length === 0) return;
  
  let currentSlide = 0;
  
  // Show first slide
  slideshowItems[0].classList.add('active');
  
  // Change slide every 4 seconds
  setInterval(() => {
    // Hide current slide
    slideshowItems[currentSlide].classList.remove('active');
    
    // Move to next slide
    currentSlide = (currentSlide + 1) % slideshowItems.length;
    
    // Show next slide
    slideshowItems[currentSlide].classList.add('active');
  }, 4000);
}

// Fetch player count from API
function fetchPlayerCount() {
  const playerCountTotal = document.getElementById('player-count-total');
  const playerCountMax = document.getElementById('player-count-max');
  
  if (!playerCountMax) return;
  
  try {
    fetch('https://servers-frontend.fivem.net/api/servers/single/qg8454')
      .then(response => response.json())
      .then(data => {
        if (data && data.Data) {
          const playerCount = data.Data.clients || 0;
          const maxPlayers = data.Data.sv_maxclients || 230;
          
          if (playerCountTotal) playerCountTotal.textContent = playerCount;
          playerCountMax.textContent = `${playerCount}/${maxPlayers}`;
          
          // Update server status based on player count
          updateServerStatus(true);
        } else {
          // Fallback values if data structure is unexpected
          console.log('Unexpected data structure:', data);
          if (playerCountTotal) playerCountTotal.textContent = '--';
          playerCountMax.textContent = '--/230';
        }
      })
      .catch(error => {
        console.error('Error fetching player count:', error);
        // Fallback values
        if (playerCountTotal) playerCountTotal.textContent = '--';
        playerCountMax.textContent = '--/230';
        
        // Set status to offline on error
        updateServerStatus(false);
      });
  } catch (error) {
    console.error('Error in fetch operation:', error);
    // Fallback values
    if (playerCountTotal) playerCountTotal.textContent = '--';
    playerCountMax.textContent = '--/230';
    
    // Set status to offline on error
    updateServerStatus(false);
  }
}

// Check server status
function checkServerStatus() {
  try {
    fetch('https://servers-frontend.fivem.net/api/servers/single/qg8454')
      .then(response => {
        if (response.ok) {
          updateServerStatus(true);
        } else {
          updateServerStatus(false);
        }
      })
      .catch(() => {
        updateServerStatus(false);
      });
  } catch (error) {
    updateServerStatus(false);
  }
}

// Update server status indicator
function updateServerStatus(isOnline) {
  const statusIndicator = document.querySelector('.status-indicator');
  if (!statusIndicator) return;
  
  if (isOnline) {
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
  } else {
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
  }
}
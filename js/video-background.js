document.addEventListener('DOMContentLoaded', function() {
  // Get the video element
  const heroVideo = document.querySelector('.hero-video');
  
  // Create a global variable to track video loading state
  window.videoReady = false;
  
  if (heroVideo) {
    // Mobile optimization
    const isMobile = window.innerWidth < 768;
    
    // Set appropriate attributes for mobile
    if (isMobile) {
      // Use lower playback rate on mobile for better performance
      heroVideo.playbackRate = 0.75;
      
      // Reduce resolution effectively by scaling down and using CSS to scale back up
      heroVideo.style.width = '100%';
      heroVideo.style.height = '100%';
      
      // Prevent autoplaying on some mobile browsers until interaction
      heroVideo.setAttribute('preload', 'metadata');
      
      // Add pause and play for better mobile performance
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          heroVideo.pause();
        } else {
          heroVideo.play().catch(e => console.log('Play prevented by browser'));
        }
      });
    }
    
    // Add the loaded class when the video has enough data to play
    heroVideo.addEventListener('loadeddata', function() {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        heroVideo.classList.add('loaded');
        // Signal that video is ready
        window.videoReady = true;
        // Dispatch a custom event that the video is ready
        document.dispatchEvent(new CustomEvent('videoReady'));
      }, 100);
    });
    
    // Fallback in case the loadeddata event doesn't fire
    setTimeout(() => {
      if (!heroVideo.classList.contains('loaded')) {
        heroVideo.classList.add('loaded');
        // Signal that video is ready even in fallback case
        window.videoReady = true;
        // Dispatch a custom event that the video is ready
        document.dispatchEvent(new CustomEvent('videoReady'));
      }
    }, 3000);
    
    // Handle orientation changes for mobile
    window.addEventListener('orientationchange', function() {
      // Small delay to allow orientation to complete
      setTimeout(() => {
        // Refresh video position
        const currentSrc = heroVideo.currentSrc;
        const currentTime = heroVideo.currentTime;
        const wasPlaying = !heroVideo.paused;
        
        // Force reposition
        if (wasPlaying) {
          heroVideo.pause();
          setTimeout(() => {
            heroVideo.play().catch(e => console.log('Play prevented'));
          }, 100);
        }
      }, 300);
    });
  }
});

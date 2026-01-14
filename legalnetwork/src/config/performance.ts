// Performance configuration and optimizations

export const PERFORMANCE_CONFIG = {
  // Image optimization
  IMAGE_LAZY_LOADING: true,
  IMAGE_PLACEHOLDER_BLUR: true,
  
  // Animation performance
  REDUCE_MOTION: false, // Set to true for users who prefer reduced motion
  GPU_ACCELERATION: true,
  
  // Bundle optimization
  CODE_SPLITTING: true,
  LAZY_LOADING_COMPONENTS: true,
  
  // Caching
  CACHE_DURATION: 300000, // 5 minutes in milliseconds
  
  // Responsive breakpoints
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
    largeDesktop: 1440,
  },
  
  // Scroll performance
  SCROLL_THROTTLE: 16, // ~60fps
  RESIZE_THROTTLE: 100,
  
  // Intersection Observer
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '50px',
};

// Performance utilities
export const isReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

export const isLowEndDevice = () => {
  // Simple heuristic to detect low-end devices
  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;
  
  if (connection) {
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  
  if (memory) {
    return memory.jsHeapSizeLimit < 1073741824; // Less than 1GB
  }
  
  return false;
};

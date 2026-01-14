// Responsive utility functions for optimized performance

export const getImageSrc = (basePath: string) => {
  // For now, return the base path
  // In production, you could implement different image sizes based on screen size
  return basePath;
};

export const getResponsiveFontSize = (baseSize: number, screenWidth: number) => {
  if (screenWidth <= 480) {
    return Math.max(baseSize * 0.8, 12); // Minimum 12px
  } else if (screenWidth <= 768) {
    return Math.max(baseSize * 0.9, 14); // Minimum 14px
  } else if (screenWidth <= 1024) {
    return baseSize;
  }
  return baseSize;
};

export const getResponsiveSpacing = (baseSpacing: number, screenWidth: number) => {
  if (screenWidth <= 480) {
    return Math.max(baseSpacing * 0.6, 8); // Minimum 8px
  } else if (screenWidth <= 768) {
    return Math.max(baseSpacing * 0.8, 12); // Minimum 12px
  } else if (screenWidth <= 1024) {
    return baseSpacing;
  }
  return baseSpacing;
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

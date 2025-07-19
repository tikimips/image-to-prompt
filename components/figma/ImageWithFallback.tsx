import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function ImageWithFallback({ src, alt, fallback, ...props }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError && fallback) {
    return <img src={fallback} alt={alt} {...props} />;
  }

  if (hasError) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 text-gray-400"
        style={{ width: props.width, height: props.height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className="flex items-center justify-center bg-gray-100 animate-pulse"
          style={{ width: props.width, height: props.height }}
        >
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
}
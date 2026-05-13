import React from 'react';

const SmartImage = ({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  width,
  height,
  style,
  fetchPriority,
  ...props
}) => {
  if (!src) return null;

  const resolvedStyle = {
    ...(width && height ? { aspectRatio: `${width} / ${height}` } : {}),
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      style={resolvedStyle}
      fetchPriority={fetchPriority}
      {...props}
    />
  );
};

export default SmartImage;

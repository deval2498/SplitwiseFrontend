import React from 'react';

const TailwindWrapper = ({ children, className = '' }) => {
  return <div className={`tailwind ${className}`}>{children}</div>;
};

export default TailwindWrapper;
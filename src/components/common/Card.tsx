import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 transition-all duration-200 hover:shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
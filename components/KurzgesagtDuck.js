import React from 'react';

export default function KurzgesagtDuck({ transform = "translate(1000, 500) scale(0.5)" }) {
  return (
    <g transform={transform}>
      {/* Duck body - rounded shape */}
      <ellipse cx="0" cy="0" rx="120" ry="100" fill="#FFD700" />
      
      {/* Duck head - slightly above body and rotated */}
      <ellipse cx="0" cy="-90" rx="70" ry="60" fill="#FFD700" transform="rotate(-15)" />
      
      {/* Duck tail - right side */}
      <path 
        d="M100,20 C150,0 170,-30 140,-50 C170,-20 160,30 100,20" 
        fill="#FFD700" 
      />
      
      {/* Duck wings - small bumps on sides */}
      <ellipse cx="-90" cy="0" rx="40" ry="60" fill="#E6C200" transform="rotate(-10)" />
      <ellipse cx="90" cy="0" rx="40" ry="60" fill="#E6C200" transform="rotate(10)" />
      
      {/* Duck feet - small triangles at bottom */}
      <path d="M-50,90 L-80,130 L-20,130 Z" fill="#FF9900" />
      <path d="M50,90 L20,130 L80,130 Z" fill="#FF9900" />
      
      {/* Duck beak - visible from side angle */}
      <path 
        d="M-30,-110 L-80,-90 L-30,-70 Z" 
        fill="#FF9900" 
      />
      
      {/* Duck eye - visible from side angle */}
      <circle 
        cx="-40" 
        cy="-95" 
        r="10" 
        fill="#000000" 
      />
      
      {/* Simple shadow/highlight for dimension */}
      <path 
        d="M-80,-20 C-40,-60 40,-60 80,-20 C40,-40 -40,-40 -80,-20" 
        fill="#E6C200" 
        opacity="0.6" 
      />
    </g>
  );
} 
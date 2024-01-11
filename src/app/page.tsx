import React from 'react';
import Image from 'next/image';

declare module 'react' {
  interface JSX {
    // Add the missing interface 'JSX.IntrinsicElements'
    // to define the types for HTML elements.
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}

export default function Home() {
  return (
    <div>
      
    </div>
  )
}

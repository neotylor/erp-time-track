import React from 'react';
import Base64Tool from '@/components/Base64Tool';

const Base64Page: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Encode and decode text and files to/from Base64 with no size limits. 
          Supports large files up to multi-GB using streaming processing.
        </p>
      </div>
      <Base64Tool />
    </div>
  );
};

export default Base64Page;
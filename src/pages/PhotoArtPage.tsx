import React from 'react';
import PhotoArtEditor from '../components/PhotoArtEditor';

const PhotoArtPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hide main navigation and maximize space for photo editor */}
      <style>{`
        body { overflow: hidden; }
        .main-navigation { display: none !important; }
        .mobile-header { display: none !important; }
        .mobile-navigation { display: none !important; }
        .desktop-navigation { display: none !important; }
      `}</style>
      <PhotoArtEditor />
    </div>
  );
};

export default PhotoArtPage;
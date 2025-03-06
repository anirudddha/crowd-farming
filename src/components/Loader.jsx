import React from 'react';

const OrganicLoader = () => {
  return (
    <div className="inset-0 bg-transparent flex items-center justify-center">
      <div className="relative">
        {/* DNA Strand Animation */}
        <div className="flex flex-col items-center space-y-4 animate-dna-float">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-8 border-2 border-emerald-400 rounded-full animate-pulse-spin">
            <div className="w-2 h-2 bg-emerald-500 mt-3 mx-auto"></div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        </div>

        {/* Floating Leaf */}
        <div className="absolute top-1/2 left-1/2 -translate-x-8 -translate-y-4">
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6 text-lime-400 animate-leaf-twist"
          >
            <path fill="currentColor" d="M12 3c-3 0-6 2-8 5.5C2 12 5 19 12 21c7-2 10-9 8-12.5C18 5 15 3 12 3Z"/>
          </svg>
        </div>

        {/* Text */}
        <p className="text-center mt-8 text-sm text-emerald-600 font-medium animate-pulse">
          Germinating...
        </p>

        <style>{`
          @keyframes dna-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-dna-float {
            animation: dna-float 3s ease-in-out infinite;
          }

          @keyframes pulse-spin {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
          }
          .animate-pulse-spin {
            animation: pulse-spin 4s linear infinite;
          }

          @keyframes leaf-twist {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(15deg) scale(1.1); }
          }
          .animate-leaf-twist {
            animation: leaf-twist 2.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrganicLoader;

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface OnboardingPromoButtonProps {
  onClick: () => void;
}

const OnboardingPromoButton: React.FC<OnboardingPromoButtonProps> = ({ onClick }) => {
  return (
    <div className="luxury-card p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-1">Complete Your Profile</h3>
          <p className="text-gray-600 text-sm">Take our personalized questionnaire to get tailored challenges and advice</p>
        </div>
        <button 
          onClick={onClick}
          className="luxury-button-secondary flex items-center px-4 py-2"
        >
          Start
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingPromoButton;

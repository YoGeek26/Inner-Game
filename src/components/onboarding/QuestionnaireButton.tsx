import React from 'react';
import { Check } from 'lucide-react';

interface QuestionnaireButtonProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

const QuestionnaireButton: React.FC<QuestionnaireButtonProps> = ({ 
  label, 
  selected = false, 
  onClick, 
  multiSelect = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${
        selected
          ? 'bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-burgundy)] bg-opacity-5 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span>{label}</span>
      {selected && (
        <div className={`p-1 rounded-full ${multiSelect ? 'bg-[var(--color-burgundy)]' : ''}`}>
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
};

export default QuestionnaireButton;

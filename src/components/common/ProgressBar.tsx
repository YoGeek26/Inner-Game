import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  labelPosition?: 'top' | 'inside' | 'none';
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  color = 'var(--color-burgundy)',
  backgroundColor = '#f3f4f6',
  labelPosition = 'none',
  showPercentage = false
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full">
      {labelPosition === 'top' && showPercentage && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-medium text-gray-500">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor, height: `${height}px` }}
      >
        <div 
          className="h-full rounded-full transition-all duration-300 ease-in-out relative"
          style={{ width: `${clampedProgress}%`, backgroundColor: color }}
        >
          {labelPosition === 'inside' && showPercentage && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

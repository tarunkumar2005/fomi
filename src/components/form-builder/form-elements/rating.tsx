"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingField {
  id: string;
  type: "rating";
  question: string;
  required: boolean;
  max?: number;
}

interface RatingPreviewProps {
  field: RatingField;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  error?: string;
}

export function RatingPreview({ field, value, onChange, disabled = false, error }: RatingPreviewProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const maxRating = field.max || 5;

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange?.(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => {
          const rating = i + 1;
          const isActive = rating <= (hoverValue || value || 0);
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={disabled}
              className={`p-1 transition-colors duration-200 ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                className={`w-8 h-8 transition-all duration-200 ${
                  isActive
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-sm text-gray-600">
          {value} out of {maxRating} stars
        </p>
      )}
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default RatingPreview;

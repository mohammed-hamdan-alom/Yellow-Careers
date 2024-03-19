import React from 'react';
import { Label } from '@/components/ui/label';

const Question = ({ question }) => {
  return (
    <div className="border-t border-b border-gray-300 py-4">
      <Label className="text-lg font-semibold">{question}</Label>
    </div>
  );
};

export default Question;

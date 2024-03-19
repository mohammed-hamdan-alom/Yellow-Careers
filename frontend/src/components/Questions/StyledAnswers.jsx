import React from 'react';
import { Label } from '@/components/ui/label';
import StyledQuestion from './StyledQuestions';
import { SquarePen } from 'lucide-react';

const StyledAnswers = ({ questions, answers }) => {
    return (
        <div>
        {questions.map((question, index) => (
            <div key={index} className="mb-3"> {/* Add bottom margin to each question */}
                <StyledQuestion question={question.question} className="mb-2" /> {/* Add bottom margin to StyledQuestion */}
                <Label className="flex items-center text-gray-700"> {/* Make the answer text a darker grey */}
                    <SquarePen className="mr-2" /> {/* Add the icon */}
                    {answers.find((answer) => answer.question === question.id)?.answer}
                </Label>
            </div>
        ))}
        </div>
    );
};

export default StyledAnswers;
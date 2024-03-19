import React from 'react';
import { Label } from '@/components/ui/label';
import Question from './Question';
import { SquarePen } from 'lucide-react';

const QuestionsAndAnswers = ({ questions, answers }) => {
    return (
        <div>
        {questions.map((question, index) => (
            <div key={index} className="mb-3">
                <Question question={question.question} className="mb-2" />
                <Label className="flex items-center text-gray-700">
                    <SquarePen className="mr-2" />
                    {answers.find((answer) => answer.question === question.id)?.answer}
                </Label>
            </div>
        ))}
        </div>
    );
};

export default QuestionsAndAnswers;
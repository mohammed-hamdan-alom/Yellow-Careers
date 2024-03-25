import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function QuestionCreation({ jobId }) {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [questionsChanged, setQuestionsChanged] = useState(false);

    const [questionData, setQuestionData] = useState({
        question: '',
        jobId: jobId
    });

    useEffect(() => {

        AxiosInstance.get(`api/jobs/${jobId}/questions/`)
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((error) => console.log(error));
        setQuestionsChanged(false);
    }, [questionsChanged]);

    const handleSubmit = (event) => {
        event.preventDefault();
        AxiosInstance.post('api/questions/create/', {
            job: questionData.jobId,
            question: questionData.question
        }).then((response) => {
            setQuestionData({
                ...questionData,
                question: ''
            });
            setQuestionsChanged(true);
        })
            .catch((error) => console.log(error));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setQuestionData({
            ...questionData,
            [name]: value
        });
    };

    const handleSkip = (event) => {
        event.preventDefault();
        navigate(`/employer/job-details/${jobId}`);
    };

    const handleRemove = (id) => {
        AxiosInstance.delete(`api/questions/${id}/update/`)
            .then((res) => setQuestionsChanged(true))
            .catch((error) => console.log(error));
    };

    return (
        <div className="mt-4 w-full flex flex-col justify-start mr-10 p-6 bg-white rounded shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold">Add a question</h2>
                <div className="form-group">
                    <Label className="text-xl font-semibold" style={{ color: '#4A5568' }}>Question</Label>
                    <Input
                        type="text"
                        name="question"
                        value={questionData.question}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <div className='form-actions mt-4'>
                        <Button onClick={handleSubmit} className="blueButton">Add Question</Button>
                    </div>
                </div>
            </form>
            <p className="mt-4"></p>
            <h2 className="text-xl font-bold mt-4">Current Questions:</h2>
            {questions.length == 0 ? <h1 className="text-xl font-semibold" style={{ color: '#4A5568' }}>There are currently no questions</h1> : null}
            {questions.map(question => (
                <ul key={question.id} className="list-disc ml-5">
                    <li className="flex justify-between items-center">
                        <span>{question.question}</span>
                        <Button onClick={() => handleRemove(question.id)} className="redButton mt-1">Remove</Button>
                    </li>
                </ul>
            ))}
            <br></br>
            <Button onClick={handleSkip} className="yellowButton">Submit</Button>
        </div>
    );
}

const Employer = ({ employer }) => {
    return (
        <div className="border-t border-b border-gray-300 py-4">
            <Label className="text-lg font-semibold"></Label>
        </div>
    );
};

export default QuestionCreation;

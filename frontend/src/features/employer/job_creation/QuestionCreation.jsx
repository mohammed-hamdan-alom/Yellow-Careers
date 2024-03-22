import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";

function QuestionCreation() {
    const { jobId } = useParams();
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
                console.log(res);
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
            .then((res) => window.location.reload())
            .catch((error) => console.log(error));
    };

    return (
        <div className="mt-4 w-full flex flex-col justify-start mr-10 p-6 bg-white rounded shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold">Add a question</h2>
                <div className="form-group">
                    <Label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</Label>
                    <Input
                        type="text"
                        name="question"
                        value={questionData.question}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <div className='form-actions mt-4'>
                        <Button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Question</Button>
                    </div>
                </div>
            </form>
            <Button type="button" onClick={handleSkip} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Finish</Button>
            <p className="mt-4"></p>
            {questions.length == 0 ? <h2 className="text-xl font-bold mt-4">Current Questions:</h2> : null}
            <br></br>
            {questions.map(question => (
                <ul key={question.id} className="list-disc ml-5">
                    <li className="flex justify-between items-center">
                        <span>{question.question}</span>
                        <Button onClick={() => handleRemove(question.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Remove</Button>
                    </li>
                </ul>
            ))}
        </div>
    );
}

export default QuestionCreation;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';

function QuestionCreationForm() {
    const { jobId } = useParams()
    const navigate = useNavigate()

    const [questionData, setQuestionData] = useState({
        question: '',
        jobId: jobId
    })


    const handleSubmit = (event) => {
        event.preventDefault();
        AxiosInstance.post('api/questions/create/', {
            job: questionData.jobId,
            question: questionData.question
        }).then((response) => console.log(response))
            .catch((error) => console.log(error))
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setQuestionData({
            ...questionData,
            [name]: value
        })
    }

    const handleSkip = (event) => {
        event.preventDefault();
        navigate(`/job-seeker/`);
    }

    return (
        <div className="question-creation-form">
            <form onSubmit={handleSubmit}>
                <h2>Add a question</h2>
                <div className="form-group">
                    <label htmlFor="question">Question</label>
                    <input
                        type="text"
                        name="question"
                        value={questionData.question}
                        onChange={handleChange}
                    />
                    <div className='form-actions'>
                        <button type="button" onClick={handleSubmit}>Submit Question</button>
                    </div>
                </div>
            </form>
            <button type="button" onClick={handleSkip}>Finish</button>
        </div>
    )
}

export default QuestionCreationForm;
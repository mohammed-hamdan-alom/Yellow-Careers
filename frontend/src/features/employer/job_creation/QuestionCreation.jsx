import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";

function QuestionCreation() {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [questionsChanged, setQuestionsChanged] = useState(false);

    const [questionData, setQuestionData] = useState({
        question: '',
        jobId: jobId
    })

    useEffect(() => {
        AxiosInstance.get(`api/jobs/${jobId}/questions/`)
            .then((res) => {
                setQuestions(res.data)
                console.log(res)
            })
            .catch((error) => console.log(error))
        setQuestionsChanged(false);
    }, [questionsChanged])

    const handleSubmit = (event) => {
        event.preventDefault();
        AxiosInstance.post('api/questions/create/', {
            job: questionData.jobId,
            question: questionData.question
        }).then((response) => {
            setQuestionData({
                ...questionData,
                question: ''
            })
            setQuestionsChanged(true)
        })
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
        navigate(`/employer/job-details/${jobId}`);
    }

    const handleRemove = (id) => {
        AxiosInstance.delete(`api/questions/${id}/update/`)
            .then((res) => window.location.reload())
            .catch((error) => console.log(error))
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
            <p><br></br></p>
            {questions.length == 0 ? <h2>Current Questions:</h2> : null}
            <br></br>
            {questions.map(question => (
                <ul key={question.id}>
                    {question.question} <button onClick={() => handleRemove(question.id)}>Remove</button>
                </ul>
            )
            )}
        </div>
    )
}

export default QuestionCreation;
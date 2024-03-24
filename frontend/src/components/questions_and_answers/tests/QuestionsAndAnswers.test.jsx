import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import QuestionsAndAnswers from "@/components/questions_and_answers/QuestionsAndAnswers"

const questions = [
    {
        "id": 1,
        "question": "Soluta et eos quam quisquam sit reprehenderit. Illum at explicabo molestias. Inventore consequuntur numquam consequatur nulla ab minima.",
        "job": 1,
    },
    {
        "id": 2,
        "question": "Quo commodi saepe. Labore amet numquam sed itaque reiciendis.",
        "job": 296
    }
]

const answers = [
    {
        "id": 3,
        "answer": "Aperiam harum ea laboriosam dolorum eum.",
        "application": 3,
        "question": 1
    },
    {
        "id": 4,
        "answer": "Dolorum quo libero similique alias maxime. Harum deleniti officia nisi iure veritatis laborum.",
        "application": 3,
        "question": 2
    }
]

vi.mock("@/components/ui/label", () => ({
    Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>)
}))

describe('QuestionAndAnswers component', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <QuestionsAndAnswers questions={questions} answers={answers} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test('renders first question', async () => {
        const question = await screen.findByText(questions[0].question);
        expect(question).toBeInTheDocument();
    });

    test('renders second question', async () => {
        const question = await screen.findByText(questions[1].question);
        expect(question).toBeInTheDocument();
    });

    test('renders first answer', async () => {
        const answer = await screen.findByText(answers[0].answer);
        expect(answer).toBeInTheDocument();
    });

    test('renders second answer', async () => {
        const answer = await screen.findByText(answers[1].answer);
        expect(answer).toBeInTheDocument();
    });

    test('renders correct order for questions and answers', async () => {
        const html = await document.body.innerHTML;
        const question1 = html.search(questions[0].question)
        const answer1 = html.search(answers[0].answer)
        const question2 = html.search(questions[1].question)
        const answer2 = html.search(answers[1].answer)

        expect(question1).toBeLessThan(answer1)
        expect(answer1).toBeLessThan(question2)
        expect(question2).toBeLessThan(answer2)
    })
});
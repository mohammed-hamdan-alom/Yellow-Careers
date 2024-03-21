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

describe('Question component', () => {

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
});
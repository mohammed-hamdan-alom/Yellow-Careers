import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Question from "@/components/questions_and_answers/Question"

const question = {
    "id": 1,
    "question": "Soluta et eos quam quisquam sit reprehenderit. Illum at explicabo molestias. Inventore consequuntur numquam consequatur nulla ab minima.",
    "job": 1,
}

vi.mock("@/components/ui/label", () => ({
    Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>)
}))

describe('Question component', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Question question={question.question} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test('renders question', async () => {
        const questionName = await screen.findByText(question.question);
        expect(questionName).toBeInTheDocument();
    });

    test('renders label', async () => {
        const label = await screen.findByTestId("mock-label");
        expect(label).toBeInTheDocument();
    });

});
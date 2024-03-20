import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JobList from '../JobList';

import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

const data = [{
    "id": 1,
    "title": "Administrator, local government",
    "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    "address": 501,
    "job_type": "FT",
    "salary": 44976
},
{
    "id": 2,
    "title": "Contracting civil engineer",
    "description": "Fugiat adipisci tempore. Consectetur veniam quaerat deleniti assumenda sapiente.",
    "address": 502,
    "job_type": "IN",
    "salary": 74726
},
{
    "id": 3,
    "title": "Office manager",
    "description": "Pariatur magnam quisquam distinctio. Repudiandae asperiores quidem dolor. Voluptatum omnis dolorem magnam et commodi magnam officiis.",
    "address": 503,
    "job_type": "TM",
    "salary": 35685
},
{
    "id": 4,
    "title": "Chief Executive Officer",
    "description": "Aliquid mollitia vitae blanditiis dignissimos dignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.",
    "address": 504,
    "job_type": "PT",
    "salary": 61939
}]

describe('JobSearchList component', () => {

    beforeEach(() => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <JobList data={data} />
                </AuthProvider>
            </MemoryRouter>
        );
    });

    test('renders search bar', () => {
        vi.mock("../../JobSummary/JobSummary", () => {
            return {
                default: () => (<div data-testid="mock-jobsummary"> </div>)
            }
        })
        const searchBar = screen.getByTestId("jobsearchbar");
        expect(searchBar).toBeInTheDocument();
        vi.unmock("../../JobSummary/JobSummary")
    });

    test('renders jobs correctly', () => {
        const jobs = screen.getAllByRole("list");
        expect(jobs).toHaveLength(5); //there are 4 jobs, but this includes antd for some reason
    });

    test('search updates on change', () => {
        vi.mock("../../JobSummary/JobSummary", () => {
            return {
                default: () => (<div data-testid="mock-jobsummary"> </div>)
            }
        })
        const input = screen.getByPlaceholderText("Search Jobs")

        fireEvent.change(input, { target: { value: 'test' } })

        expect(input.value).toBe('test')
        vi.unmock("../../JobSummary/JobSummary")
    });

    test('searched jobs appear correctly', () => {
        const input = screen.getByPlaceholderText("Search Jobs")
        fireEvent.change(input, { target: { value: 'administrator' } })
        const jobs = screen.getAllByRole("list")
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Administrator, local government")).toBeInTheDocument()
    });

});
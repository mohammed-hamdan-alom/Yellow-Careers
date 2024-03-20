import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import JobFilter from '../JobFilter';
import userEvent from '@testing-library/user-event';
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

describe('JobFilterList component', () => {

    beforeEach(() => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <JobFilter data={data} />
                </AuthProvider>
            </MemoryRouter>
        );
    });

    test('renders JobSearchList component', () => {
        const searchList = screen.getByTestId("jobsearchbar");
        expect(searchList).toBeInTheDocument();
    });

    test('renders Location filter', () => {
        const location = screen.getByTestId("location");
        expect(location).toBeInTheDocument();
    });

    test('renders Pay filter', () => {
        const pay = screen.getByTestId("pay");
        expect(pay).toBeInTheDocument();
    });

    test('renders Contract filter', () => {
        const contract = screen.getByTestId("contract");
        expect(contract).toBeInTheDocument();
    });

    // test('Pay Filter filters correctly', () => {
    //     const payFilter = within(screen.getByTestId("pay")).getByRole("combobox")
    //     console.log(payFilter)
    //     userEvent.click(payFilter)
    //     userEvent.click(screen.getByTitle("£45,000+"))
    //     const jobs = screen.getAllByRole("list");
    //     expect(jobs).toHaveLength(2);
    //     expect(screen.getByText("Contracting civil engineer")).toBeInTheDocument();
    //     expect(screen.getByText("Chief Executive Officer")).toBeInTheDocument();

    // })
});
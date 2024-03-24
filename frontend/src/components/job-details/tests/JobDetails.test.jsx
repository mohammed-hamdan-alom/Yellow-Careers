import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import JobDetailsDisplay from "@/components/job-details/JobDetails";

const data = {
    "id": 1,
    "title": "Administrator, local government",
    "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    "address": {
        "post_code": "POSTCODE",
        "city": "CITY",
        "country": "COUNTRY",
    },
    "job_type": "FT",
    "salary": 44976,
    "company": "The Company"
}

describe('JobDetails component', () => {

    beforeEach(() => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobDetailsDisplay title={data.title} description={data.description} companyName={data.company} salary={data.salary} jobType={data.job_type} address={data.address} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })

    afterEach(cleanup);

    test('renders title', async () => {
        const title = await screen.findByText(data.title);
        expect(title).toBeInTheDocument();
    });

    test('renders description', async () => {
        const description = await screen.findByText(data.description);
        expect(description).toBeInTheDocument();
    });

    test('renders companyName', async () => {
        const company = await screen.findByText(data.company);
        expect(company).toBeInTheDocument();
    });

    test('renders salary', async () => {
        const salary = await screen.findByText("Salary: £" + data.salary);
        expect(salary).toBeInTheDocument();
    });

    test('renders jobType', async () => {
        const jobType = await screen.findByText("Job Type: " + data.job_type);
        expect(jobType).toBeInTheDocument();
    });

    test('renders address', async () => {
        const address = await screen.findByText("Location: " + data.address.post_code + ", " + data.address.city + ", " + data.address.country)
        expect(address).toBeInTheDocument();
    });

});
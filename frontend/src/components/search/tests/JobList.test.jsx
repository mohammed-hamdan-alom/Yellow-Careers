import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import JobList from '../JobList';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

const data = [{
    "id": 1,
    "title": "Administrator, local government",
    "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    "address": 501,
    "job_type": "FT",
    "salary": 44976,
    "company": {
        "id": 1,
        "company_name": "D",
        "website": "WEBSITE.COM",
        "about": "ABOUT SPENCER"
    }
},
{
    "id": 2,
    "title": "Contracting civil engineer",
    "description": "Fugiat adipisci tempore. Consectetur veniam quaerat deleniti assumenda sapiente.",
    "address": 502,
    "job_type": "IN",
    "salary": 74726,
    "company": {
        "id": 2,
        "company_name": "C",
        "website": "WEBSITE.COM",
        "about": "ABOUT SPENCER"
    }
},
{
    "id": 3,
    "title": "Office manager",
    "description": "Pariatur magnam quisquam distinctio. Repudiandae asperiores quidem dolor. Voluptatum omnis dolorem magnam et commodi magnam officiis.",
    "address": 503,
    "job_type": "TM",
    "salary": 35685,
    "company": {
        "id": 3,
        "company_name": "B",
        "website": "WEBSITE.COM",
        "about": "ABOUT SPENCER"
    }
},
{
    "id": 4,
    "title": "Chief Executive Officer",
    "description": "Aliquid mollitia vitae blanditiis dignissimos Adignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.",
    "address": 504,
    "job_type": "PT",
    "salary": 61939,
    "company": {
        "id": 4,
        "company_name": "lasdhflashjfdalsfdsjflkj",
        "website": "WEBSITE.COM",
        "about": "ABOUT SPENCER"
    }
}]

vi.mock("../../JobSummary/JobSummary", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        JobCard: vi.fn(() => <div></div>)
    }
});
vi.mock("../../../utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn(() => {
            return Promise.resolve({ data: {} })
        }),
    },
}));

describe('JobList component', () => {

    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobList data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })
    afterEach(cleanup);

    test('renders search bar', async () => {
        const searchBar = await screen.findByTestId("jobsearchbar");
        expect(searchBar).toBeInTheDocument();
    });

    test('renders jobs correctly', async () => {
        const jobs = await screen.findAllByRole("list");
        expect(jobs).toHaveLength(5); //there are 4 jobs, but this includes antd for some reason
    });

    test('search updates on change', async () => {
        const input = await screen.findByPlaceholderText("Search Jobs")
        act(() => {
            fireEvent.change(input, { target: { value: 'test' } })
        })
        expect(input.value).toBe('test')
    });

    test('searched jobs appear correctly based on title', async () => {

        const input = await screen.findByPlaceholderText("Search Jobs")
        act(() => {
            fireEvent.change(input, { target: { value: 'administrator' } })
        })
        const jobs = await screen.findAllByRole("list")
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Administrator, local government")).toBeInTheDocument()
    });

    test('searched jobs appear correctly based on description', async () => {

        const input = await screen.findByPlaceholderText("Search Jobs")
        act(() => {
            fireEvent.change(input, { target: { value: 'Adignissimos. Maiores' } })
        })
        const jobs = await screen.findAllByRole("list")
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Aliquid mollitia vitae blanditiis dignissimos Adignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.")).toBeInTheDocument()
    });

    test('searched jobs appear correctly based on company', async () => {

        const input = await screen.findByPlaceholderText("Search Jobs")
        act(() => {
            fireEvent.change(input, { target: { value: 'lasdhflashjfdalsfdsjflkj' } })
        })
        const jobs = await screen.findAllByRole("list")
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Aliquid mollitia vitae blanditiis dignissimos Adignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.")).toBeInTheDocument()
    });
});
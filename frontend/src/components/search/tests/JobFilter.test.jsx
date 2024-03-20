import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, cleanup, act } from '@testing-library/react';
import JobFilter from '../JobFilter';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// const countries = [{
//     { "country": }
// }]

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

const mockedAxios = vi.mock("../../../utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn(() => {
            return Promise.resolve({ data: data })
        }),
    },
}));

vi.mock("../../JobSummary/JobSummary", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        JobCard: vi.fn(() => <div></div>)
    }
});

describe('JobFilterList component', () => {

    afterEach(cleanup);

    test('renders JobList component', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
        const searchList = await screen.findByTestId("jobsearchbar");
        expect(searchList).toBeInTheDocument();
    });

    test('renders Location filter', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
        const location = await screen.findByTestId("location");
        expect(location).toBeInTheDocument();
    });

    test('renders Pay filter', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
        const pay = await screen.findByTestId("pay");
        expect(pay).toBeInTheDocument();
    });

    test('renders Contract filter', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
        const contract = await screen.findByTestId("jobType");
        expect(contract).toBeInTheDocument();
    });

    test('Pay filters correctly', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        });
        const payFilter = await (await screen.findByTestId("pay")).querySelector('input')
        act(() => {
            fireEvent.change(payFilter, { target: { value: "45000" } });
            const fortyfivethousand = screen.getByText("£45,000+")
            fireEvent.click(fortyfivethousand)
        })
        const jobs = await screen.findAllByRole("list");
        expect(jobs).toHaveLength(3);
        expect(screen.getByText("Contracting civil engineer")).toBeInTheDocument();
        expect(screen.getByText("Chief Executive Officer")).toBeInTheDocument();

    })

    test('JobType filters correctly', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        });
        const jobTypeFilter = await (await screen.findByTestId("jobType")).querySelector('input')
        act(() => {
            fireEvent.change(jobTypeFilter, { target: { value: "TM" } });
            const temporary = screen.getByText("Temporary")
            fireEvent.click(temporary)
        })
        const jobs = await screen.findAllByRole("list");
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Office manager")).toBeInTheDocument();
    })

    test('Location filters correctly', async () => {
        act(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        });
        const locationFilter = await (await screen.findByTestId("location")).querySelector('input')
        act(() => {
            fireEvent.change(locationFilter, { target: { value: "france" } });
            const france = screen.getByText("france")
            fireEvent.click(france)
        })
        const jobs = await screen.findAllByRole("list");
        expect(jobs).toHaveLength(2);
        expect(screen.getByText("Office manager")).toBeInTheDocument();
    })
});
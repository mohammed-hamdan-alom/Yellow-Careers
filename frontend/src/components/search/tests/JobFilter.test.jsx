import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, cleanup, act } from '@testing-library/react';
import JobFilter from '../JobFilter';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

const addressF = {
    "country": "France",
}

const addressG = {
    "country": "Germany",
}

const addresses = [{
    "id:": 501,
    "country": "France",
},
{
    "id": 502,
    "country": "France",
},
{
    "id": 503,
    "country": "Germany",
},
{
    "id": 504,
    "country": "Germany",
}]

const company = [{
    "company_name": "The Company",
}]

const data = [{
    "id": 1,
    "title": "Administrator, local government",
    "description": "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
    "address": { "country": "France" },
    "job_type": "FT",
    "salary": 44976
},
{
    "id": 2,
    "title": "Contracting civil engineer",
    "description": "Fugiat adipisci tempore. Consectetur veniam quaerat deleniti assumenda sapiente.",
    "address": { "country": "France" },
    "job_type": "IN",
    "salary": 74726
},
{
    "id": 3,
    "title": "Office manager",
    "description": "Pariatur magnam quisquam distinctio. Repudiandae asperiores quidem dolor. Voluptatum omnis dolorem magnam et commodi magnam officiis.",
    "address": { "country": "Germany" },
    "job_type": "TM",
    "salary": 35685
},
{
    "id": 4,
    "title": "Chief Executive Officer",
    "description": "Aliquid mollitia vitae blanditiis dignissimos dignissimos. Maiores architecto voluptatum ex. Corrupti voluptatem esse eum nostrum adipisci explicabo.",
    "address": { "country": "Germany" },
    "job_type": "PT",
    "salary": 61939
}]

vi.mock("../../../utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url == "api/jobs/1/company/" || url == "api/jobs/2/company/") {
                return Promise.resolve({ data: company })
            }
            else if (url == "api/addresses/") {
                return Promise.resolve({ data: addresses })
            }
            else if (url == "api/jobs/1/address/" || url == "api/jobs/2/address/") {
                return Promise.resolve({ data: addressF })
            }
            else if (url == "api/jobs/3/address/" || url == "api/jobs/4/address/") {
                return Promise.resolve({ data: addressG })
            }
            return Promise.resolve({ data: {} })
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

describe('JobFilter component', () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <JobFilter data={data} />
                    </AuthProvider>
                </MemoryRouter>
            );
        })
    })
    afterEach(cleanup);

    test('renders JobList component', async () => {

        const searchList = await screen.findByTestId("jobsearchbar");
        expect(searchList).toBeInTheDocument();
    });

    test('renders Location filter', async () => {
        const location = await screen.findByTestId("location");
        expect(location).toBeInTheDocument();
    });

    test('renders Pay filter', async () => {
        const pay = await screen.findByTestId("pay");
        expect(pay).toBeInTheDocument();
    });

    test('renders Contract filter', async () => {
        const contract = await screen.findByTestId("jobType");
        expect(contract).toBeInTheDocument();
    });

    test('Pay filters correctly', async () => {
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
        const locationFilter = await (await screen.findByTestId("location")).querySelector('input')
        act(() => {
            fireEvent.change(locationFilter, { target: { value: "France" } });
            fireEvent.keyDown(locationFilter, { key: 'Enter', keyCode: 13 })

        })
        const jobs = await screen.findAllByRole("list");
        expect(jobs).toHaveLength(3);
        expect(screen.getByText("Contracting civil engineer")).toBeInTheDocument();
        expect(screen.getByText("Administrator, local government")).toBeInTheDocument();
    })
});
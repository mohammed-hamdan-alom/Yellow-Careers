import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import ArchivedJobsListPage from "../ArchivedJobsListPage";

const navigate = vi.fn();

vi.mock("@/features/employer/ToggleJobs/EmployerJobList", () => ({
    default: vi.fn(() => <div data-testid="mock-togglecompanyemployerjobs"></div>),
}));

const adminUser = {
    is_company_admin: true,
    user: {
        user_type: "employer",
        user_id: 1,

    },
};

const nonAdminUser = {
    is_company_admin: false,
    user: {
        user_type: "employer",
        user_id: 2,

    },
};

const archivedJobs = [
    {
        id: 1,
        title: "Administrator, local government",
        description:
            "Labore provident corporis deserunt perferendis. Magni a modi autem earum dolor. Commodi iure consectetur doloribus minima aliquid minima. Quidem recusandae quisquam facilis repudiandae occaecati similique.",
        address: {
            post_code: "POSTCODE",
            city: "CITY",
            country: "COUNTRY",
        },
        job_type: "FT",
        salary: 44976,
        company: {
            id: 1,
            company_name: "The Company",
            website: "http://www.morris-murphy.org/",
            about: "This is a Company",
        },
    },
]

const company = {
    id: 1,
    company_name: "The Company",
    website: "http://www.morris-murphy.org/",
    about: "This is a Company",
}

vi.mock("@/utils/AxiosInstance", () => ({
    __esModule: true,
    default: {
        get: vi.fn((url) => {
            if (url == `api/employer/1/jobs/archived/` || url == `api/employer/2/jobs/archived/`) {
                return Promise.resolve({ data: archivedJobs });
            } else if (url == `api/jobs/1/company/`) {
                return Promise.resolve({ data: company });
            } else if (url == `api/employers/1/`) {
                return Promise.resolve({ data: adminUser });
            } else if (url == `api/employer/1/company-jobs/archived/`) {
                return Promise.resolve({ data: archivedJobs });
            }
            else if (url == `api/employers/2/`) {
                return Promise.resolve({ data: nonAdminUser })
            }
        }),
    },
}));

vi.mock("@/context/AuthContext", () => ({
    __esModule: true,
    default: React.createContext(),
}));

describe("ArchivedJobsListPage component as admin", () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={adminUser}>
                        <ArchivedJobsListPage />
                    </AuthContext.Provider>
                </MemoryRouter>,
            );
        });
    });

    afterEach(cleanup);

    test("renders ToggleCompanyEmployerJobs Component as admin with expected calls", async () => {

        expect(AxiosInstance.get).toBeCalledWith(`api/employer/1/jobs/archived/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/jobs/1/company/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/employers/1/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/employer/1/company-jobs/archived/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/jobs/1/company/`)

        expect(screen.getByTestId("mock-togglecompanyemployerjobs")).toBeInTheDocument()
    });
});

describe("ArchivedJobsListPage component as non-admin", () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext.Provider value={nonAdminUser}>
                        <ArchivedJobsListPage />
                    </AuthContext.Provider>
                </MemoryRouter>,
            );
        });
    });

    afterEach(cleanup);

    test("renders ToggleCompanyEmployerJobs Component as non-admin with expected calls", async () => {

        expect(AxiosInstance.get).toBeCalledWith(`api/employer/2/jobs/archived/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/jobs/1/company/`)
        expect(AxiosInstance.get).toBeCalledWith(`api/employers/2/`)
        expect(AxiosInstance.get).not.toBeCalledWith(`api/employer/2/company-jobs/archived/`)

        expect(screen.getByTestId("mock-togglecompanyemployerjobs")).toBeInTheDocument()
    });
});

import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import JobFilterList from '../JobFilterList';

vi.mock("../JobSearchList", () => {
    return {
        default: () => (<div data-testid="mock-searchList"> </div>)
    }
})

describe('JobFilterList component', () => {

    beforeEach(() => {
        render(
            <JobFilterList />
        );
    });

    test('renders JobSearchList component', () => {
        const searchList = screen.getByTestId("mock-searchList");
        expect(searchList).toBeInTheDocument();
    });

    test('renders Location filter', () => {
        const location = screen.getByTestId("location");
        expect(location).toBeInTheDocument();
    })

    test('renders Pay filter', () => {
        const pay = screen.getByTestId("pay");
        expect(pay).toBeInTheDocument();
    })

    test('renders Contract filter', () => {
        const contract = screen.getByTestId("contract");
        expect(contract).toBeInTheDocument();
    })

});
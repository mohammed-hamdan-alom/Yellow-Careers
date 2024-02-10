import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import DashBoardPage from '../DashBoardPage';

describe('DashBoardPage', () => {
  test('renders job summaries', () => {
    render(<DashBoardPage />);
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.getByText("Jobs tailored for you!")).toBeInTheDocument();
  });
});

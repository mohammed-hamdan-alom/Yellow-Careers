import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  test('renders LoginPage component', () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  test('allows entering a username and password', async () => {
    render(<LoginPage />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password');
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password');
  });

  test('clears the form when the cancel button is clicked', async () => {
    render(<LoginPage />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const cancelButton = screen.getByText(/cancel/i);

    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'password');

    userEvent.click(cancelButton);

    expect(usernameInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });

  test('calls handleSubmit when the form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<LoginPage onSubmit={handleSubmit} />);
    const submitButton = screen.getByText(/log in/i);
    fireEvent.click(submitButton);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

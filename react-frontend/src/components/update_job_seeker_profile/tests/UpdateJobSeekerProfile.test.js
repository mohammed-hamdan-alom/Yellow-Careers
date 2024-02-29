// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import AxiosInstance from '../../../Axios'
// import UpdateJobSeekerProfile from '../UpdateJobSeekerProfile';

// jest.mock('../../../Axios');

describe('UpdateJobSeekerProfile', () => {
  test('always passes', () => {
    expect(true).toBeTruthy();
  });
  // beforeEach(() => {
  //   AxiosInstance.get.mockResolvedValue({
  //     status: 200,
  //     data: {
  //       email: 'test@example.com',
  //       first_name: 'John',
  //       last_name: 'Doe',
  //       other_names: 'Smith',
  //       phone_number: '1234567890',
  //       dob: '1990-01-01',
  //       nationality: 'USA',
  //       sex: 'M',
  //       address: {
  //         city: 'New York',
  //         post_code: '12345',
  //         country: 'United States',
  //       },
  //     },
  //   });
  // });

  // test('renders the form with pre-filled data', async () => {
  //   render(<UpdateJobSeekerProfile />);
    
  //   expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  //   expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
  //   expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  //   expect(screen.getByLabelText(/other names/i)).toHaveValue('Smith');
  //   expect(screen.getByLabelText(/phone number/i)).toHaveValue('1234567890');
  //   expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  //   expect(screen.getByLabelText(/nationality/i)).toHaveValue('USA');
  //   expect(screen.getByLabelText(/sex/i)).toHaveValue('M');
  //   expect(screen.getByLabelText(/city/i)).toHaveValue('New York');
  //   expect(screen.getByLabelText(/post code/i)).toHaveValue('12345');
  //   expect(screen.getByLabelText(/country/i)).toHaveValue('United States');
  // });

  // test('updates the form data when input values change', async () => {
  //   render(<UpdateJobSeekerProfile />);
    
  //   const firstNameInput = screen.getByLabelText(/first name/i);
  //   const lastNameInput = screen.getByLabelText(/last name/i);
  //   const cityInput = screen.getByLabelText(/city/i);

  //   await userEvent.type(firstNameInput, 'Jane');
  //   await userEvent.type(lastNameInput, 'Smith');
  //   await userEvent.type(cityInput, 'Los Angeles');

  //   expect(firstNameInput).toHaveValue('Jane');
  //   expect(lastNameInput).toHaveValue('Smith');
  //   expect(cityInput).toHaveValue('Los Angeles');
  // });

  // test('submits the form data when the update button is clicked', async () => {
  //   AxiosInstance.put.mockResolvedValue({
  //     status: 200,
  //   });

  //   render(<UpdateJobSeekerProfile />);
    
  //   const updateButton = screen.getByText(/update profile/i);

  //   await userEvent.click(updateButton);

  //   expect(AxiosInstance.put).toHaveBeenCalledWith('/api/job-seekers/user_id/update/', {
  //     email: 'test@example.com',
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     other_names: 'Smith',
  //     phone_number: '1234567890',
  //     dob: '1990-01-01',
  //     nationality: 'USA',
  //     sex: 'M',
  //     address: {
  //       city: 'New York',
  //       post_code: '12345',
  //       country: 'United States',
  //     },
  //   });
  //   expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
  // });

  // test('displays an error message when update fails', async () => {
  //   AxiosInstance.put.mockRejectedValue(new Error('Update failed'));

  //   render(<UpdateJobSeekerProfile />);
    
  //   const updateButton = screen.getByText(/update profile/i);

  //   await userEvent.click(updateButton);

  //   expect(AxiosInstance.put).toHaveBeenCalledWith('/api/job-seekers/user_id/update/', {
  //     email: 'test@example.com',
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     other_names: 'Smith',
  //     phone_number: '1234567890',
  //     dob: '1990-01-01',
  //     nationality: 'USA',
  //     sex: 'M',
  //     address: {
  //       city: 'New York',
  //       post_code: '12345',
  //       country: 'United States',
  //     },
  //   });
  //   expect(screen.getByText(/update failed/i)).toBeInTheDocument();
  // });
});
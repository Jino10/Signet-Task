import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignUp from '../../../src/Pages/Authentication/SignUp';
import React from 'react';
import emailValidator from '../../../src/EmailValidator';
import { aboutSignet } from '../../../src/Constants/TextConstants';

const MockSignUp = () => {
  return (
    <Router>
      <SignUp />
    </Router>
  );
};

describe('SignUp page', () => {
  beforeEach(() => {
    render(<MockSignUp />);
  });

  it('should render component', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    expect(firstNameInput).toBeInTheDocument();
  });

  it('should render all inputs, login button and links', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const orgNameInput = screen.getByPlaceholderText('Organization');
    const termsInput = screen.getByTestId('termsCheckbox');

    const verifyBtn = screen.getByTestId('verifybtn');
    const createAccountBtn = screen.getByRole('button', { name: 'Create Account' });
    const loginLink = screen.getByRole('link', { name: 'Login' });

    const termsLabel = screen.getByLabelText('Agree to terms and conditions');

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(orgEmailInput).toBeInTheDocument();
    expect(phoneNoInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(orgNameInput).toBeInTheDocument();
    expect(termsInput).toBeInTheDocument();

    expect(verifyBtn).toBeInTheDocument();
    expect(createAccountBtn).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/');

    expect(termsLabel).toBeInTheDocument();
  });

  it('should render all texts', async () => {
    expect(screen.getByText(aboutSignet)).toBeInTheDocument();
    expect(
      screen.getByText(
        'SIGNET Remote Smart is a next generation network operations center (NOC) located at SIGNET’s Norwell, Massachusetts, headquarters.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('SIGNET REMOTE SMART')).toBeInTheDocument();
  });

  it('firstName input should change', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'abcde' } });
    expect(firstNameInput.value).toBe('abcde');
  });

  it('lastName input should change', async () => {
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'v' } });
    expect(lastNameInput.value).toBe('v');
  });

  it('organization email input should change', async () => {
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    fireEvent.change(orgEmailInput, { target: { value: 'abcde.f@capestart.com' } });
    expect(orgEmailInput.value).toBe('abcde.f@capestart.com');
  });

  it('phone number input should change', async () => {
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    fireEvent.change(phoneNoInput, { target: { value: '9876543210' } });
    expect(phoneNoInput.value).toBe('(987) 654-3210');
  });

  it('password input should change', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'abcdefgh' } });
    expect(passwordInput.value).toBe('abcdefgh');
  });

  it('confirm password input should change', async () => {
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'abcdefgh' } });
    expect(confirmPasswordInput.value).toBe('abcdefgh');
  });

  it('organization name input should change', async () => {
    const orgNameInput = screen.getByPlaceholderText('Organization');
    fireEvent.change(orgNameInput, { target: { value: 'capestart' } });
    expect(orgNameInput.value).toBe('capestart');
  });

  it('terms checkbox input should change', async () => {
    const termsInput = screen.getByTestId('termsCheckbox');
    expect(termsInput.checked).toEqual(false);
    userEvent.click(termsInput);
    expect(termsInput.checked).toEqual(true);
  });

  it('verfiy button and OTP input should change', async () => {
    const verifyBtn = screen.getByTestId('verifybtn');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    fireEvent.change(phoneNoInput, { target: { value: '9445736377' } });
    userEvent.click(verifyBtn);

    expect(verifyBtn).not.toBeInTheDocument();
    const otpInput = screen.getByTestId('OTP');
    const resendOtpBtn = screen.getByTestId('resendOTP');
    expect(otpInput).toBeInTheDocument();
    expect(resendOtpBtn).toBeInTheDocument();

    fireEvent.change(otpInput, { target: { value: '4444' } });
    expect(otpInput.value).toBe('4444');
  });

  it('should be failed on validation', async () => {
    const verifyBtn = screen.getByTestId('verifybtn');
    userEvent.click(verifyBtn);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const orgNameInput = screen.getByPlaceholderText('Organization');
    const termsInput = screen.getByTestId('termsCheckbox');

    expect(firstNameInput).toHaveAttribute('data-validity', 'false');
    expect(lastNameInput).toHaveAttribute('data-validity', 'false');
    expect(orgEmailInput).toHaveAttribute('data-validity', 'false');
    expect(phoneNoInput).toHaveAttribute('data-validity', 'false');
    expect(passwordInput).toHaveAttribute('data-validity', 'false');
    expect(confirmPasswordInput).toHaveAttribute('data-validity', 'false');
    expect(orgNameInput).toHaveAttribute('data-validity', 'false');
    expect(termsInput).toHaveAttribute('data-validity', 'false');

    expect(screen.getByText('Enter a valid First Name')).toBeVisible();
    expect(screen.getByText('Enter a valid Last Name')).toBeVisible();
    expect(screen.getByText('Please provide a organization Email')).toBeVisible();
    expect(screen.getByText('Enter a valid Phone Number')).toBeVisible();
    expect(
      screen.getByText(
        'The password entered is not strong, Please enter a strong password with minimum 8 characters, a capital letter and a special character',
      ),
    ).toBeVisible();
    expect(screen.getByText('Password did not match')).toBeVisible();
    expect(screen.getByText('This field is required')).toBeVisible();
    expect(screen.getByText('Please agree to terms and conditions')).toBeVisible();
  });

  it('email validation', async () => {
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');

    fireEvent.change(orgEmailInput, { target: { value: 'abcde.f' } });
    expect(emailValidator(orgEmailInput.value)).toBe(true);
    expect(orgEmailInput).toHaveAttribute('data-validity', 'true');

    fireEvent.change(orgEmailInput, { target: { value: 'abcde.f@gmail.com' } });
    expect(emailValidator(orgEmailInput.value)).toBe(false);
    expect(orgEmailInput).toHaveAttribute('data-validity', 'false');

    fireEvent.change(orgEmailInput, { target: { value: 'abcde.f@capestart.com' } });
    expect(emailValidator(orgEmailInput.value)).toBe(false);
    expect(orgEmailInput).toHaveAttribute('data-validity', 'false');
  });

  it('phone number validation', async () => {
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    fireEvent.change(phoneNoInput, { target: { value: '9876543210' } });
    expect(phoneNoInput.value).not.toBe('9876543210');
    expect(phoneNoInput.value).toBe('(987) 654-3210');
  });

  it('password validation', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'abcde' } });
    expect(passwordInput).toHaveAttribute('data-validity', 'true');
    fireEvent.change(passwordInput, { target: { value: 'Abcd_123' } });
    expect(passwordInput).toHaveAttribute('data-validity', 'false');
  });

  it('confirm password validation', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'Abcd_123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'abcdefgh' } });
    expect(confirmPasswordInput).toHaveAttribute('data-validity', 'true');
    fireEvent.change(confirmPasswordInput, { target: { value: 'Abcd_123' } });
    expect(confirmPasswordInput).toHaveAttribute('data-validity', 'false');
  });
});

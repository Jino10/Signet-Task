import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../../src/Pages/Authentication/Login';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../../src/Redux/Reducers/RootReducers';
import { GOOGLE_LOGIN_URL, MICROSOFT_LOGIN_URL } from '../../../src/Config/Environment';
import * as fetchAPI from '../../../src/Services/APIService';
import APIUrlConstants from '../../../src/Config/APIUrlConstants';
import { apiMethods } from '../../../src/Constants/TextConstants';

const renderWithRouter = (ui, { initialState = {}, store = createStore(rootReducer, initialState), ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe('Login page', () => {
  beforeEach(() => {
    renderWithRouter(
      <MemoryRouter initialEntries={['/']}>
        <Login />
      </MemoryRouter>,
      { route: '/' },
    );
  });

  it('should render component', async () => {
    const emailInput = screen.getByPlaceholderText(/Email/i);

    expect(emailInput).toBeInTheDocument();
  });

  it('should render all inputs, login button and links', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });
    const forgotPassword = screen.getByRole('link', { name: 'Forgot password?' });
    const createAccount = screen.getByRole('link', { name: 'Create an account' });
    const googleLink = screen.getByTestId('googleURL');
    const microsoftLink = screen.getByTestId('microsoftURL');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(forgotPassword).toHaveAttribute('href', '/forgotpassword');
    expect(createAccount).toHaveAttribute('href', '/signup');
    expect(googleLink).toHaveAttribute('href', GOOGLE_LOGIN_URL);
    expect(microsoftLink).toHaveAttribute('href', MICROSOFT_LOGIN_URL);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('email input should change', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'abcde.f@capestart.com' } });
    expect(emailInput.value).toBe('abcde.f@capestart.com');
  });

  it('password input should change', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'Abcd_123' } });
    expect(passwordInput.value).toBe('Abcd_123');
  });

  it('should be failed on email and password validation', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    userEvent.click(loginButton);
    expect(await screen.findByText('Please provide a valid email')).toBeVisible();
    expect(await screen.findByText('Please provide a valid password')).toBeVisible();
    expect(emailInput).toHaveAttribute('data-validity', 'false');
    expect(passwordInput).toHaveAttribute('data-validity', 'false');
  });

  it('should be failed on empty email validation', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    expect(emailInput.value).toBe('');
    userEvent.click(loginButton);
    expect(await screen.findByText('Please provide a valid email')).toBeVisible();
    expect(emailInput).toHaveAttribute('data-validity', 'false');
  });

  it('should be failed on empty password validation', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    expect(passwordInput.value).toBe('');
    userEvent.click(loginButton);
    expect(await screen.findByText('Please provide a valid password')).toBeVisible();
    expect(passwordInput).toHaveAttribute('data-validity', 'false');
  });

  it('should be failed on email validation', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(emailInput, 'srinu.v');
    userEvent.click(loginButton);
    expect(emailInput.value).not.toMatch('abcde.f@capestart.com');
    expect(await screen.findByText('Please provide a valid email')).toBeVisible();
    expect(emailInput).toHaveAttribute('data-validity', 'false');
  });

  it('should be failed on password validation', async () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(passwordInput, 'Cape');
    userEvent.click(loginButton);
    expect(passwordInput.value).not.toMatch('Abcd_123');
    expect(await screen.findByText('Please provide a valid password')).toBeVisible();
    expect(passwordInput).toHaveAttribute('data-validity', 'false');
  });

  it('should fail mock api test', async () => {
    const wrongPassord = [
      400,
      {
        data: null,
        status: 'Fail',
        message: 'Please provide valid username and password',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(wrongPassord);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(emailInput, 'abcde.f@capestart.com');
    userEvent.type(passwordInput, 'Abcd_123456');
    userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please provide valid username and password')).toBeVisible();
    });
  });

  it('should not show errors', async () => {
    const correctPassord = [
      200,
      {
        data: {
          isMobileVerify: true,
          firstName: 'Abcde',
          lastName: 'F',
          isSocial: 'N',
          orgEmail: 'abcde.f@capestart.com',
          orgName: 'Capestart',
          orgNo: null,
          userId: '00u5o7o7dqEyM6LUp5e8',
        },
        status: 'Success',
        message: 'Authenticated',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(correctPassord);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    userEvent.type(emailInput, 'abcde.f@capestart.com');
    userEvent.type(passwordInput, 'Abcd_123');
    userEvent.click(loginButton);

    expect(emailInput).toHaveAttribute('data-validity', 'true');
    expect(passwordInput).toHaveAttribute('data-validity', 'true');

    const urlencoded = new URLSearchParams();
    urlencoded.append('username', emailInput.value);
    urlencoded.append('password', passwordInput.value);
    const { 0: statuscode, 1: data } = await fetchAPI.fetchCall(APIUrlConstants.LOGIN_API, apiMethods.POST, urlencoded);
    expect(statuscode).toBe(200);
  });
});

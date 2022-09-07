import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Profile from '../../../src/Pages/Profile/Profile';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../../src/Redux/Reducers/RootReducers';
import * as fetchAPI from '../../../src/Services/APIService';
import * as Routers from 'react-router';

const renderWithRouter = (ui, { initialState = {}, store = createStore(rootReducer, initialState), ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe('Profile page', () => {
  beforeEach(() => {
    renderWithRouter(
      <MemoryRouter initialEntries={['/']}>
        <Profile />
      </MemoryRouter>,
      { route: '/profile' },
    );
  });

  it('should render component', async () => {
    const Heading = screen.getByText('Profile');
    expect(Heading).toBeInTheDocument();
  });

  it('should render all labels', async () => {
    const firstNameLabel = screen.getByText('First Name');
    const lastNameLabel = screen.getByText('Last Name');
    const orgEmailLabel = screen.getByText('Organization Email');
    const orgNameLabel = screen.getByText('Organization Name');
    const phoneNoLabel = screen.getByText('Phone Number');

    expect(firstNameLabel).toBeInTheDocument();
    expect(lastNameLabel).toBeInTheDocument();
    expect(orgEmailLabel).toBeInTheDocument();
    expect(orgNameLabel).toBeInTheDocument();
    expect(phoneNoLabel).toBeInTheDocument();
  });

  it('should render all inputs and button', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const orgNameInput = screen.getByPlaceholderText('Organization Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    const editBtn = screen.getByRole('button', { name: 'Edit' });

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(orgEmailInput).toBeInTheDocument();
    expect(orgNameInput).toBeInTheDocument();
    expect(phoneNoInput).toBeInTheDocument();
    expect(editBtn).toBeInTheDocument();
  });

  it('inputs should be readonly', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const orgNameInput = screen.getByPlaceholderText('Organization Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');

    expect(firstNameInput).toHaveAttribute('readonly');
    expect(lastNameInput).toHaveAttribute('readonly');
    expect(orgEmailInput).toHaveAttribute('readonly');
    expect(orgNameInput).toHaveAttribute('readonly');
    expect(phoneNoInput).toHaveAttribute('readonly');
  });

  it('should render verify and save buttons', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    const verifyBtn = screen.getByText('Verify');
    expect(saveBtn).toBeInTheDocument();
    expect(verifyBtn).toBeInTheDocument();
  });

  it('inputs should change', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const orgNameInput = screen.getByPlaceholderText('Organization Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');

    expect(orgEmailInput).toHaveAttribute('readonly');
    expect(orgNameInput).toHaveAttribute('readonly');
    expect(firstNameInput).not.toHaveAttribute('readonly');
    expect(lastNameInput).not.toHaveAttribute('readonly');
    expect(phoneNoInput).not.toHaveAttribute('readonly');

    fireEvent.change(firstNameInput, { target: { value: 'test123' } });
    expect(firstNameInput.value).toBe('test123');
    fireEvent.change(lastNameInput, { target: { value: 'test123' } });
    expect(lastNameInput.value).toBe('test123');
    fireEvent.change(phoneNoInput, { target: { value: '9876543210' } });
    expect(phoneNoInput.value).toBe('(987) 654-3210');
  });

  it('should show errors', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(phoneNoInput, { target: { value: '55' } });

    const validFirstName = screen.getByText('Enter a valid First Name');
    const validLastName = screen.getByText('Enter a valid Last Name');
    const validPhoneNo = screen.getByText('Enter a valid Phone Number');

    expect(validFirstName).toBeInTheDocument();
    expect(validLastName).toBeInTheDocument();
    expect(validPhoneNo).toBeInTheDocument();
  });

  it('should show errors', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(phoneNoInput, { target: { value: '55' } });

    const validFirstName = screen.getByText('Enter a valid First Name');
    const validLastName = screen.getByText('Enter a valid Last Name');
    const validPhoneNo = screen.getByText('Enter a valid Phone Number');

    expect(validFirstName).toBeInTheDocument();
    expect(validLastName).toBeInTheDocument();
    expect(validPhoneNo).toBeInTheDocument();
  });
});

describe('Edit Profile page', () => {
  const navigate = jest.fn();
  beforeEach(() => {
    const parseMockValue = {
      emailId: 'testing.t@capestart.com',
      otp: null,
      token:
        'eyJraWQiOiJiR2VvZC1sWUxCaHNMMjJRLU5IMlpYQnBLZWo2X2F2OUF0RjBWeS1RNXg0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmt1YWp6MFk0QmE5ZGY4NUg3ZDg4SWZpY2pTMTVIb0lCVHQ2dGlmbWRkcjQub2FybW84bXdoeHhvendJQjI1ZDYiLCJpc3MiOiJodHRwczovL2Rldi05NjkyNTcwLm9rdGEuY29tL29hdXRoMi9hdXM1YTEzam8yOGoxYjZNNDVkNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NjE3NjUwNDQsImV4cCI6MTY2MTc2ODY0NCwiY2lkIjoiMG9hNWEwaWpnOFpwaEZvWWs1ZDciLCJ1aWQiOiIwMHU1bzdvN2RxRXlNNkxVcDVkNyIsInNjcCI6WyJvZmZsaW5lX2FjY2VzcyIsImdyb3VwcyIsIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJhdXRoX3RpbWUiOjE2NjE3NjUwNDQsInN1YiI6InNyaW51LnZAY2FwZXN0YXJ0LmNvbSIsImZpcnN0TmFtZSI6IlNyaW51IiwibGFzdE5hbWUiOiJWIiwibW9iaWxlUGhvbmUiOiI5NDQ1NzM2MzA3Iiwib3JnYW5pemF0aW9uIjoiQ2FwZXN0YXJ0IiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIiwiU2lnbmV0IEFkbWluIl0sInVzZXJUeXBlIjoiIiwiZW1haWwiOiJzcmludS52QGNhcGVzdGFydC5jb20ifQ.BOW7RetzYcFuNavBIE4z4Xtkp5TiylaBqh9IIdDqdlcBu00LpvtvomsVVWZhyaXYThRew_-Pr8ZZC7157X5pOVNPTNIwvr8cKp_G3rvHJsGBh14QPhvZTkasizfpSmvBT1N_htu3TYL0vH8KCX8f4Ga1y7wUt_StOD3FHS0ShsoMTQR6nMKOeLC-rL_Xw7bKaL93qtCIRu-Jy2R-yvr4-Lx1DGN0b--SlTjixBengBkID62M_qctsUjtvvuii5zvvWy177ANagPsD57w8iJw2Ijvw8WG7jrobzxScxdx0BV6Q37ZPHQOAhXRvqyrAvLG1ZJxNjG4Sy1eC7SvuDyNLg',
      firstName: 'Testing',
      lastName: 'T',
      orgName: 'Capestart',
      secondEmail: null,
      roleId: '00g5a0q59kk1iTOlH5d7',
      userId: '00u5o7o7dqEyM6LUp5d7',
      mobileNumber: '8976543210',
      orgNo: 'CAI001',
      contactSales: false,
      mobileVerify: true,
    };
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem('user', JSON.stringify(parseMockValue));
    localStorage.setItem('roleId', '00g5a0q59kk1iTOlH5d7');
    JSON.parse = jest.fn().mockImplementationOnce(() => {
      return parseMockValue;
    });

    renderWithRouter(
      <MemoryRouter initialEntries={['/']}>
        <Profile />
      </MemoryRouter>,
      { route: '/profile' },
    );
  });

  it('inputs should render with values', async () => {
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const orgEmailInput = screen.getByPlaceholderText('Organization Email');
    const orgNameInput = screen.getByPlaceholderText('Organization Name');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');

    expect(firstNameInput.value).toBe('Testing');
    expect(lastNameInput.value).toBe('T');
    expect(orgEmailInput.value).toBe('testing.t@capestart.com');
    expect(orgNameInput.value).toBe('Capestart');
    expect(phoneNoInput.value).toBe('(897) 654-3210');
  });

  it('should render otp input', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);
    const verifyBtn = screen.getByText('Verify');
    userEvent.click(verifyBtn);

    const otpInput = screen.getByPlaceholderText('OTP Number');
    const validOTP = screen.getByText('Enter a valid OTP');
    const resendBtn = screen.getByText('Resend OTP');
    expect(otpInput).toBeInTheDocument();
    expect(validOTP).toBeInTheDocument();
    expect(resendBtn).toBeInTheDocument();
  });

  it('should navigate to tickets page', async () => {
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    userEvent.click(cancelBtn);
    expect(navigate).toHaveBeenCalledWith('/tickets');
  });

  it('should update user', async () => {
    const updateResponse = [
      200,
      {
        data: {
          userId: '00u5o7o7dqEyM6LUp5d7',
          orgEmail: 'testing.t@capestart.com',
          firstName: 'Testing',
          lastName: 'V',
          mobileNumber: '8976543210',
          status: 'Active',
          organization: 'Capestart',
          roleId: '00g5a0q59kk1iTOlH5d7',
        },
      },
    ];
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(updateResponse);

    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveBtn);
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeVisible();
    });
  });
  it('should not update user', async () => {
    const updateResponse = [400, { message: 'something went wrong' }];
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(updateResponse);

    const editBtn = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(editBtn);
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveBtn);
    await waitFor(() => {
      expect(screen.getByText('something went wrong')).toBeVisible();
    });
  });
});

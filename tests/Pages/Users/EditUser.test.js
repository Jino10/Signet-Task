import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import EditUser from '../../../src/Pages/EditUser/EditUser';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('create User', () => {
  let history;
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    history = {
      push: jest.fn(),
    };
    useNavigate.mockReturnValue(history);
  });

  it('onSubmit is called when all fields pass validation', () => {
    render(<EditUser />);
    const linkElement = screen.queryByTestId('edituser');
    expect(linkElement).toBeInTheDocument();
    user.type(screen.queryByTestId('FName'), 'first name');
    user.type(screen.queryByTestId('LName'), 'last name');
    user.type(screen.queryByTestId('userOrg'), 'Org name');
    user.type(screen.queryByTestId('orgEmail'), 'orgEmail');
    user.type(screen.queryByTestId('email'), 'email');
    useNavigate.mockReturnValue({ location: { pathname: '/users' } });
    const history = useNavigate();
    expect(history.location.pathname).toBe('/users');
  });
});

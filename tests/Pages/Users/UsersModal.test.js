import React from 'react';
import { render, screen } from '@testing-library/react';
import UserModal from '../../../src/Pages/Users/UserModal';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { shallow } from 'enzyme';
import { makeRequest } from '../../../src/Services/APIService';
import { httpStatusCode } from '../../../src/Constants/TextConstants';
jest.mock('../../../src/Services/APIService');

describe('create User', () => {
  let enzymeWrapper;
  beforeEach(() => {
    makeRequest.mockResolvedValue([
      httpStatusCode.SUCCESS,
      {
        lastName: 'cat',
        firstName: 'dog',
        orgName: 'catOrg',
        email: 'cat@catOrg',
      },
    ]);
    const props = {};
    enzymeWrapper = shallow(<UserModal {...props} />);
  });

  afterEach(() => {
    enzymeWrapper.unmount();
    jest.restoreAllMocks();
  });

  const mockedUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
  }));
  console.error = jest.fn();

  beforeEach(() => {
    console.error.mockClear();
  });
  it('onSubmit is called when all fields pass validation', () => {
    render(<UserModal />);
    const linkElement = screen.queryByTestId('userModal');
    expect(linkElement).toBeInTheDocument();
    user.type(screen.queryByTestId('FName'), '/first name/i');
    user.type(screen.queryByTestId('LName'), '/last name/i');
    user.type(screen.queryByTestId('userOrg'), '/Org name/i');
    user.type(screen.queryByTestId('orgEmail'), 'Email');
    user.type(screen.queryByTestId('email'), 'Organization Email');
    user.type(screen.queryByTestId('userRole'), 'Select Role');
  });
});

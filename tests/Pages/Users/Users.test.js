import React from 'react';
import { shallow } from 'enzyme';
import Users from '../../../src/Pages/Users/Users';
import { httpStatusCode } from '../../../src/Constants/TextConstants';
import { makeRequest } from '../../../src/Services/APIService';

jest.mock('../../../src/Services/APIService');

describe('Admin User list', () => {
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
    enzymeWrapper = shallow(<Users {...props} />);
  });

  afterEach(() => {
    enzymeWrapper.unmount();
    jest.restoreAllMocks();
  });

  test('should render title', () => {
    expect(enzymeWrapper.find('h6').find('Users'));
    expect(enzymeWrapper.find('Modal').exists());
  });

  test('should not show modal if no userId in props', () => {
    expect(enzymeWrapper.find('Modal'));
  });
});

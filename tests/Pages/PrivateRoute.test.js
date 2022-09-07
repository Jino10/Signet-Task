import React from 'react';
import { shallow } from 'enzyme';
import '@testing-library/jest-dom';
import Dashboard from '../../src/Pages/Dashboard/Dashboard';

describe('Dashboard', () => {
  it('should render Dashboard', () => {
    localStorage.setItem('userId', '11111');
    const component = shallow(<Dashboard />);
    expect(component.getElements()).toMatchSnapshot();
  });
});

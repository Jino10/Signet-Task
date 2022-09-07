import React from 'react';
import { shallow } from 'enzyme';
import NetworkHealth from '../../../src/Pages/NetworkHealth/NetworkHealth';

describe('Network Health Component', () => {
  describe('render Network Health Component', () => {
    it('without crashing', () => {
      shallow(<NetworkHealth />);
    });
  });
});

it('should show correct text in title', () => {
  const wrapper = shallow(<NetworkHealth />);
  expect(wrapper.text().includes('Dashboard')).toBe(true);
});

it('button should be rendered', () => {
  const wrapper = shallow(<NetworkHealth />);
  wrapper.find('Button').simulate('click');
  expect(wrapper.text()).toBe('Contact Sales');
});

it('video should be rendered', () => {
  const wrapper = shallow(<NetworkHealth />);
  wrapper.find('video').simulate('ended');
  expect(wrapper.text()).toBeDefined();
});

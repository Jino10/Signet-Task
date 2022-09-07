import React from 'react';
import { shallow } from 'enzyme';
import Chats from '../../../src/Pages/Chats/Chats';

describe('Chat Component', () => {
  describe('render Chat Component', () => {
    it('without crashing', () => {
      shallow(<Chats />);
    });
  });
});

it('should show correct text in title', () => {
  const wrapper = shallow(<Chats />);
  expect(wrapper.text().includes('/Chat Demo/i')).toBe(false);
});

it('video should be rendered', () => {
  const wrapper = shallow(<Chats />);
  wrapper.find('video').simulate('ended');
  expect(wrapper.text()).toBeDefined();
});

it('button should be rendered', () => {
  const wrapper = shallow(<Chats />);
  wrapper.find('Button').simulate('click');
  expect(wrapper.text()).toBe('Contact Sales');
});

import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../../src/Common/Header/Header.js';

describe('Header Component', () => {
  describe('render Header Component', () => {
    it('without crashing', () => {
      shallow(<Header />);
    });
  });
});

describe('Images', () => {
  it('render image component with default value', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('img').length).toEqual(3);
  });
  it('renders Logo image', () => {
    const logo = shallow(<Header />);
    expect(logo.find('img').at(0).prop('src')).toEqual(process.env.REACT_APP_PUBLIC_URL + 'images/header/logo.svg');
  });
  it('renders Bell image', () => {
    const logo = shallow(<Header />);
    expect(logo.find('img').at(1).prop('src')).toEqual(process.env.REACT_APP_PUBLIC_URL + 'images/header/bell.svg');
  });
  it('renders Avatar image', () => {
    const logo = shallow(<Header />);
    expect(logo.find('img').at(2).prop('src')).toEqual(process.env.REACT_APP_PUBLIC_URL + 'images/header/avatar.svg');
  });
});

describe('User name', () => {
  it('render user name from local storage', () => {
    const wrapper = shallow(<Header />);
    localStorage.setItem('username', 'test');
    const name = localStorage.getItem('username');
    console.log(name);
    expect(wrapper.text().includes(localStorage.getItem('username'))).toBe(true);
  });
});

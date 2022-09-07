import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Routers from 'react-router';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import * as fetchAPI from '../../../src/Services/APIService';
import Tickets from '../../../src/Pages/Tickets/Tickets';
import { userRoleId } from '../../../src/Utilities/AppUtilities';
import { ticketsData } from './ticketsData';

const MockTickets = () => {
  return (
    <Router>
      <Tickets />
    </Router>
  );
};

describe('ViewTicket page', () => {
  const navigate = jest.fn();
  beforeEach(async () => {
    localStorage.setItem('roleId', userRoleId.remoteSmartUser);
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    const mockFetchCall = jest.spyOn(fetchAPI, 'makeRequest');
    mockFetchCall.mockResolvedValue(ticketsData);
    await act(async () => render(<MockTickets />));
  });

  it('should render component', async () => {
    const header = screen.getByRole('heading', { name: /Tickets/i });
    expect(header).toBeInTheDocument();
  });

  it('should render create ticket button', async () => {
    const createButton = screen.getByRole('button', { name: /Create Ticket/i });
    expect(createButton).toBeInTheDocument();
    userEvent.click(createButton);
    expect(navigate).toHaveBeenCalledWith('/ticket/add');
  });

  it('should render bootstrap table', async () => {
    const ticketsTable = screen.getByRole('table');
    expect(ticketsTable).toBeInTheDocument();

    const tableBody = ticketsTable.children[1];
    expect(tableBody.children.length).toBe(10);

    const descriptionTH = screen.getByText('Description');
    const ticketTH = screen.getByText('Ticket#');
    const priorityTH = screen.getByText('Priority');
    const statusTH = screen.getByText('Status');
    const assigneeTH = screen.getByText('Assignee');
    const editTH = screen.getByText('Edit');

    expect(descriptionTH).toBeInTheDocument();
    expect(ticketTH).toBeInTheDocument();
    expect(priorityTH).toBeInTheDocument();
    expect(statusTH).toBeInTheDocument();
    expect(assigneeTH).toBeInTheDocument();
    expect(editTH).toBeInTheDocument();
  });

  it('should render view button table', async () => {
    const viewBtn = screen.getByRole('button', { name: '29301471' });
    expect(viewBtn).toBeInTheDocument();
    userEvent.click(viewBtn);
    expect(navigate).toHaveBeenCalledWith('/ticket/view/29301471');
  });

  it('should navigate to /', async () => {
    localStorage.setItem('roleId', userRoleId.signetAdmin);
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    const mockFetchCall = jest.spyOn(fetchAPI, 'makeRequest');
    mockFetchCall.mockResolvedValue(ticketsData);
    await act(async () => render(<MockTickets />));

    expect(navigate).toHaveBeenCalledWith('/');
  });
});

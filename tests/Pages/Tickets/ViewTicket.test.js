import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import ViewTicket from '../../../src/Pages/Tickets/ViewTicket';
import * as fetchAPI from '../../../src/Services/APIService';
import { act } from 'react-dom/test-utils';

const MockViewTicket = () => {
  return (
    <Router>
      <ViewTicket />
    </Router>
  );
};

describe('ViewTicket page', () => {
  const ticketData = [
    200,
    {
      data: [
        {
          ticketNo: '29301471',
          site: 'CapeStart, Inc',
          createdDate: '2022-08-12 12:02',
          createdBy: 'Anadh Gopal',
          phoneNumber: '8300861544',
          priority: '3',
          status: 'PENDCLOSE',
          requestType: 'NOC',
          description: 'Tickets number check',
          solutionProvided: '',
          assignedTo: '',
          callerEmail: 'mail2anadhonly@gmail.com',
          problem: 'System Trouble',
        },
      ],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('email', 'mail2anadhonly@gmail.com');
    const mockFetchCall = jest.spyOn(fetchAPI, 'makeRequest');
    mockFetchCall.mockResolvedValue(ticketData);
    await act(async () => render(<MockViewTicket />));
  });

  it('should render loading screen', async () => {
    const mockFetchCall = jest.spyOn(fetchAPI, 'makeRequest');
    mockFetchCall.mockResolvedValue([]);
    await act(async () => render(<MockViewTicket />));
    const loading = screen.getByText(/Loading/i);
    expect(loading).toBeInTheDocument();
  });
  it('should render view ticket component', async () => {
    const header = screen.getByText(/Ticket # : 29301471/i);
    expect(header).toBeInTheDocument();
  });
  it('should render all Title', async () => {
    const header = screen.getByText(/Ticket # : 29301471/i);
    const descriptionTitle = screen.getByText('Description');
    const siteNameTitle = screen.getByText('Site Name');
    const priorityTitle = screen.getByText('Priority');
    const mobileNoTitle = screen.getByText('Mobile Number');
    const assignedToTitle = screen.getByText('Assigned To');
    const solutionTitle = screen.getByText('Solution Provided');
    const clientemailTitle = screen.getByText('Client Email');
    const createdByTitle = screen.getByText('Created By');
    const createdDateTitle = screen.getByText('Created Date');
    const problemCodeTitle = screen.getByText('Problem Code');

    expect(header).toBeInTheDocument();
    expect(descriptionTitle).toBeInTheDocument();
    expect(siteNameTitle).toBeInTheDocument();
    expect(priorityTitle).toBeInTheDocument();
    expect(mobileNoTitle).toBeInTheDocument();
    expect(assignedToTitle).toBeInTheDocument();
    expect(solutionTitle).toBeInTheDocument();
    expect(clientemailTitle).toBeInTheDocument();
    expect(createdByTitle).toBeInTheDocument();
    expect(createdDateTitle).toBeInTheDocument();
    expect(problemCodeTitle).toBeInTheDocument();
  });

  it('should render all values', async () => {
    const description = screen.getByText('Tickets number check');
    const siteName = screen.getByText('CapeStart, Inc');
    const priority = screen.getByText('3');
    const mobileNo = screen.getByText('8300861544');
    const clientemail = screen.getByText('mail2anadhonly@gmail.com');
    const createdBy = screen.getByText('Anadh Gopal');
    const createdDate = screen.getByText('2022-08-12 12:02');
    const problemCode = screen.getByText('System Trouble');

    expect(description).toBeInTheDocument();
    expect(siteName).toBeInTheDocument();
    expect(priority).toBeInTheDocument();
    expect(mobileNo).toBeInTheDocument();
    expect(clientemail).toBeInTheDocument();
    expect(createdBy).toBeInTheDocument();
    expect(createdDate).toBeInTheDocument();
    expect(problemCode).toBeInTheDocument();
  });

  it('should render edit button', async () => {
    const loginButton = screen.getByRole('button', { name: /Edit/i });
    expect(loginButton).toBeInTheDocument();
  });
  it('should render back button', async () => {
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });
});

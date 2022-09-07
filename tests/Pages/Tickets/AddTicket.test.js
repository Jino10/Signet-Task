import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Routers from 'react-router';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import * as fetchAPI from '../../../src/Services/APIService';
import AddTicket from '../../../src/Pages/Tickets/AddTicket';

const MockAddTicket = () => {
  return (
    <Router>
      <AddTicket />
    </Router>
  );
};

describe('Edit Ticket page', () => {
  const navigate = jest.fn();
  const siteNameResponse = [
    200,
    {
      data: [
        {
          siteNo: '24635101',
          siteName: 'CapeStart, Inc',
        },
      ],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  const priorityResponse = [
    200,
    {
      data: ['1', '2', '3', '4', '5'],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  const problemCodeResponse = [
    200,
    {
      data: [
        'Client Training',
        'MAC',
        'Parts Order',
        'Parts Repair',
        'Remote Smart',
        'Survey',
        'System Trouble',
        'System Upgrade',
      ],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  beforeEach(async () => {
    localStorage.setItem('orgNo', 'CAI001');
    localStorage.setItem('firstName', 'Suthen');
    localStorage.setItem('lastName', 'PG');
    localStorage.setItem('email', 'suthenpg@capestart.com');
    localStorage.setItem('mobile', '9445736777');

    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    jest.spyOn(Routers, 'useParams').mockReturnValue({ id: '29300919' });

    const makeRequest = jest.spyOn(fetchAPI, 'makeRequest');
    makeRequest
      .mockResolvedValueOnce(siteNameResponse)
      .mockResolvedValueOnce(priorityResponse)
      .mockResolvedValueOnce(problemCodeResponse)
      .mockResolvedValueOnce([
        200,
        {
          data: [
            {
              ticketNo: '29300919',
              site: 'CapeStart, Inc',
              createdDate: '2022-08-10 07:53',
              createdBy: 'Suthen PG',
              phoneNumber: '9445736777',
              priority: '3',
              status: 'PENDCLOSE',
              requestType: 'NOC',
              description: 'test123',
              solutionProvided: '',
              assignedTo: '',
              callerEmail: 'suthenpg@capestart.com',
              problem: 'System Trouble',
            },
          ],
          status: 'Success',
          message: 'Fetched successfully',
          errorMessage: null,
        },
      ]);
    await act(async () => render(<MockAddTicket />));
  });

  it('should render edit page component', async () => {
    const header = screen.getByRole('heading', { name: /Edit Ticket # : 29300919/i });
    expect(header).toBeInTheDocument();
  });

  it('should render all labels', async () => {
    const descriptionLabel = screen.getByText('Description');
    const siteNameLabel = screen.getByText('Site Name');
    const priorityLabel = screen.getByText('Priority');
    const problemCodeLabel = screen.getByText('Problem Code');
    const createdDateLabel = screen.getByText('Created Date');
    const mobileNoLabel = screen.getByText('Mobile Number');
    const assignedToLabel = screen.getByText('Assigned To');
    const solutionLabel = screen.getByText('Solution Provided');
    const clientEmailLabel = screen.getByText('Client Email');
    const createdByLabel = screen.getByText('Created By');

    expect(descriptionLabel).toBeInTheDocument();
    expect(siteNameLabel).toBeInTheDocument();
    expect(priorityLabel).toBeInTheDocument();
    expect(problemCodeLabel).toBeInTheDocument();
    expect(createdDateLabel).toBeInTheDocument();
    expect(mobileNoLabel).toBeInTheDocument();
    expect(assignedToLabel).toBeInTheDocument();
    expect(solutionLabel).toBeInTheDocument();
    expect(clientEmailLabel).toBeInTheDocument();
    expect(createdByLabel).toBeInTheDocument();
  });

  it('should render all inputs', async () => {
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    const priorityInput = screen.getByTestId('priority');
    const problemCodeInput = screen.getByTestId('problemCode');
    const createdDateInput = screen.getByPlaceholderText('Created Date');
    const mobileNoInput = screen.getByPlaceholderText('Mobile Number');
    const assignedToInput = screen.getByPlaceholderText('Assigned To');
    const solutionInput = screen.getByPlaceholderText('Solution Provided');
    const clientEmailInput = screen.getByPlaceholderText('Client Email');
    const createdByInput = screen.getByPlaceholderText('Created By');

    expect(descriptionInput).toBeInTheDocument();
    expect(priorityInput).toBeInTheDocument();
    expect(problemCodeInput).toBeInTheDocument();
    expect(createdDateInput).toBeInTheDocument();
    expect(mobileNoInput).toBeInTheDocument();
    expect(assignedToInput).toBeInTheDocument();
    expect(solutionInput).toBeInTheDocument();
    expect(clientEmailInput).toBeInTheDocument();
    expect(createdByInput).toBeInTheDocument();
  });

  it('should render all buttons', async () => {
    const updateBtn = screen.getByRole('button', { name: 'Update' });
    const cancelBtn = screen.getByText('Cancel');

    expect(updateBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  it('should cancel navigate to tickets', async () => {
    const cancelBtn = screen.getByText('Cancel');
    userEvent.click(cancelBtn);
    expect(navigate).toHaveBeenCalledWith('/tickets');
  });

  it('description input should change', async () => {
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(descriptionInput, { target: { value: 'test123' } });
    expect(descriptionInput.value).toBe('test123');
  });

  it('should be disabled', async () => {
    const priorityInput = screen.getByTestId('priority');
    const problemCodeInput = screen.getByTestId('problemCode');
    const createdDateInput = screen.getByPlaceholderText('Created Date');
    const mobileNoInput = screen.getByPlaceholderText('Mobile Number');
    const assignedToInput = screen.getByPlaceholderText('Assigned To');
    const solutionInput = screen.getByPlaceholderText('Solution Provided');
    const clientEmailInput = screen.getByPlaceholderText('Client Email');
    const createdByInput = screen.getByPlaceholderText('Created By');

    expect(priorityInput).toHaveAttribute('disabled');
    expect(problemCodeInput).toHaveAttribute('disabled');
    expect(createdDateInput).toHaveAttribute('disabled');
    expect(mobileNoInput).toHaveAttribute('disabled');
    expect(assignedToInput).toHaveAttribute('disabled');
    expect(solutionInput).toHaveAttribute('disabled');
    expect(clientEmailInput).toHaveAttribute('disabled');
    expect(createdByInput).toHaveAttribute('disabled');
  });

  it('should be update ticket', async () => {
    const updateResponse = [
      200,
      {
        data: {
          ticketNo: '29300919',
          callNo: '610578',
          status: 'OK',
        },
        status: 'Success',
        message: 'Ticket created successfully',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(updateResponse);
    const updateBtn = screen.getByRole('button', { name: 'Update' });
    userEvent.click(updateBtn);
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/tickets');
    });
  });

  it('should be show not Authorized error', async () => {
    localStorage.setItem('email', 'suthenpg123@capestart.com');
    const updateBtn = screen.getByRole('button', { name: 'Update' });
    userEvent.click(updateBtn);
    await waitFor(() => {
      expect(screen.getByText('You are not Authorized')).toBeVisible();
      userEvent.click(screen.getByText('You are not Authorized').parentElement.children[0]);
    });
  });

  it('should be show not Authorized error', async () => {
    const updateResponse = [
      400,
      {
        data: {
          ticketNo: '29300919',
          callNo: '610578',
          status: 'OK',
        },
        status: 'Success',
        message: 'Something went wrong',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(updateResponse);
    const updateBtn = screen.getByRole('button', { name: 'Update' });
    userEvent.click(updateBtn);
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeVisible();
    });
  });
});

describe('Add Ticket page', () => {
  const navigate = jest.fn();
  const siteNameResponse = [
    200,
    {
      data: [
        {
          siteNo: '24635101',
          siteName: 'CapeStart, Inc',
        },
      ],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  const priorityResponse = [
    200,
    {
      data: ['1', '2', '3', '4', '5'],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  const problemCodeResponse = [
    200,
    {
      data: [
        'Client Training',
        'MAC',
        'Parts Order',
        'Parts Repair',
        'Remote Smart',
        'Survey',
        'System Trouble',
        'System Upgrade',
      ],
      status: 'Success',
      message: 'Fetched successfully',
      errorMessage: null,
    },
  ];
  beforeEach(async () => {
    localStorage.setItem('orgNo', 'CAI001');
    localStorage.setItem('firstName', 'Suthen');
    localStorage.setItem('lastName', 'PG');
    localStorage.setItem('email', 'suthenpg@capestart.com');
    localStorage.setItem('mobile', '9445736777');

    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    jest.spyOn(Routers, 'useParams').mockReturnValue({ qd: '29300919' });

    const makeRequest = jest.spyOn(fetchAPI, 'makeRequest');
    makeRequest
      .mockResolvedValueOnce(siteNameResponse)
      .mockResolvedValueOnce(priorityResponse)
      .mockResolvedValueOnce(problemCodeResponse);
    await act(async () => render(<MockAddTicket />));
  });

  it('should render Add Ticket', async () => {
    const header = screen.getByRole('heading', { name: /Add Ticket/i });
    expect(header).toBeInTheDocument();
  });

  it('should render Add Ticket inputs and buttons', async () => {
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    const priorityInput = screen.getByTestId('priority');
    const problemCodeInput = screen.getByTestId('problemCode');
    const createBtn = screen.getByRole('button', { name: 'Create' });
    const cancelBtn = screen.getByText('Cancel');

    expect(descriptionInput).toBeInTheDocument();
    expect(priorityInput).toBeInTheDocument();
    expect(problemCodeInput).toBeInTheDocument();
    expect(createBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  it('inputs validation', async () => {
    const createBtn = screen.getByRole('button', { name: 'Create' });
    const descriptionError = screen.getByText('Description is required');
    userEvent.click(createBtn);
    expect(descriptionError).toBeInTheDocument();
  });

  it('should create new ticket', async () => {
    const createBtn = screen.getByRole('button', { name: 'Create' });
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(descriptionInput, { target: { value: 'capestart' } });
    expect(descriptionInput).toBeInTheDocument();
    userEvent.click(createBtn);
  });
});

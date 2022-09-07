import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { fetchCall, makeRequest } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import Loading from '../Widgets/Loading';
import Alerts from '../Widgets/Alerts';
import { useNavigate, useParams } from 'react-router-dom';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Select from 'react-select';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

export default function AddTicket() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [Priority, setPriority] = useState([]);
  const [ProblemCode, setProblemCode] = useState([]);
  const [PostObject, setPostObject] = useState({
    assignedTo: '',
    customerId: '',
    site: '',
    createdBy: '',
    createdDate: '',
    phoneNumber: '',
    status: 'ACTIVE',
    requestType: 'NOC',
    problem: 'System Trouble',
    description: '',
    callerEmail: '',
    priority: '3',
    solutionProvided: '',
    ticketNo: '',
  });
  const [options, setOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const { buttonTracker } = useAnalyticsEventTracker();
  const [noApiError, setNoApiError] = useState(true);
  const [apiErrorMsg, setApiErrorMsg] = useState('');

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 35,
    }),
  };

  const fetchPromise = async () => {
    const optionArray = [];
    const fetchSitelist = await makeRequest(`${APIUrlConstants.LIST_SITES}?customerNo=${localStorage.getItem('orgNo')}`);
    const fetchPriority = await makeRequest(APIUrlConstants.LIST_PRIORITY);
    const fetchProblemcode = await makeRequest(APIUrlConstants.LIST_PROBLEM_CODE);
    let resolvedArr;
    if (id) {
      const fetchTicketView = await makeRequest(`${APIUrlConstants.VIEW_TICKET}/${id}`);
      resolvedArr = await Promise.all([fetchSitelist, fetchPriority, fetchProblemcode, fetchTicketView]);
    } else {
      resolvedArr = await Promise.all([fetchSitelist, fetchPriority, fetchProblemcode]);
    }
    resolvedArr.forEach((i) => {
      if (i[0] !== httpStatusCode.SUCCESS) {
        setNoApiError(false);
        setApiErrorMsg(i[1].message ?? 'There was a problem with our ticketing service. Please try again later');
        setShowAlert(true);
        setAlertVarient('danger');
        setAlertMessage(i[1].message ?? 'There was a problem with our ticketing service. Please try again later');
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    });
    if (resolvedArr && resolvedArr.every((i) => i[0] === httpStatusCode.SUCCESS)) {
      const { 0: Sitelist, 1: PriorityList, 2: ProblemCodeList, 3: fetchTicket } = resolvedArr;
      Sitelist[1]?.data.length > 0 &&
        Sitelist[1]?.data.forEach((i) => {
          optionArray.push({ value: i.siteNo, label: i.siteName });
        });
      setOptions(optionArray);
      setPostObject((prev) => {
        const Current = { ...prev };
        Current.site = Sitelist[1]?.data[0].siteNo;
        return Current;
      });
      setPriority(PriorityList[1]?.data);
      setProblemCode(ProblemCodeList[1]?.data);
      setLoading(false);
      if (id) {
        setPostObject((prev) => {
          const Current = { ...prev };
          Current.requestType = fetchTicket[1]?.data[0].requestType;
          Current.description = fetchTicket[1]?.data[0].description;
          Current.phoneNumber = fetchTicket[1]?.data[0].phoneNumber;
          Current.priority = fetchTicket[1]?.data[0].priority;
          Current.status = fetchTicket[1]?.data[0].status;
          Current.callerEmail = fetchTicket[1]?.data[0].callerEmail;
          Current.solutionProvided = fetchTicket[1]?.data[0].solutionProvided;
          Current.problem = fetchTicket[1]?.data[0].problem;
          Current.ticketNo = fetchTicket[1]?.data[0].ticketNo;
          Current.createdBy = fetchTicket[1]?.data[0].createdBy;
          Current.createdDate = fetchTicket[1]?.data[0].createdDate;
          Current.assignedTo = fetchTicket[1]?.data[0].assignedTo;
          Current.site = Sitelist[1]?.data.filter((i) => i.siteName === fetchTicket[1]?.data[0].site)[0].siteNo;
          return Current;
        });
        setSelectedValue({
          label: fetchTicket[1]?.data[0].site,
          value: Sitelist[1]?.data.filter((i) => i.siteName === fetchTicket[1]?.data[0].site)[0].siteNo,
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setPostObject((prev) => {
      const Current = { ...prev };
      Current.customerId = localStorage.getItem('orgNo');
      Current.createdBy = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
      Current.callerEmail = localStorage.getItem('email');
      Current.phoneNumber = localStorage.getItem('mobile');
      return Current;
    });
    fetchPromise();
  }, []);

  const saveTicket = async () => {
    setSaveLoading(true);
    let ticketObject = { ...PostObject };
    if (id) {
      ticketObject = { ...PostObject, ticketNo: id };
      delete ticketObject.assignedTo;
      delete ticketObject.solutionProvided;
      delete ticketObject.createdDate;
      buttonTracker(gaEvents.UPDATE_TICKET_DETAILS);
    } else {
      buttonTracker(gaEvents.CREATE_NEW_TICKET);
    }
    if (PostObject.description && PostObject.callerEmail === localStorage.getItem('email') && noApiError) {
      const { 0: status, 1: data } = await fetchCall(APIUrlConstants.CREATE_TICKET, apiMethods.POST, ticketObject);
      const statusCode = status;
      const responseData = data;

      if (statusCode === httpStatusCode.SUCCESS) {
        setSaveLoading(false);
        navigate('/tickets');
      } else {
        setShowAlert(true);
        setAlertVarient('danger');
        setAlertMessage(responseData.message ?? 'something went wrong ');
        setSaveLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } else if (PostObject.callerEmail !== localStorage.getItem('email')) {
      setShowAlert(true);
      setAlertVarient('danger');
      setAlertMessage('You are not Authorized');
      setSaveLoading(false);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else if (noApiError !== true) {
      setShowAlert(true);
      setAlertVarient('danger');
      setAlertMessage(apiErrorMsg);
      setSaveLoading(false);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setValidated(true);
      setSaveLoading(false);
    }
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    setPostObject((prev) => {
      const Current = { ...prev };
      Current.site = value.value;
      return Current;
    });
  };

  return (
    <div className="wrapperBase">
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(false);
          }}
          alertshow={alertMessage}
        />
      )}
      {saveLoading && <Loading />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="titleHeader d-flex align-items-center justify-content-between">
            <div className="info">
              <h6>{id ? `Edit Ticket # : ${PostObject.ticketNo}` : 'Add Ticket'}</h6>
            </div>
          </div>

          <div className="wrapperBase">
            <Form noValidate validated={validated}>
              <Form.Group className="mb-3 input-group">
                <div className="input-container col">
                  <Form.Label>
                    Description <span className="requiredTxt">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className="width-95"
                    placeholder="Enter description"
                    required
                    name="description"
                    onChange={(e) => {
                      setPostObject((prev) => {
                        const Current = { ...prev };
                        Current.description = e.target.value;
                        return Current;
                      });
                    }}
                    value={PostObject.description}
                  />
                  <Form.Control.Feedback type="invalid">Description is required</Form.Control.Feedback>
                </div>
              </Form.Group>
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label>
                    Site Name <span className="requiredTxt">*</span>
                  </Form.Label>
                  <div className="width-90">
                    <Select
                      options={options}
                      onChange={handleChange}
                      placeholder="Search for Site Name"
                      value={selectedValue}
                      styles={{ customStyles }}
                      data-testid="siteName"
                    />
                  </div>
                </div>
                <div className="input-container col-6">
                  <Form.Label>Priority {!id && <span className="requiredTxt">*</span>}</Form.Label>
                  <Form.Select
                    className="width-90"
                    data-testid="priority"
                    onChange={(e) => {
                      setPostObject((prev) => {
                        const Current = { ...prev };
                        Current.priority = e.target.value;
                        return Current;
                      });
                    }}
                    value={PostObject.priority}
                    disabled={id}
                  >
                    {Priority.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label>Problem Code {!id && <span className="requiredTxt">*</span>}</Form.Label>
                  <Form.Select
                    className="width-90"
                    data-testid="problemCode"
                    onChange={(e) => {
                      setPostObject((prev) => {
                        const Current = { ...prev };
                        Current.problem = e.target.value;
                        return Current;
                      });
                    }}
                    value={PostObject.problem}
                    disabled={id}
                  >
                    {ProblemCode.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {id && (
                  <div className="input-container col-6">
                    <Form.Label>Created Date</Form.Label>
                    <Form.Control
                      placeholder="Created Date"
                      type="text"
                      className="width-90"
                      value={PostObject.createdDate}
                      disabled
                    />
                  </div>
                )}
              </Form.Group>
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col-6">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      placeholder="Mobile Number"
                      type="text"
                      className="width-90"
                      value={PostObject.phoneNumber}
                      disabled
                    />
                  </div>
                  <div className="input-container col-6">
                    <Form.Label>Assigned To</Form.Label>
                    <Form.Control
                      placeholder="Assigned To"
                      type="text"
                      className="width-90"
                      value={PostObject.assignedTo}
                      disabled
                    />
                  </div>
                </Form.Group>
              )}
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col-6">
                    <Form.Label>Solution Provided</Form.Label>
                    <Form.Control
                      placeholder="Solution Provided"
                      type="text"
                      className="width-90"
                      value={PostObject.solutionProvided}
                      disabled
                    />
                  </div>
                  <div className="input-container col-6">
                    <Form.Label>Client Email</Form.Label>
                    <Form.Control
                      placeholder="Client Email"
                      type="text"
                      className="width-90"
                      value={PostObject.callerEmail}
                      disabled
                    />
                  </div>
                </Form.Group>
              )}
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col-6">
                    <Form.Label>Created By</Form.Label>
                    <Form.Control
                      placeholder="Created By"
                      type="text"
                      className="width-90"
                      value={PostObject.createdBy}
                      disabled
                    />
                  </div>
                </Form.Group>
              )}
            </Form>
            <div className="d-flex justify-content-md-start justify-content-sm-center justify-content-center editAction">
              <input
                className="buttonDefault text-center minHeight45"
                type="submit"
                onClick={() => {
                  buttonTracker(gaEvents.NAVIGATE_TICKETS_LIST);
                  navigate('/tickets');
                }}
                value="Cancel"
              />
              <Button
                className="buttonPrimary text-center"
                onClick={() => {
                  if (PostObject.description.trim().length > 0) {
                    saveTicket();
                  } else {
                    setPostObject((prev) => {
                      const Current = { ...prev };
                      Current.description = '';
                      return Current;
                    });
                    setValidated(true);
                  }
                }}
              >
                {id ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

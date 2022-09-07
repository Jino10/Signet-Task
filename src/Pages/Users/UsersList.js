/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { fetchCall, makeRequest } from '../../Services/APIService';
import UserModal from './UserModal';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Loading from '../Widgets/Loading';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import ReactGA from 'react-ga4';

function UsersList({ userId }) {
  const { SearchBar } = Search;
  const { buttonTracker } = useAnalyticsEventTracker();
  const history = useNavigate();
  const [users, setUser] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(false);
  const closeAlert = () => setShowAlert(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    buttonTracker(gaEvents.OPEN_DELETE_USER);
    ReactGA.send({ hitType: 'pageview', page: `/deleteuser/${e.target.id}` });
    sessionStorage.setItem('deleteUserActive', e.target.getAttribute('status'));
    sessionStorage.setItem('deleteUserId', e.target.id);
    setShow(true);
  };

  const fetchAllUserDetails = async () => {
    setIsLoading(true);
    const { 0: statusCode, 1: data } = await makeRequest(APIUrlConstants.FETCH_USER_DETAILS);
    if (statusCode === httpStatusCode.SUCCESS) {
      setIsLoading(false);
    }
    setUser(data.data);
  };
  const handleClick = (e) => {
    const { id } = e.target;
    buttonTracker(gaEvents.NAVIGATE_EDIT_USER);
    history(`/edituser/${id}`);
  };
  const deleteUser = async () => {
    buttonTracker(gaEvents.DELETE_USER);
    setIsLoading(true);
    const id = sessionStorage.getItem('deleteUserId');
    const deleteUserStatus = sessionStorage.getItem('deleteUserActive');

    const dUser = {
      status: deleteUserStatus,
    };

    const { 0: statusCode, 1: responseData } = await fetchCall(`${APIUrlConstants.DELETE_USER}/${id}`, apiMethods.DELETE, dUser);
    if (statusCode === httpStatusCode.SUCCESS) {
      setShowAlert(true);
      setAlertMessage('Deleted successfully');
      setError(false);
      handleClose();
      sessionStorage.removeItem('deleteUserActive');
      sessionStorage.removeItem('deleteUserId');
      setTimeout(() => {
        fetchAllUserDetails();
        setTimeout(() => {
          closeAlert();
        }, 3000);
      }, 2000);
    } else {
      setShowAlert(true);
      setError(true);
      setAlertMessage(responseData.message);
      handleClose();
      setIsLoading(false);
      sessionStorage.removeItem('deleteUserActive');
      sessionStorage.removeItem('deleteUserId');
      setTimeout(() => {
        closeAlert();
      }, 5000);
    }
    handleClose();
  };
  const actionBtn = (_row, cell, _rowIndex) => (
    <div className="actionBox d-flex align-items-center" data-testid="usertable">
      <Button variant="link" id={cell.userId} onClick={handleClick}>
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/edit.svg'} id={cell.userId} alt="Edit" />
      </Button>

      <Button
        variant="link"
        id={cell.userId}
        status={cell.status}
        onClick={handleShow}
        disabled={cell.userId === localStorage.getItem('id') ? 'disabled' : ''}
      >
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/bin.svg'} id={cell.userId} status={cell.status} alt="Bin" />
      </Button>
    </div>
  );

  const fullName = (_cell, row, _rowIndex) => `${row.firstName} ${row.lastName}`;
  function nameFilter(_cell, row) {
    return `${row.firstName} ${row.lastName}`;
  }
  const columns = [
    {
      dataField: 'userId',
      text: 'userId',
      hidden: true,
    },
    {
      dataField: 'fullName',
      text: 'Name',
      formatter: fullName,
      filterValue: (cell, row) => nameFilter(cell, row),
    },
    {
      dataField: 'orgEmail',
      text: 'Email',
    },
    {
      dataField: 'organization',
      text: 'Organization',
    },
    {
      dataField: 'status',
      text: 'Status',
    },
    {
      dataField: 'Action',
      text: 'Action',
      formatter: actionBtn,
    },
  ];

  useEffect(() => {
    fetchAllUserDetails();
  }, []);

  const emptyDataMessage = () =>
    !isLoading ? (
      <h6 className="text-center text-bold m-0 p-0">No records found</h6>
    ) : (
      <h6 className="text-center text-bold m-0 p-0">Fetching users ...</h6>
    );

  return (
    <div className="tabelBase" data-test-id="usertable">
      {isLoading && <Loading />}
      <ToolkitProvider keyField="userId" data={users} columns={columns} search>
        {(props) => (
          <>
            <div className="titleHeader d-flex align-items-center justify-content-between">
              <div className="info">
                <h6>Users</h6>
              </div>
              <div className="headerAction d-flex align-items-center">
                <div className="searchWIC">
                  <SearchBar {...props.searchProps} />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/users/search.svg'} alt="inputIcon" />
                </div>
                <UserModal successCallback={fetchAllUserDetails} userId={userId} />
              </div>
            </div>
            <div className="tableBaseBox">
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory({ sizePerPage: 10 })}
                noDataIndication={emptyDataMessage}
              />
            </div>
          </>
        )}
      </ToolkitProvider>

      {showAlert && (
        <Alert variant={!error ? 'success' : 'danger'} className="alertWrapper" onClose={closeAlert} dismissible>
          <Alert.Heading>{alertMessage}</Alert.Heading>
        </Alert>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="p-5">Are you sure you want to delete this user ?</Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              buttonTracker(gaEvents.CANCEL_DELETE_USER);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsersList;

import React, { useEffect, useState } from 'react';
import { Row, Col, ProgressBar, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import './HealthCharts.css';
import DoughnutChart from '../../Charts/DoughnutChart';
import VerticalBarChart from '../../Charts/VerticalBarChart';
import HorizontalBarChart from '../../Charts/HorizontalBarChart';
import { makeRequest } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { httpStatusCode } from '../../Constants/TextConstants';
import moment from 'moment';
import { userRoleId } from '../../Utilities/AppUtilities';
import NetworkHealth from '../NetworkHealth/NetworkHealth';

export default function HealthCharts() {
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [q360Data, setq360Data] = useState({});
  const [systemCapacity, setSystemCapacity] = useState({});
  const [systemAvailability, setSystemAvailability] = useState({});
  const roledId = localStorage.getItem('roleId');

  const fetchCharts = async () => {
    const keywords = ['q360_data', 'system_capacity', 'system_availability'];
    let customerName = localStorage.getItem('orgName') || '';
    const customerNumber = localStorage.getItem('orgNo') || '';
    const format = 'YYYY-MM-DD HH:mm:ss';
    const date = moment.utc(new Date()).format(format);
    setIsLoading(true);
    let i;
    i = 0;
    keywords.map(async (type) => {
      let url = '';
      if (type === 'q360_data') {
        url = `${APIUrlConstants.GET_CHARTS_BY_TICKETS}`;
      } else {
        url = `${APIUrlConstants.GET_CHARTS_BY_SYSTEM}`;
        customerName = localStorage.getItem('probe') || '';
      }
      const {
        0: statusCode,
        1: { data },
      } = await makeRequest(`${url}?customerName=${customerName}&customerNumber=${customerNumber}&keyword=${type}&date=${date}`);
      if (httpStatusCode.SUCCESS === statusCode) {
        if (type === 'q360_data') {
          setq360Data(data);
        } else if (type === 'system_capacity') {
          setSystemCapacity(data);
        } else {
          setSystemAvailability(data);
        }
      }
      i += 1;
      if (i === keywords.length) {
        setIsLoading(false);
        setTimeout(() => {
          setReload(!reload);
        }, 300000);
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem('roleId') === userRoleId.remoteSmartUser) {
      fetchCharts();
    }
  }, [reload]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div className="p-2">
        <p>
          <b>{systemAvailability.title}</b>
        </p>
        <hr />
        <div className="d-flex justify-content-between bg-lightred p-1">
          <span className="">Percent Downtime</span>
          <span className="">{systemAvailability.system.systemAvailabilityDTOs[0].percentageDown.toFixed(2)}%</span>
        </div>
        <div className="d-flex justify-content-between bg-lightgreen p-1 mt-2">
          <span className="">Percent Uptime</span>
          <span className="">{systemAvailability.system.systemAvailabilityDTOs[0].percentageUp.toFixed(2)}%</span>
        </div>
      </div>
    </Tooltip>
  );

  const renderNoDataFound = () => (
    <div className="cardBody d-flex align-items-center justify-content-center w-100">
      <span>No data found</span>
    </div>
  );

  const renderSpinner = () => (
    <div className="cardBody d-flex align-items-center justify-content-center w-100">
      <Spinner as="span" animation="border" size="xxl" />
    </div>
  );

  const renderChart = (type, data) => {
    if (type === 'ticketByPriority' && data && data.ticket && data.ticket.ticketPrioritys && data.ticket.ticketPrioritys.length) {
      return (
        <div className="cardBody">
          <VerticalBarChart data={data.ticket.ticketPrioritys} />
          <p className="chartXaxis">Priority</p>
        </div>
      );
    }
    if (type === 'ticketBySite' && data && data.ticket && data.ticket.ticketSites && data.ticket.ticketSites.length) {
      return (
        <div className="cardBody mt-4">
          <DoughnutChart data={data.ticket.ticketSites} />
        </div>
      );
    }
    if (
      type === 'systemCapacity' &&
      data &&
      data.system &&
      data.system.systemCapacityDTOs &&
      data.system.systemCapacityDTOs.length &&
      data.system.systemCapacityDTOs.filter((sys) => sys.capacity !== 0).length
    ) {
      return (
        <div className="cardBody mt-5">
          <HorizontalBarChart data={data} />
          <p className="chartXaxis">Average Usage</p>
        </div>
      );
    }
    if (
      type === 'systemCapacityCopy' &&
      data &&
      data.system &&
      data.system.systemCapacityDTOs &&
      data.system.systemCapacityDTOs.length &&
      data.system.systemCapacityDTOs.filter((sys) => sys.capacity !== 0).length
    ) {
      return (
        <div className="cardBody w-100">
          <table className="border-none border-2 w-100 tablebase">
            <thead>
              <tr className="text-center">
                <th className="p-2">
                  System Types
                  <img
                    src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/arrow-down.svg'}
                    alt=""
                    className="m-2 sysCapacity"
                  />
                </th>
                <th className="p-2">
                  Average Usage
                  <img
                    src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/arrow-down.svg'}
                    alt=""
                    className="m-2 sysCapacity"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {data.system.systemCapacityDTOs.map((sys) => (
                <tr key={sys.capacity}>
                  <td className="p-2 text-12"> {sys.key.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} </td>
                  <td className="p-2">
                    <ProgressBar className="progressWrap" now={sys.capacity.toFixed()} label={sys.capacity.toFixed() + '%'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (
      type === 'systemAvailability' &&
      data &&
      data.system &&
      data.system.systemAvailabilityDTOs &&
      data.system.systemAvailabilityDTOs &&
      data.system.systemAvailabilityDTOs.length
    ) {
      return (
        <div className="d-flex align-items-center">
          <p className="wrapperProgressTitle">{data.title}</p>
          <div className="wrapperProgress d-flex flex-column w-100">
            <div className="d-flex align-items-center justify-content-between">
              <span className="capicityInfo mb-1">
                <span className="badge bg-lightgreen text-lightgreen rounded-circle">.</span> Percentage up
              </span>
              <span className="capicityInfo mb-1">
                <span className="badge bg-lightred text-lightred rounded-circle">.</span> Percentage down
              </span>
              <span className="capicityInfo mb-1">{data.system.systemAvailabilityDTOs[0].percentageUp.toFixed()}%</span>
            </div>
            <OverlayTrigger placement="top" delay={{ show: 0, hide: 0 }} overlay={renderTooltip}>
              <ProgressBar now={data.system.systemAvailabilityDTOs[0].percentageUp.toFixed()} />
            </OverlayTrigger>
            <div className="progressPercentage">
              <span>0.00%</span>
              <span>20.00%</span>
              <span>40.00%</span>
              <span>60.00%</span>
              <span>80.00%</span>
              <span>100.00%</span>
            </div>
          </div>
        </div>
      );
    }
    if (type === 'numberOfTickets' && data && data.ticket && data.ticket.numberOfTickets) {
      return (
        <div className="cardBody">
          <div className="text-center  d-flex align-items-center flex-column justify-content-center">
            <img className="ticketImg" src={process.env.REACT_APP_PUBLIC_URL + 'images/ticket.svg'} alt="Ticket" />
            <span className="totalTxt">Total Tickets</span>
            <h3 className="totalCount">{data.ticket.numberOfTickets}</h3>
          </div>
        </div>
      );
    }
    return renderNoDataFound();
  };

  return (
    <div>
      {roledId !== userRoleId.remoteSmartUser ? (
        <NetworkHealth />
      ) : (
        <div className="wrapperBase">
          <div className="wrapHeader mb-4">
            <div className="info">
              <h6>Dashboard</h6>
            </div>
          </div>
          <div>
            <Row>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>Tickets by Priority</h6>
                    <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" />
                  </div>
                  {isLoading ? renderSpinner() : renderChart('ticketByPriority', q360Data)}
                </div>
              </Col>
              <Col lg={3} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>Tickets by Site</h6>
                    <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" />
                  </div>
                  {isLoading ? renderSpinner() : renderChart('ticketBySite', q360Data)}
                </div>
              </Col>
              <Col lg={3} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex align-items-center ">
                    <h6>Number of Tickets Open</h6>
                  </div>
                  {isLoading ? renderSpinner() : renderChart('numberOfTickets', q360Data)}
                </div>
              </Col>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>System Capacity</h6>
                    <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" />
                  </div>
                  {isLoading ? renderSpinner() : renderChart('systemCapacity', systemCapacity)}
                </div>
              </Col>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <Col lg={12} className="mb-4">
                  <div className="cardWrapper">
                    <div className="cardHeader d-flex align-items-center justify-content-between">
                      <h6>System Availability</h6>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" />
                    </div>
                    {isLoading ? renderSpinner() : renderChart('systemAvailability', systemAvailability)}
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="cardWrapper heightAuto">
                    <div className="cardHeader d-flex align-items-center justify-content-between">
                      <h6>System Capacity (Copy)</h6>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" />
                    </div>
                    {isLoading ? renderSpinner() : renderChart('systemCapacityCopy', systemCapacity)}
                  </div>
                </Col>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

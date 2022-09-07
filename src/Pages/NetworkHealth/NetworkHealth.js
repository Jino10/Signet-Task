import React, { useState, useEffect } from 'react';
import './NetworkHealth.css';
import { Button } from 'react-bootstrap';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { fetchCall } from '../../Services/APIService';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

export default function NetworkHealth() {
  const [snackBar, setSnackBar] = useState(false);
  const { buttonTracker } = useAnalyticsEventTracker();

  useEffect(() => {
    if (localStorage.getItem('contactSales') === 'true') {
      setSnackBar(true);
    }
  }, []);

  const handleClick = async () => {
    const [statusCode] = await fetchCall(`${APIUrlConstants.CONTACT_SALES}/${localStorage.getItem('id')}`, apiMethods.POST, {});
    if (statusCode === httpStatusCode.SUCCESS) {
      setSnackBar(true);
      localStorage.setItem('contactSales', 'true');
    }
  };

  return (
    <div className="wrapperBase">
      <div className="wrapperCard">
        <div className="wrapperCard--header">
          <div className="titleHeader">
            <div className="info">
              <h6>Dashboard</h6>
            </div>
          </div>
          <div className="wrapperCard--body">
            <div className="videoWrapper">
              <video width="100%" height="100%" controls src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4">
                <source src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4" type="video/mp4" />
              </video>
            </div>
            {!snackBar && (
              <Button
                className="buttonPrimary mb-5"
                onClick={() => {
                  buttonTracker(gaEvents.CONTACT_SALES);
                  handleClick();
                }}
              >
                Contact Sales
              </Button>
            )}
          </div>
        </div>
        {snackBar && <div className="contactSalesText">Thank you for your interest. We will be contacting you soon</div>}
      </div>
    </div>
  );
}

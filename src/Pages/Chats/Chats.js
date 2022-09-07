import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { fetchCall } from '../../Services/APIService';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import { hidefcWidget, preSetupFCWidget } from './FreshChat';
import { userRoleId } from '../../Utilities/AppUtilities';
import './Chats.css';
import Loading from '../Widgets/Loading';
import { Button } from 'react-bootstrap';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

export default function Chats() {
  const location = useLocation();
  const [snackBar, setSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(location.state != null ? location.state.showLoader : true);
  const roledId = localStorage.getItem('roleId');
  const { buttonTracker } = useAnalyticsEventTracker();
  useEffect(() => {
    if (roledId === userRoleId.remoteSmartUser) {
      preSetupFCWidget(true).then();
    }

    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 7000);
    }

    if (localStorage.getItem('contactSales') === 'true') {
      setSnackBar(true);
    }
  }, [isLoading, roledId]);
  /* Component cleanup function call start  */
  useEffect(
    () => () => {
      hidefcWidget().then();
    },
    [],
  );
  /* Component cleanup function call end  */
  const handleClick = async () => {
    const [statusCode] = await fetchCall(APIUrlConstants.CONTACT_SALES + '/' + localStorage.getItem('id'), apiMethods.POST, {});
    if (statusCode === httpStatusCode.SUCCESS) {
      setSnackBar(true);
      localStorage.setItem('contactSales', 'true');
    }
  };

  return (
    <div className="wrapperBase">
      {isLoading && <Loading />}
      {roledId !== userRoleId.remoteSmartUser && (
        <div className="wrapperCard">
          <div className="wrapperCard--header">
            <div className="titleHeader">
              <div className="info">
                <h6>Chat Demo</h6>
              </div>
            </div>
          </div>
          <div className="wrapperCard--body">
            <div className="videoWrapper">
              <video width="100%" height="100%" controls>
                <source src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4" />
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
          {snackBar && <div className="contactSalesText">Thank you for your interest. We will be contacting you soon</div>}
        </div>
      )}
    </div>
  );
}

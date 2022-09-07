import ReactGA from 'react-ga4';

const useAnalyticsEventTracker = (category = 'category') => {
  const eventTracker = (action = 'action', label = 'label') => {
    ReactGA.event({ category, action, label });
  };
  const buttonTracker = (label = 'label') => {
    ReactGA.event({ category: 'Button', action: label, label });
  };
  const linkTracker = (label = 'label') => {
    ReactGA.event({ category: 'Link', action: label, label });
  };
  return { eventTracker, buttonTracker, linkTracker };
};

export default useAnalyticsEventTracker;

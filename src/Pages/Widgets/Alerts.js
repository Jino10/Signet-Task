import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

export default function Alerts(props) {
  const { variant, alertshow, onClose } = props;
  useEffect(() => {
    const timeId = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timeId);
    };
  }, [onClose]);

  return (
    <Alert variant={variant} className="alertWrapper" onClose={() => onClose()} dismissible>
      <Alert.Heading>{alertshow}</Alert.Heading>
    </Alert>
  );
}

import React from 'react';
import './Loading.css';
import { Spinner } from 'react-bootstrap';

export default function Loading() {
  return (
    <div className="loadingWrap">
      <div className="loadingBox">
        <Spinner as="span" animation="border" size="xxl" />
        <label>Loading...</label>
      </div>
    </div>
  );
}

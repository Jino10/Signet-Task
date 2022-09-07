import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { ThemeProvider } from '../Context/MenuContext';

function LayoutWithHeader(component) {
  return (
    <div className="main">
      <ThemeProvider>
        <Header />
        <Container fluid>
          <Row>
            <Sidebar />
            <Col lg={10} md={9} sm={9} className="p-0 mainWrapBox">
              <div className="mainArea layoutHeaderArea">{component}</div>
            </Col>
          </Row>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default LayoutWithHeader;

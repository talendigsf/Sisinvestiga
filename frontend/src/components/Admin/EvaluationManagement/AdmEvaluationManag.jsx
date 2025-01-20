import React, { useState } from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import EvaluationsList from './EvaluationsList';
import UnEvaluatedProjectsList from './UnEvaluatedProjectsList';
import '../../../css/Admin/AdmEvaluationManag.css';

const AdmEvaluationManag = () => {
  const [activeTab, setActiveTab] = useState('evaluations');

  return (
    <Container fluid className="evaluation-management py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-black">Evaluation Management</h1>
        </Col>
      </Row>
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey="evaluations"
                active={activeTab === 'evaluations'}
                onClick={() => setActiveTab('evaluations')}
              >
                Completed Evaluations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="unevaluatedProjects"
                active={activeTab === 'unevaluatedProjects'}
                onClick={() => setActiveTab('unevaluatedProjects')}
              >
                Unevaluated Projects
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} lg={10}>
          <div className="tab-content">
            {activeTab === 'evaluations' && <EvaluationsList />}
            {activeTab === 'unevaluatedProjects' && <UnEvaluatedProjectsList />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdmEvaluationManag;
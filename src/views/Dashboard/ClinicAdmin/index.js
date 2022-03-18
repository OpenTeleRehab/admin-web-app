import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { IoPerson } from 'react-icons/io5';
import { FaNotesMedical } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getChartDataClinicAdmin } from 'store/dashboard/actions';
import _ from 'lodash';
import { getTranslate } from 'react-localize-redux';
import customColorScheme from '../../../utils/customColorScheme';

const ClinicAdminDashboard = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const dashboardData = useSelector(state => state.dashboard.clinicAdminData);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [totalTherapist, setTotalTherapist] = useState(0);
  const [totalPatient, setTotalPatient] = useState(0);
  const [totalOngoingTreatment, setTotalOngoingTreatment] = useState(0);
  const [therapistLimit, setTherapistLimit] = useState(0);

  useEffect(() => {
    if (profile !== undefined) {
      dispatch(getChartDataClinicAdmin({ clinic_id: profile.clinic_id }));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (!_.isEmpty(dashboardData)) {
      if (dashboardData.therapistData) {
        setTotalTherapist(dashboardData.therapistData.therapistTotal);
        setTherapistLimit(dashboardData.therapistData.therapistLimit);
      }

      if (dashboardData.patientData) {
        setTotalPatient(dashboardData.patientData.patientTotal);
        setTotalOngoingTreatment(dashboardData.patientData.onGoingTreatments);
      }
    }
  }, [dashboardData]);

  return (
    <>
      <Row className="top-card-container mt-5">
        <Col sm={5} md={4} lg={4}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <IoPerson size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_therapist')}</h6>
                  <h5 className="card-number">{ totalTherapist + '/' + therapistLimit }</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={5} md={4} lg={4}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <IoPerson size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_patient')}</h6>
                  <h5 className="card-number">{ totalPatient }</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={5} md={4} lg={4}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <FaNotesMedical size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total.ongoing_treatment_plan')}</h6>
                  <h5 className="card-number">{totalOngoingTreatment}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

ClinicAdminDashboard.propTypes = {
  translate: PropTypes.func
};

export default ClinicAdminDashboard;

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FaClinicMedical, FaUserMd } from 'react-icons/fa';
import { getCountryAdminData } from '../../../store/dashboard/actions';
import { Bar } from 'react-chartjs-2';
import _ from 'lodash';
import { withLocalize } from 'react-localize-redux';
import settings from 'settings';
import { CHART } from '../../../variables/dashboard';
import { ContextAwareToggle } from '../../../components/Accordion/ContextAwareToggle';
import scssColors from 'scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';

const CountryAdminDashboard = ({ translate }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const dashboardData = useSelector(state => state.dashboard.countyAdminData);
  const clinics = useSelector(state => state.clinic.clinics);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [totalClinicAdmin, setTotalClinicAdmin] = useState(0);
  const [totalTherapist, setTotalTherapist] = useState(0);
  const [therapistLimit, setTherapistLimit] = useState(0);
  const [clinicLabel, setClinicLabel] = useState([]);
  const [therapistsByClinic, setTherapistsByClinic] = useState([]);
  const [patientsByGenderByClinic, setPatientsByGenderByClinic] = useState([]);
  const [patientsByAgeByClinic, setPatientsByAgeByClinic] = useState([]);
  const [ongoingTreatmentByGenderByClinic, setOngoingTreatmentByGenderByClinic] = useState([]);
  const [ongoingTreatmentByAgeByClinic, setOngoingTreatmentByAgeByClinic] = useState([]);

  useEffect(() => {
    dispatch(getCountryAdminData({
      country_id: profile && profile.country_id
    }));
  }, [profile, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(dashboardData)) {
      const ageLabels = [];
      const color = CHART.COLOR;
      const patientsByAgeGapGroupedByClinic = dashboardData.patientData.patientsByAgeGapGroupedByClinic;
      const ongoingsByAgeGapGroupedByClinic = dashboardData.patientData.onGoingTreatmentsByAgeGapGroupedByClinic;

      for (let i = settings.minAge; i <= settings.maxAge; i = i + settings.ageGap) {
        if (i === 0) {
          ageLabels.push('< ' + settings.ageGap);
        } else if (i === settings.maxAge) {
          ageLabels.push('>= ' + settings.maxAge);
        } else {
          ageLabels.push(i + ' - ' + (i + settings.ageGap));
        }
      }

      const patientsByAgeByClinicDatasets = [];
      const ongoingTreatmentByAgeByClinicDatasets = [];

      ageLabels.forEach((ageLabel, index) => {
        const patientsByAgeByClinicDataset = {};
        patientsByAgeByClinicDataset.label = ageLabel + ' ' + translate('common.year');
        patientsByAgeByClinicDataset.data = [];
        patientsByAgeByClinicDataset.backgroundColor = color[index];
        patientsByAgeByClinicDataset.borderColor = color[index];

        const ongoingTreatmentByAgeByClinicDataset = {};
        ongoingTreatmentByAgeByClinicDataset.label = ageLabel + ' ' + translate('common.year');
        ongoingTreatmentByAgeByClinicDataset.data = [];
        ongoingTreatmentByAgeByClinicDataset.backgroundColor = color[index];
        ongoingTreatmentByAgeByClinicDataset.borderColor = color[index];

        clinics.forEach(clinic => {
          const patientDataByAge = patientsByAgeGapGroupedByClinic.find(item => item.clinic_id === clinic.id);
          patientsByAgeByClinicDataset.data.push(patientDataByAge ? patientDataByAge[ageLabel] : 0);

          const ongoingDataByAge = ongoingsByAgeGapGroupedByClinic.find(item => item.clinic_id === clinic.id);
          ongoingTreatmentByAgeByClinicDataset.data.push(ongoingDataByAge ? ongoingDataByAge[ageLabel] : 0);
        });
        patientsByAgeByClinicDatasets.push(patientsByAgeByClinicDataset);
        ongoingTreatmentByAgeByClinicDatasets.push(ongoingTreatmentByAgeByClinicDataset);
      });
      setPatientsByAgeByClinic(patientsByAgeByClinicDatasets);
      setOngoingTreatmentByAgeByClinic(ongoingTreatmentByAgeByClinicDatasets);

      const clinicAdmin = dashboardData.clinicAdminTotal;
      const therapistData = dashboardData.therapistData;
      const therapistsByClinic = therapistData.therapistsByClinic;
      const patientData = dashboardData.patientData;
      const patientsByGenderByClinic = patientData.patientsByGenderGroupedByClinic;
      const ongoingTreatmentByGender = patientData.onGoingTreatmentsByGenderGroupedByClinic;
      const clinicLabels = [];
      const therapistByClinic = [];
      const therapistLimitByClinic = [];
      const femalePatientByClinic = [];
      const malePatientByClinic = [];
      const otherPatientByClinic = [];
      const femaleOngoingByClinic = [];
      const maleOngoingByClinic = [];
      const otherOngoingByClinic = [];
      for (let i = 0; i < clinics.length; i++) {
        clinicLabels.push(clinics[i].name);
        therapistLimitByClinic.push(clinics[i].therapist_limit);
        const therapist = therapistsByClinic.find(
          t => t.clinic_id === clinics[i].id);
        const patientsByGender = patientsByGenderByClinic.find(
          p => p.clinic_id === clinics[i].id);
        const ongoingByGender = ongoingTreatmentByGender.find(
          o => o.clinic_id === clinics[i].id);
        therapistByClinic.push(therapist ? therapist.total : 0);
        malePatientByClinic.push(
          patientsByGender ? patientsByGender.male : 0);
        femalePatientByClinic.push(
          patientsByGender ? patientsByGender.female : 0);
        otherPatientByClinic.push(
          patientsByGender ? patientsByGender.other : 0);
        maleOngoingByClinic.push(
          ongoingByGender ? ongoingByGender.male : 0);
        femaleOngoingByClinic.push(
          ongoingByGender ? ongoingByGender.female : 0);
        otherOngoingByClinic.push(
          ongoingByGender ? ongoingByGender.other : 0);
      }
      setTotalClinicAdmin(clinicAdmin[0].total);
      setTotalTherapist(therapistData.therapistTotal);
      setTherapistLimit(therapistData.therapistLimit);
      setClinicLabel(clinicLabels);
      setTherapistsByClinic([
        { label: translate('common.total_therapist'), data: therapistByClinic, backgroundColor: '#06038D', borderColor: '#06038D', borderWidth: 1 },
        { label: translate('common.therapist_limit'), data: therapistLimitByClinic, backgroundColor: scssColors.orangeLight, borderColor: scssColors.orangeLight, borderWidth: 1 }
      ]);
      setPatientsByGenderByClinic([
        { label: translate('common.male'), data: malePatientByClinic, backgroundColor: '#E35205', borderColor: '#E35205', borderWidth: 1 },
        { label: translate('common.female'), data: femalePatientByClinic, backgroundColor: '#64CCC9', borderColor: '#64CCC9', borderWidth: 1 },
        { label: translate('common.other'), data: otherPatientByClinic, backgroundColor: '#eb1515', borderColor: '#eb1515', borderWidth: 1 }
      ]);
      setOngoingTreatmentByGenderByClinic([
        { label: translate('common.male'), data: maleOngoingByClinic, backgroundColor: '#E35205', borderColor: '#E35205', borderWidth: 1 },
        { label: translate('common.female'), data: femaleOngoingByClinic, backgroundColor: '#64CCC9', borderColor: '#64CCC9', borderWidth: 1 },
        { label: translate('common.other'), data: otherOngoingByClinic, backgroundColor: '#eb1515', borderColor: '#eb1515', borderWidth: 1 }
      ]);
    }
  }, [dashboardData, clinics, translate]);

  const groupBarChartOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontColor: '#000000'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        gridLines: {
          drawOnChartArea: false
        },
        fontColor: '#000000'
      }],
      xAxes: [{
        gridLines: {
          drawOnChartArea: false
        },
        barPercentage: 1.0
      }]
    }
  };

  const groupStackedBarChartOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontColor: '#000000'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        stacked: true,
        gridLines: {
          drawOnChartArea: false
        },
        fontColor: '#000000'
      }],
      xAxes: [{
        gridLines: {
          drawOnChartArea: false
        },
        barPercentage: 1.0,
        stacked: true
      }]
    }
  };

  const therapistStackedBarChartOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontColor: '#000000'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        stacked: false,
        gridLines: {
          drawOnChartArea: false
        },
        fontColor: '#000000'
      }],
      xAxes: [{
        gridLines: {
          drawOnChartArea: false
        },
        barPercentage: 1.0,
        stacked: true
      }]
    }
  };

  const therapistsByClinicData = {
    labels: clinicLabel,
    datasets: therapistsByClinic
  };

  const patientsByGenderByClinicData = {
    labels: clinicLabel,
    datasets: patientsByGenderByClinic
  };

  const patientsByAgeByClinicData = {
    labels: clinicLabel,
    datasets: patientsByAgeByClinic
  };

  const ongoingTreatmentsByGenderByClinicData = {
    labels: clinicLabel,
    datasets: ongoingTreatmentByGenderByClinic
  };

  const ongoingTreatmentsByAgeByClinicData = {
    labels: clinicLabel,
    datasets: ongoingTreatmentByAgeByClinic
  };

  return (
    <>
      <Row className="top-card-container">
        <Col sm={5} md={4} lg={3}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <FaClinicMedical size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('dashboard.total_clinic_admin')}</h6>
                  <h5 className="card-number">{ totalClinicAdmin }</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={5} md={4} lg={3}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <FaUserMd size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('dashboard.total_therapist')}</h6>
                  <h5 className="card-number">{totalTherapist + '/' + therapistLimit}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Accordion defaultActiveKey="0" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="0" className="d-flex align-items-center card-header border-0">
            {translate('patient')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="0" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('dashboard.patient_by_gender_per_clinic')}</Card.Header>
                    <Card.Body>
                      <Bar data={patientsByGenderByClinicData} options={groupStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('dashboard.patient_by_age_per_clinic')}</Card.Header>
                    <Card.Body>
                      <Bar data={patientsByAgeByClinicData} options={groupBarChartOptions}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="1" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="1" className="d-flex align-items-center card-header border-0">
            {translate('common.ongoing_treatment')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="1" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('dashboard.ongoing_treatment_by_gender_per_clinic')}</Card.Header>
                    <Card.Body>
                      <Bar data={ongoingTreatmentsByGenderByClinicData} options={groupStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('dashboard.ongoing_treatment_by_age_per_clinic')}</Card.Header>
                    <Card.Body>
                      <Bar data={ongoingTreatmentsByAgeByClinicData} options={groupBarChartOptions}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="2" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="2" className="d-flex align-items-center card-header border-0">
            {translate('therapist')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="2" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('dashboard.therapist_per_clinic')}</Card.Header>
                    <Card.Body>
                      <Bar data={therapistsByClinicData} options={therapistStackedBarChartOptions}/>
                    </Card.Body>
                  </Card>
                </Col>
                <Col></Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

CountryAdminDashboard.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CountryAdminDashboard);

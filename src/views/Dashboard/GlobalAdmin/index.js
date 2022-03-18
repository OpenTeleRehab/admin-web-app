import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Accordion } from 'react-bootstrap';
import { IoPerson } from 'react-icons/io5';
import { AiOutlineGlobal } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { FaFlag, FaClinicMedical } from 'react-icons/fa';
import { getChartDataGlobalAdmin } from 'store/dashboard/actions';
import { getTranslate } from 'react-localize-redux';
import { Bar } from 'react-chartjs-2';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { CHART } from '../../../variables/dashboard';
import settings from '../../../settings';
import { ContextAwareToggle } from '../../../components/Accordion/ContextAwareToggle';
import MapChart from '../../../components/MapChart';
import scssColors from 'scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';

const GlobalAdminDashboard = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const globalAdminData = useSelector(state => state.dashboard.globalAdminData);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const countries = useSelector(state => state.country.countries);
  const [totalGlobalAdmin, setTotalGlobalAdmin] = useState(0);
  const [totalCountryAdmin, setTotalCountryAdmin] = useState(0);
  const [totalClinicAdmin, setTotalClinicAdmin] = useState(0);
  const [totalTherapist, setTotalTherapist] = useState(0);
  const [clinicAdminPerCountries, setClinicAdminPerCountries] = useState([]);
  const [countryLabel, setCountryLabel] = useState([]);
  const [patientsByAgePerCountry, setPatientsByAgePerCounty] = useState([]);
  const [ongoingByAgePerCountry, setOngoingByAgePerCounty] = useState([]);
  const [treatmentByAgePerCountry, setTreatmentByAgePerCounty] = useState([]);
  const [patientsByGenderByCountry, setPatientsByGenderByCountry] = useState([]);
  const [treatmentsByGenderByCountry, setTreatmentsByGenderByCountry] = useState([]);
  const [ongoingTreatmentsByGenderByCountry, setOngoingTreatmentsByGenderByCountry] = useState([]);
  const [therapistsByCountry, setTherapistsByCountry] = useState([]);
  const [mapChartContent, setMapChartContent] = useState('');

  useEffect(() => {
    dispatch(getChartDataGlobalAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(globalAdminData) && countries.length && !_.isEmpty(globalAdminData.therapistData)) {
      const labels = [];
      const totalTherapistByCountryData = [];
      const therapistLimitByCountryData = [];
      countries.forEach(country => {
        labels.push(country.name);
        const numberByCountry = globalAdminData.therapistData.data.therapistsByCountry.find(item => item.country_id === country.id);
        totalTherapistByCountryData.push(numberByCountry ? numberByCountry.total : 0);
        therapistLimitByCountryData.push(country.therapist_limit);
      });

      setTherapistsByCountry([
        { label: translate('common.total_therapist'), data: totalTherapistByCountryData, backgroundColor: '#06038D', borderColor: '#06038D', borderWidth: 1 },
        { label: translate('common.therapist_limit'), data: therapistLimitByCountryData, backgroundColor: scssColors.orangeLight, borderColor: scssColors.orangeLight, borderWidth: 1 }
      ]);
    }
  }, [globalAdminData, countries, translate]);

  useEffect(() => {
    if (!_.isEmpty(globalAdminData)) {
      setTotalGlobalAdmin(globalAdminData.globalAdminTotal);
      setTotalCountryAdmin(globalAdminData.countryAdminTotal);
      setTotalClinicAdmin(globalAdminData.clinicAdminTotal);
      const countryLabels = [];
      const countryAdminsPerCountry = [];
      const clinicAdminsByCountry = [];
      const femalePatientByCountry = [];
      const malePatientByCountry = [];
      const otherPatientByCountry = [];
      const femaleTreatmentByCountry = [];
      const maleTreatmentByCountry = [];
      const otherTreatmentByCountry = [];
      const maleOngoingTreatmentByCountry = [];
      const femaleOngoingTreatmentByCountry = [];
      const otherOngoingTreatmentByCountry = [];

      countries.forEach(country => {
        countryLabels.push(country.name);
        const countryAdmins = globalAdminData.countryAdminByCountry.find(c => parseInt(c.country_id) === country.id);
        countryAdminsPerCountry.push(countryAdmins ? countryAdmins.total : 0);
        const clinicAdmins = globalAdminData.clinicAdminsByCountry.find(c => parseInt(c.country_id) === country.id);
        clinicAdminsByCountry.push(clinicAdmins ? clinicAdmins.total : 0);

        const patientData = globalAdminData.patientData.patientsByGenderGroupedByCountry.find(c => parseInt(c.country_id) === country.id);
        malePatientByCountry.push(patientData ? patientData.male : 0);
        femalePatientByCountry.push(patientData ? patientData.female : 0);
        otherPatientByCountry.push(patientData ? patientData.other : 0);

        const treatmentData = globalAdminData.patientData.treatmentsByGender.find(c => parseInt(c.country_id) === country.id);
        maleTreatmentByCountry.push(treatmentData ? treatmentData.male : 0);
        femaleTreatmentByCountry.push(treatmentData ? treatmentData.female : 0);
        otherTreatmentByCountry.push(treatmentData ? treatmentData.other : 0);

        const onGoingTreatmentData = globalAdminData.patientData.onGoingTreatmentsByGenderGroupedByCountry.find(c => parseInt(c.country_id) === country.id);
        maleOngoingTreatmentByCountry.push(onGoingTreatmentData ? onGoingTreatmentData.male : 0);
        femaleOngoingTreatmentByCountry.push(onGoingTreatmentData ? onGoingTreatmentData.female : 0);
        otherOngoingTreatmentByCountry.push(onGoingTreatmentData ? onGoingTreatmentData.other : 0);
      });

      setCountryLabel(countryLabels);
      setClinicAdminPerCountries(clinicAdminsByCountry);

      if (!_.isEmpty(globalAdminData.therapistData)) {
        setTotalTherapist(globalAdminData.therapistData.data.therapistTotal);
      }

      const ageLabels = [];
      const color = CHART.COLOR;
      const patientsByAgeGapGroupedByCountry = globalAdminData.patientData.patientsByAgeGapGroupedByCountry;
      const ongoingsByAgeGapGroupedByCountry = globalAdminData.patientData.onGoingTreatmentsByAgeGapGroupedByCountry;
      const treatmentsByAgeGapGroupedByCountry = globalAdminData.patientData.treatmentsByAgeGapGroupedByCountry;

      for (let i = settings.minAge; i <= settings.maxAge; i = i +
        settings.ageGap) {
        if (i === 0) {
          ageLabels.push('< ' + settings.ageGap);
        } else if (i === settings.maxAge) {
          ageLabels.push('>= ' + settings.maxAge);
        } else {
          ageLabels.push(i + ' - ' + (i + settings.ageGap));
        }
      }
      const patientsByAgeByCountryDatasets = [];
      const ongoingTreatmentByAgeByCountryDatasets = [];
      const treatmentsByAgeGapGroupedByCountryDatasets = [];

      ageLabels.forEach((ageLabel, index) => {
        const patientsByAgeByCountryDataset = {};
        patientsByAgeByCountryDataset.label = ageLabel + ' ' + translate('common.year');
        patientsByAgeByCountryDataset.data = [];
        patientsByAgeByCountryDataset.backgroundColor = color[index];
        patientsByAgeByCountryDataset.borderColor = color[index];

        const ongoingTreatmentByAgeByCountryDataset = {};
        ongoingTreatmentByAgeByCountryDataset.label = ageLabel + ' ' + translate('common.year');
        ongoingTreatmentByAgeByCountryDataset.data = [];
        ongoingTreatmentByAgeByCountryDataset.backgroundColor = color[index];
        ongoingTreatmentByAgeByCountryDataset.borderColor = color[index];

        const treatmentsByAgeGapGroupedByCountryDataset = {};
        treatmentsByAgeGapGroupedByCountryDataset.label = ageLabel + ' ' + translate('common.year');
        treatmentsByAgeGapGroupedByCountryDataset.data = [];
        treatmentsByAgeGapGroupedByCountryDataset.backgroundColor = color[index];
        treatmentsByAgeGapGroupedByCountryDataset.borderColor = color[index];

        countries.forEach(country => {
          const patientDataByAge = patientsByAgeGapGroupedByCountry.find(item => item.country_id === country.id);
          patientsByAgeByCountryDataset.data.push(patientDataByAge ? patientDataByAge[ageLabel] : 0);

          const ongoingDataByAge = ongoingsByAgeGapGroupedByCountry.find(item => item.country_id === country.id);
          ongoingTreatmentByAgeByCountryDataset.data.push(ongoingDataByAge ? ongoingDataByAge[ageLabel] : 0);

          const treatmentDataByAge = treatmentsByAgeGapGroupedByCountry.find(item => item.country_id === country.id);
          treatmentsByAgeGapGroupedByCountryDataset.data.push(treatmentDataByAge ? treatmentDataByAge[ageLabel] : 0);
        });
        patientsByAgeByCountryDatasets.push(patientsByAgeByCountryDataset);
        ongoingTreatmentByAgeByCountryDatasets.push(ongoingTreatmentByAgeByCountryDataset);
        treatmentsByAgeGapGroupedByCountryDatasets.push(treatmentsByAgeGapGroupedByCountryDataset);
      });
      setOngoingByAgePerCounty(ongoingTreatmentByAgeByCountryDatasets);
      setPatientsByAgePerCounty(patientsByAgeByCountryDatasets);
      setTreatmentByAgePerCounty(treatmentsByAgeGapGroupedByCountryDatasets);

      setPatientsByGenderByCountry([
        { label: translate('common.male'), data: malePatientByCountry, backgroundColor: '#06038D', borderColor: '#E35205', borderWidth: 1 },
        { label: translate('common.female'), data: femalePatientByCountry, backgroundColor: '#64CCC9', borderColor: '#64CCC9', borderWidth: 1 },
        { label: translate('common.other'), data: otherPatientByCountry, backgroundColor: '#eb1515', borderColor: '#eb1515', borderWidth: 1 }
      ]);

      setTreatmentsByGenderByCountry([
        { label: translate('common.male'), data: maleTreatmentByCountry, backgroundColor: '#06038D', borderColor: '#E35205', borderWidth: 1 },
        { label: translate('common.female'), data: femaleTreatmentByCountry, backgroundColor: '#64CCC9', borderColor: '#64CCC9', borderWidth: 1 },
        { label: translate('common.other'), data: otherTreatmentByCountry, backgroundColor: '#eb1515', borderColor: '#eb1515', borderWidth: 1 }
      ]);

      setOngoingTreatmentsByGenderByCountry([
        { label: translate('common.male'), data: maleOngoingTreatmentByCountry, backgroundColor: '#06038D', borderColor: '#E35205', borderWidth: 1 },
        { label: translate('common.female'), data: femaleOngoingTreatmentByCountry, backgroundColor: '#64CCC9', borderColor: '#64CCC9', borderWidth: 1 },
        { label: translate('common.other'), data: otherOngoingTreatmentByCountry, backgroundColor: '#eb1515', borderColor: '#eb1515', borderWidth: 1 }
      ]);
    }
  }, [globalAdminData, countries, translate]);

  const barChartOptions = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        gridLines: {
          drawOnChartArea: false
        }
      }],
      xAxes: [{
        gridLines: {
          drawOnChartArea: false
        }
      }]
    }
  };

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

  const clinicAdminPerCountryData = {
    labels: countryLabel,
    datasets: [
      {
        fill: false,
        lineTension: 0.5,
        backgroundColor: '#5BC2E7',
        borderWidth: 2,
        data: clinicAdminPerCountries
      }
    ]
  };

  const patientsByAgePerCountryData = {
    labels: countryLabel,
    datasets: patientsByAgePerCountry
  };

  const ongoingTreatmentsByAgePerCountryData = {
    labels: countryLabel,
    datasets: ongoingByAgePerCountry
  };

  const treatmentsByAgePerCountryData = {
    labels: countryLabel,
    datasets: treatmentByAgePerCountry
  };

  const patientsByGenderByCountryData = {
    labels: countryLabel,
    datasets: patientsByGenderByCountry
  };

  const treatmentsByGenderByCountryData = {
    labels: countryLabel,
    datasets: treatmentsByGenderByCountry
  };

  const ongoingTreatmentsByGenderByCountryData = {
    labels: countryLabel,
    datasets: ongoingTreatmentsByGenderByCountry
  };

  const therapistsByCountryData = {
    labels: countryLabel,
    datasets: therapistsByCountry
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

  return (
    <>
      <Row className="top-card-container mt-5">
        <Col sm={5} md={4} lg={3}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <AiOutlineGlobal size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_global_admin')}</h6>
                  <h5 className="card-number">{ totalGlobalAdmin }</h5>
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
                  <FaFlag size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_country_admin')}</h6>
                  <h5 className="card-number">{totalCountryAdmin}</h5>
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
                  <FaClinicMedical size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_clinic_admin')}</h6>
                  <h5 className="card-number">{totalClinicAdmin}</h5>
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
                  <IoPerson size={45} color={!_.isEmpty(colorScheme) ? colorScheme.primary_color : '#0077C8'}/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_therapist')}</h6>
                  <h5 className="card-number">{totalTherapist}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Accordion defaultActiveKey="0" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="0" className="d-flex align-items-center card-header border-0">
            {translate('admin')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="0" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{process.env.REACT_APP_SITE_TITLE} {translate('setting.countries')}</Card.Header>
                    <Card.Body>
                      <div className="map-chart">
                        <MapChart setTooltipContent={setMapChartContent} countries={countries} />
                        <ReactTooltip>{mapChartContent}</ReactTooltip>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.clinic_admin_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={clinicAdminPerCountryData} options={barChartOptions} />
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
            {translate('patient')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="1" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.patient_by_gender_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={patientsByGenderByCountryData} options={groupStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.patient_by_age_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={patientsByAgePerCountryData} options={groupBarChartOptions}/>
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
            {translate('common.treatment')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="2" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.treatment_by_gender_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={treatmentsByGenderByCountryData} options={groupStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.treatment_by_age_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={treatmentsByAgePerCountryData} options={groupBarChartOptions}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="3" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="3" className="d-flex align-items-center card-header border-0">
            {translate('common.ongoing_treatment')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="3" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3">
            <Card.Body>
              <Row className="top-card-container">
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.ongoing_treatement_by_gender_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={ongoingTreatmentsByGenderByCountryData} options={groupStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.ongoing_by_age_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={ongoingTreatmentsByAgePerCountryData} options={groupBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="4" className="mb-3">
        <Card>
          <Accordion.Toggle eventKey="4" className="d-flex align-items-center card-header border-0">
            {translate('therapist')}
            <div className="ml-auto text-nowrap">
              <ContextAwareToggle eventKey="4" />
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="4">
            <Card.Body>
              <Row>
                <Col className="container-fluid content-row" sm={6} md={6} lg={6}>
                  <Card className="h-100">
                    <Card.Header as="h5" className="chart-header">{translate('common.therapist_per_country')}</Card.Header>
                    <Card.Body>
                      <Bar data={therapistsByCountryData} options={therapistStackedBarChartOptions} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col></Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme)}
    </>
  );
};

export default GlobalAdminDashboard;

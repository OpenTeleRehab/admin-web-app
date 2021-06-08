import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate, Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import validateEmail from 'utils/validateEmail';
import { createTherapist, updateTherapist } from 'store/therapist/actions';
import { getCountryName, getCountryIdentity } from 'utils/country';
import { getClinicName, getClinicIdentity } from 'utils/clinic';
import { getProfessions } from 'store/profession/actions';
import { Therapist as therapistService } from 'services/therapist';
import Select from 'react-select';
import scssColors from '../../scss/custom.scss';

import {
  getTotalOnGoingTreatment
} from 'utils/patient';

const CreateTherapist = ({ show, handleClose, editId }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const therapists = useSelector(state => state.therapist.therapists);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);

  const [patients, setPatients] = useState([]);
  const [onGoingPatients, setOngoingPatient] = useState(0);

  const { profile } = useSelector((state) => state.auth);
  const professions = useSelector(state => state.profession.professions);
  const languages = useSelector(state => state.language.languages);
  const defaultLimitedPatients = useSelector(state => state.defaultLimitedPatient.defaultLimitedPatients);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [errorLimitPatient, setErrorLimitPatient] = useState(false);
  const [errorLimitPatientMessage, setErrorLimitPatientMessage] = useState('');
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);

  const [formFields, setFormFields] = useState({
    email: '',
    first_name: '',
    last_name: '',
    country: '',
    limit_patient: defaultLimitedPatients.value,
    clinic: '',
    clinic_identity: '',
    country_identity: ''
  });

  useEffect(() => {
    dispatch(getProfessions());
  }, [dispatch]);

  const resetData = () => {
    setErrorEmail(false);
    setErrorCountry(false);
    setErrorLimitPatient(false);
    setErrorClinic(false);
    setFormFields({
      email: '',
      first_name: '',
      last_name: '',
      limit_patient: defaultLimitedPatients.value,
      clinic: '',
      country: ''
    });
  };

  useEffect(() => {
    if (editId) {
      therapistService.getPatientByTherapistId(editId).then(res => {
        if (res.data) {
          setPatients(res.data);
        }
      });
    }
  }, [editId]);

  useEffect(() => {
    if (patients.length) {
      setOngoingPatient(getTotalOnGoingTreatment(editId, patients));
    }
  }, [patients, editId]);

  useEffect(() => {
    if (editId && therapists.length) {
      const editingData = therapists.find(user => user.id === editId);
      setFormFields({
        email: editingData.email || '',
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || '',
        country: editingData.country_id || '',
        clinic: editingData.clinic_id || '',
        limit_patient: editingData.limit_patient || '',
        language_id: editingData.language_id || '',
        profession: editingData.profession_id || ''
      });
    } else {
      resetData();
      if (profile !== undefined) {
        setFormFields({ ...formFields, country: profile.country_id, clinic: profile.clinic_id, country_identity: getCountryIdentity(profile.country_id, countries), clinic_identity: getClinicIdentity(profile.clinic_id, clinics) });
      }
    }
    // eslint-disable-next-line
  }, [editId, therapists, profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.email === '' || !validateEmail(formFields.email)) {
      canSave = false;
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }

    if (formFields.country === '') {
      canSave = false;
      setErrorCountry(true);
    } else {
      setErrorCountry(false);
    }

    if (formFields.first_name === '') {
      canSave = false;
      setErrorFirstName(true);
    } else {
      setErrorFirstName(false);
    }

    if (formFields.last_name === '') {
      canSave = false;
      setErrorLastName(true);
    } else {
      setErrorLastName(false);
    }

    if (formFields.clinic === '') {
      canSave = false;
      setErrorClinic(true);
    } else {
      setErrorClinic(false);
    }

    if (formFields.country === '') {
      canSave = false;
      setErrorCountry(true);
    } else {
      setErrorCountry(false);
    }

    if (formFields.limit_patient === '') {
      canSave = false;
      setErrorLimitPatient(true);
      setErrorLimitPatientMessage(translate('error.limit_patient'));
    } else {
      if (onGoingPatients > 0 && formFields.limit_patient < onGoingPatients) {
        canSave = false;
        setErrorLimitPatient(true);
        setErrorLimitPatientMessage(translate('error.limit_patient.lessthan'));
      } else {
        setErrorLimitPatient(false);
      }
    }

    if (canSave) {
      const language = languages.find(item => item.id === formFields.language_id);
      const data = { ...formFields, language_code: (language ? language.code : null) };
      if (editId) {
        dispatch(updateTherapist(editId, data)).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createTherapist(data)).then(result => {
          if (result) {
            handleClose();
          }
        });
      }
    }
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      size="md"
      title={translate(editId ? 'admin.edit' : 'therapist.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="formEmail">
          <Form.Label>{translate('common.email')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="email"
            onChange={handleChange}
            type="email"
            placeholder={translate('placeholder.email')}
            isInvalid={errorEmail}
            value={formFields.email}
            disabled={!!editId}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.email')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId="formCountry" className="mb-0">
            <Form.Label>{translate('common.country')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              isDisabled={true}
              placeholder={profile !== undefined && getCountryName(profile.country_id, countries)}
              classNamePrefix="filter"
              className={errorCountry ? 'is-invalid' : ''}
              value={profile !== undefined && getCountryName(profile.country_id, countries)}
              getOptionLabel={option => option.label}
              styles={customSelectStyles}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.country')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="patient" className="mb-0">
            <Form.Label>
              <Translate
                id="common.limit_treatment"
                data={{ defaultLimitedPatients: defaultLimitedPatients.value }}
              />
            </Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="limit_patient"
              onChange={handleChange}
              placeholder={translate('placeholder.limit_patient')}
              isInvalid={errorLimitPatient}
              value={formFields.limit_patient}
            />
            <Form.Control.Feedback type="invalid">
              {errorLimitPatientMessage}
            </Form.Control.Feedback>
            <p className="mt-1">
              <Translate
                id="common.on_going.treatment"
                data={{ onGoingPatients: onGoingPatients }}
              />
            </p>
          </Form.Group>
        </Form.Row>
        <hr />
        <Form.Row>
          <Form.Group as={Col} controlId="formLastName">
            <Form.Label>{translate('common.last_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="last_name"
              onChange={handleChange}
              isInvalid={errorLastName}
              value={formFields.last_name}
              placeholder={translate('placeholder.last_name')}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.last_name')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="formFirstName">
            <Form.Label>{translate('common.first_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="first_name"
              onChange={handleChange}
              isInvalid={errorFirstName}
              value={formFields.first_name}
              placeholder={translate('placeholder.first_name')}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.first_name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formProfession">
            <Form.Label>{translate('common.profession')}</Form.Label>
            <Select
              placeholder={translate('placeholder.profession')}
              classNamePrefix="filter"
              value={professions.filter(option => option.id === formFields.profession)}
              getOptionLabel={option => option.name}
              options={[
                {
                  id: '',
                  name: translate('placeholder.profession')
                },
                ...professions
              ]}
              onChange={(e) => handleSingleSelectChange('profession', e.id)}
              styles={customSelectStyles}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.profession')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="clinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              value={formFields.clinic}
              placeholder={getClinicName(profile.clinic_id, clinics)}
              classNamePrefix="filter"
              className={errorClinic ? 'is-invalid' : ''}
              isDisabled={true}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formLanguage">
            <Form.Label>{translate('common.language')}</Form.Label>
            <Select
              placeholder={translate('placeholder.language')}
              classNamePrefix="filter"
              value={languages.filter(option => option.id === formFields.language_id)}
              getOptionLabel={option => option.name}
              options={[{ id: '', name: translate('placeholder.language') }, ...languages]}
              onChange={(e) => handleSingleSelectChange('language_id', e.id)}
              styles={customSelectStyles}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateTherapist.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string
};

export default CreateTherapist;

import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa';
import { updateUserProfile } from 'store/auth/actions';
import { USER_GROUPS } from 'variables/user';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import settings from '../../../settings';

const EdiInformation = ({ editId }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);
  const countries = useSelector(state => state.country.countries);
  const languages = useSelector(state => state.language.languages);
  const clinics = useSelector(state => state.clinic.clinics);

  const [errorLastName, setErrorLastName] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [disabled, setDisable] = useState(true);

  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    country_id: '',
    clinic_id: '',
    language_id: ''
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setDisable(false);
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
    setDisable(false);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.last_name === '') {
      canSave = false;
      setErrorLastName(true);
    } else {
      setErrorLastName(false);
    }

    if (formFields.first_name === '') {
      canSave = false;
      setErrorFirstName(true);
    } else {
      setErrorFirstName(false);
    }

    if (canSave) {
      const language = languages.find(item => item.id === formFields.language_id);
      const data = { ...formFields, language_code: (language ? language.code : null) };
      dispatch(updateUserProfile(data))
        .then((result) => {
          if (result) {
            history.goBack();
          }
        });
    }
  };

  useEffect(() => {
    if (profile) {
      setFormFields({
        email: profile.email,
        gender: profile.gender || '',
        first_name: profile.first_name,
        last_name: profile.last_name,
        country_id: profile.country_id || '',
        clinic_id: profile.clinic_id || '',
        language_id: profile.language_id || ''
      });
    }
  }, [profile]);

  if (profile === undefined) {
    return React.Fragment;
  }

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.lightInfo
      }
    })
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Form onKeyPress={(e) => handleFormSubmit(e)} className="my-4">
      <Form.Row >
        <Form.Group className="col-sm-2 md-4" controlId="formLastName">
          <Form.Label>{translate('common.last_name')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="last_name"
            placeholder={translate('placeholder.last_name')}
            onChange={handleChange}
            isInvalid={errorLastName}
            value={formFields.last_name}

          />
          <Form.Control.Feedback type="invalid">
            {translate('error.last_name')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-sm-2 md-4" controlId="formFirstName">
          <Form.Label>{translate('common.first_name')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="first_name"
            placeholder={translate('placeholder.first_name')}
            onChange={handleChange}
            isInvalid={errorFirstName}
            value={formFields.first_name}

          />
          <Form.Control.Feedback type="invalid">
            {translate('error.first_name')}
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formEmail">
          <Form.Label>{translate('common.email')}</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={formFields.email}
            disabled
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.email')}
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formGender">
          <Form.Label>{translate('gender')}</Form.Label>
          <Select
            placeholder={translate('placeholder.gender')}
            classNamePrefix="filter"
            value={settings.genders.options.filter(option => option.value === formFields.gender)}
            getOptionLabel={option => translate(option.value)}
            options={[{ value: '', text: translate('placeholder.gender') }, ...settings.genders.options]}
            onChange={(e) => handleSingleSelectChange('gender', e.value)}
            aria-label="Gender"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-sm-4 md-4" controlId="formLanguage">
          <Form.Label>
            <FaGlobe className="mr-1" />
            {translate('common.language')}
          </Form.Label>
          <Select
            placeholder={translate('placeholder.language')}
            classNamePrefix="filter"
            value={languages.filter(option => option.id === formFields.language_id)}
            getOptionLabel={option => option.name}
            options={[{ id: '', name: translate('placeholder.language') }, ...languages]}
            onChange={(e) => handleSingleSelectChange('language_id', e.id)}
            styles={customSelectStyles}
            aria-label="Language"
          />
        </Form.Group>
      </Form.Row>

      { profile.type !== USER_GROUPS.ORGANIZATION_ADMIN && (
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <Select
              isDisabled={true}
              placeholder={translate('placeholder.country')}
              classNamePrefix="filter"
              value={countries.filter(option => option.id === parseInt(formFields.country_id))}
              getOptionLabel={option => option.name}
              options={countries}
              styles={customSelectStyles}
              aria-label="Country"
            />
          </Form.Group>
        </Form.Row>
      )}

      {profile.type === USER_GROUPS.CLINIC_ADMIN && (
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <Select
              isDisabled={true}
              placeholder={translate('placeholder.clinic')}
              classNamePrefix="filter"
              value={countries.filter(option => option.id === parseInt(formFields.clinic_id))}
              getOptionLabel={option => option.name}
              options={clinics}
              styles={customSelectStyles}
              aria-label="Clinic"
            />
          </Form.Group>
        </Form.Row>
      )}

      <Form.Row>
        <Button
          disabled={disabled}
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
        >
          {translate('common.save')}
        </Button>

        <Button
          className="ml-2"
          variant="outline-dark"
          onClick={handleCancel}
        >
          {translate('common.cancel')}
        </Button>
      </Form.Row>
    </Form>
  );
};

EdiInformation.propTypes = {
  editId: PropTypes.string
};

export default EdiInformation;

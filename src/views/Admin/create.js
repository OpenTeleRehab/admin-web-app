import React, { useState, useEffect, useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import validateEmail from 'utils/validateEmail';
import { USER_GROUPS, USER_ROLES } from 'variables/user';
import { getCountryName } from 'utils/country';

import { createUser, updateUser } from 'store/user/actions';
import { useKeycloak } from '@react-keycloak/web';
import Select from 'react-select';
import scssColors from '../../scss/custom.scss';

const CreateAdmin = ({ show, handleClose, editId, setType, type }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const users = useSelector(state => state.user.users);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const [hintMessage, setHintMessage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [errorCountryMessage, setErrorCountryMessage] = useState('');
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const regionOptions = useMemo(() => {
    if (profile?.admin_regions?.length > 0) {
      return profile.admin_regions.map((region) => ({
        label: region.name,
        value: region.id,
      }));
    }

    if (profile?.region_id) {
      return [
        {
          label: profile.region_name,
          value: profile.region_id,
        },
      ];
    }

    return [];
  }, [profile]);

  const [formFields, setFormFields] = useState({
    type: type,
    email: '',
    first_name: '',
    last_name: '',
    country_id: '',
    clinic_id: '',
    region_id: ''
  });

  useEffect(() => {
    if (editId && users.length) {
      const editingData = users.find(user => user.id === editId);
      setFormFields({
        type: editingData.type || USER_GROUPS.ORGANIZATION_ADMIN,
        email: editingData.email || '',
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || '',
        country_id: editingData.country_id || '',
        clinic_id: editingData.clinic_id || '',
        region_id: editingData.region_id || ''
      });
    }
  }, [editId, users]);

  useEffect(() => {
    setErrorEmail(false);
    setErrorCountry(false);
    setErrorClinic(false);
    setErrorFirstName(false);
    setErrorLastName(false);

    if (!editId) {
      setFormFields({
        ...formFields,
        email: '',
        first_name: '',
        last_name: '',
        country_id: profile.country_id,
        clinic_id: '',
        region_id: ''
      });
    }

    if (formFields.type === USER_GROUPS.ORGANIZATION_ADMIN) {
      setHintMessage(translate('admin.hint_message_global_admin'));
    } else if (formFields.type === USER_GROUPS.COUNTRY_ADMIN) {
      setHintMessage(translate('admin.hint_message_country_admin'));
    } else {
      setHintMessage(translate('admin.hint_message_clinic_admin'));
    }
    // eslint-disable-next-line
  }, [formFields.type, profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSingleSelectChange = (key, value) => {
    if (key === 'region_id') {
      setFormFields({ ...formFields, [key]: value, clinic_id: '' });
    } else {
      setFormFields({ ...formFields, [key]: value });
    }
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.email === '' || !validateEmail(formFields.email)) {
      canSave = false;
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }

    if (formFields.type === USER_GROUPS.COUNTRY_ADMIN) {
      if (formFields.country_id === '') {
        canSave = false;
        setErrorCountry(true);
        setErrorCountryMessage(translate('error.country'));
      } else if (users.length) {
        const user = users.find(user => user.country_id === formFields.country_id);
        if (user && user.enabled === 1 && editId !== user.id) {
          canSave = false;
          setErrorCountry(true);
          setErrorCountryMessage(translate('error.country.in_used'));
        } else {
          setErrorCountry(false);
        }
      } else {
        setErrorCountry(false);
      }
    } else {
      setErrorCountry(false);
    }

    if (formFields.type === USER_GROUPS.CLINIC_ADMIN && formFields.clinic_id === '') {
      canSave = false;
      setErrorClinic(true);
    } else {
      setErrorClinic(false);
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

    if (canSave) {
      setIsLoading(true);
      if (editId) {
        dispatch(updateUser(editId, formFields))
          .then(result => {
            if (result) {
              setType(formFields.type);
              handleClose();
            }
            setIsLoading(false);
          });
      } else {
        dispatch(createUser(formFields))
          .then(result => {
            if (result) {
              setType(formFields.type);
              handleClose();
            }
            setIsLoading(false);
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

  const clinicOptions = useMemo(() => {
    if (formFields.region_id) {
      return clinics.filter(clinic => {
        const clinicRegionId = clinic.region_id || clinic.region?.id;
        return parseInt(clinicRegionId) === parseInt(formFields.region_id);
      });
    }
    return clinics;
  }, [clinics, formFields.region_id]);

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'admin.edit' : 'admin.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      disabled={isLoading}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <fieldset>
          <legend className="d-none">Admin type</legend>
          <Form.Group as={Row}>
            { keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN) && (
              <Col md={6}>
                <Form.Check
                  name="type"
                  onChange={handleChange}
                  value={USER_GROUPS.ORGANIZATION_ADMIN}
                  defaultChecked={formFields.type === USER_GROUPS.ORGANIZATION_ADMIN}
                  type="radio"
                  label={translate('organization_admin')}
                  id="formGlobalAdmin"
                  disabled={!!editId}
                />
              </Col>
            )}
            { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY_ADMIN) && (
              <Col md={6} >
                <Form.Check
                  name="type"
                  onChange={handleChange}
                  value={USER_GROUPS.COUNTRY_ADMIN}
                  defaultChecked={formFields.type === USER_GROUPS.COUNTRY_ADMIN}
                  type="radio"
                  label={translate('country_admin')}
                  id="formCountryAdmin"
                  disabled={!!editId}
                />
              </Col>
            )}
            { keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC_ADMIN) && (
              <Col xs={7} md={8}>
                <Form.Check
                  name="type"
                  onChange={handleChange}
                  value={USER_GROUPS.CLINIC_ADMIN}
                  defaultChecked={formFields.type === USER_GROUPS.CLINIC_ADMIN}
                  type="radio"
                  label={translate('clinic_admin')}
                  id="formClinicAdmin"
                  disabled={!!editId}
                />
              </Col>
            )}
          </Form.Group>
        </fieldset>
        <p className="text-muted font-italic">
          { hintMessage }
        </p>
        <Form.Group controlId="formEmail">
          <Form.Label>{translate('common.email')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="email"
            onChange={handleChange}
            type="email"
            placeholder={translate('placeholder.email')}
            value={formFields.email}
            isInvalid={errorEmail}
            disabled={!!editId}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.email')}
          </Form.Control.Feedback>
        </Form.Group>
        {(formFields.type === USER_GROUPS.COUNTRY_ADMIN) && (
          <Form.Group controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              placeholder={translate('placeholder.country')}
              classNamePrefix="filter"
              className={errorCountry ? 'is-invalid' : ''}
              value={countries.filter(option => option.id === parseInt(formFields.country_id))}
              getOptionLabel={option => option.name}
              options={[
                {
                  id: '',
                  name: translate('placeholder.country')
                },
                ...countries
              ]}
              onChange={(e) => handleSingleSelectChange('country_id', e.id)}
              styles={customSelectStyles}
              aria-label="Country"
            />
            <Form.Control.Feedback type="invalid">
              { errorCountryMessage }
            </Form.Control.Feedback>
          </Form.Group>
        )}
        {(formFields.type === USER_GROUPS.CLINIC_ADMIN) && (
          <Form.Group controlId="formRegion">
            <Form.Label>{translate('common.region')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              placeholder={translate('placeholder.region')}
              options={regionOptions}
              value={regionOptions.find(option => option.value === parseInt(formFields.region_id))}
              onChange={(e) => handleSingleSelectChange('region_id', e ? e.value : '')}
              styles={customSelectStyles}
              aria-label="Region"
            />
            <Form.Control.Feedback type="invalid">
              { translate('error.region') }
            </Form.Control.Feedback>
          </Form.Group>
        )}
        {formFields.type === USER_GROUPS.CLINIC_ADMIN && (
          <Form.Group controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              placeholder={translate('placeholder.clinic')}
              classNamePrefix="filter"
              className={errorClinic ? 'is-invalid' : ''}
              value={clinics.find(option => option.id === parseInt(formFields.clinic_id)) || null}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              options={clinicOptions}
              onChange={(e) => handleSingleSelectChange('clinic_id', e ? e.id : '')}
              styles={customSelectStyles}
              aria-label="Clinic"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic')}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        <Form.Row>
          <Form.Group as={Col} controlId="formLastName">
            <Form.Label>{translate('common.last_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="last_name"
              onChange={handleChange}
              value={formFields.last_name}
              placeholder={translate('placeholder.last_name')}
              isInvalid={errorLastName}
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
              value={formFields.first_name}
              placeholder={translate('placeholder.first_name')}
              isInvalid={errorFirstName}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.first_name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateAdmin.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string,
  setType: PropTypes.func,
  type: PropTypes.string
};

export default CreateAdmin;

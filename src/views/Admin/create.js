import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import validateEmail from 'utils/validateEmail';
import { USER_GROUPS, USER_ROLES } from 'variables/user';

import { createUser, updateUser } from 'store/user/actions';
import { useKeycloak } from '@react-keycloak/web';

const CreateAdmin = ({ show, handleClose, editId, setType, type }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const users = useSelector(state => state.user.users);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const [hintMessage, setHintMessage] = useState('');

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    type: type,
    email: '',
    first_name: '',
    last_name: '',
    country_id: '',
    clinic_id: ''
  });

  useEffect(() => {
    if (editId && users.length) {
      const editingData = users.find(user => user.id === editId);
      setFormFields({
        type: editingData.type || USER_GROUPS.GLOBAL_ADMIN,
        email: editingData.email || '',
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || '',
        country_id: editingData.country_id || '',
        clinic_id: editingData.clinic_id || ''
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
        country_id: '',
        clinic_id: ''
      });
    }

    if (formFields.type === USER_GROUPS.GLOBAL_ADMIN) {
      setHintMessage(translate('admin.hint_message_global_admin'));
    } else if (formFields.type === USER_GROUPS.COUNTRY_ADMIN) {
      setHintMessage(translate('admin.hint_message_country_admin'));
    } else {
      setHintMessage(translate('admin.hint_message_clinic_admin'));
    }
    // eslint-disable-next-line
  }, [formFields.type]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.email === '' || !validateEmail(formFields.email)) {
      canSave = false;
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }

    if ((formFields.type === USER_GROUPS.COUNTRY_ADMIN ||
        formFields.type === USER_GROUPS.CLINIC_ADMIN) &&
        formFields.country_id === '') {
      canSave = false;
      setErrorCountry(true);
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

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'admin.edit' : 'admin.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      disabled={isLoading}
    >
      <Form>
        <Form.Group as={Row}>
          { keycloak.hasRealmRole(USER_ROLES.MANAGE_GLOBAL_ADMIN) && (
            <Col xs={5} md={4}>
              <Form.Check
                name="type"
                onChange={handleChange}
                value={USER_GROUPS.GLOBAL_ADMIN}
                defaultChecked={formFields.type === USER_GROUPS.GLOBAL_ADMIN}
                type="radio"
                label={translate('global_admin')}
                id="formGlobalAdmin"
                disabled={!!editId}
              />
            </Col>
          )}
          { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY_ADMIN) && (
            <Col xs={7} md={8}>
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
        {(formFields.type === USER_GROUPS.COUNTRY_ADMIN ||
          formFields.type === USER_GROUPS.CLINIC_ADMIN) && (
          <Form.Group controlId="formCountry">
            <Form.Label>{translate('common.country')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="country_id"
              onChange={handleChange}
              as="select"
              isInvalid={errorCountry}
              value={formFields.country_id}
              disabled={!!editId}
            >
              <option value="">{translate('placeholder.country')}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}

            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {translate('error.country')}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        {formFields.type === USER_GROUPS.CLINIC_ADMIN && (
          <Form.Group controlId="formClinic">
            <Form.Label>{translate('common.clinic')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="clinic_id"
              onChange={handleChange}
              as="select"
              isInvalid={errorClinic}
              value={formFields.clinic_id}
              disabled={!!editId}
            >
              <option value="">{translate('placeholder.clinic')}</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
              ))}
            </Form.Control>
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

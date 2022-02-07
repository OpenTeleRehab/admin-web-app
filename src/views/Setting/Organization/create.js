import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import settings from 'settings';
import {
  createOrganization,
  getOrganization,
  updateOrganization
} from 'store/organization/actions';
import validateEmail from '../../../utils/validateEmail';

const CreateOrganization = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const { organization } = useSelector(state => state.organization);
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorSubDomainName, setErrorSubDomainName] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    type: '',
    admin_email: '',
    sub_domain_name: ''
  });

  useEffect(() => {
    if (editId) {
      dispatch(getOrganization(editId));
    }
  }, [editId, dispatch]);

  useEffect(() => {
    if (editId && organization.id) {
      setFormFields({
        name: organization.name,
        type: organization.type,
        admin_email: organization.admin_email,
        sub_domain_name: organization.sub_domain_name
      });
    }
    // eslint-disable-next-line
  }, [editId, organization]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (formFields.admin_email === '' || !validateEmail(formFields.admin_email)) {
      canSave = false;
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }

    if (formFields.sub_domain_name === '') {
      canSave = false;
      setErrorSubDomainName(true);
    } else {
      setErrorSubDomainName(false);
    }

    if (canSave) {
      const payload = {
        ...formFields
      };
      if (editId) {
        dispatch(updateOrganization(editId, payload)).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createOrganization(payload)).then(result => {
          if (result) {
            handleClose();
          }
        });
      }
    }
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
      title={translate(editId ? 'organization.edit' : 'organization.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('organization.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.organization.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.organization.name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formEmail">
            <Form.Label>{translate('organization.admin_email')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="admin_email"
              onChange={handleChange}
              type="email"
              placeholder={translate('placeholder.email')}
              value={formFields.admin_email}
              isInvalid={errorEmail}
              disabled={!!editId}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.email')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="subDomainName">
            <Form.Label>{translate('organization.sub_domain_name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="sub_domain_name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.organization.sub_domain_name')}
              isInvalid={errorSubDomainName}
              value={formFields.sub_domain_name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.organization.sub_domain_name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateOrganization.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.string,
  handleClose: PropTypes.func
};

export default CreateOrganization;

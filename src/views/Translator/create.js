import React, { useState, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import validateEmail from 'utils/validateEmail';

import {
  createTranslator,
  updateTranslator
} from '../../store/translator/actions';

const CreateTranslator = ({ show, handleClose, editId }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const translators = useSelector(state => state.translator.translators);
  const { profile } = useSelector((state) => state.auth);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: '',
    first_name: '',
    last_name: '',
    country_id: '',
    clinic_id: ''
  });

  useEffect(() => {
    if (editId && translators.length) {
      const editingData = translators.find(translator => translator.id === editId);
      setFormFields({
        email: editingData.email || '',
        first_name: editingData.first_name || '',
        last_name: editingData.last_name || ''
      });
    }
  }, [editId, translators]);

  useEffect(() => {
    setErrorEmail(false);
    setErrorFirstName(false);
    setErrorLastName(false);

    if (!editId) {
      setFormFields({
        ...formFields,
        email: '',
        first_name: '',
        last_name: '',
        country_id: profile.country_id,
        clinic_id: ''
      });
    }
  }, [profile]);

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
        dispatch(updateTranslator(editId, formFields))
          .then(result => {
            if (result) {
              handleClose();
            }
            setIsLoading(false);
          });
      } else {
        dispatch(createTranslator(formFields))
          .then(result => {
            if (result) {
              handleClose();
            }
            setIsLoading(false);
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
      title={translate(editId ? 'translator.edit' : 'translator.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      disabled={isLoading}
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
            value={formFields.email}
            isInvalid={errorEmail}
            disabled={!!editId}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.email')}
          </Form.Control.Feedback>
        </Form.Group>
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

CreateTranslator.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.string
};

export default CreateTranslator;

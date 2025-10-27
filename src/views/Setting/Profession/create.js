import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { createProfession, updateProfession } from 'store/profession/actions';
import settings from 'settings';
import { PROFESSION_TYPES } from 'variables/professionTypes';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';

const CreateProfession = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { profile } = useSelector((state) => state.auth);

  const professions = useSelector(state => state.profession.professions);
  const [errorName, setErrorName] = useState(false);
  const [errorType, setErrorType] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    country_id: '',
    type: ''
  });

  useEffect(() => {
    if (editId && professions.length) {
      const profession = professions.find(profession => profession.id === editId);
      setFormFields({
        name: profession.name,
        country_id: profession.country_id,
        type: profession.type
      });
    } else {
      setFormFields({
        ...formFields,
        country_id: profile.country_id
      });
    }
    // eslint-disable-next-line
  }, [editId, professions, profile]);

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

    if (!formFields.type) {
      canSave = false;
      setErrorType(true);
    } else {
      setErrorType(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateProfession(editId, formFields)).then(result => {
          if (result) {
            invalidate(END_POINTS.PROFESSION_LIST);
            handleClose();
          }
        });
      } else {
        dispatch(createProfession(formFields)).then(result => {
          if (result) {
            invalidate(END_POINTS.PROFESSION_LIST);
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
      title={translate(editId ? 'profession.edit' : 'profession.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('profession.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.profession.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.profession.name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="professionType">
            <div className="d-flex flex-column">
              {PROFESSION_TYPES.map((type, index) => (
                <Form.Check
                  key={index}
                  id={type.value}
                  name="type"
                  type="radio"
                  value={type.value}
                  label={translate(type.label)}
                  checked={formFields.type === type.value}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      type: e.target.value
                    })
                  }
                />
              ))}
            </div>
            {errorType && (
              <Form.Text className="text-danger">
                {translate('error.profession.type.required')}
              </Form.Text>
            )}
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateProfession.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.string,
  handleClose: PropTypes.func
};

export default CreateProfession;

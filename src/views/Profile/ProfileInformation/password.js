import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updatePassword } from 'store/auth/actions';

const Password = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();

  const [formFields, setFormFields] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordNotMactchError, setConfirmPasswordNotMactchError] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.current_password === '') {
      canSave = false;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (formFields.new_password === '') {
      canSave = false;
      setNewPasswordError(true);
    } else {
      setNewPasswordError(false);
    }

    if (formFields.confirm_password === '') {
      setConfirmPasswordNotMactchError(false);
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
      if (formFields.confirm_password !== formFields.new_password) {
        canSave = false;
        setConfirmPasswordNotMactchError(true);
      } else {
        setConfirmPasswordNotMactchError(false);
      }
    }

    if (canSave) {
      dispatch(updatePassword(formFields))
        .then((result) => {
          if (result) {
            history.goBack();
          }
        });
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <Form className="mt-4">
        <Form.Row >
          <Form.Group className="col-sm-4 md-4" controlId="formCurrentPassword">
            <Form.Label>{translate('profile.current_password')}</Form.Label>
            <Form.Control
              type="password"
              name="current_password"
              onChange={handleChange}
              isInvalid={passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.current_password')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formNewPassword">
            <Form.Label>{translate('profile.new_password')}</Form.Label>
            <Form.Control
              type="password"
              name="new_password"
              onChange={handleChange}
              isInvalid={newPasswordError}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.new_password')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group className="col-sm-4 md-4" controlId="formConfirmNewPassword">
            <Form.Label>{translate('profile.confirm_password')}</Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              onChange={handleChange}
              isInvalid={confirmPasswordError || confirmPasswordNotMactchError}
            />
            <Form.Control.Feedback type="invalid">
              {confirmPasswordError && translate('error.confirm_password_required')}
              {confirmPasswordNotMactchError && translate('error.confirm_password')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Button
            onClick={handleSave}
            disabled={!formFields.current_password && !formFields.new_password && !formFields.confirm_password}
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
    </>
  );
};

export default Password;
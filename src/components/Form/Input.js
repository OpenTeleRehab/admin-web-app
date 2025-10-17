import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const Input = ({ control, name, rules, label, ...props }) => {
  const sanitizedControlId = name.replace(/\./g, '_');

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Group controlId={sanitizedControlId}>
          {label && (
            <Form.Label>
              {label}
              {rules && rules.required && <span className="text-dark ml-1">*</span>}
            </Form.Label>
          )}
          <Form.Control
            {...props}
            {...field}
            onChange={(e) => {
              field.onChange(e);
            }}
            isInvalid={!!fieldState.error}
          />

          {fieldState.error && (
            <Form.Control.Feedback type="invalid">
              {fieldState.error.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}
    />
  );
};

Input.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string
};

export default Input;

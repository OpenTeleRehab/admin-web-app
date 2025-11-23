import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const Input = ({ control, name, rules, label, startIcon, endIcon, ...props }) => {
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
          <InputGroup>
            {startIcon && <InputGroup.Text>{startIcon}</InputGroup.Text>}
            <Form.Control
              {...props}
              {...field}
              onChange={(e) => field.onChange(e)}
              isInvalid={!!fieldState.error}
            />
            {endIcon && <InputGroup.Text style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 0 }}>{endIcon}</InputGroup.Text>}
            {fieldState.error && (
              <Form.Control.Feedback type="invalid">
                {fieldState.error.message}
              </Form.Control.Feedback>
            )}
          </InputGroup>

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
  label: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node
};

export default Input;

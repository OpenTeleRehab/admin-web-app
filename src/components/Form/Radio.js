import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const Radio = ({ control, name, label, rules, options = [], ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const sanitizedControlId = name.replace(/\./g, '_');

        return (
          <Form.Group controlId={sanitizedControlId}>
            {label && (
              <Form.Label>
                {label}
                {rules && rules.required && <span className="text-dark ml-1">*</span>}
              </Form.Label>
            )}

            {options.map((opt, index) => {
              const optionId = `${sanitizedControlId}_${index}`;

              return (
                <Form.Check
                  key={index}
                  {...props}
                  id={optionId}
                  label={opt.label}
                  name={name}
                  type="radio"
                  value={opt.value}
                  checked={field.value === opt.value}
                  onChange={() => field.onChange(opt.value)}
                  isInvalid={!!fieldState.error}
                  disabled={!!opt.disabled}
                />
              );
            })}

            {fieldState.error && (
              <Form.Control.Feedback type="invalid">
                {fieldState.error.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        );
      }}
    />
  );
};

Radio.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })
  )
};

export default Radio;

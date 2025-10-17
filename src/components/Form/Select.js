import React from 'react';
import ReactSelect from 'react-select';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

const Select = ({ control, label, name, rules, options = [], isMulti = false, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const selectedValue = isMulti
          ? options.filter(opt => field.value && field.value.includes(opt.value))
          : options.find(opt => opt.value === field.value) || null;
        const sanitizedControlId = name.replace(/\./g, '_');

        return (
          <Form.Group controlId={sanitizedControlId}>
            {label && (
              <Form.Label>
                {label}
                {rules && rules.required && <span className="text-dark ml-1">*</span>}
              </Form.Label>
            )}

            <ReactSelect
              {...props}
              isMulti={isMulti}
              inputId={sanitizedControlId}
              options={options}
              value={selectedValue}
              onChange={(val) => {
                if (isMulti) {
                  field.onChange(val ? val.map(v => v.value) : []);
                } else {
                  field.onChange(val ? val.value : null);
                }
              }}
              onBlur={field.onBlur}
              classNamePrefix="select"
              className={fieldState.error ? 'is-invalid' : ''}
            />

            {fieldState.error && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {fieldState.error.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        );
      }}
    />
  );
};

Select.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })
  ).isRequired,
  isMulti: PropTypes.bool
};

export default Select;

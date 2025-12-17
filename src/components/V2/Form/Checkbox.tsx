import { Form, FormCheckProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type CheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  label?: string;
} & Omit<FormCheckProps, 'name'>;

const Checkbox = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...props
}: CheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState }) => {
        const sanitizedControlId = name.replace(/\./g, '_');

        return (
          <Form.Group controlId={sanitizedControlId}>
            <Form.Check
              {...props}
              label={label}
              name={name}
              type="checkbox"
              checked={value}
              onChange={(event) => onChange(event.target.checked)}
              isInvalid={!!fieldState.error}
            />
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

export default Checkbox;

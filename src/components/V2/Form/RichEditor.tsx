import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Form, FormControlProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import settings from '../../../settings';

type RichEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  disabled?: boolean;
  as?: React.ElementType;
} & Omit<FormControlProps, 'name'>;

const RichEditor = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
  disabled,
  as,
}: RichEditorProps<T>) => {
  const sanitizedControlId = name.replace(/\./g, '_');

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Form.Group as={as} controlId={sanitizedControlId}>
          {label && (
            <Form.Label>
              {label} {rules?.required && <span className="text-dark ml-1">*</span>}
            </Form.Label>
          )}
          <Editor
            apiKey={settings.tinymce.apiKey}
            init={{
              height: settings.tinymce.height,
              plugins: settings.tinymce.plugins,
              content_style: settings.tinymce.contentStyle,
              toolbar: settings.tinymce.toolbar
            }}
            value={field.value}
            disabled={disabled}
            onEditorChange={(value) => field.onChange(value)}
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

export default RichEditor;

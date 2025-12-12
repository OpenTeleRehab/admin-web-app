import { Button, Form, FormCheckProps } from 'react-bootstrap';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { BsUpload, BsX } from 'react-icons/bs';
import settings from '../../../settings';
import React from 'react';

type FileUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  label?: string;
} & Omit<FormCheckProps, 'name'>;

const FileUpload = <T extends FieldValues>({
  control,
  name,
  label,
  rules,
}: FileUploadProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <Form.Group>
            {field?.value && (
              <div className="mb-2 d-flex justify-content-start">
                <img
                  className="img-thumbnail"
                  src={
                    field.value?.id
                      ? `${process.env.REACT_APP_API_BASE_URL}/file/${field.value.id}`
                      : window.URL.createObjectURL(field.value)
                  }
                  alt=""
                  width="220"
                />
                <div className="ml-2">
                  <Button
                    aria-label="remove file"
                    variant="outline-danger"
                    className="remove-btn d-flex align-items-center justify-content-center"
                    onClick={() => field.onChange(null)}
                  >
                    <BsX size={16} />
                  </Button>
                </div>
              </div>
            )}
            <div className="btn btn-sm text-primary position-relative overflow-hidden" role="button">
              <BsUpload size={15}/> {label}
              <input
                className="position-absolute upload-btn"
                type="file"
                onChange={(event) => field.onChange(event.target.files?.[0])}
                accept={settings.question.acceptImageTypes}
                aria-label="Upload"
              />
            </div>
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

export default FileUpload;

import React, { useState } from 'react';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formatFileSize, toMB } from '../../../utils/file';
import settings from '../../../settings';
import { BsDownload } from 'react-icons/bs';
import { TEMPLATE_URL } from 'variables/diseases';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Dialog from '../../../components/Dialog';
import { uploadDiseases } from '../../../store/disease/actions';

const UploadDisease = ({ translate, handleCloseUploadDialog, showUploadDialog, setShowUploadDialog }) => {
  const dispatch = useDispatch();
  const { maxFileSize } = settings.educationMaterial;
  const [file, setFile] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFile(files[0]);
  };

  const renderUploadFileName = () => {
    if (file) {
      return `${file.name} (${formatFileSize(file.size)})`;
    }
    return translate('disease.bulk_upload.file.placeholder');
  };

  const handleUpload = () => {
    let canSave = true;

    if ((file === undefined || toMB(file.size) > maxFileSize)) {
      canSave = false;
      setFileError(true);
    } else {
      setFileError(false);
    }

    if (canSave) {
      setIsLoading(true);
      dispatch(uploadDiseases({
        file
      }))
        .then(result => {
          setIsLoading(false);
          setShowUploadDialog(false);
        });
    }
  };

  return (
    <Dialog
      show={showUploadDialog}
      title={translate('disease.upload')}
      onCancel={handleCloseUploadDialog}
      onConfirm={handleUpload}
      confirmLabel={translate('disease.upload')}
      size='lg'
    >
      <>
        { isLoading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>{translate('disease.bulk_upload.instruction')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Row>
                <Col sm={6} xl={5}>
                  <Form.File custom>
                    <Form.File.Input
                      name='file'
                      onChange={handleFileChange}
                      isInvalid={fileError}
                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      aria-label="File"
                    />
                    <Form.File.Label>{renderUploadFileName()}</Form.File.Label>
                    <Form.Control.Feedback type="invalid">
                      {file === undefined
                        ? translate('disease.bulk_upload.file.required')
                        : translate('disease.bulk_upload.file.max_size', { size: maxFileSize })
                      }
                    </Form.Control.Feedback>
                  </Form.File>
                </Col>
                <Col sm={6} xl={5}>
                  <Button
                    variant="link"
                    download
                    href={TEMPLATE_URL.DISEASE}
                  >
                    <BsDownload className="mr-3" size={30} />
                    {translate('disease.bulk_upload.download_template')}
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Col>
        </Row>
      </>
    </Dialog>
  );
};

UploadDisease.propTypes = {
  translate: PropTypes.func,
  handleCloseUploadDialog: PropTypes.func,
  showUploadDialog: PropTypes.bool,
  setShowUploadDialog: PropTypes.func
};

export default withLocalize(UploadDisease);

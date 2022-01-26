import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux/lib/index';

const ViewEducationMaterial = ({ showView, handleViewClose, id }) => {
  const { educationMaterials } = useSelector(state => state.educationMaterial);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [title, setTitle] = useState('');
  const [materialFile, setMaterialFile] = useState(undefined);

  useEffect(() => {
    if (id && educationMaterials.length) {
      const data = educationMaterials.find(educationMaterial => educationMaterial.id === id);
      setTitle(data.title);
      setMaterialFile(data.file);
    }
  }, [id, educationMaterials]);

  return (
    <Dialog
      show={showView}
      title={title}
      cancelLabel={translate('common.close')}
      onCancel={handleViewClose}
    >
      <Form>
        <Row>
          <Col sm={12} xl={12}>
            { materialFile ? (
              <div className = "exercise-media">
                { materialFile.fileType === 'audio/mpeg' &&
                <div className="img-thumbnail w-100 pt-2">
                  <audio controls className="w-100">
                    <source src={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`} type="audio/ogg" />
                  </audio>
                </div>
                }

                { (materialFile.fileType !== 'audio/mpeg' && materialFile.fileType !== 'video/mp4' && materialFile.fileType !== 'application/pdf') &&
                <img src={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`} alt="..." className="w-100 img-thumbnail"/>
                }

                { materialFile.fileType === 'video/mp4' &&
                <video className="w-100 img-thumbnail" controls>
                  <source src={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`} type="video/mp4" />
                </video>
                }

                { materialFile.fileType === 'application/pdf' &&
                <object
                  data={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`}
                  type="application/pdf"
                  width="480"
                  height="678"
                >
                  <iframe
                    src={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`}
                    width="480"
                    height="678"
                    title={materialFile.fileName}
                  >
                    <p>This browser does not support PDF!</p>
                  </iframe>
                </object>
                }

                <Form.Text className="text-muted">
                  {translate(materialFile.fileGroupType)}:
                  <a
                    href={`${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`}
                    /* eslint-disable-next-line react/jsx-no-target-blank */
                    target="_blank"
                    className="pl-2" rel="noreferrer"
                  >
                    {materialFile.fileName}
                  </a>
                </Form.Text>
              </div>
            ) : (
              <div>{translate('common.no_file_translate')}</div>
            )}
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};

ViewEducationMaterial.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  id: PropTypes.string
};

export default withLocalize(ViewEducationMaterial);

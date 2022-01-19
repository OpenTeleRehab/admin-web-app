import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  createPartnerLogo, getPartnerLogo,
  getStaticPages
} from 'store/staticPage/actions';
import { useDispatch, useSelector } from 'react-redux';

import BasicTable from 'components/Table/basic';
import { EditAction } from 'components/ActionIcons';
import { Button, Form } from 'react-bootstrap';
import { BsUpload, BsXCircle } from 'react-icons/bs';
import settings from '../../../settings';
import { toMB } from '../../../utils/file';
import _ from 'lodash';
import { USER_GROUPS } from '../../../variables/user';
import customColorScheme from '../../../utils/customColorScheme';

let timer = null;
const StaticPage = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { staticPages, filters, partnerLogoFile } = useSelector(state => state.staticPage);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [partnerLogo, setPartnerLogo] = useState(undefined);
  const { maxFileSize } = settings.educationMaterial;
  const [formFields, setFormFields] = useState({
    file: undefined
  });
  const [fileError, setFileError] = useState(false);
  const [pages, setPages] = useState(staticPages);
  const columns = [
    { name: 'title', title: translate('static_page.title') },
    { name: 'platform', title: translate('setting.translations.platform') },
    { name: 'action', title: translate('common.action') }
  ];

  useEffect(() => {
    if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }

    if (partnerLogoFile) {
      setPartnerLogo(partnerLogoFile);
    }
  }, [filters, profile, partnerLogoFile]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getStaticPages());
    }, 500);
  }, [language, dispatch]);

  useEffect(() => {
    dispatch(getPartnerLogo());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN) {
      setPages(_.filter(staticPages, (item) => { return item.url === 'about-us'; }));
    } else {
      setPages(staticPages);
    }
  }, [staticPages, profile]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormFields({ ...formFields, [name]: files[0] });

    const file = files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2);
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPartnerLogo({ url: reader.result, fileName, fileSize, fileType, file });
      };
    }
  };

  const handleFileRemove = (e) => {
    setPartnerLogo(null);
    setFormFields({ ...formFields, file: undefined });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.file !== undefined && toMB(formFields.file.size) > maxFileSize) {
      canSave = false;
      setFileError(true);
    } else {
      setFileError(false);
    }
    if (canSave) {
      dispatch(createPartnerLogo({ ...formFields }));
    }
  };

  return (
    <>
      <div className="mb-5">
        <Form.Group controlId="formFile">
          <Form.Label className="mb-3">{translate('static_page.partner_logo')}</Form.Label>
          <Form.Control.Feedback type="invalid">
            {formFields.file !== undefined
              ? translate('education_material.upload_file.max_size', { size: maxFileSize }) : ''
            }
          </Form.Control.Feedback>

          <div className="w-50">
            {!_.isEmpty(partnerLogo) && (
              <div className="exercise-media">
                <div className="mb-2 position-relative w-50">
                  <div className="position-absolute remove-btn-wrapper">
                    <BsXCircle size={20} onClick={handleFileRemove}/>
                  </div>
                  <img src={partnerLogo.url || `${process.env.REACT_APP_API_BASE_URL}/file/${partnerLogo.id}`} alt="..." className="w-100 img-thumbnail"/>
                </div>
              </div>
            )}
            <div className="btn bg-white btn-outline-primary text-primary position-relative overflow-hidden mr-3 mt-2 up-load-button-wrapper" role="button" tabIndex="0" onKeyPress={(event) => event.key === 'Enter' && document.getElementById('file').click()}>
              <BsUpload size={15}/> Upload Image
              <input type="file" id="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} accept="image/*" isInvalid={fileError} aria-label="Upload" />
            </div>
            <Button variant="primary" className="mt-2" disabled={!formFields.file} onClick={handleConfirm} tabIndex="0">
              {translate('common.save')}
            </Button>
          </div>
        </Form.Group>
      </div>
      <div className="card">
        <BasicTable
          rows={pages.map(staticPage => {
            const action = (
              <>
                <EditAction className="ml-1" onClick={() => handleRowEdit(staticPage.id)} />
              </>
            );

            return {
              title: staticPage.title,
              platform: staticPage.platform,
              action
            };
          })}
          columns={columns}
        />
      </div>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

StaticPage.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(StaticPage);

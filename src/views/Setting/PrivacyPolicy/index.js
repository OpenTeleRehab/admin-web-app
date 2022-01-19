import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Badge, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import _ from 'lodash';

import settings from 'settings';
import BasicTable from 'components/Table/basic';
import { DeleteAction, EditAction, PublishAction, ViewAction } from 'components/ActionIcons';
import {
  getPrivacyPolicies,
  getPrivacyPolicy,
  publishPrivacyPolicy
} from 'store/privacyPolicy/actions';
import { STATUS_VARIANTS, STATUSES } from 'variables/privacyPolicy';
import Dialog from 'components/Dialog';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import keycloak from '../../../utils/keycloak';
import customColorScheme from '../../../utils/customColorScheme';

const PrivacyPolicy = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { privacyPolicies, privacyPolicy } = useSelector(state => state.privacyPolicy);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector(state => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [privacyPolicyData, setPrivacyPolicyData] = useState([]);
  const [showPublishedDialog, setShowPublishedDialog] = useState(false);
  const [publishedId, setPublishedId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [language, setLanguage] = useState('');

  const columns = [
    { name: 'version', title: translate('privacy_policy.version') },
    { name: 'status', title: translate('common.status') },
    { name: 'published_date', title: translate('privacy_policy.published_date') },
    { name: 'action', title: translate('common.action') }
  ];

  useEffect(() => {
    if (languages.length) {
      if (viewId) {
        if (profile && profile.language_id) {
          setLanguage(profile.language_id);
        } else {
          setLanguage(languages[0].id);
        }
      }
    }
  }, [profile, languages, viewId]);

  useEffect(() => {
    if (viewId && language) {
      dispatch(getPrivacyPolicy(viewId, language));
    }
  }, [viewId, language, dispatch]);

  useEffect(() => {
    dispatch(getPrivacyPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN) {
      setPrivacyPolicyData(_.filter(privacyPolicies, (item) => { return item.status === STATUSES.PUBLISHED; }));
    } else {
      setPrivacyPolicyData(privacyPolicies);
    }
  }, [profile, privacyPolicies]);

  const handlePublish = (id) => {
    setPublishedId(id);
    setShowPublishedDialog(true);
  };

  const handlePublishedDialogConfirm = () => {
    dispatch(publishPrivacyPolicy(publishedId)).then(result => {
      if (result) {
        handlePublishedDialogClose();
      }
    });
  };

  const handlePublishedDialogClose = () => {
    setPublishedId(null);
    setShowPublishedDialog(false);
  };

  const handleViewContent = (id) => {
    setShowViewDialog(true);
    setViewId(id);
  };

  const handleViewContentClose = () => {
    setShowViewDialog(false);
    setLanguage('');
    setViewId(null);
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.lightInfo
      }
    })
  };

  return (
    <div className="card">
      <BasicTable
        rows={privacyPolicyData.map(privacyPolicy => {
          const publishedDate = privacyPolicy.published_date;
          const action = (
            <>
              <ViewAction onClick={() => handleViewContent(privacyPolicy.id)}/>
              { keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY) && (
                <>
                  <PublishAction className="ml-1" onClick={() => handlePublish(privacyPolicy.id)} disabled={publishedDate} />
                  <EditAction className="ml-1" onClick={() => handleRowEdit(privacyPolicy.id)} disabled={publishedDate} />
                  <DeleteAction className="ml-1" disabled />
                </>
              )}
            </>
          );
          const status = privacyPolicy.status && (
            <Badge pill variant={STATUS_VARIANTS[privacyPolicy.status]}>
              {translate('term_and_condition.status_' + privacyPolicy.status)}
            </Badge>
          );
          return {
            version: privacyPolicy.version,
            status: status,
            published_date: publishedDate ? moment(publishedDate).format(settings.date_format) : '',
            action
          };
        })}
        columns={columns}
      />

      <Dialog
        show={showPublishedDialog}
        title={translate('privacy_policy.publish_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handlePublishedDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handlePublishedDialogConfirm}
      >
        <p>{translate('privacy_policy.publish_confirmation_message')}</p>
      </Dialog>

      <Dialog
        show={showViewDialog}
        title={translate('privacy_policy.view_title')}
        cancelLabel={translate('common.close')}
        onCancel={handleViewContentClose}
      >
        <Form.Group controlId="formLanguage">
          <Form.Label>{translate('common.language')}</Form.Label>
          <Select
            placeholder={translate('placeholder.language')}
            classNamePrefix="filter"
            value={languages.filter(option => option.id === language)}
            getOptionLabel={option => option.name}
            options={languages}
            onChange={(e) => setLanguage(e.id)}
            styles={customSelectStyles}
            aria-label="Language"
          />
        </Form.Group>
        <div dangerouslySetInnerHTML={{ __html: privacyPolicy.content }} />
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

PrivacyPolicy.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(PrivacyPolicy);

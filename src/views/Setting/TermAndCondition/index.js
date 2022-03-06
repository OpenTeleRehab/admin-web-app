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
  getTermAndCondition,
  getTermAndConditions,
  publishTermAndCondition
} from 'store/termAndCondition/actions';
import { STATUS_VARIANTS, STATUSES } from 'variables/termAndCondition';
import Dialog from 'components/Dialog';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import keycloak from '../../../utils/keycloak';

const TermAndCondition = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { termAndConditions, termAndCondition } = useSelector(state => state.termAndCondition);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector(state => state.auth);

  const [termsConditionsData, setTermsConditionsData] = useState([]);
  const [showPublishedDialog, setShowPublishedDialog] = useState(false);
  const [publishedId, setPublishedId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [language, setLanguage] = useState('');

  const columns = [
    { name: 'version', title: translate('term_and_condition.version') },
    { name: 'status', title: translate('common.status') },
    { name: 'published_date', title: translate('term_and_condition.published_date') },
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
  }, [profile, viewId, languages]);

  useEffect(() => {
    if (viewId && language) {
      dispatch(getTermAndCondition(viewId, language));
    }
  }, [viewId, language, dispatch]);

  useEffect(() => {
    dispatch(getTermAndConditions());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN) {
      setTermsConditionsData(_.filter(termAndConditions, (item) => { return item.status === STATUSES.PUBLISHED; }));
    } else {
      setTermsConditionsData(termAndConditions);
    }
  }, [profile, termAndConditions]);

  const handlePublish = (id) => {
    setPublishedId(id);
    setShowPublishedDialog(true);
  };

  const handlePublishedDialogConfirm = () => {
    dispatch(publishTermAndCondition(publishedId)).then(result => {
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
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <div className="card">
      <BasicTable
        rows={termsConditionsData.map(term => {
          const publishedDate = term.published_date;
          const action = (
            <>
              <ViewAction onClick={() => handleViewContent(term.id)} />
              { keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION) && (
                <>
                  <PublishAction className="ml-1" onClick={() => handlePublish(term.id)} disabled={publishedDate} />
                  <EditAction className="ml-1" onClick={() => handleRowEdit(term.id)} disabled={publishedDate} />
                  <DeleteAction className="ml-1" disabled />
                </>
              )}
            </>
          );
          const status = term.status && (
            <Badge pill variant={STATUS_VARIANTS[term.status]}>
              {translate('term_and_condition.status_' + term.status)}
            </Badge>
          );
          return {
            version: term.version,
            status: status,
            published_date: publishedDate ? moment(publishedDate).format(settings.date_format) : '',
            action
          };
        })}
        columns={columns}
      />

      <Dialog
        show={showPublishedDialog}
        title={translate('term_and_condition.publish_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handlePublishedDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handlePublishedDialogConfirm}
      >
        <p>{translate('term_and_condition.publish_confirmation_message')}</p>
      </Dialog>

      <Dialog
        show={showViewDialog}
        title={translate('term_and_condition.view_title')}
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
        <div dangerouslySetInnerHTML={{ __html: termAndCondition.content }} />
      </Dialog>
    </div>
  );
};

TermAndCondition.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(TermAndCondition);

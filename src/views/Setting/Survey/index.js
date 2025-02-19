import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Badge } from 'react-bootstrap';
import BasicTable from 'components/Table/basic';
import { EditAction, PublishAction, ViewAction } from 'components/ActionIcons';
import {
  publishSurvey,
  getSurveys
} from '../../../store/survey/actions';
import Dialog from 'components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import { getOrganizationNames } from 'utils/organization';
import { getCountryNames, getLocations } from 'utils/country';
import { getClinicNames } from 'utils/clinic';
import { SURVEY_LOCATION } from 'variables/survey';
import keycloak from '../../../utils/keycloak';
import { USER_ROLES } from '../../../variables/user';
import { STATUS_VARIANTS } from 'variables/privacyPolicy';
import settings from 'settings';
import _ from 'lodash';
import moment from 'moment';
import ViewSurvey from './viewSurvey';

const Survey = ({ translate, handleRowEdit }) => {
  const { surveys } = useSelector((state) => state.survey);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const organizations = useSelector((state) => state.organization.organizations);
  const [showPublishedDialog, setShowPublishedDialog] = useState(false);
  const [publishedId, setPublishedId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [survey, setSurvey] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSurveys());
  }, [dispatch]);

  const handlePublish = (id) => {
    setPublishedId(id);
    setShowPublishedDialog(true);
  };

  const handlePublishedDialogConfirm = () => {
    dispatch(publishSurvey(publishedId)).then(result => {
      if (result) {
        handlePublishedDialogClose();
      }
    });
  };

  const handlePublishedDialogClose = () => {
    setPublishedId(null);
    setShowPublishedDialog(false);
  };

  const handleViewSurvey = (survey) => {
    setShowViewDialog(true);
    setSurvey(survey);
  };

  const handleCloseViewSurvey = () => {
    setShowViewDialog(false);
  };

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'organization', title: translate('setting.organization') },
    { name: 'role', title: translate('survey.role') },
    { name: 'country', title: translate('common.country') },
    { name: 'clinic', title: translate('common.clinic') },
    { name: 'location', title: translate('survey.location') },
    { name: 'frequency', title: translate('survey.frequency') },
    { name: 'status', title: translate('common.status') },
    { name: 'published_date', title: translate('survey.published_date') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      {surveys && (
        <BasicTable
          rows={surveys.map((item, index) => {
            const action = (
              <>
                <ViewAction onClick={() => handleViewSurvey(item)}/>
                { keycloak.hasRealmRole(USER_ROLES.MANAGE_SURVEY) && (
                  <>
                    {!item.published_date && (
                      <EditAction onClick={() => handleRowEdit(item.id)} />
                    )}
                    <PublishAction className="ml-1" onClick={() => handlePublish(item.id)} disabled={item.published_date} />
                  </>
                )}
              </>
            );
            const status = item.status && (
              <Badge pill variant={STATUS_VARIANTS[item.status]}>
                {translate('term_and_condition.status_' + item.status)}
              </Badge>
            );
            return {
              id: index + 1,
              organization: getOrganizationNames(item.organization, organizations),
              role: translate(`common.${item.role}`),
              country: getCountryNames(item.country, countries),
              clinic: getClinicNames(item.clinic, clinics),
              location: getLocations(item.location, SURVEY_LOCATION, translate),
              frequency: item.frequency,
              status: status,
              published_date: item.published_date ? moment(item.published_date).format(settings.date_format) : '',
              action
            };
          })}
          columns={columns}
        />
      )}
      <Dialog
        show={showPublishedDialog}
        title={translate('survey.publish_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handlePublishedDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handlePublishedDialogConfirm}
      >
        <p>{translate('survey.publish_confirmation_message')}</p>
      </Dialog>
      {showViewDialog && <ViewSurvey survey={survey} show={showViewDialog} handleClose={handleCloseViewSurvey}/>}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

Survey.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Survey);

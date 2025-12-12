import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Badge } from 'react-bootstrap';
import BasicTable from '../../../components/Table/basic';
import { EditAction, PublishAction, ViewAction } from '../../../components/ActionIcons';
import Dialog from '../../../components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import ViewScreeningQuestionnaire from './view';
import { getScreeningQuestionnaires, publishScreeningQuestionnaire } from '../../../store/screeningQuestionnaire/actions';
import { USER_ROLES } from '../../../variables/user';
import { STATUS_VARIANTS } from '../../../variables/privacyPolicy';
import keycloak from '../../../utils/keycloak';
import settings from '../../../settings';
import _ from 'lodash';

const ScreeningQuestionnaire = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { screeningQuestionnaires } = useSelector((state) => state.screeningQuestionnaire);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [showPublishedDialog, setShowPublishedDialog] = useState(false);
  const [publishedId, setPublishedId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [screeningQuestionnaire, setScreeningQuestionnaire] = useState();

  useEffect(() => {
    dispatch(getScreeningQuestionnaires());
  }, [dispatch]);

  const handlePublish = (id) => {
    setPublishedId(id);
    setShowPublishedDialog(true);
  };

  const handlePublishedDialogConfirm = () => {
    dispatch(publishScreeningQuestionnaire(publishedId)).then(result => {
      if (result) {
        handlePublishedDialogClose();
      }
    });
  };

  const handlePublishedDialogClose = () => {
    setPublishedId(null);
    setShowPublishedDialog(false);
  };

  const handleViewScreeningQuestionnaire = (screeningQuestionnaire) => {
    setShowViewDialog(true);
    setScreeningQuestionnaire(screeningQuestionnaire);
  };

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'title', title: translate('screening_questionnaire.title') },
    { name: 'total_question', title: translate('screening_questionnaire.number_of_question') },
    { name: 'status', title: translate('common.status') },
    { name: 'published_date', title: translate('screening_questionnaire.published_date') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      {screeningQuestionnaires && (
        <BasicTable
          rows={screeningQuestionnaires.map((item, index) => {
            const action = (
              <>
                <ViewAction onClick={() => handleViewScreeningQuestionnaire(item)} />
                {keycloak.hasRealmRole(USER_ROLES.MANAGE_SCREENING_QUESTIONNAIRE) && (
                  <>
                    {item.published_date && (
                      <EditAction onClick={() => handleRowEdit(item.id)} />
                    )}
                    <PublishAction
                      className="ml-1"
                      onClick={() => handlePublish(item.id)} disabled={item.published_date}
                    />
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
              title: item.title,
              total_question: item.total_question,
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
        title={translate('screening_questionnaire.publish_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handlePublishedDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handlePublishedDialogConfirm}
      >
        <p>{translate('screening_questionnaire.publish_confirmation_message')}</p>
      </Dialog>
      <ViewScreeningQuestionnaire
        id={screeningQuestionnaire?.id}
        show={showViewDialog}
        handleClose={() => setShowViewDialog(false)}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

ScreeningQuestionnaire.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func,
};

export default withLocalize(ScreeningQuestionnaire);

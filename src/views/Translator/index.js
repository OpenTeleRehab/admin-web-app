import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteTranslator,
  resendEmail, updateTranslatorStatus
} from 'store/translator/actions';
import settings from 'settings';
import * as moment from 'moment';
import useDialog from 'components/V2/Dialog';

import CustomTable from 'components/Table';
import EnabledStatus from 'components/EnabledStatus';
import { DeleteAction, EditAction, EnabledAction, DisabledAction, MailSendAction } from 'components/ActionIcons';
import { useTranslate } from 'hooks/useTranslate';
import { Button } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import Dialog from '../../components/Dialog';
import CreateOrEditTranslator from './_Partials/createOrEdit';
import { useList } from 'hooks/useList';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';

const Translator = () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const invalidate = useInvalidate();
  const { profile } = useSelector((state) => state.auth);
  const { openDialog } = useDialog();

  const columns = [
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'email', title: translate('common.email') },
    {
      name: 'edit_languages',
      title: translate('translator.edit_languages'),
      getCellValue: (row) => (row.edit_languages ?? []).map(lang => lang.name).join(' / ')
    },
    { name: 'status', title: translate('common.status') },
    { name: 'last_login', title: translate('common.last_login') },
    { name: 'action', title: translate('common.action') }
  ];
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSwitchStatusDialog, setShowSwitchStatusDialog] = useState(false);
  const [formFields, setFormFields] = useState({
    enabled: 0
  });
  const [id, setId] = useState(null);
  const { data: translators } = useList(END_POINTS.TRANSLATOR, {
    search_value: searchValue,
    filters: filters,
    page_size: pageSize,
    page: currentPage + 1
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'last_login', wordWrapEnabled: true, width: 250 }
  ];

  const handleSendMail = (id) => {
    dispatch(resendEmail(id));
  };

  const handleCreate = () => {
    openDialog({
      title: translate('translator.new'),
      content: <CreateOrEditTranslator />
    });
  };

  const handleEdit = (translator) => {
    openDialog({
      title: translate('translator.edit'),
      content: <CreateOrEditTranslator translator={translator} />
    });
  };

  const handleDelete = (id) => {
    setId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteTranslator(id)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  const handleSwitchStatus = (id, enabled) => {
    setId(id);
    setFormFields({ ...formFields, enabled: enabled });
    setShowSwitchStatusDialog(true);
  };

  const handleSwitchStatusDialogClose = () => {
    setId(null);
    setShowSwitchStatusDialog(false);
  };

  const handleSwitchStatusDialogConfirm = () => {
    dispatch(updateTranslatorStatus(id, formFields)).then(result => {
      if (result) {
        invalidate(END_POINTS.TRANSLATOR);
        handleSwitchStatusDialogClose();
      }
    });
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1>{translate('translator.management')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleCreate}>
            <BsPlus size={20} className="mr-1" />
            {translate('translator.new')}
          </Button>
        </div>
      </div>
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={translators?.info?.total_count ?? 0}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        rows={(translators?.data ?? []).map(translator => {
          const action = (
            <>
              {translator.enabled
                ? <EnabledAction onClick={() => handleSwitchStatus(translator.id, 0)} disabled={parseInt(translator.id) === parseInt(profile.id)}/>
                : <DisabledAction onClick={() => handleSwitchStatus(translator.id, 1)} disabled={parseInt(translator.id) === parseInt(profile.id)} />
              }
              <EditAction onClick={() => handleEdit(translator)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(translator.id)} disabled={parseInt(translator.id) === parseInt(profile.id) || translator.enabled} />
              <MailSendAction onClick={() => handleSendMail(translator.id)} disabled={translator.last_login} />
            </>
          );

          return {
            last_name: translator.last_name,
            first_name: translator.first_name,
            email: translator.email,
            status: <EnabledStatus enabled={!!translator.enabled} />,
            edit_languages: translator.edit_languages,
            last_login: translator.last_login ? moment.utc(translator.last_login).local().format(settings.datetime_format) : '',
            action
          };
        })}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('translator.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      <Dialog
        show={showSwitchStatusDialog}
        title={translate('translator.switchStatus_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchStatusDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchStatusDialogConfirm}
      >
        <div>
          <p>{translate('common.switchStatus_confirmation_message')}</p>
        </div>
      </Dialog>
    </div>
  );
};

export default Translator;

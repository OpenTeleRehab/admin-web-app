import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import {
  deleteAssistiveTechnology,
  getAssistiveTechnologies
} from '../../../store/assistiveTechnology/actions';
import Dialog from 'components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const AssistiveTechnology = ({ translate, handleRowEdit }) => {
  const { assistiveTechnologies } = useSelector((state) => state.assistiveTechnology);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [deleteId, setDeleteId] = useState('');
  const [isUsed, setIsUsed] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAssistiveTechnologies());
  }, [dispatch]);

  const handleDelete = (id, isUsed) => {
    setDeleteId(id);
    setIsUsed(isUsed);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteAssistiveTechnology(deleteId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'code', title: translate('common.code') },
    { name: 'name', title: translate('common.name') },
    { name: 'description', title: translate('common.description') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      {assistiveTechnologies && (
        <BasicTable
          rows={assistiveTechnologies.map((item, index) => {
            const action = (
              <>
                <EditAction onClick={() => handleRowEdit(item.id)} />
                <DeleteAction className="ml-1" onClick={() => handleDelete(item.id, item.isUsed)} />
              </>
            );
            return {
              id: index + 1,
              code: item.code,
              name: item.name,
              description: item.description,
              action
            };
          })}
          columns={columns}
        />
      )}
      <Dialog
        show={showDeleteDialog}
        title={translate('assistive_technology.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{isUsed ? translate('assistive_technology.delete_used_assistive_confirmation_message') : translate('common.delete_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

AssistiveTechnology.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(AssistiveTechnology);

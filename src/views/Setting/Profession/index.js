import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { deleteProfession } from 'store/profession/actions';
import Dialog from 'components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const Profession = ({ translate, handleRowEdit }) => {
  const professions = useSelector((state) => state.profession.professions);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [deleteId, setDeleteId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteProfession(deleteId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      <BasicTable
        rows={professions.map(profession => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(profession.id)}/>
              <DeleteAction className="ml-1" onClick={() => handleDelete(profession.id)} disabled={profession.isUsed}/>
            </>
          );
          return {
            id: profession.id,
            name: profession.name,
            action
          };
        })}
        columns={columns}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('profession.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

Profession.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Profession);

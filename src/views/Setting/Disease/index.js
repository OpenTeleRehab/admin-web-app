import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { deleteDisease, getDiseases } from 'store/disease/actions';
import Dialog from 'components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const Disease = ({ translate, handleRowEdit }) => {
  const diseases = useSelector((state) => state.disease.diseases);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [deleteId, setDeleteId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDiseases());
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteDisease(deleteId)).then(result => {
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
        rows={diseases.map((disease, index) => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(disease.id)}/>
              <DeleteAction className="ml-1" onClick={() => handleDelete(disease.id)} disabled={disease.isUsed}/>
            </>
          );
          return {
            id: index + 1,
            name: disease.name,
            action
          };
        })}
        columns={columns}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('disease.delete_confirmation_title')}
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

Disease.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Disease);

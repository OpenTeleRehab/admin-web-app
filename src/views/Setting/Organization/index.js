import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import BasicTable from 'components/Table/basic';
import { EditAction } from 'components/ActionIcons';
import Dialog from 'components/Dialog';
import { deleteOrganization, getOrganizations } from 'store/organization/actions';
import { renderStatusBadge } from '../../../utils/organization';

const Organization = ({ translate, handleRowEdit }) => {
  const { organizations } = useSelector((state) => state.organization);
  const [deleteId, setDeleteId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteOrganization(deleteId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'admin_email', title: translate('organization.admin_email') },
    { name: 'max_number_of_therapist', title: translate('organization.max_number_of_therapist') },
    { name: 'max_ongoing_treatment_plan', title: translate('organization.max_ongoing_treatment_plan') },
    { name: 'status', title: translate('common.status') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      <BasicTable
        rows={organizations.map((organization, index) => {
          const action = (
            <EditAction onClick={() => handleRowEdit(organization.id)}/>
          );
          return {
            id: index + 1,
            name: organization.name,
            admin_email: organization.admin_email,
            max_number_of_therapist: organization.max_number_of_therapist,
            max_ongoing_treatment_plan: organization.max_ongoing_treatment_plan,
            status: renderStatusBadge(organization.status),
            action
          };
        })}
        columns={columns}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('organization.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
    </div>
  );
};

Organization.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Organization);

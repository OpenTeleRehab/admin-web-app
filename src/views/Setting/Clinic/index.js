import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { getCountryISO } from 'utils/country';
import Dialog from 'components/Dialog';
import { deleteClinic } from 'store/clinic/actions';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const Clinic = ({ translate, handleRowEdit }) => {
  const clinics = useSelector(state => state.clinic.clinics);
  const countries = useSelector(state => state.country.countries);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const dispatch = useDispatch();

  const [editId, setEditId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'country_iso', title: translate('common.country.iso_code') },
    { name: 'region', title: translate('common.region.state') },
    { name: 'province', title: translate('common.province') },
    { name: 'city', title: translate('common.city') },
    { name: 'therapist_limit', title: translate('common.therapist_limit') },
    { name: 'action', title: translate('common.action') }
  ]);

  const handleDelete = (id) => {
    setEditId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setEditId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteClinic(editId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return (
    <div className="card">
      <BasicTable
        rows={clinics.map(clinic => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(clinic.id)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(clinic.id)} />
            </>
          );
          return {
            id: clinic.identity,
            name: clinic.name,
            country_iso: getCountryISO(clinic.country_id, countries),
            region: clinic.region?.name,
            province: clinic.province?.name,
            city: clinic.city,
            therapist_limit: clinic.therapist_limit,
            action
          };
        })}
        columns={columns}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('clinic.delete_confirmation_title')}
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

Clinic.propTypes = {
  handleRowEdit: PropTypes.func,
  translate: PropTypes.func
};

export default withLocalize(Clinic);

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
import useDialog from 'components/V2/Dialog';
import { useAlertDialog } from 'components/V2/AlertDialog';
import DeleteClinicConfirmation from './Partial/deleteConfirmation';

const Clinic = ({ translate, handleRowEdit }) => {
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const clinics = useSelector(state => state.clinic.clinics);
  const countries = useSelector(state => state.country.countries);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const dispatch = useDispatch();

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'country_iso', title: translate('common.country.iso_code') },
    { name: 'province', title: translate('common.province') },
    { name: 'therapist_limit', title: translate('common.therapist_limit') },
    { name: 'action', title: translate('common.action') }
  ]);

  const handleDelete = (id) => {
    showAlert({
      title: translate('clinic.delete_confirmation_title'),
      message: translate('common.delete_confirmation_message'),
      closeOnConfirm: false,
      onConfirm: () => {
        openDialog({
          title: translate('clinic.delete_confirmation_title'),
          content: (
            <DeleteClinicConfirmation
              clinicId={id}
              onConfirm={() => {
                dispatch(deleteClinic(id)).then((result) => {
                  if (result) {
                    closeDialog();
                    closeDialog();
                  }
                });
              }}
            />
          ),
          props: { size: 'lg' }
        });
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
            province: clinic.province?.name,
            therapist_limit: clinic.therapist_limit,
            action
          };
        })}
        columns={columns}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

Clinic.propTypes = {
  handleRowEdit: PropTypes.func,
  translate: PropTypes.func
};

export default withLocalize(Clinic);

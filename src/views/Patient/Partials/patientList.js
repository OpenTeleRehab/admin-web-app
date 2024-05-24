import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import { getCountryName } from 'utils/country';
import { getClinicName, getClinicRegion } from 'utils/clinic';
import AgeCalculation from 'utils/age';
import { deleteGlobalPatient, getGlobalPatients } from 'store/globalPatient/actions';
import { renderStatusBadge } from 'utils/treatmentPlan';
import { USER_GROUPS } from 'variables/user';
import * as ROUTES from 'variables/routes';
import { useHistory } from 'react-router-dom';
import { DeleteAction, ViewAction } from '../../../components/ActionIcons';
import customColorScheme from '../../../utils/customColorScheme';
import Dialog from '../../../components/Dialog';
import _ from 'lodash';

const PatientList = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const patients = useSelector(state => state.patient.patients);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector(state => state.auth);

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'gender', title: translate('gender') },
    { name: 'age', title: translate('common.age') },
    { name: 'region', title: translate('common.region') },
    { name: 'treatment_status', title: translate('common.ongoing_treatment_status') }
  ];

  const columnExtensions = [
    { columnName: 'id', wordWrapEnabled: true },
    { columnName: 'treatment_plan', wordWrapEnabled: true },
    { columnName: 'treatment_status', wordWrapEnabled: true }
  ];

  if ([USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN].includes(profile.type)) {
    columns.splice(2, 0, { name: 'country', title: translate('common.country') });
  }

  if (profile.type !== USER_GROUPS.CLINIC_ADMIN) {
    columns.splice(3, 0, { name: 'clinic', title: translate('common.clinic') });
  }

  if ([USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.CLINIC_ADMIN].includes(profile.type)) {
    columns.push({ name: 'action', title: translate('common.action') });
  }

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editId, setEditId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderBy] = useState('identity');

  useEffect(() => {
    if (profile) {
      dispatch(getGlobalPatients({
        page_size: pageSize,
        page: currentPage + 1,
        search_value: searchValue,
        order_by: orderBy,
        type: profile.type,
        country: profile.type === USER_GROUPS.CLINIC_ADMIN || profile.type === USER_GROUPS.COUNTRY_ADMIN ? profile.country_id : '',
        clinic: profile.type === USER_GROUPS.CLINIC_ADMIN ? profile.clinic_id : '',
        filters
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }
  }, [profile, currentPage, pageSize, dispatch, filters, searchValue, orderBy]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', row.id).replace(':countryId', row.country_id));
  };

  const handleDelete = (id) => {
    setEditId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setEditId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteGlobalPatient(editId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return (
    <div className="mt-4">
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        hover="hover-primary"
        rows={patients.map(patient => {
          const action = (
            <>
              <ViewAction className="ml-1" onClick={() => handleRowClick(patient)} />

              {[USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.CLINIC_ADMIN].includes(profile.type) && (
                <DeleteAction className="ml-1" onClick={() => handleDelete(patient.patient_id)} />
              )}
            </>
          );

          return {
            id: patient.patient_id,
            country_id: patient.country_id,
            identity: patient.identity,
            email: patient.email,
            gender: translate(`common.${patient.gender}`),
            age: patient.date_of_birth !== null ? AgeCalculation(patient.date_of_birth, translate) : '',
            country: getCountryName(patient.country_id, countries),
            clinic: getClinicName(patient.clinic_id, clinics),
            region: getClinicRegion(patient.clinic_id, clinics),
            treatment_status: renderStatusBadge(patient.ongoingTreatmentPlan.length ? patient.ongoingTreatmentPlan[0] : patient.lastTreatmentPlan),
            action
          };
        })}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('patient.delete_confirmation_title')}
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

PatientList.propTypes = {
  translate: PropTypes.func
};

export default PatientList;

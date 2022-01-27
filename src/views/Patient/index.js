import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import { getCountryName } from 'utils/country';
import { getClinicName, getClinicRegion } from 'utils/clinic';
import AgeCalculation from 'utils/age';
import { getGlobalPatients } from 'store/globalPatient/actions';
import { renderStatusBadge } from 'utils/treatmentPlan';
import { USER_GROUPS } from 'variables/user';
import * as ROUTES from 'variables/routes';
import { useHistory } from 'react-router-dom';

const Patient = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const patients = useSelector(state => state.patient.patients);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'age', title: translate('common.age') },
    { name: 'country', title: translate('common.country') },
    { name: 'clinic', title: translate('common.clinic') },
    { name: 'region', title: translate('common.region') },
    { name: 'treatment_status', title: translate('common.ongoing_treatment_status') }
  ];

  const columnExtensions = [
    { columnName: 'id', wordWrapEnabled: true },
    { columnName: 'treatment_plan', wordWrapEnabled: true },
    { columnName: 'treatment_status', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy] = useState('identity');

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    dispatch(getGlobalPatients({
      page_size: pageSize,
      page: currentPage + 1,
      search_value: searchValue,
      order_by: orderBy,
      type: USER_GROUPS.ORGANIZATION_ADMIN,
      filters
    })).then(result => {
      if (result) {
        setTotalCount(result.total_count);
      }
    });
  }, [currentPage, pageSize, dispatch, filters, searchValue, orderBy]);

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', row.id).replace(':countryId', row.country_id));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.list')}</h1>
      </div>
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
        onRowClick={handleRowClick}
        hover="hover-primary"
        rows={patients.map(patient => {
          return {
            id: patient.patient_id,
            country_id: patient.country_id,
            identity: patient.identity,
            email: patient.email,
            age: patient.date_of_birth !== null ? AgeCalculation(patient.date_of_birth, translate) : '',
            country: getCountryName(patient.country_id, countries),
            clinic: getClinicName(patient.clinic_id, clinics),
            region: getClinicRegion(patient.clinic_id, clinics),
            treatment_status: renderStatusBadge(patient.ongoingTreatmentPlan.length ? patient.ongoingTreatmentPlan[0] : patient.lastTreatmentPlan)
          };
        })}
      />
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;

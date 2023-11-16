import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import AgeCalculation from 'utils/age';
import customColorScheme from 'utils/customColorScheme';
import _ from 'lodash';
import {
  getAssistiveTechnologies,
  getAssistiveTechnologyPatients
} from 'store/assistiveTechnology/actions';
import { getAssistiveTechnologyName } from 'utils/assistiveTechnology';
import moment from 'moment/moment';
import settings from '../../settings';
import { USER_GROUPS } from '../../variables/user';
import { getCountryName } from '../../utils/country';
import { getClinicName } from '../../utils/clinic';

const AssistiveTechnologyPatient = ({ translate }) => {
  const dispatch = useDispatch();
  const { assistiveTechnologyPatients } = useSelector(state => state.assistiveTechnology);
  const { assistiveTechnologies } = useSelector((state) => state.assistiveTechnology);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector(state => state.auth);
  const { countries } = useSelector(state => state.country);
  const { clinics } = useSelector(state => state.clinic);
  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'gender', title: translate('gender') },
    { name: 'age', title: translate('common.age') },
    { name: 'assistive_technology', title: translate('assistive_patient.assistive_technology') },
    { name: 'provision_date', title: translate('assistive_patient.provision_date') }
  ];

  if (profile.type === USER_GROUPS.ORGANIZATION_ADMIN || profile.type === USER_GROUPS.SUPER_ADMIN) {
    columns.splice(3, 0, { name: 'country', title: translate('common.country') });
  }

  if (profile.type === USER_GROUPS.COUNTRY_ADMIN) {
    columns.splice(3, 0, { name: 'clinic', title: translate('common.clinic') });
  }

  const columnExtensions = [
    { columnName: 'identity', wordWrapEnabled: true },
    { columnName: 'assistive_technology', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy] = useState('identity');

  useEffect(() => {
    if (profile) {
      dispatch(getAssistiveTechnologyPatients({
        page_size: pageSize,
        page: currentPage + 1,
        search_value: searchValue,
        order_by: orderBy,
        type: profile.type,
        country: USER_GROUPS.CLINIC_ADMIN || profile.type === USER_GROUPS.COUNTRY_ADMIN ? profile.country_id : '',
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
    dispatch(getAssistiveTechnologies());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  return (
    <div className="mt-4">
      <div className="mb-5">
        <h1>{translate('assistive_patient.list.title')}</h1>
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
        hover="hover-primary"
        showTotalPatient={true}
        rows={assistiveTechnologyPatients.map(assistive => {
          return {
            identity: assistive.identity,
            gender: translate('common.' + assistive.gender),
            age: assistive.date_of_birth !== null ? AgeCalculation(assistive.date_of_birth, translate) : '',
            country: getCountryName(assistive.country_id, countries),
            clinic: getClinicName(assistive.clinic_id, clinics),
            assistive_technology: getAssistiveTechnologyName(assistive.assistive_technology_id, assistiveTechnologies),
            provision_date: moment(assistive.provision_date, 'YYYY-MM-DD HH:mm:ss').format(settings.date_format)
          };
        })}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

AssistiveTechnologyPatient.propTypes = {
  translate: PropTypes.func
};

export default AssistiveTechnologyPatient;

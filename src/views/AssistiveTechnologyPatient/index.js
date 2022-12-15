import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import AgeCalculation from 'utils/age';
import { USER_GROUPS } from 'variables/user';
import customColorScheme from 'utils/customColorScheme';
import _ from 'lodash';
import {
  getAssistiveTechnologies,
  getAssistiveTechnologyPatients
} from 'store/assistiveTechnology/actions';
import { getAssistiveTechnologyName } from 'utils/assistiveTechnology';
import moment from 'moment/moment';
import settings from '../../settings';

const AssistiveTechnologyPatient = ({ translate }) => {
  const dispatch = useDispatch();
  const { assistiveTechnologyPatients } = useSelector(state => state.assistiveTechnology);
  const { assistiveTechnologies } = useSelector((state) => state.assistiveTechnology);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { profile } = useSelector(state => state.auth);

  const columns = [
    { name: 'identity', title: translate('common.id') },
    { name: 'gender', title: translate('gender') },
    { name: 'age', title: translate('common.age') },
    { name: 'assistive_technology', title: translate('assistive_patient.assistive_technology') },
    { name: 'provision_date', title: translate('assistive_patient.provision_date') }
  ];

  const columnExtensions = [
    { columnName: 'identity', wordWrapEnabled: true },
    { columnName: 'assistive_technology', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [country, setCountry] = useState('');
  const [clinic, setClinic] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filters, setFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy] = useState('identity');

  useEffect(() => {
    dispatch(getAssistiveTechnologies());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setCountry(profile.country_id);
      setClinic(profile.type === USER_GROUPS.CLINIC_ADMIN ? profile.clinic_id : '');
    }
  }, [profile]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    dispatch(getAssistiveTechnologyPatients({
      page_size: pageSize,
      page: currentPage + 1,
      search_value: searchValue,
      from_date: fromDate,
      to_date: toDate,
      country,
      clinic,
      order_by: orderBy,
      type: profile.type,
      filters
    })).then(result => {
      if (result) {
        setTotalCount(result.total_count);
      }
    });
  }, [currentPage, pageSize, dispatch, filters, searchValue, orderBy, fromDate, toDate, country, profile, clinic]);

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
        setCountry={setCountry}
        country={country}
        setFromDate={setFromDate}
        fromDate={fromDate}
        setToDate={setToDate}
        toDate={toDate}
        setFilters={setFilters}
        filters={filters}
        clinic={clinic}
        setClinic={setClinic}
        columns={columns}
        columnExtensions={columnExtensions}
        hover="hover-primary"
        showClinicFilter={profile.type === USER_GROUPS.COUNTRY_ADMIN}
        showDateFilter={true}
        showTotalPatient={true}
        rows={assistiveTechnologyPatients.map(assistive => {
          return {
            identity: assistive.identity,
            gender: translate('common.' + assistive.gender),
            age: assistive.date_of_birth !== null ? AgeCalculation(assistive.date_of_birth, translate) : '',
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

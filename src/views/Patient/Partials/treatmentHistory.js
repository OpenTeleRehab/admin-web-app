import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import { Button } from 'react-bootstrap/esm/index';
import CustomTable from 'components/Table';
import { getTreatmentPlans } from 'store/treatmentPlan/actions';
import * as ROUTES from 'variables/routes';
import { renderStatusBadge } from 'utils/treatmentPlan';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const TreatmentHistory = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const history = useHistory();
  const { patientId, countryId } = useParams();
  const { treatmentPlans } = useSelector(state => state.treatmentPlan);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { countries } = useSelector((state) => state.country);

  const columns = [
    { name: 'name', title: translate('common.treatment_name') },
    { name: 'treatment_status', title: translate('common.status') },
    { name: 'start_date', title: translate('common.start_date') },
    { name: 'end_date', title: translate('common.end_date') }
  ];
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const columnExtensions = [
    { columnName: 'name', wordWrapEnabled: true }
  ];

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (patientId && countries.length) {
      dispatch(getTreatmentPlans({
        country_id: countryId,
        patient_id: patientId,
        search_value: searchValue,
        filters: filters,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }
  }, [dispatch, currentPage, pageSize, searchValue, filters, countryId, patientId, countries]);

  const handleRowClick = (row) => {
    history.push(ROUTES.VIEW_TREATMENT_PLAN_DETAIL.replace(':patientId', patientId).replace(':countryId', countryId).replace(':id', row.id));
  };

  return (
    <>
      <div className="mt-4 d-flex">
        <h5>
          {translate('treatment_plan.treatment_history')}
        </h5>
        <Button
          className="ml-auto"
          variant="outline-primary"
          as={Link}
          to={ROUTES.PATIENT}
        >
          &lt; {translate('patient.back_to_list')}
        </Button>
      </div>
      <div className="mt-3">
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
          rows={treatmentPlans.map(treatmentPlan => {
            return {
              id: treatmentPlan.id,
              name: treatmentPlan.name,
              treatment_status: renderStatusBadge(treatmentPlan),
              start_date: treatmentPlan.start_date,
              end_date: treatmentPlan.end_date
            };
          })}
        />
      </div>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default TreatmentHistory;

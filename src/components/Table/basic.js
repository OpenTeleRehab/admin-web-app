import React, { useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFixedColumns,
  TableFilterRow,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
  SearchPanel
} from '@devexpress/dx-react-grid-bootstrap4';
import {
  SearchState,
  FilteringState,
  PagingState
} from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import SearchInput from 'components/Table/SearchPanel/Input';
import Toolbar from 'components/Table/Toolbar';
import FilterToggle from 'components/Table/FilterToggle';
import ToggleButton from 'components/Table/ColumnChooser/ToggleButton';
import FilterCells from 'components/Table/FilterCells';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

const FilterRow = (props) => <Table.Row className="filter" {...props} />;

const BasicTable = ({ rows, columns, pageSize, setPageSize, currentPage, setCurrentPage, totalCount, setSearchValue, setFilters = (filters) => {}, filters = [], showPagination = false, showSearch = false, showColumnChooser = false, showFilter = false }) => {
  const pageSizes = [60, 120, 180, 240];
  const [showToggleFilter, setShowToggleFilter] = useState(false);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const tableColumnVisibilityColumnExtensions = [{ columnName: 'action', togglingEnabled: false }];

  const handlePageSizeChange = value => {
    setCurrentPage(0);
    setPageSize(value);
  };

  const toggleFilter = () => {
    if (filters && filters.length) {
      setFilters([]);
    }
    setShowToggleFilter(!showToggleFilter);
  };

  return (
    <Grid
      rows={rows}
      columns={columns}>
      <SearchState onValueChange={setSearchValue} />
      <FilteringState filters={filters} defaultFilters={[]} onFiltersChange={setFilters} />
      <PagingState
        currentPage={currentPage}
        onCurrentPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
      <Table columnExtensions={[{ columnName: 'action', align: 'center', width: 120 }]} />
      <TableHeaderRow />
      {showToggleFilter && <TableFilterRow rowComponent={FilterRow} cellComponent={FilterCells} messages={{ filterPlaceholder: translate('common.search.placeholder') }} />}
      <TableColumnVisibility columnExtensions={tableColumnVisibilityColumnExtensions} />
      <TableFixedColumns rightColumns={['action']} />
      {showSearch && <Toolbar /> }
      {showSearch && <SearchPanel inputComponent={SearchInput} /> }
      {showFilter && <FilterToggle onToggle={toggleFilter} showFilter={showToggleFilter} /> }
      {showColumnChooser && <ColumnChooser toggleButtonComponent={ToggleButton} /> }
      {showPagination && <PagingPanel pageSizes={pageSizes} /> }
    </Grid>
  );
};

BasicTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  totalCount: PropTypes.number,
  setSearchValue: PropTypes.func,
  setFilters: PropTypes.func,
  filters: PropTypes.array,
  showPagination: PropTypes.bool,
  showSearch: PropTypes.bool,
  showColumnChooser: PropTypes.bool,
  showFilter: PropTypes.bool
};

export default BasicTable;

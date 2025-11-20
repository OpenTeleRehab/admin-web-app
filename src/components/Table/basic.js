import React from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFixedColumns,
  PagingPanel,
  SearchPanel
} from '@devexpress/dx-react-grid-bootstrap4';
import {
  SearchState,
  PagingState
} from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import SearchInput from 'components/Table/SearchPanel/Input';
import Toolbar from 'components/Table/Toolbar';

const BasicTable = ({ rows, columns, pageSize, setPageSize, currentPage, setCurrentPage, totalCount, setSearchValue, showPagination = false, showSearch = false }) => {
  const pageSizes = [60, 120, 180, 240];
  const handlePageSizeChange = value => {
    setCurrentPage(0);
    setPageSize(value);
  };

  return (
    <Grid
      rows={rows}
      columns={columns}>
      <SearchState onValueChange={setSearchValue} />
      <PagingState
        currentPage={currentPage}
        onCurrentPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
      <Table columnExtensions={[{ columnName: 'action', align: 'center', width: 120 }]} />
      <TableHeaderRow />
      <TableFixedColumns rightColumns={['action']} />
      {showSearch && <Toolbar /> }
      {showSearch && <SearchPanel inputComponent={SearchInput} /> }
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
  showPagination: PropTypes.bool,
  showSearch: PropTypes.bool
};

export default BasicTable;

import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import ReactPaginate from 'react-paginate';

let recordStart = 0;
let recordEnd = 0;

const Pagination = ({ pageSize = 10, totalCount = 0, currentPage = 1, setCurrentPage, pageSizes = [10, 20, 30, 40, 50], setPageSize }) => {
  currentPage = Math.max(1, currentPage);

  const handleClick = page => {
    setCurrentPage(page.selected + 1);
  };

  const handlePageSizeChange = e => {
    setCurrentPage(1);
    setPageSize(e.target.value);
  };

  recordStart = totalCount <= 0 ? 0 : 1 + (currentPage - 1) * pageSize;
  recordEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div>
      <span>
        <Translate
          id="common.paginate.show_number_of_records"
          data={{ recordStart, recordEnd, totalCount }}
        />
      </span>

      <div className="float-right mr-3 exercise-pagination">
        <ReactPaginate
          previousLabel={'⟨'}
          nextLabel={'⟩'}
          breakLabel={'...'}
          pageCount={Math.max(1, Math.ceil(totalCount / pageSize))}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          onPageChange={handleClick}
          containerClassName={'pagination'}
          activeClassName={'active-paginate'}
          disabledClassName={'disable-style'}
        />
      </div>

      <Form inline className="float-right mr-5">
        <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
          {
            pageSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))
          }
        </Form.Control>
        <span className="ml-2">
          <Translate id="common.paginate.per_page" />
        </span>
      </Form>
    </div>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  pageSizes: PropTypes.array,
  setPageSize: PropTypes.func
};

export default Pagination;

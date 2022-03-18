import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';

import CustomTable from 'components/Table';
import settings from 'settings';
import { getLocalizations, updateLocalization } from 'store/localization/actions';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

let timer = null;
const Translation = ({ translate }) => {
  const dispatch = useDispatch();
  const { localizations, loading } = useSelector(state => state.localization);
  const languages = useSelector(state => state.language.languages);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterPlatform, setFilterPlatform] = useState(settings.platforms.options[0].value);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [editingRowIds, setEditingRowIds] = useState([]);
  const [showInlineEdited] = useState(true);
  const [editingStateColumnExtensions] = useState([
    { columnName: 'key', editingEnabled: false }
  ]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getLocalizations({
        search_value: searchValue,
        filter_platform: filterPlatform,
        filters: filters,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [currentPage, pageSize, searchValue, filters, filterPlatform, dispatch]);

  const commitChanges = ({ changed }) => {
    if (changed && editingRowIds) {
      const changedRows = localizations.map((row, index) => (changed[index] ? { ...row, ...changed[index] } : row));
      dispatch(updateLocalization(changedRows[editingRowIds].id, Object.values(changed)[0]));
    }
  };

  const columns = [
    { name: 'key', title: translate('common.key') }
  ];

  languages.forEach(lang => {
    columns.push({ name: lang.code, title: lang.name });
  });

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <>
      <Form>
        <Form.Row>
          <Form.Group controlId="formPlateForm" className="col-md-4">
            <Form.Label>{translate('setting.translations.platform')}</Form.Label>
            <Select
              classNamePrefix="filter"
              value={settings.platforms.options.filter(option => option.value === filterPlatform)}
              getOptionLabel={option => option.text}
              options={settings.platforms.options}
              onChange={(e) => setFilterPlatform(e.value)}
              styles={customSelectStyles}
              aria-label="Platform"
            />
          </Form.Group>
        </Form.Row>
      </Form>
      <CustomTable
        totalCount={totalCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        showInlineEdited={showInlineEdited}
        editingStateColumnExtensions={editingStateColumnExtensions}
        commitChanges={commitChanges}
        editingRowIds={editingRowIds}
        setEditingRowIds={setEditingRowIds}
        rows={localizations.map(localization => {
          const data = {
            key: localization.key
          };
          languages.forEach(lang => {
            data[lang.code] = localization[lang.code] || '';
          });
          return data;
        })}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
      { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
    </>
  );
};

Translation.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(Translation);

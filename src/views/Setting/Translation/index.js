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
import Dialog from 'components/Dialog';
import { TEXT_MAX_LENGTH, TRANSLATION_KEYS } from 'variables/setting';

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
  const [showAlert, setShowAlert] = useState(false);
  const [overLengthTranslations, setOverLengthTranslations] = useState([]);

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
      const smsRows = _.find(changedRows, { key: TRANSLATION_KEYS.SMS_REMINDER_ALERT, id: changedRows[editingRowIds].id });
      const overLengthTranslation = [];

      if (smsRows) {
        const regexp = new RegExp("^[A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅå\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!\"#$%&'()*+,\\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]*$");
        Object.keys(smsRows).map((key) => {
          const lang = _.find(languages, { code: key });
          if (lang) {
            if (regexp.test(smsRows[lang.code])) {
              if (smsRows[lang.code].length > TEXT_MAX_LENGTH.GSM_7) {
                overLengthTranslation.push({ lang: lang.name, maxLength: TEXT_MAX_LENGTH.GSM_7 });
              }
            } else {
              if (smsRows[lang.code].length > TEXT_MAX_LENGTH.NON_GSM) {
                overLengthTranslation.push({ lang: lang.name, maxLength: TEXT_MAX_LENGTH.NON_GSM });
              }
            }
          }
        });
      }

      if (overLengthTranslation.length) {
        showOverLengthTranslationAlert(overLengthTranslation);
      } else {
        dispatch(updateLocalization(changedRows[editingRowIds].id, Object.values(changed)[0]));
      }
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

  const showOverLengthTranslationAlert = (overLengthTranslation) => {
    setShowAlert(true);
    setOverLengthTranslations(overLengthTranslation);
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
      <Dialog
        show={showAlert}
        title={translate('setting.translations.over_length_title')}
        onCancel={() => setShowAlert(false)}
        cancelLabel={translate('common.close')}
      >
        <p>{translate('setting.translations.over_length_content')}</p>
        {overLengthTranslations.map((item, index) => (
          <div key={index}>
            {item.lang + ' : ' + item.maxLength }
          </div>
        ))}
      </Dialog>
    </>
  );
};

Translation.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(Translation);

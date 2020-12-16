import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import {
  Grid,
  Table,
  TableHeaderRow
} from '@devexpress/dx-react-grid-bootstrap4';

import { EditAction, DeleteAction } from 'components/ActionIcons';
import { getLanguageName } from 'utils/language';

const Country = ({ translate }) => {
  const countries = useSelector(state => state.country.countries);
  const languages = useSelector(state => state.language.languages);

  const [columns] = useState([
    { name: 'id', title: 'ID' },
    { name: 'name', title: 'Name' },
    { name: 'iso_code', title: 'ISO Code' },
    { name: 'phone_code', title: 'Phone Code' },
    { name: 'language', title: 'Language' },
    { name: 'action', title: 'Action' }
  ]);

  return (
    <div className="card">
      <Grid
        rows={countries.map(country => {
          const action = (
            <>
              <EditAction disabled />
              <DeleteAction className="ml-1" disabled />
            </>
          );
          return {
            id: country.identity,
            name: country.name,
            iso_code: country.iso_code,
            phone_code: country.phone_code,
            language: getLanguageName(country.language_id, languages),
            action
          };
        })}
        columns={columns}>
        <Table />
        <TableHeaderRow />
      </Grid>
    </div>
  );
};

Country.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(Country);
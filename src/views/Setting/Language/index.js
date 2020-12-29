import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';

const Language = ({ translate, handleRowEdit }) => {
  const languages = useSelector(state => state.language.languages);

  const [columns] = useState([
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'code', title: translate('common.code') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div className="card">
      <BasicTable
        rows={languages.map(language => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(language.id)} />
              <DeleteAction className="ml-1" disabled />
            </>
          );
          return {
            id: language.id,
            name: language.name,
            code: language.code,
            action
          };
        })}
        columns={columns}
      />
    </div>
  );
};

Language.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Language);

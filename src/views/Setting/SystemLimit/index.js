import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable from 'components/Table';
import { getSystemLimits, updateSystemLimit } from 'store/systemLimit/actions';

const SystemLimit = ({ translate }) => {
  const dispatch = useDispatch();
  const { systemLimits } = useSelector(state => state.systemLimit);
  const [showInlineEdited] = useState(true);
  const [editingStateColumnExtensions] = useState([
    { columnName: 'content_type', editingEnabled: false }
  ]);
  const [editingRowIds, setEditingRowIds] = useState([]);

  useEffect(() => {
    dispatch(getSystemLimits());
  }, [dispatch]);

  const commitChanges = ({ changed }) => {
    if (changed && editingRowIds) {
      const changedRows = systemLimits.map((row, index) => (changed[index] ? { ...row, ...changed[index] } : row));
      dispatch(updateSystemLimit(changedRows[editingRowIds].id, Object.values(changed)[0]));
    }
  };

  const columns = [
    { name: 'content_type', title: translate('system_limit.content_type') },
    { name: 'value', title: translate('system_limit.value') }
  ];

  return (
    <div className="card">
      <CustomTable
        columns={columns}
        showInlineEdited={showInlineEdited}
        editingStateColumnExtensions={editingStateColumnExtensions}
        commitChanges={commitChanges}
        editingRowIds={editingRowIds}
        setEditingRowIds={setEditingRowIds}
        hideSearchFilter={true}
        hidePagination={true}
        rows={systemLimits.map(systemLimit => {
          const data = {
            content_type: translate(systemLimit.content_type),
            value: systemLimit.value
          };

          return data;
        })}
      />
    </div>
  );
};

SystemLimit.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(SystemLimit);

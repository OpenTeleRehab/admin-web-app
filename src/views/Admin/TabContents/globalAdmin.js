import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers, resendEmail } from 'store/user/actions';
import { USER_GROUPS } from 'variables/user';
import settings from 'settings';
import * as moment from 'moment';

import CustomTable from 'components/Table';
import EnabledStatus from 'components/EnabledStatus';
import { DeleteAction, EditAction, EnabledAction, DisabledAction, MailSendAction } from 'components/ActionIcons';
import { getTranslate } from 'react-localize-redux';
import { checkFederatedUser } from 'utils/user';

let timer = null;
const GlobalAdmin = ({ handleEdit, handleDelete, handleSwitchStatus, type }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { profile } = useSelector((state) => state.auth);

  const columns = [
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'email', title: translate('common.email') },
    { name: 'status', title: translate('common.status') },
    { name: 'last_login', title: translate('common.last_login') },
    { name: 'action', title: translate('common.action') }
  ];
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (type === USER_GROUPS.ORGANIZATION_ADMIN) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(getUsers({
          search_value: searchValue,
          filters: filters,
          admin_type: type,
          page_size: pageSize,
          page: currentPage + 1
        })).then(result => {
          if (result) {
            setTotalCount(result.total_count);
          }
        });
      }, 500);
    }
  }, [currentPage, type, pageSize, searchValue, filters, dispatch]);

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'last_login', wordWrapEnabled: true, width: 250 }
  ];

  const handleSendMail = (id) => {
    dispatch(resendEmail(id, type));
  };

  return (
    <div className="mt-3">
      <p>
        {translate('common.global_admin.management')}
      </p>
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
        rows={users.map(user => {
          const isFederatedUser = checkFederatedUser(user.email);
          const action = (
            <div className='d-flex justify-content-start'>
              {user.enabled
                ? <EnabledAction onClick={() => handleSwitchStatus(user.id, 0)} disabled={parseInt(user.id) === parseInt(profile.id)}/>
                : <DisabledAction onClick={() => handleSwitchStatus(user.id, 1)} disabled={parseInt(user.id) === parseInt(profile.id)} />
              }
              <EditAction onClick={() => handleEdit(user.id)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(user.id)} disabled={parseInt(user.id) === parseInt(profile.id) || user.enabled} />
              {!isFederatedUser && <MailSendAction onClick={() => handleSendMail(user.id)} disabled={user.last_login} />}
            </div>
          );

          return {
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            status: <EnabledStatus enabled={!!user.enabled} />,
            last_login: user.last_login ? moment.utc(user.last_login).local().format(settings.datetime_format) : '',
            action
          };
        })}
      />
    </div>
  );
};

GlobalAdmin.propTypes = {
  handleEdit: PropTypes.func,
  type: PropTypes.string,
  handleDelete: PropTypes.func,
  handleSwitchStatus: PropTypes.func
};

export default GlobalAdmin;

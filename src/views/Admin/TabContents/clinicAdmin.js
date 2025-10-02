import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import EnabledStatus from 'components/EnabledStatus';
import { EditAction, DeleteAction, EnabledAction, DisabledAction, MailSendAction } from 'components/ActionIcons';
import { USER_GROUPS } from 'variables/user';
import { getUsers, resendEmail } from 'store/user/actions';
import { getClinicName } from 'utils/clinic';
import * as moment from 'moment';
import settings from 'settings';
import { getTranslate } from 'react-localize-redux';
import { checkFederatedUser } from 'utils/user';

let timer = null;
const ClinicAdmin = ({ handleEdit, handleDelete, handleSwitchStatus, type }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const clinics = useSelector(state => state.clinic.clinics);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const columns = [
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'email', title: translate('common.email') },
    { name: 'clinic', title: translate('common.clinic') },
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
    if (type === USER_GROUPS.CLINIC_ADMIN) {
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
        {translate('common.clinic_admin.management')}
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
                ? <EnabledAction onClick={() => handleSwitchStatus(user.id, 0)} />
                : <DisabledAction onClick={() => handleSwitchStatus(user.id, 1)} />
              }
              <EditAction onClick={() => handleEdit(user.id)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(user.id)} disabled={user.enabled} />
              {!isFederatedUser && <MailSendAction onClick={() => handleSendMail(user.id)} disabled={user.last_login} />}
            </div>
          );

          return {
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            clinic: getClinicName(user.clinic_id, clinics),
            status: <EnabledStatus enabled={!!user.enabled} />,
            last_login: user.last_login ? moment.utc(user.last_login).local().format(settings.datetime_format) : '',
            action
          };
        })}
      />
    </div>
  );
};

ClinicAdmin.propTypes = {
  handleEdit: PropTypes.func,
  type: PropTypes.string,
  handleDelete: PropTypes.func,
  handleSwitchStatus: PropTypes.func
};

export default ClinicAdmin;

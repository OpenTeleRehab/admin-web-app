import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useKeycloak } from '@react-keycloak/web';
import { deleteUser, updateUserStatus } from 'store/user/actions';

import GlobalAdmin from './TabContents/globalAdmin';
import CountryAdmin from './TabContents/countryAdmin';
import ClinicAdmin from './TabContents/clinicAdmin';
import RegionalAdmin from './TabContents/regionalAdmin';

import CreateAdmin from './create';
import PropTypes from 'prop-types';
import { USER_GROUPS, USER_ROLES } from 'variables/user';
import Dialog from 'components/Dialog';
import customColorScheme from '../../utils/customColorScheme';
import PhcServiceAdmin from './TabContents/phcServiceAdmin';
import CreatePhcServiceAdmin from './_Partials/PhcServiceAdminForm';
import CreateOrEditRegionalAdmin from './_Partials/RegionalAdminForm';
import useDialog from 'components/V2/Dialog';
import _ from 'lodash';

const Admin = ({ translate }) => {
  const { keycloak } = useKeycloak();
  const [show, setShow] = useState(false);
  const [type, setType] = useState(undefined);
  const [editId, setEditId] = useState('');
  const [errorCountryInUsed, setErrorCountryInUsed] = useState('');
  const [countryId, setCountryId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSwitchStatusDialog, setShowSwitchStatusDialog] = useState(false);
  const users = useSelector(state => state.user.users);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [id, setId] = useState(null);
  const [formFields, setFormFields] = useState({
    enabled: 0,
    type: undefined
  });
  const { openDialog } = useDialog();
  const dispatch = useDispatch();

  useEffect(() => {
    removeTabIndexAttr();
  });

  useEffect(() => {
    if (keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN)) {
      setType(USER_GROUPS.ORGANIZATION_ADMIN);
    } else if (keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY_ADMIN)) {
      setType(USER_GROUPS.COUNTRY_ADMIN);
    } else if (keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC_ADMIN)) {
      setType(USER_GROUPS.CLINIC_ADMIN);
    }
  }, [keycloak]);

  const removeTabIndexAttr = () => {
    setTimeout(() => {
      if (keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN)) {
        document.getElementById('amg-tab-tab-' + USER_ROLES.ORGANIZATION_ADMIN).removeAttribute('tabindex');
      }
      if (keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY_ADMIN)) {
        document.getElementById('amg-tab-tab-' + USER_ROLES.COUNTRY_ADMIN).removeAttribute('tabindex');
      }
      if (keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC_ADMIN)) {
        document.getElementById('amg-tab-tab-' + USER_ROLES.CLINIC_ADMIN).removeAttribute('tabindex');
      }
    }, 100);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };
  const handleShow = () => {
    if (type !== USER_GROUPS.PHC_SERVICE_ADMIN && type !== USER_GROUPS.REGIONAL_ADMIN) {
      setShow(true);
    } if (type === USER_GROUPS.REGIONAL_ADMIN) {
      openDialog({
        title: translate('regional_admin.new'),
        content: <CreateOrEditRegionalAdmin />
      });
    } else {
      openDialog({
        title: translate('phc_service_admin.new'),
        content: <CreatePhcServiceAdmin />
      });
    }
  };

  const handleDelete = (id) => {
    setId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteUser(id, type)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  const handleSwitchStatus = (id, enabled, countryId) => {
    setId(id);
    setFormFields({ ...formFields, enabled: enabled, type: type });
    setShowSwitchStatusDialog(true);
    if (countryId) {
      setCountryId(countryId);
    }
    setErrorCountryInUsed('');
  };

  const handleSwitchStatusDialogClose = () => {
    setId(null);
    setShowSwitchStatusDialog(false);
  };

  const handleSwitchStatusDialogConfirm = () => {
    if (countryId) {
      const user = users.find(user => user.country_id === countryId);
      if (user && user.id === id && user.enabled === 1) {
        setErrorCountryInUsed(translate('error.country.in_used'));
      } else {
        dispatch(updateUserStatus(id, formFields)).then(result => {
          if (result) {
            handleSwitchStatusDialogClose();
          }
        });
      }
    } else {
      dispatch(updateUserStatus(id, formFields)).then(result => {
        if (result) {
          handleSwitchStatusDialogClose();
        }
      });
    }
  };

  const handleSelectTab = (key) => {
    setType(key);
    removeTabIndexAttr();
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1>{translate('admin.management')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleShow}>
            <BsPlus size={20} className="mr-1" />
            {translate('admin.new')}
          </Button>
        </div>
      </div>

      <Tabs id="amg-tab" activeKey={type} onSelect={(key) => handleSelectTab(key)} transition={false}>
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN) && (
          <Tab eventKey={USER_GROUPS.ORGANIZATION_ADMIN} title={translate('organization_admin')}>
            <GlobalAdmin handleEdit={handleEdit} type={type} handleDelete={handleDelete} handleSwitchStatus={handleSwitchStatus} />
          </Tab>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY_ADMIN) && (
          <Tab eventKey={USER_GROUPS.COUNTRY_ADMIN} title={translate('country_admin')}>
            <CountryAdmin handleEdit={handleEdit} type={type} handleDelete={handleDelete} handleSwitchStatus={handleSwitchStatus} />
          </Tab>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC_ADMIN) && (
          <Tab eventKey={USER_GROUPS.CLINIC_ADMIN} title={translate('clinic_admin')}>
            <ClinicAdmin handleEdit={handleEdit} type={type} handleDelete={handleDelete} handleSwitchStatus={handleSwitchStatus} />
          </Tab>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_SERVICE_ADMIN) && (
          <Tab eventKey={USER_GROUPS.PHC_SERVICE_ADMIN} title={translate('common.phc_service_admin')} onSelect={() => setType(USER_GROUPS.PHC_SERVICE_ADMIN)}>
            <PhcServiceAdmin />
          </Tab>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_REGIONAL_ADMIN) && (
          <Tab eventKey={USER_GROUPS.REGIONAL_ADMIN} title={translate('common.regional_admin')} onSelect={() => setType(USER_GROUPS.REGIONAL_ADMIN)}>
            <RegionalAdmin />
          </Tab>
        )}
      </Tabs>

      {show && <CreateAdmin show={show} handleClose={handleClose} editId={editId} setType={setType} type={type} />}
      <Dialog
        show={showDeleteDialog}
        title={translate('user.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      <Dialog
        show={showSwitchStatusDialog}
        title={translate('user.switchStatus_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchStatusDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchStatusDialogConfirm}
      >
        <div>
          <p>{translate('common.switchStatus_confirmation_message')}</p>
          <p className="error-feedback">{errorCountryInUsed}</p>
        </div>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Admin.propTypes = {
  translate: PropTypes.func
};

export default Admin;

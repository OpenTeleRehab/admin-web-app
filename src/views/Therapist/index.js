import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import EnabledStatus from 'components/EnabledStatus';
import { DeleteAction, EditAction, EnabledAction, DisabledAction, MailSendAction } from 'components/ActionIcons';
import CreateTherapist from 'views/Therapist/create';
import { getTherapists, updateTherapistStatus, resendEmail } from 'store/therapist/actions';
import { getCountryName, getCountryISO, getCountryIsoCode } from 'utils/country';
import { getClinicName, getClinicRegion, getTotalTherapistLimit } from 'utils/clinic';
import * as moment from 'moment';
import settings from 'settings';
import Dialog from 'components/Dialog';
import DeleteTherapist from './Partials/delete';

import {
  getPatient,
  getTotalOnGoingTreatment,
  getTotalPatient
} from 'utils/patient';
import { USER_ROLES, USER_GROUPS } from '../../variables/user';
import { useKeycloak } from '@react-keycloak/web';
import _ from 'lodash';
import { Therapist as therapistService } from 'services/therapist';
import { Clinic as clinicService } from 'services/clinic';
import { getProfessionName } from 'utils/profession';
import { getChatRooms } from 'utils/therapist';
import customColorScheme from '../../utils/customColorScheme';

let timer = null;

const Therapist = ({ translate }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const therapists = useSelector(state => state.therapist.therapists);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const professions = useSelector(state => state.profession.professions);
  const { profile } = useSelector((state) => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { orgOngoingTreatmentLimit } = useSelector(state => state.organization);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const [therapistChatRooms, setTherapistChatRooms] = useState('');
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [isTherapistLimit, setIsTherapistLimit] = useState(false);
  const [countryCode, setCountryCode] = useState('');

  const [formFields, setFormFields] = useState({
    enabled: 0
  });

  const columns = [
    { name: 'id', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'email', title: translate('common.email') },
    { name: 'total_patient', title: translate('common.total_patient') },
    { name: 'assigned_patient', title: translate('common.assigned_patient') },
    { name: 'limit_patient', title: translate('common.on_going.treatment_let') },
    { name: 'status', title: translate('common.status') },
    { name: 'last_login', title: translate('common.last_login') },
    { name: 'action', title: translate('common.action') }
  ];

  const globalAdminTherapistColumns = [
    { name: 'id', title: translate('common.id') },
    { name: 'profession', title: translate('common.profession') },
    { name: 'therapist_country', title: translate('common.country') },
    { name: 'region', title: translate('common.region') },
    { name: 'therapist_clinic', title: translate('common.clinic') },
    { name: 'total_patient', title: translate('common.total_patient') },
    { name: 'on_going_treatment', title: translate('common.ongoing_treatment_plan') },
    { name: 'limit_patient', title: translate('common.on_going.treatment_let') }
  ];

  const columnExtensions = [
    { columnName: 'id', wordWrapEnabled: true, width: 250 },
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'limit_patient', wordWrapEnabled: true },
    { columnName: 'last_login', wordWrapEnabled: true, width: 250 },
    { columnName: 'total_patient', wordWrapEnabled: true },
    { columnName: 'assigned_patient', wordWrapEnabled: true },
    { columnName: 'on_going_treatment', wordWrapEnabled: true }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSwitchStatusDialog, setShowSwitchStatusDialog] = useState(false);
  const [id, setId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientTherapists, setPatientTherapists] = useState([]);
  const [therapistsSameClinic, setTherapistsSameClinic] = useState([]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getTherapists({
        clinic_id: profile ? profile.clinic_id : null,
        filters,
        search_value: searchValue,
        user_type: profile.type,
        page_size: pageSize,
        page: currentPage + 1
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [currentPage, pageSize, searchValue, filters, dispatch, profile]);

  useEffect(() => {
    if (keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN)) {
      setIsGlobalAdmin(true);
    }
  }, [keycloak]);

  useEffect(() => {
    if (therapists && therapists.length > 0 && totalCount) {
      const therapistIds = _.map(therapists, 'id');
      therapistService.getPatientByTherapistIds(therapistIds, { country_code: getCountryIsoCode(profile.country_id) }).then(res => {
        if (res.data) {
          setPatients(res.data);
        }
      });
    };
  }, [therapists, totalCount, profile]);

  useEffect(() => {
    if (profile !== undefined && profile.type === USER_GROUPS.CLINIC_ADMIN) {
      setCountryCode(getCountryISO(profile.country_id, countries));
      clinicService.countTherapistByClinic(profile.clinic_id).then(res => {
        if (res.success) {
          if (res.data.therapistTotal < getTotalTherapistLimit(profile.clinic_id, clinics)) {
            setIsTherapistLimit(true);
          } else {
            setIsTherapistLimit(false);
          }
        }
      });
    }
  }, [profile, clinics, therapists, countries]);

  const handleShow = () => setShow(true);

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleDelete = (id) => {
    therapistService.getPatientForTherapistRemove(id, true).then(res => {
      if (res.data) {
        setPatientTherapists(res.data);
      }
    });

    therapistService.getTherapistsByClinic(profile.clinic_id).then(res => {
      if (res.data) {
        setTherapistsSameClinic(res.data);
      }
    });

    setId(id);
    setShowDeleteDialog(true);
    setTherapistChatRooms(getChatRooms(id, therapists));
  };

  const handleSwitchStatus = (id, enabled) => {
    setId(id);
    setFormFields({ ...formFields, enabled: enabled });
    setShowSwitchStatusDialog(true);
  };

  const handleSwitchStatusDialogClose = () => {
    setId(null);
    setShowSwitchStatusDialog(false);
  };

  const handleSwitchStatusDialogConfirm = () => {
    dispatch(updateTherapistStatus(id, formFields)).then(result => {
      if (result) {
        handleSwitchStatusDialogClose();
      }
    });
  };

  const handleSendMail = (id) => {
    dispatch(resendEmail(id));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('therapist.list')}</h1>
        {(!isGlobalAdmin && isTherapistLimit) &&
          <div className="btn-toolbar mb-2 mb-md-0">
            <Button variant="primary" onClick={handleShow}>
              <BsPlus size={20} className="mr-1" />
              {translate('therapist.new')}
            </Button>
          </div>
        }
      </div>
      {show && <CreateTherapist show={show} handleClose={handleClose} editId={editId} defaultOnGoingLimitPatient={orgOngoingTreatmentLimit} />}
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={isGlobalAdmin ? globalAdminTherapistColumns : columns}
        columnExtensions={columnExtensions}
        rows={therapists.map(user => {
          const action = (
            <>
              {user.enabled
                ? <EnabledAction onClick={() => handleSwitchStatus(user.id, 0)} disabled={!!getPatient(user.id, patients)}/>
                : <DisabledAction onClick={() => handleSwitchStatus(user.id, 1)} disabled={!!getPatient(user.id, patients)} />
              }
              <EditAction onClick={() => handleEdit(user.id)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(user.id, patients)} />
              <MailSendAction onClick={() => handleSendMail(user.id)} disabled={user.last_login} />
            </>
          );

          return {
            id: user.identity,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profession: getProfessionName(user.profession_id, professions),
            therapist_country: getCountryName(user.country_id, countries),
            region: getClinicRegion(user.clinic_id, clinics),
            therapist_clinic: getClinicName(user.clinic_id, clinics),
            total_patient: getTotalPatient(user.id, patients),
            on_going_treatment: getTotalOnGoingTreatment(user.id, patients),
            assigned_patient: getTotalOnGoingTreatment(user.id, patients),
            limit_patient: user.limit_patient,
            status: <EnabledStatus enabled={user.enabled} />,
            last_login: user.last_login ? moment.utc(user.last_login).local().format(settings.datetime_format) : '',
            action
          };
        })}
      />
      <DeleteTherapist countryCode={countryCode} setShowDeleteDialog={setShowDeleteDialog} chatRooms={therapistChatRooms} showDeleteDialog={showDeleteDialog} patientTherapists={patientTherapists} therapistId={id} therapistsSameClinic={therapistsSameClinic} />
      <Dialog
        show={showSwitchStatusDialog}
        title={translate('user.switchStatus_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleSwitchStatusDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSwitchStatusDialogConfirm}
      >
        <p>{translate('common.switchStatus_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Therapist.propTypes = {
  translate: PropTypes.func
};

export default Therapist;

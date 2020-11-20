import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTable from 'components/Table';
import CreateTherapist from 'views/Therapist/create';
import { getTherapists } from 'store/therapist/actions';

const Therapist = ({ translate }) => {
  const dispatch = useDispatch();
  const therapists = useSelector(state => state.therapist.therapists);

  const [show, setShow] = useState(false);
  const columns = [
    { name: 'id', title: 'ID' },
    { name: 'last_name', title: 'Last Name' },
    { name: 'first_name', title: 'First Name' },
    { name: 'email', title: 'Email' },
    { name: 'date_of_birth', title: 'Date Of Birth' },
    { name: 'age', title: 'Age' },
    { name: 'country', title: 'Country' },
    { name: 'institution', title: 'Institution' },
    { name: 'ongoing', title: 'Ongoing / Patient limit' },
    { name: 'assigned_patients', title: 'Assigned Patients' },
    { name: 'status', title: 'Status' },
    { name: 'last_login', title: 'Last Login' },
    { name: 'action', title: 'Actions' }
  ];

  const columnExtensions = [
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'ongoing', wordWrapEnabled: true },
    { columnName: 'assigned_patients', wordWrapEnabled: true }
  ];

  useEffect(() => {
    dispatch(getTherapists());
  }, [dispatch]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('therapist.management')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" onClick={handleShow}>
            <BsPlus className="mr-1" />
            {translate('therapist.new')}
          </Button>
        </div>
      </div>

      <CreateTherapist show={show} handleClose={handleClose} />

      <CustomTable
        columns={columns}
        columnExtensions={columnExtensions}
        rows={therapists.map(user => {
          const dropdown = (
            <DropdownButton alignRight variant="outline-dark" title={translate('common.actions')}>
              <Dropdown.Item onClick={() => console.log('click on edit')}>{translate('common.edit_info')}</Dropdown.Item>
              <Dropdown.Item href="#/action-2">{translate('common.deactivate')}</Dropdown.Item>
              <Dropdown.Item href="#/action-3">{translate('common.delete')}</Dropdown.Item>
            </DropdownButton>
          );

          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            status: '',
            last_login: '',
            action: dropdown
          };
        })}
      />
    </>
  );
};

Therapist.propTypes = {
  translate: PropTypes.func
};

export default Therapist;

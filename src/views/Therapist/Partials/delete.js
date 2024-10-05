import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Therapist as therapistService } from 'services/therapist';
import Select from 'react-select';
import scssColors from 'scss/custom.scss';
import { getTranslate, Translate } from 'react-localize-redux';
import { getIdentity, getChatRooms } from 'utils/therapist';
import PropTypes from 'prop-types';
import { deleteTherapistUser } from 'store/therapist/actions';
import { USER_ROLES } from '../../../variables/user';
import { useKeycloak } from '@react-keycloak/web';

const DeleteTherapist = ({ setShowDeleteDialog, chatRooms, patientTherapists, therapistsSameClinic, showDeleteDialog, therapistId, numberOfActiveTransfers }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { keycloak } = useKeycloak();
  const therapists = useSelector(state => state.therapist.therapists);
  const [errorTherapist, setErrorTherapist] = useState(false);
  const dispatch = useDispatch();
  const [isLastPatient, setIsLastPatient] = useState(false);
  const [lastPatientId, setLastPatientId] = useState(null);
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [isTransfer, setIsTransfer] = useState(null);
  const [numberOfOnGoingTreatmentPlans, setNumberOfOnGoingTreatmentPlans] = useState(0);

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

  _.remove(patientTherapists, patient => (patient.ongoingTreatmentPlan.length === 0 && _.isEmpty(patient.upcomingTreatmentPlan)) || patient.is_secondary_therapist);
  _.remove(therapistsSameClinic, therapist => therapist.id === therapistId);

  const [currentIndex, SetCurrentIndex] = useState(0);

  const [formFields, setFormFields] = useState({
    therapist_id: '',
    therapist_identity: '',
    chat_rooms: '',
    new_chat_rooms: ''
  });

  useEffect(() => {
    if (therapistsSameClinic.length > 0 && patientTherapists.length > 0) {
      setConfirmTransfer(true);

      let sumOfOnGoingTreatmentPlans = 0;
      patientTherapists.forEach(item => {
        sumOfOnGoingTreatmentPlans += item.ongoingTreatmentPlan.length;
      });
      setNumberOfOnGoingTreatmentPlans(sumOfOnGoingTreatmentPlans);
    } else {
      setConfirmTransfer(false);
    }
  }, [therapistsSameClinic, patientTherapists]);

  const handleDeleteConfirm = () => {
    const therapist = therapists.find(item => item.id === therapistId);

    if (patientTherapists.length === 0 || !isTransfer) {
      dispatch(deleteTherapistUser(therapistId, {
        country_code: therapist.country_id,
        hard_delete: keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN)
      })).then(result => {
        if (result) {
          setShowDeleteDialog(false);
          setConfirmTransfer(false);
          setIsTransfer(null);
        }
      });
    } else {
      therapistService.transferPatientToTherapist(lastPatientId, formFields).then(res => {
        if (res) {
          setFormFields({ ...formFields, therapist_id: '', therapist_identity: '', new_chat_rooms: '', chat_rooms: chatRooms });
          dispatch(deleteTherapistUser(therapistId, {
            country_code: therapist.country_id,
            hard_delete: keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION_ADMIN)
          })).then(result => {
            if (result) {
              setShowDeleteDialog(false);
              setConfirmTransfer(false);
              setIsTransfer(null);
            }
          });
        }
      });
    }
  };

  const handleDeleteConfirmClose = () => {
    setFormFields({ ...formFields, therapist_id: '', therapist_identity: '', new_chat_rooms: '', chat_rooms: chatRooms });
    setConfirmTransfer(false);
    setIsTransfer(null);
    if (isLastPatient) {
      therapistService.transferPatientToTherapist(lastPatientId, formFields).then(res => {
        if (res) {
          setShowDeleteDialog(false);
          setIsLastPatient(false);
        }
      });
    } else {
      setShowDeleteDialog(false);
    }
  };

  const handleNextPatient = (patientId) => {
    if (formFields.therapist_id === '') {
      setErrorTherapist(true);
      SetCurrentIndex(currentIndex);
    } else {
      setErrorTherapist(false);
      if (currentIndex + 1 === patientTherapists.length) {
        setIsLastPatient(true);
        setLastPatientId(patientId);
      } else {
        therapistService.transferPatientToTherapist(patientId, formFields).then(res => {
          if (res) {
            setFormFields({ ...formFields, therapist_id: '', therapist_identity: '', new_chat_rooms: '', chat_rooms: chatRooms });
            SetCurrentIndex(currentIndex + 1);
          }
        });
      }
    }
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value, therapist_identity: getIdentity(value, therapistsSameClinic), chat_rooms: chatRooms, new_chat_rooms: getChatRooms(value, therapists) });
  };

  const handleConfirmTransfer = () => {
    setIsTransfer(true);
    setConfirmTransfer(false);
  };

  const handleNotTransfer = () => {
    setIsTransfer(false);
    setConfirmTransfer(false);
  };

  return (
    <>
      <Modal size="lg" show={showDeleteDialog} onHide={handleDeleteConfirmClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{patientTherapists.length > 0 && !isLastPatient && isTransfer ? <Translate id="patient_transfer_therapist" data={{ patientName: patientTherapists[currentIndex].last_name + ' ' + patientTherapists[currentIndex].first_name }} /> : confirmTransfer ? translate('therapist.transfer_confirmation_title') : translate('therapist.delete_confirmation_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isTransfer && !isLastPatient &&
            <Form.Row>
              <Form.Group as={Col} controlId="formTherapist">
                <Form.Label>{translate('common.therapist')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Select
                  placeholder={translate('placeholder.therapist')}
                  classNamePrefix="filter"
                  value={therapistsSameClinic.filter(option => option.id === formFields.therapist_id)}
                  getOptionLabel={option => `${option.last_name} ${option.first_name}`}
                  options={therapistsSameClinic}
                  onChange={(e) => handleSingleSelectChange('therapist_id', e.id)}
                  styles={customSelectStyles}
                  className={errorTherapist ? 'is-invalid' : ''}
                  aria-label="Therapist"
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.therapist')}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
          }
          {(patientTherapists.length === 0 || isLastPatient || (isTransfer === false && confirmTransfer === false)) &&
            <p>{translate('common.delete_confirmation_message')}</p>
          }
          { confirmTransfer &&
            <>
              <p>{translate('common.transfer_confirmation_message')}</p>
              {!!numberOfOnGoingTreatmentPlans &&
                <h5>
                  <Badge variant="warning">
                    <Translate
                      id="common.transfer_confirmation_message.number_of_on_going_treatment_plans"
                      data={{ numberOfOnGoingTreatmentPlans: numberOfOnGoingTreatmentPlans }}
                    />
                  </Badge>
                </h5>
              }
              {!!numberOfActiveTransfers &&
                <h5>
                  <Badge variant="warning">
                    <Translate
                      id="common.transfer_confirmation_message.number_of_in_progress_patient_transfer_requests"
                      data={{ numberOfActiveTransfers: numberOfActiveTransfers }}
                    />
                  </Badge>
                </h5>
              }
            </>
          }
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="action">
            {isLastPatient || patientTherapists.length === 0 || isTransfer === false ? (
              <Button
                className="ml-1"
                variant="primary"
                onClick={handleDeleteConfirm}
              >
                <Translate id='common.yes'/>
              </Button>
            ) : (
              <Button
                className="ml-1"
                variant="primary"
                onClick={() => isTransfer ? handleNextPatient(patientTherapists[currentIndex].id) : handleConfirmTransfer()}
              >
                <Translate id={ isTransfer ? 'common.transfer' : 'common.yes'}/>
              </Button>
            )}
            <Button
              className="ml-1"
              variant="outline-dark"
              onClick={ confirmTransfer ? handleNotTransfer : handleDeleteConfirmClose}
            >
              <Translate id={(isLastPatient || patientTherapists.length === 0 || confirmTransfer || !isTransfer) ? 'common.no' : 'common.close'} />
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeleteTherapist.propTypes = {
  chatRooms: PropTypes.array,
  handleDeleteDialogClose: PropTypes.func,
  patientTherapists: PropTypes.array,
  therapistsSameClinic: PropTypes.array,
  showDeleteDialog: PropTypes.func,
  therapistId: PropTypes.number,
  setShowDeleteDialog: PropTypes.func,
  numberOfActiveTransfers: PropTypes.number
};

export default DeleteTherapist;

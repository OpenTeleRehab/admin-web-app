import React, { useEffect, useState } from 'react';
import { Button, Form, Col, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Therapist as therapistService } from 'services/therapist';
import Select from 'react-select';
import { Translate } from 'react-localize-redux';
import { USER_GROUPS } from '../../../variables/user';
import useDialog from 'components/V2/Dialog';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import DialogBody from 'components/V2/Dialog/DialogBody';
import { useTranslate } from 'hooks/useTranslate';
import { IPhcWorker } from 'interfaces/IPhcWorker';
import { END_POINTS } from 'variables/endPoint';
import { useList } from 'hooks/useList';
import { useOne } from 'hooks/useOne';
import scssColors from 'scss/custom.scss';
import { useMutationAction } from 'hooks/useMutationAction';
import useToast from 'components/V2/Toast';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { getCountryISO } from 'utils/country';

const DeletePhcWorker = ({ phcWorker }: {phcWorker: IPhcWorker}) => {
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const t = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const [errorPhcWorker, setErrorPhcWorker] = useState(false);
  const dispatch = useDispatch();
  const [isLastPatient, setIsLastPatient] = useState(false);
  const [lastPatientId, setLastPatientId] = useState<number | null>(null);
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [isTransfer, setIsTransfer] = useState<boolean | null>(null);
  const [numberOfOnGoingTreatmentPlans, setNumberOfOnGoingTreatmentPlans] = useState(0);
  const { data: { data: phcWorkersByPhcService = [] } = {} } = useList(END_POINTS.PHC_WORKER_LIST_BY_PHC_SERVICE, { phc_service_id: phcWorker?.phc_service_id }, { enabled: !!phcWorker?.phc_service_id });
  const { data: numberOfActiveTransfers } = useOne(END_POINTS.NUMBER_OF_TRANSFER_BY_THERAPIST, null, { params: { therapist_id: phcWorker.id }, enabled: !!phcWorker?.id });
  const { data: { data: phcWorkerPatients = [] } = {} } = useList(END_POINTS.PATIENT_LIST_FOR_PHC_WORKER_REMOVE, { phc_worker_id: phcWorker.id }, { }, { country: getCountryISO(phcWorker?.country_id) });
  const { mutate: deletePhcWorker } = useMutationAction(END_POINTS.PHC_WORKERS_DELETE);
  const [currentIndex, SetCurrentIndex] = useState(0);
  const [formFields, setFormFields] = useState<{
    therapist_id: number | null;
    chat_rooms: string[];
    new_chat_rooms: string[];
  }>({
    therapist_id: null,
    chat_rooms: [],
    new_chat_rooms: []
  });

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  useEffect(() => {
    if (phcWorkersByPhcService.length > 0 && phcWorkerPatients.length > 0) {
      setConfirmTransfer(true);

      let sumOfOnGoingTreatmentPlans = 0;
      phcWorkerPatients.forEach(item => {
        sumOfOnGoingTreatmentPlans += item.ongoingTreatmentPlan.length;
      });
      setNumberOfOnGoingTreatmentPlans(sumOfOnGoingTreatmentPlans);
    } else {
      setConfirmTransfer(false);
    }
  }, [phcWorkersByPhcService, phcWorkerPatients]);

  _.remove(phcWorkerPatients, patient => (patient.ongoingTreatmentPlan.length === 0 && _.isEmpty(patient.upcomingTreatmentPlan)) || patient.is_secondary_therapist);
  _.remove(phcWorkersByPhcService, worker => worker.id === phcWorker.id);

  const handleDeleteConfirm = () => {
    const payload = {
      country_code: getCountryISO(phcWorker?.country_id),
      hard_delete: profile?.type === USER_GROUPS.ORGANIZATION_ADMIN || profile?.type === USER_GROUPS.COUNTRY_ADMIN || profile?.type === USER_GROUPS.REGIONAL_ADMIN,
      user_id: profile.id,
      user_name: `${profile.last_name} ${profile.first_name}`,
      group: profile.type
    };
    if (phcWorkerPatients.length === 0 || !isTransfer) {
      if (phcWorker.id) {
        dispatch(showSpinner(true));
        deletePhcWorker(
          {
            id: phcWorker.id,
            payload,
            invalidateKeys: [END_POINTS.PHC_WORKERS]
          },
          {
            onSuccess: async (res) => {
              dispatch(showSpinner(false));
              showToast({
                title: t('phc_worker.delete'),
                message: t(res?.message),
                color: 'success'
              });
              closeDialog();
            },
            onError: () => {
              dispatch(showSpinner(false));
            }
          }
        );
      }
    } else {
      if (formFields.therapist_id === null) {
        setErrorPhcWorker(true);
      } else {
        setErrorPhcWorker(false);
        const patientId = lastPatientId ?? phcWorkerPatients[currentIndex].id;
        therapistService.transferPatientToTherapist(patientId, { ...formFields, user_id: profile.id, user_name: `${profile.last_name} ${profile.first_name}`, group: profile.type }).then(res => {
          if (res.success) {
            console.log('Patient transferred successfully');
            setFormFields({ ...formFields, therapist_id: null, new_chat_rooms: [], chat_rooms: phcWorker.chat_rooms || [] });
            deletePhcWorker(
              { id: phcWorker.id, payload, invalidateKeys: [END_POINTS.PHC_WORKERS] },
              {
                onSuccess: async (res) => {
                  dispatch(showSpinner(false));
                  showToast({
                    title: t('phc_worker.delete'),
                    message: t(res?.message),
                    color: 'success'
                  });
                  closeDialog();
                },
                onError: () => {
                  dispatch(showSpinner(false));
                }
              }
            );
          }
        });
      }
    }
  };

  const handleDeleteConfirmClose = () => {
    setFormFields({ ...formFields, therapist_id: null, new_chat_rooms: [], chat_rooms: phcWorker.chat_rooms || [] });
    setConfirmTransfer(false);
    setIsTransfer(null);
    if (isLastPatient) {
      therapistService.transferPatientToTherapist(lastPatientId, formFields).then(res => {
        if (res) {
          closeDialog();
          setIsLastPatient(false);
        }
      });
    } else {
      closeDialog();
    }
  };

  const handleNextPatient = (patientId: number) => {
    if (formFields.therapist_id === null) {
      setErrorPhcWorker(true);
      SetCurrentIndex(currentIndex);
    } else {
      setErrorPhcWorker(false);
      if (currentIndex + 1 === phcWorkerPatients.length) {
        setIsLastPatient(true);
        setLastPatientId(patientId);
      } else {
        therapistService.transferPatientToTherapist(patientId, formFields).then(res => {
          if (res) {
            setFormFields({ ...formFields, therapist_id: null, new_chat_rooms: [], chat_rooms: phcWorker.chat_rooms || [] });
            SetCurrentIndex(currentIndex + 1);
          }
        });
      }
    }
  };

  const handleSingleSelectChange = (selectedPhcWorker: IPhcWorker) => {
    console.log('Selected PHC Worker:', selectedPhcWorker);
    setFormFields({ ...formFields, therapist_id: selectedPhcWorker.id, chat_rooms: phcWorker.chat_rooms || [], new_chat_rooms: selectedPhcWorker.chat_rooms || [] });
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
      <DialogBody>
        {isTransfer && !isLastPatient &&
          <Form.Row>
          <Form.Group as={Col} controlId="formPhcWorker">
            <Form.Label>{t('common.phc_worker')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Select
              placeholder={t('placeholder.phc_worker')}
              classNamePrefix="filter"
              value={phcWorkersByPhcService.filter(option => option.id === formFields.therapist_id)}
              getOptionLabel={option => `${option.last_name} ${option.first_name}`}
              options={phcWorkersByPhcService}
              onChange={handleSingleSelectChange}
              styles={customSelectStyles}
              className={errorPhcWorker ? 'is-invalid' : ''}
              aria-label="Phc Worker"
            />
            <Form.Control.Feedback type="invalid">
              {t('error.phc_worker')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        }
        {(phcWorkerPatients.length === 0 || isLastPatient || (isTransfer === false && confirmTransfer === false)) &&
          <p>{t('common.delete_confirmation_message')}</p>
        }
        {confirmTransfer &&
          <>
            <p>{t('phc_worker.transfer_patient_confirmation_message')}</p>
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
      </DialogBody>
      <DialogFooter>
        {isLastPatient || phcWorkerPatients.length === 0 || isTransfer === false ? (
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
          >
            <Translate id='common.yes'/>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => isTransfer ? handleNextPatient(phcWorkerPatients[currentIndex].id) : handleConfirmTransfer()}
          >
            <Translate id={isTransfer ? 'common.transfer' : 'common.yes'}/>
          </Button>
        )}
        <Button
          variant="outline-dark"
          onClick={confirmTransfer ? handleNotTransfer : handleDeleteConfirmClose}
        >
          <Translate id={(isLastPatient || phcWorkerPatients.length === 0 || confirmTransfer || !isTransfer) ? 'common.no' : 'common.close'}/>
        </Button>
      </DialogFooter>
    </>
  );
};

export default DeletePhcWorker;

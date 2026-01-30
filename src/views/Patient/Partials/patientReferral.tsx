import { useList } from 'hooks/useList';
import React, { useMemo, useState } from 'react';
import { END_POINTS } from 'variables/endPoint';
import moment from 'moment';
import { Badge, Button } from 'react-bootstrap';
import { IReferralResource } from 'interfaces/IReferral';
import Table from 'components/Table';
import useDialog from 'components/V2/Dialog';
import ReferralForm from './acceptReferralForm';
import DeclineForm from './declineReferralForm';
import { REFERRAL_STATUS } from 'variables/referralStatus';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import InterviewHistoryDialog from './InterviewHistoryDialog';

type PatientReferralProps = {
  translate: any;
}

const CustomTable = Table as any;

const PatientReferral = ({ translate }: PatientReferralProps) => {
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState([]);
  const { data: patientReferrals } = useList<IReferralResource>(END_POINTS.PATIENT_REFERRAL);
  const { openDialog } = useDialog();
  const [showInterviewHistory, setShowInterviewHistory] = useState(false);
  const [interviewPatientId, setInterviewPatientId] = useState<number | null>(null);

  const handleViewHistory = (patientId: number) => {
    setInterviewPatientId(patientId);
    setShowInterviewHistory(true);
  };

  const columns = useMemo(() => [
    { name: 'identity', title: translate('common.id') },
    { name: 'last_name', title: translate('common.last_name') },
    { name: 'first_name', title: translate('common.first_name') },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'phc_workers', title: translate('referral.lead.and.supplementary') },
    { name: 'referred_by', title: translate('referral.referred_by') },
    { name: 'status', title: translate('common.status') },
    { name: 'request_reason', title: translate('referral.phc_request_reason') },
    { name: 'therapist_reason', title: translate('referral.therapist_reject_reason') },
    { name: 'interview_history', title: translate('common.interview_history') },
    { name: 'action', title: translate('common.action') },
  ], [translate]);

  const defaultHiddenColumnNames = [
    'referred_by',
  ];

  const columnExtensions = [
    { columnName: 'request_reason', wordWrapEnabled: true },
    { columnName: 'therapist_reason', wordWrapEnabled: true },
    { columnName: 'action', align: 'right' }
  ];

  const formatLeadSupplementaryPhc = (workers: string[] = []) => {
    if (!workers || workers.length === 0) return '';

    const [first, ...rest] = workers;
    let display = `<b>${first}</b>`;

    if (rest.length > 0) {
      display += ' / ' + rest.join(' / ');
    }

    return display;
  };

  const onAccept = (referralId: number) => {
    openDialog({
      title: translate('patient.referral.accept.title'),
      content: <ReferralForm referralId={referralId} />
    });
  };

  const onDecline = (referralId: number) => {
    openDialog({
      title: translate('patient.referral.decline.title'),
      content: <DeclineForm referralId={referralId} />
    });
  };

  const rows = useMemo(() => {
    return (patientReferrals?.data ?? []).map((pr) => {
      const action = (
        <div className='d-flex justify-content-end'>
          <Button
            size="sm"
            className="d-flex justify-content-center align-items-center"
            disabled={pr.status === REFERRAL_STATUS.INVITED}
            onClick={() => onAccept(pr.id)}
          >
            <FaCheck /> {translate('common.assign')}
          </Button>
          <Button
            size="sm"
            disabled={pr.status === REFERRAL_STATUS.INVITED}
            variant='danger'
            className="ml-1 d-flex justify-content-center align-items-center"
            onClick={() => onDecline(pr.id)}
          >
            <IoClose size={18} /> {translate('common.declined')}
          </Button>
        </div>
      );

      return {
        identity: pr.patient_identity,
        last_name: pr.last_name,
        first_name: pr.first_name,
        date_of_birth: pr.date_of_birth ? moment(pr.date_of_birth).format('DD/MM/YYYY') : '',
        phc_workers: <span dangerouslySetInnerHTML={{ __html: formatLeadSupplementaryPhc(pr.lead_and_supplementary_phc) }}></span>,
        referred_by: pr.referred_by,
        status: <Badge pill variant='light'>{pr.status}</Badge>,
        request_reason: pr.request_reason,
        therapist_reason: pr.therapist_reason,
        interview_history: <p className="text-primary" style={{ cursor: 'pointer' }} onClick={() => handleViewHistory(pr.patient_id)}>{translate('common.view_history')}</p>,
        action,
      };
    });
  }, [patientReferrals, translate]);

  return (
    <div className="mt-4">
      <CustomTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        defaultHiddenColumnNames={defaultHiddenColumnNames}
        columnExtensions={columnExtensions}
        hover="hover-primary"
        rows={rows}
      />
      <InterviewHistoryDialog
        show={showInterviewHistory}
        onClose={() => setShowInterviewHistory(false)}
        patientId={interviewPatientId}
        translate={translate}
      />

    </div>
  );
};

export default PatientReferral;

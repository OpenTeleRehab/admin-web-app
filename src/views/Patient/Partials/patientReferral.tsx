import { useList } from 'hooks/useList';
import React, { useMemo } from 'react';
import { END_POINTS } from 'variables/endPoint';
import moment from 'moment';
import { Badge, Button } from 'react-bootstrap';
import { IReferralResource } from 'interfaces/IReferral';
import Table from 'components/Table/basic';
import useDialog from 'components/V2/Dialog';
import ReferralForm from './referralForm';
import { REFERRAL_STATUS } from 'variables/referralStatus';
import { FaCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

type PatientReferralProps = {
  translate: any;
}

const BasicTable = Table as any;

const PatientReferral = ({ translate }: PatientReferralProps) => {
  const { data: patientReferrals } = useList<IReferralResource>(END_POINTS.PATIENT_REFERRAL);
  const { openDialog } = useDialog();

  const columns = useMemo(() => [
    { name: 'identity', title: translate('common.id') },
    { name: 'date_of_birth', title: translate('common.date_of_birth') },
    { name: 'phc_workers', title: translate('referral.lead.and.supplementary') },
    { name: 'referred_by', title: translate('referral.referred_by') },
    { name: 'status', title: translate('common.status') },
    { name: 'action', title: translate('common.action') },
  ], [translate]);

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
      title: translate('patient.referral.title'),
      content: <ReferralForm referralId={referralId} />
    });
  };

  const rows = useMemo(() => {
    return (patientReferrals?.data ?? []).map((pr) => {
      const action = (
        <div className='d-flex justify-content-end'>
          <Button size="sm" className="d-flex justify-content-center align-items-center" disabled={pr.status === REFERRAL_STATUS.INVITED} onClick={() => onAccept(pr.id)}><FaCheck /> {translate('common.accept')}</Button>
          <Button size="sm" variant='danger' className="ml-1 d-flex justify-content-center align-items-center"><IoClose size={18} /> {translate('common.declined')}</Button>
        </div>
      );

      return {
        identity: pr.id,
        date_of_birth: pr.date_of_birth ? moment(pr.date_of_birth).format('DD/MM/YYYY') : '',
        phc_workers: <span dangerouslySetInnerHTML={{ __html: formatLeadSupplementaryPhc(pr.lead_and_supplementary_phc) }}></span>,
        referred_by: pr.referred_by,
        status: <Badge pill variant='light'>{pr.status}</Badge>,
        action,
      };
    });
  }, [patientReferrals, translate]);

  return (
    <div className="mt-4">
      <BasicTable
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default PatientReferral;

import React, { useMemo } from 'react';
import { useTranslate } from '../../../hooks/useTranslate';
import { useList } from '../../../hooks/useList';
import { END_POINTS } from '../../../variables/endPoint';
import { IEmailTemplateResource } from '../../../interfaces/IEmailTemplate';
import { EditAction } from 'components/V2/ActionIcons';
import useDialog from '../../../components/V2/Dialog';
import EditReferralEmailTemplate from './edit';
import Table from '../../../components/Table';
import customColorScheme from 'utils/customColorScheme';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const CustomTable: any = Table;

const EmailTemplate = () => {
  const t = useTranslate();
  const { openDialog } = useDialog();
  const { colorScheme } = useSelector((state: any) => state.colorScheme);
  const { data: { data = [] } = {} } = useList<IEmailTemplateResource>(END_POINTS.EMAIL_TEMPLATE);

  const columns = useMemo(() => [
    { name: 'content_type', title: t('email_template.content_type') },
    { name: 'title', title: t('common.title') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const rows = useMemo(() => {
    return data.map((item) => {
      const action = (
        <EditAction onClick={() => showEditModal(item)} />
      );

      return {
        content_type: item.content_type,
        title: item.title,
        action,
      };
    });
  }, [data]);

  const showEditModal = (data: IEmailTemplateResource) => {
    openDialog({
      title: t('email_template.edit.title'),
      content: <EditReferralEmailTemplate id={data.id} />,
      props: { size: 'lg' },
    });
  };

  return (
    <div className="card">
      <CustomTable
        rows={rows}
        columns={columns}
        columnExtensions={[]}
        hideSearchFilter
        hidePagination
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

export default EmailTemplate;

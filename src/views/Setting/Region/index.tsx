import { EditAction, DeleteAction } from 'components/V2/ActionIcons';
import useDialog from 'components/V2/Dialog';
import { useTranslate } from 'hooks/useTranslate';
import EditRegion from './_Partials/createOrEdit';
import BasicTable from 'components/Table/basic';
import { useList } from 'hooks/useList';
import { useDelete } from 'hooks/useDelete';
import { useDispatch } from 'react-redux';
import useToast from 'components/V2/Toast';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';
import { IRegionResource } from 'interfaces/IRegion';
import { useMemo } from 'react';

const Region = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const { data: regions } = useList<IRegionResource>(END_POINTS.REGION);
  const { mutate: deleteRegion } = useDelete(END_POINTS.REGION);
  const invalidate = useInvalidate();

  const columns = useMemo(() => [
    { name: 'id', title: t('common.id') },
    { name: 'name', title: t('common.name') },
    { name: 'country', title: t('common.country') },
    { name: 'therapist_limit', title: t('region.therapist_limit') },
    { name: 'phc_worker_limit', title: t('region.phc_worker_limit') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const handleEdit = (regionData: IRegionResource) => {
    openDialog({
      title: t('region.edit.title'),
      content: <EditRegion regionData={regionData} />,
      props: { size: 'lg' }
    });
  };

  const handleDelete = async (regionId: number) => {
    if (regionId) {
      dispatch(showSpinner(true));
      deleteRegion(
        regionId,
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            invalidate(END_POINTS.COUNTRY_LIMITATION);
            showToast({
              title: t('region.toast_title.delete'),
              message: t(res.data?.message),
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
  };

  const showConfirmDelete = (regionId: number) => {
    showAlert({
      title: t('region.delete_confirmation.title'),
      message: t('region.delete_confirmation.message'),
      onConfirm: () => handleDelete(regionId)
    });
  };

  const rows = useMemo(() =>
    (regions?.data || []).map((region) => {
      const action = (
        <>
          <EditAction onClick={() => handleEdit(region)} />
          <DeleteAction onClick={() => showConfirmDelete(region.id)} />
        </>
      );

      return {
        id: region.id,
        name: region.name,
        therapist_limit: region.therapist_limit,
        phc_worker_limit: region.phc_worker_limit,
        country: region?.country?.name,
        action
      };
    }),
    [regions, handleEdit, showConfirmDelete]
  );

  return (
    <div className="card">
      <BasicTable
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

export default Region;

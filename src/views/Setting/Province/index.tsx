import { EditAction, DeleteAction } from 'components/V2/ActionIcons';
import useDialog from 'components/V2/Dialog';
import { useTranslate } from 'hooks/useTranslate';
import EditProvince from './_Partials/createOrEdit';
import { useList } from 'hooks/useList';
import { useDelete } from 'hooks/useDelete';
import { useDispatch } from 'react-redux';
import useToast from 'components/V2/Toast';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';
import { IProvinceResource } from 'interfaces/IProvince';
import { useEffect, useMemo, useState } from 'react';
import BasicTable from 'components/Table/basic';

const Province = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE, { page_size: pageSize, search_value: searchValue });
  const { mutate: deleteProvince } = useDelete(END_POINTS.PROVINCE);
  const invalidate = useInvalidate();

  useEffect(() => {
    if (provinces) {
      setTotalCount(provinces.total);
    }
  }, [provinces, pageSize, currentPage, searchValue]);

  const columns = useMemo(() => [
    { name: 'identity', title: t('common.id') },
    { name: 'name', title: t('common.name') },
    { name: 'region_name', title: t('common.region') },
    { name: 'therapist_limit', title: t('common.therapist_limit') },
    { name: 'phc_worker_limit', title: t('common.phc_worker_limit') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const handleEdit = (provinceData: IProvinceResource) => {
    openDialog({
      title: t('province.edit'),
      content: <EditProvince provinceData={provinceData} />,
      props: { size: 'lg' }
    });
  };

  const handleDelete = async (provinceId: number) => {
    if (provinceId) {
      dispatch(showSpinner(true));
      deleteProvince(
        provinceId,
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            invalidate(END_POINTS.REGION_LIMITATION);
            showToast({
              title: t('province.toast_title.delete'),
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

  const showConfirmDelete = (provinceId: number) => {
    showAlert({
      title: t('province.delete_confirmation.title'),
      message: t('province.delete_confirmation.message'),
      onConfirm: () => handleDelete(provinceId)
    });
  };

  const rows = useMemo(() =>
    (provinces?.data || []).map((province) => {
      const action = (
        <>
          <EditAction onClick={() => handleEdit(province)} />
          <DeleteAction onClick={() => showConfirmDelete(province.id)} />
        </>
      );

      return {
        identity: province.identity,
        name: province.name,
        therapist_limit: province.therapist_limit,
        phc_worker_limit: province.phc_worker_limit,
        region_name: province.region_name,
        action
      };
    }),
    [provinces, handleEdit, showConfirmDelete]
  );

  return (
    <BasicTable
      showSearch={true}
      showPagination={true}
      pageSize={pageSize}
      setPageSize={setPageSize}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalCount={totalCount}
      setSearchValue={setSearchValue}
      columns={columns}
      rows={rows}
    />
  );
};

export default Province;

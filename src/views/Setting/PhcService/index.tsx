import { useEffect, useMemo, useState } from 'react';
import { useTranslate } from 'hooks/useTranslate';
import { useSelector, useDispatch } from 'react-redux';
import { EditAction, DeleteAction } from 'components/V2/ActionIcons';
import customColorScheme from '../../../utils/customColorScheme';
import { useList } from 'hooks/useList';
import { useDelete } from 'hooks/useDelete';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import { useAlertDialog } from 'components/V2/AlertDialog';
import CreatePhcService from './_Partials/createEdit';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { IPHCService } from '../../../interfaces/IPHCService';
import { END_POINTS } from 'variables/endPoint';
import BasicTable from 'components/Table/basic';
import _ from 'lodash';
import DeletePhcServiceConfirmation from './_Partials/deleteConfirmation';

const PhcService = () => {
  const t = useTranslate();
  const { colorScheme } = useSelector((state: any) => state.colorScheme);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const { data: phcServices } = useList<IPHCService>(END_POINTS.PHC_SERVICES, { page_size: pageSize, search_value: searchValue, filters });
  const { mutate: deletePhcService } = useDelete(END_POINTS.PHC_SERVICES);

  useEffect(() => {
    if (phcServices) {
      setTotalCount(phcServices.total);
    }
  }, [phcServices, pageSize, currentPage, searchValue]);

  const columns = useMemo(() => [
    { name: 'identity', title: t('common.id') },
    { name: 'name', title: t('common.name') },
    { name: 'region', title: t('common.region') },
    { name: 'province', title: t('common.province') },
    { name: 'phc_worker_limit', title: t('common.phc_worker_limit') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const handleEdit = (phcService: IPHCService) => {
    openDialog({
      title: t('phc_service.edit'),
      content: <CreatePhcService phcService={phcService} />
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('phc_service.delete'),
      message: t('phc_service.delete_confirmation_message'),
      closeOnConfirm: false,
      onConfirm: () => {
        openDialog({
          title: t('phc_service.delete'),
          content: (
            <DeletePhcServiceConfirmation
              phcServiceId={id}
              onConfirm={() => {
                dispatch(showSpinner(true));
                deletePhcService(id, {
                  onSuccess: async (res: any) => {
                    dispatch(showSpinner(false));
                    closeDialog();
                    closeDialog();
                    showToast({
                      title: t('phc_service.toast_title.delete'),
                      message: t(res.message),
                      color: 'success'
                    });
                  },
                  onError: () => {
                    dispatch(showSpinner(false));
                  }
                });
              }}
            />
          ),
          props: { size: 'lg' }
        });
      }
    });
  };

  const rows = useMemo(() =>
    (phcServices?.data || []).map((phcService) => {
      const action = (
        <>
          <EditAction onClick={() => handleEdit(phcService)} />
          <DeleteAction onClick={() => handleDelete(phcService.id)} />
        </>
      );

      return {
        identity: phcService.identity,
        name: phcService.name,
        region: phcService.region_name,
        province: phcService.province_name,
        phc_worker_limit: phcService.phc_worker_limit,
        action
      };
    }),
    [phcServices, handleEdit, handleDelete]
  );

  return (
    <>
      <BasicTable
        showSearch={true}
        showPagination={true}
        showColumnChooser={true}
        showFilter={true}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        rows={rows}
      />
    { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default PhcService;

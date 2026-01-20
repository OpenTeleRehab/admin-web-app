import { DeleteAction } from 'components/V2/ActionIcons';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Card } from 'react-bootstrap';
import { BsArrowsMove } from 'react-icons/bs';
import keycloak from '../../../utils/keycloak';
import { USER_ROLES } from 'variables/user';
import { useList } from 'hooks/useList';
import { FaEdit } from 'react-icons/fa';
import { IPhcWorkerGuidanceResource } from 'interfaces/IPhcWorkerGuidance';
import { useCreate } from 'hooks/useCreate';
import _ from 'lodash';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';
import { reorderArray } from 'utils/array';
import useDialog from 'components/V2/Dialog';
import CreateEditPhcWorkerGuidance from './createOrEdit';
import { useDelete } from 'hooks/useDelete';
import { useDispatch } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import useToast from 'components/V2/Toast';
import { useTranslate } from 'hooks/useTranslate';
import { useAlertDialog } from 'components/V2/AlertDialog';

const PhcWorkerGuidance = () => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const t: any = useTranslate();
  const { openDialog, closeDialog } = useDialog();
  const { showToast } = useToast();
  const { showAlert } = useAlertDialog();
  const [phcWorkerGuidances, setPhcWorkerGuidances] = useState<IPhcWorkerGuidanceResource[]>([]);
  const { data: guidancePages } = useList<IPhcWorkerGuidanceResource>(END_POINTS.GUIDANCE_PAGE, { target_role: 'phc_worker' });
  const { mutate: updatePhcWorkerGuidances } = useCreate(END_POINTS.GUIDANCE_PAGE_UPDATE_ORDER);
  const { mutate: deletePhcWorkerGuidance } = useDelete(END_POINTS.GUIDANCE_PAGE);

  useEffect(() => {
    if (guidancePages) {
      setPhcWorkerGuidances(guidancePages?.data);
    }
  }, [guidancePages]);

  const onDragEnd = (e: any) => {
    // dropped outside the list
    if (!e.destination) {
      return;
    }

    const updatedGuidances: any = reorderArray(
      guidancePages?.data || [],
      e.source.index,
      e.destination.index
    );

    setPhcWorkerGuidances(updatedGuidances);
    const formData = new FormData();
    formData.append('data', JSON.stringify({ guidancePages: updatedGuidances }));

    _.forIn(updatedGuidances, (value, key) => {
      formData.append(key, value);
    });

    updatePhcWorkerGuidances(formData, {
      onSuccess: () => {
        invalidate(END_POINTS.GUIDANCE_PAGE);
      }
    });
  };

  const handleEdit = (id: number) => {
    openDialog({
      title: t('phc_worker_guidance.title.edit'),
      content: <CreateEditPhcWorkerGuidance editId={id} />,
      props: { size: 'lg' }
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('phc_worker_guidance.dialog.delete.title'),
      message: t('common.delete_confirmation_message'),
      onConfirm: () => {
        dispatch(showSpinner(true));
        deletePhcWorkerGuidance(id, {
          onSuccess: () => {
            showToast({
              title: t('phc_worker_guidance.toast.delete.title'),
              message: t('phc_worker_guidance.toast.delete.success'),
            });
            closeDialog();
          },
          onSettled: () => {
            dispatch(showSpinner(false));
          },
        });
      },
    });
  };

  return (
    <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {phcWorkerGuidances.map((guidancePage, index) => (
              <Draggable key={index} draggableId={`guidancePage${index}`} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Card className="guidance-card mb-3">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5>{guidancePage.title}</h5>
                        <div className="d-flex align-items-center">
                          {keycloak.hasRealmRole(USER_ROLES.MANAGE_GUIDANCE_PAGE) && (
                            <>
                              <div {...provided.dragHandleProps}>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-dark drag-button"
                                  aria-label="Drag button"
                                >
                                  <BsArrowsMove size={20}/>
                                </Button>
                              </div>
                              <DeleteAction className="mr-2" onClick={() => handleDelete(guidancePage.id)} key={guidancePage.id} />
                            </>
                          )}
                          {(keycloak.hasRealmRole(USER_ROLES.MANAGE_GUIDANCE_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_GUIDANCE_PAGE)) && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0"
                              onClick={() => handleEdit(guidancePage.id)}
                              aria-label="Edit"
                            >
                              <FaEdit size={20} />
                            </Button>
                          )}
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div dangerouslySetInnerHTML={{ __html: guidancePage.content }} />
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PhcWorkerGuidance;

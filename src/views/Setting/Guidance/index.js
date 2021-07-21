import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  updateGuidancePages, getGuidancePages
} from 'store/guidancePage/actions';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { BsArrowsMove } from 'react-icons/bs';
import {
  Button,
  Card
} from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa/index';

let timer = null;

const reorderGuidance = (quidances, startIndex, endIndex) => {
  const result = Array.from(quidances);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const GuidancePage = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { guidancePages, filters } = useSelector(state => state.guidancePage);
  const [language, setLanguage] = useState('');
  const { profile } = useSelector((state) => state.auth);
  const [guidenceObjects, setGuidanceObjects] = useState([]);

  useEffect(() => {
    if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }
  }, [filters, profile]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getGuidancePages());
    }, 500);
  }, [language, dispatch]);

  useEffect(() => {
    if (guidancePages.length) {
      setGuidanceObjects(guidancePages);
    }
  }, [guidancePages]);

  const onDragEnd = (e) => {
    // dropped outside the list
    if (!e.destination) {
      return;
    }

    const updatedGuidances = reorderGuidance(
      guidancePages,
      e.source.index,
      e.destination.index
    );

    setGuidanceObjects(updatedGuidances);

    if (updatedGuidances.length) {
      dispatch(updateGuidancePages({ guidancePages: updatedGuidances, lang: language }));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {guidenceObjects.map((guidancePage, index) => (
                <Draggable key={index} draggableId={`guidancePage${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card className="guidance-card mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <h5>{guidancePage.title}</h5>

                          <div className="d-flex align-items-center">
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

                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0"
                              onClick={() => handleRowEdit(guidancePage.id)}
                              aria-label="Edit"
                            >
                              <FaEdit size={20} />
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-between">
                          <div dangerouslySetInnerHTML={{ __html: guidancePage.content }} />
                          <>
                            <div>

                            </div>
                          </>
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
    </>
  );
};

GuidancePage.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(GuidancePage);

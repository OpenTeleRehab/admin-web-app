import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate, withLocalize } from 'react-localize-redux';
import {
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import { useSelector } from 'react-redux';
import { BsHeartFill, BsHeart } from 'react-icons/bs';
import ViewQuestionnaire from './viewQuestionnaire';

const ListQuestionnaireCard = ({ questionnaireObjs, lang }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);

  useEffect(() => {
    if (questionnaireObjs && questionnaireObjs.length > 0) {
      setQuestionnaires(questionnaireObjs);
    } else {
      setQuestionnaires([]);
    }
    // eslint-disable-next-line
  }, [lang, questionnaireObjs]);

  const handleViewQuestionnaire = (questionnaire) => {
    setViewQuestionnaire(true);
    setQuestionnaire(questionnaire);
  };

  const handleViewQuestionnaireClose = () => {
    setViewQuestionnaire(false);
  };

  return (
    <>
      { questionnaires.map(questionnaire => (
        <div key={questionnaire.id} className="position-relative">
          <Card className="exercise-card shadow-sm mb-4">
            <div className="top-bar">
              <div className="favorite-btn btn-link">
                {questionnaire.is_favorite
                  ? <BsHeartFill size={20} />
                  : <BsHeart size={20} />
                }
              </div>
            </div>
            <div className="card-container" onClick={() => handleViewQuestionnaire(questionnaire)}>
              <div className="card-img bg-light">
                <div className="w-100 h-100 px-2 py-4 text-center questionnaire-header">
                  <img src={'/images/questionnaire.svg'} alt='questionnaire' />
                  <p>{translate('activity.questionnaire').toUpperCase()}</p>
                </div>
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>
                  {
                    questionnaire.title.length <= 50
                      ? <h5 className="card-title">
                        { questionnaire.title }
                      </h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ questionnaire.title }</Tooltip>}
                        >
                          <h5 className="card-title">
                            { questionnaire.title }
                          </h5>
                        </OverlayTrigger>
                      )
                  }
                </Card.Title>
                <Card.Text>
                  <b>{questionnaire.questions.length}</b> {translate('activity.questionnaire.questions')}
                </Card.Text>
              </Card.Body>
            </div>
          </Card>
        </div>
      ))}
      { viewQuestionnaire && <ViewQuestionnaire show={viewQuestionnaire} id={questionnaire.id} handleClose={handleViewQuestionnaireClose}/> }
    </>
  );
};

ListQuestionnaireCard.propTypes = {
  questionnaireObjs: PropTypes.array,
  readOnly: PropTypes.bool,
  lang: PropTypes.any
};

export default withLocalize(ListQuestionnaireCard);

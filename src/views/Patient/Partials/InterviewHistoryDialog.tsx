import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import settings from 'settings';
import { END_POINTS } from 'variables/endPoint';
import { useList } from 'hooks/useList';
import moment from 'moment';
import { useForm, FormProvider } from 'react-hook-form';
import QuestionRenderer from './QuestionRenderer';
import { getQuestionName } from './logic';

const calculateScoreBySection = (section: any, answers: any) => {
  let totalScore = 0;

  section?.questions?.forEach((question: any) => {
    // Find answer for this question
    const answerObj = Array.isArray(answers)
      ? answers.find((answer: any) => answer.question_id === question.id)
      : null;

    if (!answerObj) return;

    const { answer } = answerObj;

    switch (question.question_type) {
      case 'radio':
      case 'checkbox': {
        const selectedOptionIds = Array.isArray(answer) ? answer : [answer];

        selectedOptionIds.forEach((optionId: any) => {
          const option = question.options.find((opt: any) => opt.id === Number(optionId));

          if (option && option.option_point) {
            totalScore += option.option_point;
          }
        });
        break;
      }

      case 'open-number': {
        const optionPoint = question.options?.[0]?.option_point;
        if (optionPoint && answer) {
          totalScore += Number(optionPoint);
        }
        break;
      }

      case 'rating': {
        if (answer) {
          totalScore += Number(answer);
        }
        break;
      }
      // Note, Open Text => No Score
      default:
        break;
    }
  });

  return totalScore;
};

const mapScore = (sectionTotalScore: number, actions: any[]) => {
  if (!actions) return null;
  const match = actions.find(
    (item) => sectionTotalScore >= item.from && sectionTotalScore <= item.to,
  );

  return match ? match.action_text : null;
};

type Props = {
  show: boolean;
  onClose: () => void;
  patientId: number | null;
  translate: (key: string, params?: any) => string;
};

const InterviewHistoryDialog = ({ show, onClose, patientId, translate }: Props) => {
  const [showDetail, setShowDetail] = useState(false);
  const [step, setStep] = useState(0);

  const { data: interviewHistoryData } = useList<any>(END_POINTS.INTERVIEW_HISTORY, { user_id: patientId }, { enabled: !!patientId });
  const interviewHistorys = interviewHistoryData?.data;

  const [interviewHistoryDetail, setInterviewHistoryDetail] = useState<any>();
  const currentQuestionnaire = interviewHistoryDetail?.questionnaire;
  const currentAnswers = interviewHistoryDetail?.answers;
  const currentSection = currentQuestionnaire?.sections[step];

  // Parse answers once
  const parsedAnswers = useMemo(() =>
    currentAnswers ? (Array.isArray(currentAnswers) ? currentAnswers : JSON.parse(currentAnswers)) : [],
  [currentAnswers]);

  // Prepare default values for the form
  const defaultValues = useMemo(() => {
    if (!currentSection) return {};
    const values: any = {};
    parsedAnswers.forEach((ans: any) => {
      values[getQuestionName(ans.question_id)] = ans.answer;
    });
    return values;
  }, [currentSection, parsedAnswers]);

  const methods = useForm({
    defaultValues
  });

  useEffect(() => {
     if (currentSection) {
        methods.reset(defaultValues);
     }
  }, [defaultValues, methods, currentSection]);

  const totalScore = currentSection ? calculateScoreBySection(currentSection, parsedAnswers) : 0;
  const actionText = currentSection ? mapScore(totalScore, currentSection.actions) : null;
  const handleNext = () => {
    if (step < currentQuestionnaire.sections.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (!show) {
      setShowDetail(false);
      setStep(0);
      setInterviewHistoryDetail(undefined);
    }
  }, [show]);

  const getSectionMaxScores = (section:any) => {
    const sectionMax = (section?.questions || [])?.reduce((sum:any, q:any) => {
      const options = q?.options || [];

      const points = options
        ?.map((o:any) => Number(o?.option_point ?? 0))
        ?.filter((n:any) => !Number.isNaN(n));

      let questionMax = 0;

      switch (q?.question_type) {
        case 'radio':
          questionMax = points.length ? Math.max(...points) : 0;
          break;

        case 'checkbox':
          questionMax = points.reduce((s:any, p:any) => s + (p > 0 ? p : 0), 0);
          break;

        case 'rating':
          questionMax = Number(q?.options?.[0]?.max ?? 0) || 0;
          break;

        case 'open-number':
          questionMax = Number(q?.options?.[0]?.option_point ?? 0);
          break;

        default:
          questionMax = points.length ? Math.max(...points) : 0;
          break;
      }
      return sum + questionMax;
    }, 0);

    return sectionMax;
  };

  return (
    <>
      {/* Main List Dialog */}
      <Dialog
        show={show && !showDetail}
        title={translate('common.interview_history')}
        onCancel={onClose}
        cancelLabel={translate('common.close')}
      >
        <div className='mt-2' style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {(interviewHistorys?.length ?? 0) > 0
            ? interviewHistorys?.map((interviewHistory: any) => {
              const firstSection = interviewHistory.questionnaire?.sections?.[0];
              const score = firstSection ? calculateScoreBySection(firstSection, Array.isArray(interviewHistory.answers) ? interviewHistory.answers : JSON.parse(interviewHistory.answers)) : 0;
              const statusText = firstSection ? mapScore(score, firstSection.actions) : '';

              return (
                <div
                  key={interviewHistory.id}
                  onClick={() => {
                    setInterviewHistoryDetail(interviewHistory);
                    setShowDetail(true);
                    setStep(0);
                  }}
                  className="card p-3 mb-2 border"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between">
                    <p className="m-0 font-weight-bold">
                      {interviewHistory.questionnaire.title}
                    </p>
                    <p className="m-0 text-primary">
                      {statusText}
                    </p>
                  </div>
                  <div className="d-flex text-muted small">
                    <p className="m-0">
                    ( {moment(interviewHistory.created_at).format(settings.date_format)} )
                    </p>
                  </div>
                </div>
              );
            })
            : <div className="d-flex justify-content-center align-items-center p-5">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          }
        </div>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        show={show && showDetail}
        title={currentQuestionnaire?.title}
        onCancel={() => setShowDetail(false)}
        cancelLabel={translate('common.back')}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '10px' }}>
          {currentSection && (
            <div>
              <h6 className="font-weight-bold mb-3 border-bottom pb-2">{currentSection?.title}</h6>
              <FormProvider {...methods}>
                <form>
                  {currentSection.questions.map((question: any) => (
                    <QuestionRenderer
                      key={question.id}
                      question={question}
                      disabled
                    />
                  ))}
                </form>
              </FormProvider>

              <div className="mt-4 p-3 bg-light rounded border">
                <h6 className="font-weight-bold text-center">
                  {translate('phc.interview_summary_information')}
                </h6>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>{currentSection.title}</span>
                  <span className="font-weight-bold">
                    {translate('common.interview_total_score_of_max_score', { total_score: totalScore, max_score: getSectionMaxScores(currentSection) })}
                  </span>
                </div>
                {actionText && (
                  <div className="alert alert-info mt-2 text-center mb-0">
                    {actionText}
                  </div>
                )}
              </div>
              {(currentQuestionnaire?.sections?.length > 1) && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button
                  variant="outline-dark"
                  disabled={step === 0}
                  onClick={handleBack}
                >
                  {translate('common.back')}
                </Button>
                <span className="font-weight-bold">
                  {step + 1} / {currentQuestionnaire?.sections?.length}
                </span>
                <Button
                  variant="primary"
                  disabled={step === currentQuestionnaire?.sections?.length - 1}
                  onClick={handleNext}
                >
                  {translate('common.next')}
                </Button>
              </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default InterviewHistoryDialog;

import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

export const useTranslate = (): any => {
  const localize = useSelector((state: any) => state.localize);
  return getTranslate(localize);
};

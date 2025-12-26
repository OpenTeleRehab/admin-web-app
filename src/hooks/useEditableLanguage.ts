import { useSelector } from 'react-redux';
import { USER_GROUPS } from 'variables/user';

export const useEditableLanguage = (langId: number) => {
  const profile = useSelector((state: any) => state.auth.profile);

  if (profile.type === USER_GROUPS.SUPER_ADMIN) {
    return true;
  }

  return new Set(profile?.edit_languages?.map((l: any) => l.id) ?? []).has(Number(langId));
};

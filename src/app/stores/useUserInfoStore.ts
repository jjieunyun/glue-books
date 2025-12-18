import { getUserInfo } from '@api/auth';
import apiClientHandler from '@lib/apiClientHandler';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface UserInfo {
  id?: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

interface UserState {
  userInfo: UserInfo;
}

interface UserActions {
  setUserInfo: (userInfo: UserInfo | null) => void;
  getUserInfo: () => Promise<void>;
}

const initialUserInfo: UserInfo = {
  id: '',
  email: null,
  name: null,
  picture: null,
};

const userStore = create<UserState & UserActions>((set) => ({
  userInfo: initialUserInfo,

  setUserInfo: (userInfo) => set({ userInfo: userInfo ?? initialUserInfo }),

  getUserInfo: async () => {
    try {
      const res = await apiClientHandler(getUserInfo());

      if (res && res.users && res.users.length > 0) {
        const user = res.users[0];
        set({
          userInfo: {
            id: user.localId,
            email: user.email,
            name: user.displayName,
            picture: user.photoUrl,
          },
        });
      } else {
        set({ userInfo: initialUserInfo });
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      set({ userInfo: initialUserInfo });
    }
  },
}));

export const useUserInfoStore = <T extends keyof (UserState & UserActions)>({
  keys,
}: {
  keys: T[];
}) => {
  return userStore(
    useShallow((state: UserState & UserActions) => {
      const selected: Partial<UserState & UserActions> = {};
      for (const key of keys) {
        (selected as any)[key] = state[key];
      }
      return selected as Pick<UserState & UserActions, T>;
    }),
  );
};

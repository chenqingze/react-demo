// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    }
    : {
      type: Key;
      payload: M[Key];
    };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

type CanRemove = {
  login?: (username: string, password: string) => Promise<void>;
  register?: (
    username: string,
    password: string,
  ) => Promise<void>;
  //
  loginWithWeChat?: () => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  loginWithTwitter?: () => Promise<void>;
  //
  // loginWithPopup?: (options?: PopupLoginOptions) => Promise<void>;
  // loginWithRedirect?: (options?: RedirectLoginOptions) => Promise<void>;
  //
  confirmRegister?: (phoneNumber: string, code: string) => Promise<void>;
  forgotPassword?: (phoneNumber: string) => Promise<void>;
  resendCodeRegister?: (phoneNumber: string) => Promise<void>;
  newPassword?: (phoneNumber: string, code: string, password: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
};

export type SessionContextType = CanRemove & {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
};


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
}

const getStoredUser = (): AuthState["user"] => {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storedToken = (() => {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
})();

const initialState: AuthState = {
  isAuthenticated: Boolean(storedToken),
  user: getStoredUser(),
  token: storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
      } catch {
        // Ignore storage errors (private mode, etc.)
      }
    },
    login: (state, action: PayloadAction<AuthState["user"]>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } catch {
        // Ignore storage errors (private mode, etc.)
      }
    },
  },
});

export const { login, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

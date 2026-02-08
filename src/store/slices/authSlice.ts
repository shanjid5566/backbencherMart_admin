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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
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
      } catch {
        // Ignore storage errors (private mode, etc.)
      }
    },
  },
});

export const { login, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

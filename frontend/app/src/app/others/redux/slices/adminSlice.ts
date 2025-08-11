import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  users: any[];
  movies: any[];
  analytics: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  movies: [],
  analytics: null,
  loading: false,
  error: null,
};
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setMovies: (state, action: PayloadAction<any[]>) => {
      state.movies = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<any>) => {
      state.analytics = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAdminState: (state) => {
      state.users = [];
      state.movies = [];
      state.analytics = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUsers,
  setMovies,
  setAnalytics,
  setError,
  clearAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;

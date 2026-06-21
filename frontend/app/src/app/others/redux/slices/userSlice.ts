import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  _id?: string;
  id?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

interface UserState {
  profile: UserProfile | null;
  nearbyUsers: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  nearbyUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setNearbyUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.nearbyUsers = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUserState: (state) => {
      state.profile = null;
      state.nearbyUsers = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProfile,
  setNearbyUsers,
  setError,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer;

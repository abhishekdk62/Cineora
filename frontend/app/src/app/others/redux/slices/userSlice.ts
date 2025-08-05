import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: any | null;
  nearbyUsers: any[];
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
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setNearbyUsers: (state, action: PayloadAction<any[]>) => {
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

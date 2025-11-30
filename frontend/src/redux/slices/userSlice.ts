import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: any | null;
}

const initialState: UserState = {
    accessToken: null,
    refreshToken: null,
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.userInfo = action.payload.userInfo;
        },
        clearUser: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userInfo = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

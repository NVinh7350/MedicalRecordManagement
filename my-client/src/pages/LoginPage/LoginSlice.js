import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import {clearStorage, setAccessToken, setRefreshToken, setUser } from '../../utils/LocalStorage'
import { instance } from '../../api/axiosConfig'

const initialState = {
    loginInfo: {
        citizenId: 'admin',
        password: 'adminpw'
    },
    token: {
        accessToken: null,
        refreshToken: null
    },
    isLoading: false,
    error: null,
    user: null
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoginInfo: (state, action) => {
            state.loginInfo = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(onLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(onLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = {
                    accessToken: action.payload.accessToken || null,
                    refreshToken : action.payload.refreshToken || null
                };
                state.user = action.payload.user;
                state.error = null;
                console.log('ff')
            })
            .addCase(onLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err')
            })
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(onLogout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(onLogout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.error = null
            })
            .addCase(onLogout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            });
    },
})

export const onLogin = createAsyncThunk(
    'login/onLogin',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const loginData = state.login.loginInfo;

            const token= await instance(
                '/login',
                {
                    data: loginData,
                    headers: {
                        Authorization: 'Bearer authorization'
                    },
                    method: 'post'
                }
            )
            setAccessToken(token.data.accessToken);
            setRefreshToken(token.data.refreshToken);
            setUser(JSON.stringify(token.data.user));
            console.log(JSON.stringify(token.data.user))
            
            return token.data
        } catch (error) {
            console.log('first')
                return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getUser = createAsyncThunk(
    'login/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await instance(
                '/Auth/getUser',
                {
                    method: 'GET'
                }
            )
            return user.data
        } catch (error) {
            console.log('error getuser')
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error?.message || error.response?.data.error);
            }
        }
    }
)

export const onLogout = createAsyncThunk(
    'login/onLogout',
    async (_, { getState, rejectWithValue }) => {
        try {
            clearStorage();
            return null;
        } catch (error) {
            console.log('first')
            console.log(error)
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error);
            }
        }
    })

export default loginSlice
export const loginSelector = (state) => state.login;
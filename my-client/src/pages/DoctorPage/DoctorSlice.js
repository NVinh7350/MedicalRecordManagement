import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../../api/axiosConfig'
import { setUser } from '../../utils/LocalStorage'

const initialState = {
    isLoading: false,
    error: null,
    passwordUpdate: null,
    doctorInfo: null,
    userInfo : null,
    patientSearchList: [],
    accessRequestList: [],
    accessList: [],
    detailPatient: null
}

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        removePatientSearchList : (state, action) => {
            state.patientSearchList = []
        },
        setDoctorInfo: (state, action) => {
            state.doctorInfo = action.payload
        },
        removeDoctorInfo: (state, action) => {
            state.doctorInfo = null
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        removeUserInfo: (state, action) => {
            state.userInfo = null
        },
        setPageIndex: (state,action) => {
            state.pageIndex = action.payload
        },
        setPasswordUpdate: (state, action) => {
            state.passwordUpdate = action.payload
        },
        removePasswordUpdate: (state, action) => {
            state.passwordUpdate = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateDoctorInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateDoctorInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(findPatientBySearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(findPatientBySearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.patientSearchList = action.payload
            })
            .addCase(findPatientBySearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');

            })
            .addCase(requestAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(requestAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.patientSearchList = state.patientSearchList.map((patient) => {
                    if(patient?.citizenId === action.payload?.patientId) {
                        patient?.accessRequestList?.push({
                            doctorId: action.payload?.doctorId,
                            patientId: action.payload?.patientId
                        })
                    }
                    return patient;
                })
            })
            .addCase(requestAccess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(getAccessRequestList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(getAccessRequestList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = action.payload;
            })
            .addCase(getAccessRequestList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(cancelAccessRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelAccessRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = state.accessRequestList.filter((access) => access?.patient?.citizenId !== action.payload?.patientId)
            })
            .addCase(cancelAccessRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(getAccessList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(getAccessList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessList = action.payload;
                console.log('ff')
            })
            .addCase(getAccessList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err');
                console.log(error)
            })
            .addCase(getDetailPatient.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(getDetailPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.detailPatient = action.payload;
                console.log('ff')
            })
            .addCase(getDetailPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err');
                console.log(error)
            })
    },
})

export const getDetailPatient = createAsyncThunk(
    'doctor/getDetailPatient',
    async (userId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const detailUser= await instance(
                `/Auth/getUser/${userId}`,
                {
                    method: 'get'
                }
            )
            return detailUser?.data?.user
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessList = createAsyncThunk(
    'doctor/getAccessList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/getAuthorizedAccessList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessList;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const cancelAccessRequest = createAsyncThunk(
    'doctor/cancelAccessRequest',
    async (patientId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/cancelRequest`,
                {
                    method: 'post',
                    data: {
                        patientId: patientId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessRequestList = createAsyncThunk(
    'doctor/getAccessRequestList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/getRequestedList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessRequestList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const requestAccess = createAsyncThunk(
    'doctor/requestAccess',
    async (patientId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/requestAccess`,
                {
                    method: 'post',
                    data: {
                        patientId : patientId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const findPatientBySearch = createAsyncThunk(
    'doctor/findPatientBySearch',
    async (searchContent, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/findPatientBySearch/${searchContent}`,
                {
                    method: 'get'
                }
            )
            return patientList?.data?.patientList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const changePassword = createAsyncThunk(
    'doctor/changePassword',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/changePassword`,
                {
                    method: 'put',
                    data: {
                        password: state.doctor.passwordUpdate?.oldPassword,
                        newPW : state.doctor.passwordUpdate?.newPassword
                    }
                }
            )
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const updateDoctorInfo = createAsyncThunk(
    'doctor/updateDoctorInfo',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/Doctor/updateDoctorInfo`,
                {
                    method: 'put',
                    data: {
                        user: state.doctor.userInfo,
                        doctor: state.doctor.doctorInfo
                    }
                }
            )
            const newUser = {
                ...state.doctor.userInfo,
                doctor: {
                    ...state.doctor.doctorInfo
                },
                patient: null
            }
            
            setUser(JSON.stringify(newUser))
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export default doctorSlice
export const doctorSelector = (state) => state.doctor;
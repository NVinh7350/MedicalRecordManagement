import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../../api/axiosConfig'
import { setUser } from '../../utils/LocalStorage'

const initialState = {
    isLoading: false,
    error: null,
    passwordUpdate: null,
    patientInfo: null,
    userInfo : null,
    accessRequestList: [],
    accessList: [],
    detailDoctor: null
}

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatientInfo: (state, action) => {
            state.patientInfo = action.payload
        },
        removePatientInfo: (state, action) => {
            state.patientInfo = null
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
            .addCase(updatePatientInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                console.log('pd ud')
            })
            .addCase(updatePatientInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                console.log('ff ud')
            })
            .addCase(updatePatientInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err ud')
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                console.log('pd')
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                console.log('ff')
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err')
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
                state.accessRequestList = state.accessRequestList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId)
            })
            .addCase(cancelAccessRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(grantAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(grantAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = state.accessRequestList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId)
            })
            .addCase(grantAccess.rejected, (state, action) => {
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
            })
            .addCase(getAccessList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            })
            .addCase(revokeAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(revokeAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessList = state.accessList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId)
            })
            .addCase(revokeAccess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
            }).addCase(getDetailDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(getDetailDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.detailDoctor = action.payload;
                console.log('ff')
            })
            .addCase(getDetailDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                console.log('err');
                console.log(error)
            })
    },
})

export const getDetailDoctor = createAsyncThunk(
    'patient/getDetailDoctor',
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
export const revokeAccess = createAsyncThunk(
    'patient/revokeAccess',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/revokeRequest`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessList = createAsyncThunk(
    'patient/getAccessList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/getAccessibleDoctorList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const grantAccess = createAsyncThunk(
    'patient/grantAccess',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/grantAccess`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const cancelAccessRequest = createAsyncThunk(
    'patient/cancelAccessRequest',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/refuseRequest`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
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
    'patient/getAccessRequestList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/getRequestDoctorList/1`,
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

export const changePassword = createAsyncThunk(
    'patient/changePassword',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/changePassword`,
                {
                    method: 'put',
                    data: {
                        password: state.patient.passwordUpdate?.oldPassword,
                        newPW : state.patient.passwordUpdate?.newPassword
                    }
                }
            )
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const updatePatientInfo = createAsyncThunk(
    'patient/updatePatientInfo',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/Patient/updatePatientInfo`,
                {
                    method: 'put',
                    data: {
                        user: state.patient.userInfo,
                        patient: state.patient.patientInfo
                    }
                }
            )
            const newUser = {
                ...state.patient.userInfo,
                patient: {
                    ...state.patient.patientInfo
                },
                doctor: null
            }
            
            setUser(JSON.stringify(newUser))
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export default patientSlice
export const patientSelector = (state) => state.patient;
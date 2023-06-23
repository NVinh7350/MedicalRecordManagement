import React, { useState, useEffect } from "react";
import "../AddDoctor/AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, { adminSelector, changePassword, createPatient } from "../AdminSlice";
import { getUser } from "../../../utils/LocalStorage";
import { changeDateForm } from "../../../utils/TimeUtils";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import ReactLoading from 'react-loading'
import { validateHook } from "../../../components/validateHook/validateHook";
export const EditInfo = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const adminUpdate = adminSelect.adminUpdate;
    const passwordUpdate = adminSelect.passwordUpdate;
    useEffect(() => {
        dispatch(adminSlice.actions.setAdminUpdate(JSON.parse(getUser())));

        return () => {
            dispatch(adminSlice.actions.removePasswordUpdate());
        }
    }, [])
    const handleChangeInfo = (key, value) => {
        dispatch(
            adminSlice.actions.setAdminUpdate({
                ...adminUpdate,
                [key]: value,
            })
        );
    };
    const handleChangePW = (key, value) => {
        dispatch(
            adminSlice.actions.setPasswordUpdate({
                ...passwordUpdate,
                [key]:value
            })
        )
    }
    const requiredFields = {
        citizenId : {
          check : () => {return null},
          req : true,
          label: 'Số CMND',
          key: 'citizenId'
        },
        fullName : {
          check : validateName,
          req : true,
          label: 'HỌ và TÊN',
          key: 'fullName'
        },
        email : {
          check : validateEmail,
          req : false,
          label: 'EMAIL',
          key: 'email'
        },
        birthDay : {
          check : validateDateOfBirth,
          req : true,
          label: 'NGÀY SINH',
          key: 'birthDay'
        },
        gender : {
          check : () => {return null},
          req : true,
          label: 'GIỚI TÍNH',
          key: 'gender'
        },
        ethnicity : {
          check : validateName,
          req : false,
          label: 'DÂN TỘC',
          key: 'ethnicity'
        },
        address : {
          check : validateAddress,
          req : true,
          label: 'ĐỊA CHỈ',
          key: 'address'
        },
        phoneNumber : {
          check : validatePhoneNumber,
          req : false,
          label: 'ĐIỆN THOẠI',
          key: 'phoneNumber'
        },
         HICNumber : {
          check : validateHICNumber,
          req : false,
          label: 'số BHYT',
          key: 'HICNumber'
        },
        guardianName : {
          check : validateName,
          req : true,
          label: 'TÊN NGƯỜI THÂN',
          key: 'guardianName'
        },
        guardianPhone : {
          check : validatePhoneNumber,
          req : false,
          label: 'ĐIỆN THOẠI NGƯỜI THÂN',
          key: 'guardianPhone'
        },
        guardianAddress : {
          check : validateAddress,
          req : false,
          label: 'ĐỊA CHỈ NGƯỜI THÂN',
          key: 'guardianAddress'
        },
    }
    const requiredPWFields = { oldPassword : {
        check : () => {return null},
        req : true,
        label: 'MẬT KHUẨU CŨ',
        key: 'oldPassword'
      },
      newPassword : {
        check : () => {return null},
        req : true,
        label: 'MẬT KHẨU MỚI',
        key: 'newPassword'
      },
      confirmPassword : {
        check : () => {return null},
        req : true,
        label: 'XÁC NHẬN MẬT KHẨU MỚI',
        key: 'confirmPassword'
      },
  }

    const {error, checkValidate} = validateHook();

    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Cập nhật thông tin</h3>
            <div className="add-doctor-container">
                <div className="user-input-container">
                    <h4>Thông tin cá nhân</h4>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={adminUpdate?.citizenNumber}
                            setValue={handleChangeInfo}
                            pro={requiredFields.citizenId.key}
                            required={requiredFields.citizenId.req}
                            label={requiredFields.citizenId.label}
                            error={error?.citizenId}
                            readOnly={true}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={changeDateForm(adminUpdate?.birthDay)}
                            setValue={handleChangeInfo}
                            type="date"
                            pro={requiredFields.birthDay.key}
                            required={requiredFields.birthDay.req}
                            label={requiredFields.birthDay.label}
                            error={error?.birthDay}
                            ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={adminUpdate?.fullName}
                            setValue={handleChangeInfo}
                            pro={requiredFields.fullName.key}
                            required={requiredFields.fullName.req}
                            label={requiredFields.fullName.label}
                            error={error?.fullName}
                        ></TextField>

                        <div className="radio-container">
                            <div className="radio-column">
                                <label>Nam</label>
                                <input type="radio" name="gender" value={'MALE'} checked={adminUpdate?.gender==='MALE'} onChange={
                                   (e) => handleChangeInfo('gender', e.target.value) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={adminUpdate?.gender==='FEMALE'} onChange={(e) => handleChangeInfo('gender', e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={adminUpdate?.phoneNumber}
                            setValue={handleChangeInfo}
                            pro={requiredFields.phoneNumber.key}
                            required={requiredFields.phoneNumber.req}
                            label={requiredFields.phoneNumber.label}
                            error={error?.phoneNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChangeInfo}
                            value={adminUpdate?.email}
                            pro={requiredFields.email.key}
                            required={requiredFields.email.req}
                            label={requiredFields.email.label}
                            error={error?.email}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChangeInfo}
                            value={adminUpdate?.address}
                            pro={requiredFields.address.key}
                            required={requiredFields.address.req}
                            label={requiredFields.address.label}
                            error={error?.address}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChangeInfo}
                            value={adminUpdate?.ethnicity}
                            pro={requiredFields.ethnicity.key}
                            required={requiredFields.ethnicity.req}
                            label={requiredFields.ethnicity.label}
                            error={error?.ethnicity}
                        ></TextField>
                    </div>
                    <button
                        onClick={() => {
                            checkValidate(adminUpdate, requiredFields, () => dispatch(updateAdminInfo()))
                            console.log(adminUpdate)
                        }}
                    >
                        {adminSelect.isLoading ?
            (<ReactLoading color="blue" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading>) :'Cập nhật'}
                    </button>
                </div>
                <div className="doctor-input-container">
                    <h4>Đổi mật khẩu</h4>
                    <TextField
                            setValue={handleChangePW}
                            pro={requiredPWFields.oldPassword.key}
                            required={requiredPWFields.oldPassword.req}
                            label={requiredPWFields.oldPassword.label}
                            error={error?.oldPassword}
                        ></TextField>

                        <TextField
                            setValue={handleChangePW}
                            pro={requiredPWFields.newPassword.key}
                            required={requiredPWFields.newPassword.req}
                            label={requiredPWFields.newPassword.label}
                            error={error?.newPassword}
                        ></TextField>
                        <TextField
                            setValue={handleChangePW}
                            pro={requiredPWFields.confirmPassword.key}
                            required={requiredPWFields.confirmPassword.req}
                            label={requiredPWFields.confirmPassword.label}
                            error={error?.confirmPassword}
                        ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(passwordUpdate, requiredPWFields, () => dispatch(changePassword()))
                        }}
                    >
                        {adminSelect.isLoading ?
            (<ReactLoading color="blue" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading>) :'Đổi mật khẩu'}
                    </button>
                </div>
            </div>
        </>)
};

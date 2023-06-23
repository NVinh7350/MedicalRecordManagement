import React, { useState, useEffect } from "react";
import "../AddDoctor/AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, { adminSelector, createPatient } from "../AdminSlice";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import ReactLoading from 'react-loading'
import { validateHook } from "../../../components/validateHook/validateHook";
export const AddPatient = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const patientInput = adminSelect.patientInput;
    useEffect(() => {
        dispatch(adminSlice.actions.setPatientInput({
            'gender' : 'MALE'
        }));
        return () => {
            dispatch(adminSlice.actions.removePatientInput());
        }
    }, [])
    const handleChange = (key, value) => {
        dispatch(
            adminSlice.actions.setPatientInput({
                ...patientInput,
                [key]: value,
            })
        );
    };

    const requiredFields = {
        citizenId : {
          check : validateCitizenId,
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

    const {error, checkValidate} = validateHook();
    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Đăng ký bệnh nhân</h3>
            <div className="add-doctor-container">
                <div className="user-input-container">
                <h4>Thông tin cá nhân</h4>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
                            pro={requiredFields.citizenId.key}
                            required={requiredFields.citizenId.req}
                            label={requiredFields.citizenId.label}
                            error={error?.citizenId}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
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
                            setValue={handleChange}
                            pro={requiredFields.fullName.key}
                            required={requiredFields.fullName.req}
                            label={requiredFields.fullName.label}
                            error={error?.fullName}
                        ></TextField>

                        <div className="radio-container">
                            <div className="radio-column">
                                <label>Nam</label>
                                <input type="radio" name="gender" value={'MALE'} checked={patientInput?.gender==='MALE'} onChange={
                                   (e) => handleChange('gender', e.target.value) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={patientInput?.gender==='FEMALE'} onChange={(e) => handleChange('gender', e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
                            pro={requiredFields.phoneNumber.key}
                            required={requiredFields.phoneNumber.req}
                            label={requiredFields.phoneNumber.label}
                            error={error?.phoneNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
                            pro={requiredFields.email.key}
                            required={requiredFields.email.req}
                            label={requiredFields.email.label}
                            error={error?.email}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
                            pro={requiredFields.address.key}
                            required={requiredFields.address.req}
                            label={requiredFields.address.label}
                            error={error?.address}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            setValue={handleChange}
                            pro={requiredFields.ethnicity.key}
                            required={requiredFields.ethnicity.req}
                            label={requiredFields.ethnicity.label}
                            error={error?.ethnicity}
                        ></TextField>
                    </div>
                </div>
                <div className="doctor-input-container">
                    <h4>Thông tin bệnh nhân</h4>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        setValue={handleChange}
                        pro={requiredFields.HICNumber.key}
                        required={requiredFields.HICNumber.req}
                        label={requiredFields.HICNumber.label}
                        error={error?.HICNumber}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: 3 }}
                        setValue={handleChange}
                        pro={requiredFields.guardianName.key}
                        required={requiredFields.guardianName.req}
                        label={requiredFields.guardianName.label}
                        error={error?.guardianName}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        setValue={handleChange}
                        pro={requiredFields.guardianPhone.key}
                        required={requiredFields.guardianPhone.req}
                        label={requiredFields.guardianPhone.label}
                        error={error?.guardianPhone}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        setValue={handleChange}
                        pro={requiredFields.guardianAddress.key}
                        required={requiredFields.guardianAddress.req}
                        label={requiredFields.guardianAddress.label}
                        error={error?.guardianAddress}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(patientInput,requiredFields, () => {dispatch(createPatient())})
                        }}
                    >  
                        {adminSelect.isLoading ? <ReactLoading color="#fff" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading> : 'Đăng ký'}
                    </button>
                </div>
            </div>
        </>
    );
};

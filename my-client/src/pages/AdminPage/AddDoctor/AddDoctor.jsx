import React, { useState, useEffect } from "react";
import "./AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, { adminSelector, createDoctor } from "../AdminSlice";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import ReactLoading from 'react-loading'
import { validateHook } from "../../../components/validateHook/validateHook";
export const AddDoctor = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const doctorInput = adminSelect.doctorInput;
    useEffect(() => {
        dispatch(adminSlice.actions.setDoctorInput({
            'gender' : 'MALE'
        }));
        return () => {
            dispatch(adminSlice.actions.removeDoctorInput());
        }
    }, [])
    const handleChange = (key, value) => {
        dispatch(
            adminSlice.actions.setDoctorInput({
                ...doctorInput,
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
        position : {
            check : validateName,
            req : true,
            label: 'CHỨC VỤ',
            key: 'position'
          },
          specialty : {
            check : validateName,
            req : true,
            label: 'KHOA',
            key: 'specialty'
          },
          hospital : {
            check : validateName,
            req : true,
            label: 'BỆNH VIỆN',
            key: 'hospital'
          },
    }

    const {error, checkValidate} = validateHook();
    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Đăng ký bác sĩ</h3>
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
                                <input type="radio" name="gender" value={'MALE'} checked={doctorInput?.gender==='MALE'} onChange={
                                   (e) => handleChange('gender', e.target.value) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={doctorInput?.gender==='FEMALE'} onChange={(e) => handleChange('gender', e.target.value)}></input>
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
                    <h4>Thông tin bác sĩ</h4>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        setValue={handleChange}
                        pro={requiredFields.position.key}
                        required={requiredFields.position.req}
                        label={requiredFields.position.label}
                        error={error?.position}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: 3 }}
                        setValue={handleChange}
                        pro={requiredFields.specialty.key}
                        required={requiredFields.specialty.req}
                        label={requiredFields.specialty.label}
                        error={error?.specialty}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        setValue={handleChange}
                        pro={requiredFields.hospital.key}
                        required={requiredFields.hospital.req}
                        label={requiredFields.hospital.label}
                        error={error?.hospital}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(doctorInput,requiredFields, () => {dispatch(createDoctor())})
                        }}
                    >  
                        {adminSelect.isLoading ? <ReactLoading color="#fff" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading> : 'Đăng ký'}
                    </button>
                </div>
            </div>
        </>
    );
};

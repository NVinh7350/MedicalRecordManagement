import React, { useState, useEffect } from "react";
import "../../AdminPage/AddPatient/AddPatient.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../utils/LocalStorage";
import ReactLoading from "react-loading"
import { changeDateForm } from "../../../utils/TimeUtils";
import patientSlice, { changePassword, patientSelector, updatePatientInfo } from "../PatientSlice";
export const EditPatientInfo = () => {
    const dispatch = useDispatch();
    const patientSelect = useSelector(patientSelector);
    const patientInfo = patientSelect.patientInfo;
    const userInfo = patientSelect.userInfo;
    const passwordUpdate = patientSelect.passwordUpdate;
    useEffect(() => {
        (async() => {
            const {doctor, patient, ...user} = await JSON.parse(getUser());
            dispatch(patientSlice.actions.setPatientInfo(patient))
            dispatch(patientSlice.actions.setUserInfo(user))
        })()
    }, [])
    const validateName = (e) => {
        if (e === "") {
            return "Không bỏ trống";
        } else {
            return null;
        }
    };
    
    const handleChangePatientInfo = (key, value) => {
        dispatch(
            patientSlice.actions.setPatientInfo({
                ...patientInfo,
                [key]: value,
            })
        );
    };

    const handleChangeUserInfo = (key, value) => {
        dispatch(
            patientSlice.actions.setUserInfo({
                ...userInfo,
                [key]: value,
            })
        );
    };

    const handleChangePW = (key, value) => {
        dispatch(
            patientSlice.actions.setPasswordUpdate({
                ...passwordUpdate,
                [key]:value
            })
        )
    }
    const checkEmpty = () => {
        if (
            !userInfo?.citizenId ||
            !userInfo?.birthDay ||
            !userInfo?.fullName ||
            !userInfo?.gender ||
            !userInfo?.phoneNumber ||
            !userInfo?.address ||
            !userInfo?.email ||
            !userInfo?.ethnicity ||
            !patientInfo?.HICNumber ||
            !patientInfo?.guardianAddress ||
            !patientInfo?.guardianPhone ||
            !patientInfo?.guardianName
        ) {
            return false;
        }
        return true;
    };
    console.log(userInfo)
    const checkPassword = () => {
        if(!passwordUpdate?.oldPassword || !passwordUpdate.newPassword || !passwordUpdate.confirmPassword){
            return false;
        } else if (passwordUpdate?.newPassword !== passwordUpdate?.confirmPassword) {
            return false
        } 
        return true;
    }
    
    return (
        <>
            {patientSelect.isLoading ?
            (<ReactLoading color="blue" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading>)
            :
            (<>
            <h2>CHỈNH SỬA THÔNG TIN</h2>
            <div className="add-doctor-container">
                <div className="user-input-container">
                    <h4>Thông tin cá nhân</h4>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"citizenId"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"số CMND"}
                            value={userInfo?.citizenId}
                            required={false}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"birthDay"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"NGÀY SINH"}
                            value={changeDateForm(userInfo?.birthDay)}
                            type="date"
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"fullName"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"HỌ VÀ TÊN"}
                            value={userInfo?.fullName}
                        ></TextField>

                        <div className="radio-container">
                            <div className="radio-column">
                                <label>Nam</label>
                                <input type="radio" name="gender" value={'MALE'} checked={userInfo?.gender==='MALE'} onChange={(e) => handleChangeUserInfo('gender', e.target.value)}></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={userInfo?.gender==='FEMALE'} onChange={(e) => handleChangeUserInfo('gender', e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"phoneNumber"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"ĐIỆN THOẠI"}
                            value={userInfo?.phoneNumber}
                            required={false}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"email"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"EMAIL"}
                            value={userInfo?.email}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"address"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            label={"ĐIẠ CHỈ"}
                            value={userInfo?.address}
                            required={false}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"ethnicity"}
                            setValue={handleChangeUserInfo}
                            checkValue={validateName}
                            value={userInfo?.ethnicity}
                            label={"DÂN TỘC"}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"HICNumber"}
                            setValue={handleChangePatientInfo}
                            checkValue={validateName}
                            label={"Mã BHYT"}
                            value={patientInfo?.HICNumber}
                            required={false}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"guardianName"}
                            setValue={handleChangePatientInfo}
                            checkValue={validateName}
                            value={patientInfo?.guardianName}
                            label={"TÊN NHÂN THÂN"}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"guardianPhone"}
                            setValue={handleChangePatientInfo}
                            checkValue={validateName}
                            label={"ĐIỆN THOẠI NHÂN THÂN"}
                            value={patientInfo?.guardianPhone}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            pro={"guardianAddress"}
                            setValue={handleChangePatientInfo}
                            checkValue={validateName}
                            label={"ĐỊA CHỈ NHÂN THÂN"}
                            value={patientInfo?.guardianAddress}
                        ></TextField>
                    </div>
                    <button
                        onClick={() => {
                            checkEmpty() ? dispatch(updatePatientInfo()) : console.log('empty')
                        }}
                    >
                        Cập nhật
                    </button>
                </div>
                <div className="doctor-input-container">
                    <h4>Đổi mật khẩu</h4>
                    <TextField
                        pro={"oldPassword"}
                        setValue={handleChangePW}
                        checkValue={validateName}
                        label={"MẬT KHẨU CŨ"}
                        required={false}
                    ></TextField>
                    <TextField
                        pro={"newPassword"}
                        setValue={handleChangePW}
                        checkValue={validateName}
                        label={"MẬT KHẨU MỚI"}
                    ></TextField>
                    <TextField
                        pro={"confirmPassword"}
                        setValue={handleChangePW}
                        checkValue={validateName}
                        label={"XÁC NHẬN MẬT KHẨU"}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkPassword() ? dispatch(changePassword()) : console.log('empty')
                        }}
                    >
                        Thay mật khẩu
                    </button>
                </div>
            </div>
            </>)
        }
        </>
    );
};

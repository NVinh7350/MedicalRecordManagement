import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import doctorSlice, { doctorSelector, findPatientBySearch, getDetailPatient, requestAccess } from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
export const FindFatient = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const citizenId = JSON.parse(getUser())?.citizenId;
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(doctorSlice.actions.removePatientSearchList());
    }, []);

    const sendRequestAccess = (patientId) => {
        dispatch(requestAccess(patientId))
        dispatch(findPatientBySearch(patientId))
    }

    const handleShowDetailUser = async(userId, path) => {
        dispatch(getDetailPatient(userId));
        navigate(path)
        console.log(userId)
    }

    return (
        <div className="main-content-container">
            <div className="main-content-header">
                <Search
                    onClick={() => {
                        dispatch(findPatientBySearch(searchContent));
                    }}
                    setSearchContent={setSearchContent}
                    planceHolder={"Tìm bệnh nhân"}
                ></Search>
                <TabIndex></TabIndex>
            </div>
            <div className="line"></div>
            {doctorSelect.isLoading ? (
                <ReactLoading
                    color="blue"
                    height="40px"
                    width="40px"
                    type={"spinningBubbles"}
                ></ReactLoading>
            ) : (
                <></>
            )}
            <table className="table">
                <thead>
                    <th>CMNN</th>
                    <th>Họ và Tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Mã BHYT</th>
                    <th>Quyền truy cập</th>
                    <th>Gửi yêu cầu</th>
                    <th>Truy cập</th>
                </thead>
                <tbody>
                    {doctorSelect.patientSearchList?.map((patient, index) => {
                        const access = patient?.accessList?.some(
                            (access) => access?.doctorId === citizenId
                        );
                        const accessRequest = patient?.accessRequestList.some(
                            (accessRequest) =>
                                accessRequest?.doctorId === citizenId
                        );
                        return (
                            <tr key={index}>
                                <td>{patient?.citizenId}</td>
                                <td>{patient?.user?.fullName}</td>
                                <td>
                                    {patient?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{`${getDate(
                                    patient?.user?.birthDay
                                )} (${getAge(patient?.user?.birthDay)})`}</td>
                                <td>{patient?.HICNumber}</td>
                                <td>
                                    {access ? (
                                        <span className="success status">
                                            Có thể truy cập
                                        </span>
                                    ) : accessRequest ? (
                                        <span className="status waiting">
                                            Đã yêu cầu
                                        </span>
                                    ) : (
                                        <span className="status pending">
                                            Chưa yêu cầu
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {accessRequest || access ? (
                                        <TbSendOff
                                            className="icon"
                                            color="dimgray"
                                            fontSize="20px"
                                        ></TbSendOff>
                                    ) : (
                                        <TbSend
                                            color="#695cfe"
                                            fontSize="20px"
                                            onClick={() => sendRequestAccess(patient?.citizenId)}
                                        ></TbSend>
                                    )}
                                </td>
                                <td>
                                    {access ? (
                                        <BsFillEyeFill
                                            color="#695cfe"
                                            fontSize="20px"
                                                onClick={() =>  handleShowDetailUser(patient?.citizenId, '/doctor/detail-patient')}
                                        ></BsFillEyeFill>
                                    ) : (
                                        <BsFillEyeSlashFill
                                            fontSize="20px"
                                            color="dimgray"
                                        ></BsFillEyeSlashFill>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

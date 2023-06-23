import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import {BsFillEyeFill} from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    cancelAccessRequest,
    doctorSelector,
    findPatientBySearch,
    getAccessList,
    getAccessRequestList,
    getDetailPatient,
    requestAccess,
} from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
export const DoctorAccessList = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const citizenId = JSON.parse(getUser())?.citizenId;
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getAccessList());
    }, []);
    const handleShowDetailUser = async(userId, path) => {
        dispatch(getDetailPatient(userId));
        navigate(path)
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
                    <th>Thời gian yêu cầu</th>
                    <th>Chi tiết</th>
                    <th>Bệnh án</th>
                    <th>Tạo bệnh án</th>
                </thead>
                <tbody>
                    {doctorSelect.accessList?.map((request, index) => {
                        console.log("ok");
                        return (
                            <tr key={index}>
                                <td>{request?.patient?.citizenId}</td>
                                <td>{request?.patient?.user?.fullName}</td>
                                <td>
                                    {request?.patient?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{`${getDate(
                                    request?.patient?.user?.birthDay
                                )} (${getAge(
                                    request?.patient?.user?.birthDay
                                )})`}</td>
                                <td>{request?.patient?.HICNumber}</td>
                                <td>
                                    {getDateTime(request?.patient?.requestTime)}
                                </td>
                                <td>
                                    {
                                        <BsFillEyeFill
                                        color="#695cfe"
                                        fontSize="20px"
                                        onClick={() =>  handleShowDetailUser(request?.patient?.citizenId, '/doctor/detail-patient')}
                                        ></BsFillEyeFill>
                                    }
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

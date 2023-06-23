import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import TabIndex from "../../../components/TabIndex/TabIndex";
import { MdCancel } from "react-icons/md"
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    cancelAccessRequest,
    doctorSelector,
    findPatientBySearch,
    getAccessRequestList,
    requestAccess,
} from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
export const DoctorAccessRequest = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const citizenId = JSON.parse(getUser())?.citizenId;
    const navigate = useNavigate();
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getAccessRequestList());
    }, []);

    const sendRequestAccess = (patientId) => {
        dispatch(requestAccess(patientId));
    };

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
                    <th>Hủy yêu cầu</th>
                </thead>
                <tbody>
                    {doctorSelect.accessRequestList?.map((request, index) => {
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
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(cancelAccessRequest(request?.patient?.citizenId))}
                                        ></MdCancel>
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
